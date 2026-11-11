# Amber Hunter — Product Requirements Document

**Version:** MVP baseline 1.0  
**Status:** Product intent approved; individual feature acceptance criteria to be specified as GitHub Issues.

## Vision
Help people decide **whether, when and where** to look for amber on the Polish Baltic coast, and remain useful when conditions are not favorable through educational content.

## Goals
- Fast, polished, publicly accessible portfolio MVP.
- Understandable forecast and actionable beach recommendations.
- Learning value: real geospatial map, meteorological sources, explainable scoring and transparent uncertainty.
- Free and anonymous core experience.

## Audience
Newcomers, amber enthusiasts and tourists who may not understand wind, waves or safe coastal conditions.

## Primary user journey
1. User opens the homepage (without sign-in).
2. Sees a prominent 'conditions today' hero, an experimental Amber Index (0–100), reasons, forecast confidence and safety status.
3. Sees recommended beaches and favorable hourly intervals.
4. Opens the interactive map; selects a colored coastline segment or a beach.
5. Reads beach details (forecast, relevant marine/weather conditions, access/safety, location and directions).
6. If conditions are poor or unsafe, explores Amber Academy instead of receiving an unsafe suggestion to go out.

## MVP capabilities

### Home / Forecast
- Primary hero card asks whether conditions are favorable today.
- Amber Index 0–100 with simple human explanations, clearly marked experimental.
- Recommendation ranking within the validated pilot area.
- Seven-day outlook with hourly time windows.
- Show freshness, separate confidence (low/medium/high; unavailable as needed) and safety warnings.
- Provide practical gear guidance when appropriate.

### Interactive Map
- MapLibre GL JS base map; coastline segments color-coded by conditions.
- Segment selection reveals forecast and location details.
- Controls for time period, legend and segment context.
- Do not suggest restricted or unsafe places as actionable destinations.
- Location permission **only when the user opts in**; manual area exploration remains available.

### Beach Detail
- Beach identity, optional verified photograph, segment-level conditions and seven-day/hourly forecast.
- Concise explanations, wave/wind metrics, confidence, safety/access and route handoff.
- Reports/findings can be represented as future placeholders, not an MVP dependency.

### Amber Academy
- Static, version-controlled articles: how amber forms, practical identification, safe searching, wind/wave concepts, equipment and coastal safety.
- Article list and readable article pages.

### Localization and platform
- Polish, English, Russian; browser preference and explicit language switch.
- Responsive web, installable PWA later in MVP implementation, accessible and usable on mobile outdoors.
- Light theme is required. Evening design is a reference; full dark mode deferred.

## Out of scope for MVP
Mandatory accounts, public user findings, social network, achievements/rankings, ML predictions, AI chatbot, Amber Quest game, native app store distribution, user-managed CMS. Push notifications are part of longer-term product intent; flexible preferences require additional design and delivery milestones.

## Geographic MVP
Pilot 5–10 sites within the Gdańsk coastal area. Candidates for OSM validation: Stogi, Górki Zachodnie, Sobieszewo, Orle, Świbno, Mikoszewo, Jantar and Stegna. These are **candidates**, not an approved or validated segment dataset.

## Safety and trust
- Never equate the index with chance/probability of finding amber.
- Safety evaluation is independent of score; dangerous/closed areas must not receive a positive visit CTA.
- A stale forecast is clearly dated, with a limit to how long it can be shown as actionable (threshold pending research).
- Attribute data sources, publish methodology and limitations.

## Success and MVP acceptance direction
- Users can understand the daily conditions, best supported pilot beaches and why a recommendation was made.
- Core map, home, details and Academy work without an account.
- Safety blocks known restricted or dangerous recommendations.
- Automated checks protect index calculation, key journeys, localization and accessible responsive UI.
- Quality is assessed by reproducible checks, not subjective agent assurances.

## Future tracks
- Community: profiles, private/public location controls, reports of finds and unsuccessful searches, achievements.
- Amber Quest: separate gameplay discovery; not a release blocker.
- Forecast research: more providers, evidence collection, backtesting, and possible ML after sufficient validated data.
- Mobile: Capacitor after PWA validation.
