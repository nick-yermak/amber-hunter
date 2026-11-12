# GitHub Issue Fields

The Main agent uses authenticated `gh` for authorized Issue updates. Follow the [Harness permissions](PERMISSIONS.md) and keep the [Restricted Local Reviewer](REVIEWER.md) on local diffs and supplied evidence.

Priority and Area are repository Issue fields displayed in Amber Hunter — Development (#3). Use `repository.issueFields` for their definitions and `setIssueFieldValue` for their values. Project Status uses Project V2 item fields. The milestone belongs to the repository Issue.

## Resolve the current IDs

Set `issue_number` to the authorized Issue number. Use the Issue ID, field IDs, and option IDs returned by this query. Match each option by exact name within its field. Start with the cursor variables unset. When a connection has another page, set its cursor variable to the returned `endCursor` and run the query again.

```sh
gh api graphql -F number="$issue_number" -F fieldsAfter="${fields_after:-null}" -f query='
query($number: Int!, $fieldsAfter: String) {
  repository(owner: "nick-yermak", name: "amber-hunter") {
    issue(number: $number) { id viewerCanSetFields }
    issueFields(first: 30, after: $fieldsAfter) {
      pageInfo { hasNextPage endCursor }
      nodes {
        ... on IssueFieldSingleSelect { id name options { id name } }
      }
    }
  }
}'
```

## Assign Priority and Area

Set the shell variables below from the lookup. Confirm both fields and both options before sending the mutation.

```sh
gh api graphql -f issue="$issue_id" \
  -f priority="$priority_field_id" -f priorityOption="$priority_option_id" \
  -f area="$area_field_id" -f areaOption="$area_option_id" -f query='
mutation($issue: ID!, $priority: ID!, $priorityOption: ID!,
         $area: ID!, $areaOption: ID!) {
  setIssueFieldValue(input: {
    issueId: $issue
    issueFields: [
      {fieldId: $priority, singleSelectOptionId: $priorityOption}
      {fieldId: $area, singleSelectOptionId: $areaOption}
    ]
  }) { issue { id } }
}'
```

Read the existing Project and its Status options through `user(login: "nick-yermak").projectV2(number: 3)`. Verify the Project title. Reuse the matching item from the Issue's `projectItems` connection, or use `addProjectV2ItemById` if membership is missing. Use `updateProjectV2ItemFieldValue` with the current Project ID, item ID, Status field ID, and approved Status option ID. Resolve the milestone number by its exact title from the repository's milestones and assign it through the Issue update API.

## Verify saved values

Run a separate read after the updates. Compare both Issue field names and selected option IDs, the Project number and title, the Status name, and the milestone number and title with the intended values. Follow connection cursors when needed.

```sh
gh api graphql -F number="$issue_number" \
  -F valuesAfter="${values_after:-null}" -F projectsAfter="${projects_after:-null}" -f query='
query($number: Int!, $valuesAfter: String, $projectsAfter: String) {
  repository(owner: "nick-yermak", name: "amber-hunter") {
    issue(number: $number) {
      milestone { number title }
      issueFieldValues(first: 30, after: $valuesAfter) {
        pageInfo { hasNextPage endCursor }
        nodes {
          ... on IssueFieldSingleSelectValue {
            name optionId
            field { ... on IssueFieldSingleSelect { name } }
          }
        }
      }
      projectItems(first: 30, after: $projectsAfter) {
        pageInfo { hasNextPage endCursor }
        nodes {
          id
          project { number title }
          fieldValueByName(name: "Status") {
            ... on ProjectV2ItemFieldSingleSelectValue { name optionId }
          }
        }
      }
    }
  }
}'
```

## Handle failures

- If `viewerCanSetFields` is false or GitHub denies an operation, stop and report the operation and permission error to the owner. Keep credentials out of evidence and use the authorized Main agent access.
- If a field, option, project, or milestone is missing or ambiguous after checking all relevant pages, stop and ask the owner to confirm the intended value. Use existing definitions and options only.
- If any write fails or times out, check the CLI exit status and GraphQL errors, then read back all five values. Refresh metadata if IDs may have changed. After a successful read, retry only authorized updates whose saved values are missing or differ from the intended values. If access was denied, follow the permission rule above. Confirm all five values before proceeding.
