# AH-020 — Weather & Marine Data Feasibility Assessment

- Date: 2026-11-24
- Repository: https://github.com/nick-yermak/amber-hunter
- Verified remote baseline: `3a23e45918b465e461c8d26f99f5c4e269ec36ac` (read-only GitHub check on 2026-11-24)
- Status: Research complete; Conditional GO for Forecast Data Foundation. Repository adoption and production acceptance pending.
- Owner-approved design decisions: D-01–D-11 and S-01–S-10; Open-Meteo Free API for the non-commercial MVP.

## 1. Executive assessment

Open-Meteo can provide the six required hourly wind and wave variables for the three current pilot beaches over the target window of 72 historical and 168 forecast hours, as demonstrated in one archived experimental run. The preferred initial configuration is Weather Best Match with land selection and Marine ECMWF WAM with sea selection. The latter is a provisional primary model, not a validated production choice. Several independent model updates, geographic review, and deployed runtime measurements are required before acceptance.

The existing Angular / Cloudflare Workers / D1 architecture remains appropriate to investigate at approximately zero operating cost. The evidence does not establish beach-scale physical accuracy, reliable long-term availability, or a scientifically validated relationship to amber finds. No production ingestion, score calculation, or safety-source implementation was performed during AH-020.

## 2. Variable inventory and temporal semantics

Weather endpoint: `https://api.open-meteo.com/v1/forecast`.
Marine endpoint: `https://marine-api.open-meteo.com/v1/marine`.

| Domain | Variable | Normalized unit | Status |
|---|---|---|---|
| Weather | wind_speed_10m | m/s | Required |
| Weather | wind_direction_10m | degrees, from | Required |
| Weather | wind_gusts_10m | m/s | Required |
| Marine | wave_height | m, significant height | Required |
| Marine | wave_direction | degrees, from | Required |
| Marine | wave_period | s | Required |
| Marine | wind_wave_height, wind_wave_direction, wind_wave_period | m, degrees, s | Research only |
| Marine | swell_wave_height, swell_wave_direction, swell_wave_period | m, degrees, s | Research only |
| Weather | temperature_2m, precipitation, weather_code, surface_pressure | °C, mm, WMO code, hPa | Optional future UI/research |
| Marine | sea_level_height_msl, ocean_current_velocity, ocean_current_direction, sea_surface_temperature | Provider-specific units/conventions | Deferred |

Request `past_hours=72`, `forecast_hours=168`, `timezone=GMT`, `timeformat=unixtime`; use `wind_speed_unit=ms` for Weather. Use hourly valid times in UTC and display coastal local time in Europe/Warsaw. The exact request window must be tested relative to the start of the current hour; verify a consistent UTC axis and use actual timestamps, not array index alone, to join weather and marine data. The seven-day UI calendar semantics remain a separate presentation concern.

`past_hours` represents recent model-derived conditions, not beach observations or an archive of forecasts as they were originally issued. Historical Weather (reanalysis), Historical Forecast (stitched runs), Previous Runs (fixed lead times), and Single Runs (individual run structure) have distinct semantics; availability and free-access terms for each historical product must be checked before adopting it. Preserve actual fetched forecasts for replay rather than reconstructing them using hindsight. Direction conventions must be verified for each variable; use circular differences, and do not impute directions or periods when physically undefined. API hourly output can include temporal interpolation and is not necessarily the native model time step.

Sources: [1–4].

## 3. Geographic sampling and experiment evidence

Coordinates below are existing beach reference points from `apps/web/src/app/shared/beaches/pilot-beaches.ts`, not verified model cells or shoreline geometry.

| Beach | Latitude | Longitude |
|---|---:|---:|
| Sobieszewo | 54.355317 | 18.836583 |
| Orle | 54.348133 | 18.874800 |
| Mikoszewo | 54.347655 | 18.977491 |

The local archive records 21 successful Open-Meteo HTTP 200 responses on 2026-11-24 after 21 DNS failures in the initial sandbox. Retrieval timestamps below come from the request log. They identify when each response was received and carry no assertion about the underlying model run time.

| Test | Request configuration | Coverage per beach | Returned point distance: Sobieszewo / Orle / Mikoszewo (km) |
|---|---|---|---|
| T01 | Weather Best Match / land | 3 variables, 72+168 h | 1.28 / 0.62 / 1.35 |
| T02 | Weather Best Match / sea | 3 variables, 72+168 h | 0.85 / 1.47 / 1.64 |
| T03 | Marine Best Match / sea | 9 variables, 72+168 h | 11.72 / 12.25 / 12.37 |
| T04 | Marine ecmwf_wam / sea | 3 variables, 72+168 h; 6 entirely null | 2.38 / 3.65 / 4.26 |
| T05 | Marine dwd_ewam / sea | 9 variables, 72+65 h | 5.50 / 5.99 / 6.00 |
| T06 | Marine meteofrance_wave / sea | 9 variables, 72+168 h | 11.72 / 12.25 / 12.37 |
| T07 | Marine Best Match / nearest | All 9 variables null | 3.32 / 2.99 / 3.28 |

All archived responses had 240 consecutive UTC hourly timestamps (2026-11-21 02:00 through 2026-12-01 01:00 inclusive). T05 last non-null forecast time was 2026-11-26 18:00 UTC. T04 returned undefined units for the six empty variables. T03 and T06 matched for this run only. T03, T04 and T06 each returned identical coordinates and series for Sobieszewo and Orle. T05 returned three distinct points and series but an insufficient seven-day horizon. Both Weather configurations returned three distinct points and series.

ECMWF returned all required marine variables and nearer points than Météo-France in this experiment. This supports its provisional selection for simplicity, not a claim of superior accuracy. Returned coordinates do not prove native grid-cell identity. Validate marine mask and source geometry before making coastal comparisons. Distinguish beach coordinates, requested sampling coordinates, provider-returned coordinates and verified native cell/shoreline geometry (when available). Do not create new segments or artificially differentiate scores from identical inputs. The NE wind / post-storm relationship remains an unvalidated hypothesis.

### Preserved evidence

The original capture is preserved outside the repository under the archive identifier `AH-020/2026-11-24`. On 2026-11-24, the closeout verified all 47 original files against `SHA256SUMS` (48 original archive files including the manifest). The capture includes the request and sandbox attempt logs, the experiment report, the capture and analysis scripts, and 21 JSON responses with their HTTP headers. The two Owner-supplied Markdown inputs were added separately and are outside the original manifest. The JSON response bodies total 239,891 bytes, with individual sizes from 6,417 to 14,058 bytes.

| Capture | Retrieved (UTC) | JSON bytes |
|---|---|---:|
| T01-mikoszewo | `2026-11-24T02:01:32.712724+00:00` | 6,417 |
| T01-orle | `2026-11-24T02:01:32.712144+00:00` | 6,431 |
| T01-sobieszewo | `2026-11-24T02:01:32.709603+00:00` | 6,427 |
| T02-mikoszewo | `2026-11-24T02:01:32.824675+00:00` | 6,464 |
| T02-orle | `2026-11-24T02:01:32.826173+00:00` | 6,459 |
| T02-sobieszewo | `2026-11-24T02:01:32.715264+00:00` | 6,446 |
| T03-mikoszewo | `2026-11-24T02:01:32.892584+00:00` | 12,963 |
| T03-orle | `2026-11-24T02:01:32.978035+00:00` | 12,943 |
| T03-sobieszewo | `2026-11-24T02:01:32.894220+00:00` | 12,942 |
| T04-mikoszewo | `2026-11-24T02:01:33.051937+00:00` | 13,764 |
| T04-orle | `2026-11-24T02:01:33.052422+00:00` | 13,734 |
| T04-sobieszewo | `2026-11-24T02:01:32.979479+00:00` | 13,734 |
| T05-mikoszewo | `2026-11-24T02:01:33.136001+00:00` | 13,388 |
| T05-orle | `2026-11-24T02:01:33.212591+00:00` | 13,348 |
| T05-sobieszewo | `2026-11-24T02:01:33.136313+00:00` | 13,408 |
| T06-mikoszewo | `2026-11-24T02:01:33.323147+00:00` | 12,963 |
| T06-orle | `2026-11-24T02:01:33.321602+00:00` | 12,943 |
| T06-sobieszewo | `2026-11-24T02:01:33.216925+00:00` | 12,943 |
| T07-mikoszewo | `2026-11-24T02:01:33.371507+00:00` | 14,058 |
| T07-orle | `2026-11-24T02:01:33.476245+00:00` | 14,058 |
| T07-sobieszewo | `2026-11-24T02:01:33.371568+00:00` | 14,058 |

The request log records the requested model, sampling coordinates, cell selection, and hourly variables. The saved headers corroborate HTTP status. The response bodies contain provider-returned coordinates, units, and hourly series. The digest check verifies the preserved bytes against the manifest and covers one capture window. It does not establish independent model updates, native cell identity, physical accuracy or future availability.

## 4. Provider comparison and deferred Copernicus candidate

| Source | Nominal resolution / native time step | Published horizon/update information | MVP role |
|---|---|---|---|
| Weather Best Match | Varies by model, location and horizon | Combined model series; updates vary | Approved initial weather config |
| Marine ECMWF WAM | ~9 km / hourly | 15 days / 6 h in provider model table | Provisional primary marine config |
| Marine Météo-France MFWAM | ~8 km / 3 h | 10 days / 12 h | Alternative candidate |
| Marine DWD EWAM | ~5 km / hourly | Provider documentation has conflicting horizon entries; experiment yielded 65 future hours | Short-horizon research only |
| Copernicus Baltic Wave | 1 nautical mile (~1.85 km) / hourly | Regional analysis and forecast; usable horizon across updates not tested | Deferred candidate |

Official source tables describe model properties, not verified point-specific availability [1–3, 8]. A successful point request does not establish scientific accuracy. Copernicus Marine is a documented candidate for future integration, historical research and validation. Relevant products:

- `BALTICSEA_ANALYSISFORECAST_WAV_003_010`: regional wave analysis/forecast, wave height, direction, period and wave components.
- `BALTICSEA_MULTIYEAR_WAV_003_015`: historical wave hindcast, useful for retrospective storm/seasonal studies; not an issued forecast archive.
- `BALTICSEA_ANALYSISFORECAST_PHY_003_006`: currents, sea level and other physical parameters.

Copernicus provides regional data through its data store and Toolbox, with free registration and access including commercial use subject to acknowledgement and citation [8–12]. This adds a separate access workflow, credentials and data processing compared with Open-Meteo's JSON interface. No Copernicus access, installation, Python backend, production integration or automatic fallback is approved. Reconsider if Open-Meteo cannot meet coastal coverage, differentiation, quality or historical validation needs. A separate feasibility study and Owner decision are required. MFWAM delivered through Open-Meteo may itself use upstream Copernicus data; deferring direct Copernicus integration does not remove upstream attribution obligations.

## 5. Minimal logical source-data model

Not a final SQL schema or public API contract. Keep the backend source contract distinct from AH-019's frontend demo forecast domain.

| Entity | Minimum logical contents |
|---|---|
| Source configuration | Stable id/version, provider, endpoint, requested model or explicit Best Match, requested latitude/longitude, cell selection, variables, units/time settings; beach associations |
| Source snapshot | Immutable id, configuration version, schema version, retrieval timestamp, actual requested and returned coordinates, window, source metadata, per-variable quality summary, normalized hourly JSON |
| Hourly series | UTC valid times and three typed nullable Weather OR three typed nullable Marine values; units explicit in contract |
| Ingestion run | Scheduled slot, actual start/end, outcome, bounded error code, snapshot references, attempts |

Weather and Marine snapshots are independent. A beach may reference a shared series; physical deduplication is not required initially. A versioned repository configuration may replace a separate database configuration table. Store exact request parameters or canonical request representation. Separate `fetchedAt`, `validAt`, nullable confirmed `sourceRunAt`, nullable reported latest model initialization time and nullable availability/publication metadata. Do not claim that a reported latest run produced every value; the exact Best Match source may be unknown. Preserve metadata origin and verification status. Track source/run and configuration changes rather than rewriting previous snapshots.

## 6. Ingestion, quality and safety

Scheduled UTC checks every three hours; no provider fetch on user page views. Fetch, validate schema/units/timestamps/value domains, evaluate coverage per variable and period, record provenance, persist immutable snapshots and make only eligible snapshots available to downstream consumers. A successful HTTP 200 is insufficient. Null is never zero; do not interpolate missing values in v1. Optional research variables must not block required inputs. Ineligible attempts must not overwrite a previously eligible snapshot. Partial and unavailable are explicit; whether a particular forecast window is eligible depends on the required inputs and actual time coverage. No scoring algorithm or safety rules are implemented in this phase.

Proposed implementation details to approve at Issue level: bounded retries/timeouts and 429 backoff, idempotent scheduled slots, no duplicate writes on retry, independent source failure handling, atomic publication/selection of eligible snapshots, and safe retention deletion. Record failed attempts without logging credentials or unbounded payloads. Avoid automatic model switching. Unexpected coordinate or model changes require review before treating the changed source as equivalent.

Approved preliminary retrieval freshness: age <6 h recent, 6 h <= age <12 h stale (block active recommendations), age >=12 h expired (do not use for current recommendations). Measure from the last eligible snapshot retrieval, not the last HTTP success. Separately evaluate source run freshness (unknown if not established) and coverage of the target valid time. Re-fetching unchanged old output does not prove freshness of the underlying model. Display data confidence separately from the experimental Amber Index. The index is not a probability of finding amber. Track availability, completeness, freshness and safety explicitly. Missing safety information is UNKNOWN, never safe. Known unsafe/restricted conditions override favorable forecasts; no positive actionable recommendations without independent safety eligibility.

## 7. Free-tier, licensing and operational feasibility

Official terms checked 2026-11-24 [5–7, 13–16]. Open-Meteo free access is non-commercial with no uptime guarantee. The published caps are 600/min, 5,000/hour, 10,000/day and 300,000/month; weighted calls may differ from HTTP request counts. Use data under applicable attribution terms, including Open-Meteo and the actual upstream model providers; label modified/normalized data where required. The approved portfolio is intended to remain non-commercial; confirm the specific public use case with the provider if ambiguous. The terms inspected do not establish a specific cache TTL or blanket permission for every redistribution scenario; confirm any additional caching, redistribution and retention terms before public release. Do not assume archived products share identical service limits.

Cloudflare Workers Free: 100,000 daily requests; 10 ms CPU per Cron invocation; 50 external subrequests per invocation. D1 Free: 5 million rows read/day, 100,000 rows written/day, 500 MB per database, 5 GB account storage, 50 D1 queries per invocation, 2 MB maximum row/string/BLOB. D1 daily quotas are enforced and queries fail on exhaustion; index writes and deletions count. Use an isolated non-production binding and measure CPU on deployed Workers rather than inferring from local wall time. If limits are exceeded, optimize and remeasure; stop for Owner decision before changing the approved architecture or plan.

| Beaches | Scheduled cycles/day | Source snapshots/day (no batching/deduplication) | 30-day snapshots | Payload estimate at assumed 20 KiB each |
|---:|---:|---:|---:|---:|
| 3 | 8 | 48 | 1,440 | 28.125 MiB |
| 5 | 8 | 80 | 2,400 | 46.875 MiB |
| 10 | 8 | 160 | 4,800 | 93.75 MiB |

Estimates exclude overhead, indexes, run logs, retries, retention cleanup and future forecast data. HTTP request counts may be lower with multi-location batching; billed calls need separate validation. Archived raw response sizes are recorded in section 3. Normalized snapshot sizes and D1 storage overhead still require measurement. Use JSON snapshots rather than one row per hour for initial whole-window replay. Operational retention is 30 days for snapshots and logs, with a bounded last-eligible diagnostic reference and selected durable replay/research evidence. An archive strategy for snapshots used in published historical forecasts must exist before deleting data needed for replay. No R2, KV, Queues, Durable Objects, extra paid services or new provider infrastructure in this phase.

## 8. Decision register (Owner approved)

| ID | Decision |
|---|---|
| D-01 | Weather Best Match / land; sea candidate for offshore wind research |
| D-02 | ECMWF WAM / sea provisional primary marine model |
| D-03 | Météo-France alternative; DWD EWAM short-horizon research |
| D-04 | Exclude Marine nearest for current pilot configuration |
| D-05 | Allow shared source series across beaches |
| D-06 | Six required variables, three per source |
| D-07 | Immutable snapshots and provenance |
| D-08 | Preserve missingness; no zero substitution |
| D-09 | No automatic multi-model fallback in v1 |
| D-10 | Document Copernicus as deferred candidate |
| D-11 | Recheck multiple independent updates before production acceptance |
| S-01 | Workers + D1 Free; no paid services without separate decision |
| S-02 | Scheduled checks every 3 h; independent of user traffic |
| S-03 | JSON snapshot storage |
| S-04 | Separate Weather and Marine snapshots |
| S-05 | Immutable data, configuration version and ingestion logs |
| S-06 | Preliminary retrieval thresholds: 6 h stale, 12 h expired |
| S-07 | 30-day operational retention; durable selected replay/research evidence |
| S-08 | No R2/KV/Queues/Durable Objects at this stage |
| S-09 | Deployed CPU and D1 benchmark before production acceptance |
| S-10 | Preserve experiment evidence outside repo with checksums |

## 9. Unresolved questions and acceptance gates

- Verify selected model configurations across distinct source updates (proposed minimum: three distinct observed marine updates, with time-stamped evidence; if run identity cannot be established, distinguish repeated retrievals from verified different runs). Inspect actual coverage, missingness and coordinate stability. Do not certify stable production behavior based on one sample.
- Validate marine sampling/land-sea mask, coordinate mapping and offshore suitability. Identify independent observations for future physical validation; no claim of validated shoreline resolution. New coastal segments require separate validation.
- Verify provider metadata semantics and define model-age policy; retrieval freshness alone is insufficient.
- Verify actual normalized JSON bytes, D1 metrics/retention cleanup, request weights and deployed CPU for three beaches; assess ten-beach expansion separately. Confirm actual non-production isolation and quotas.
- Retain the verified archive and prepare selected reproducible fixtures with attribution. Verify caching/redistribution terms and eligibility for free public non-commercial deployment.
- Record final physical schema, scheduling/idempotency and snapshot selection decisions in focused Issues/ADR if materially architectural. Existing ADR-005 remains a proposed record of the approved experimental baseline; do not silently mark it Accepted.
- Separate later gates: safety sources and access restrictions, calibrated confidence, regional/coastal mapping, scoring design and weights, forecast replay and field validation. Agent Evals is a separate Harness track; it is not forecast validation.

## 10. Recommendation and scope boundary

Conditional GO for building the data foundation with Open-Meteo and the approved stack. This documentation closeout records the preserved evidence and links the approved [Forecast Data Foundation Epic](FORECAST_DATA_FOUNDATION_EPIC.md). Subsequent separately approved Issues cover the typed ingestion path, local and isolated Cloudflare persistence, scheduling, quality gates and runtime validation. Do not implement Amber Index or replace frontend demo data during this Epic. Do not claim production readiness before the source, operational and licensing gates pass. Human Owner approval and Controlled Autonomy v1.1 remain mandatory.

## Sources (official documentation rechecked 2026-11-24)

1. Open-Meteo Weather API — https://open-meteo.com/en/docs
2. Open-Meteo Marine API — https://open-meteo.com/en/docs/marine-weather-api
3. Open-Meteo Model Updates — https://open-meteo.com/en/docs/model-updates
4. Open-Meteo Historical Forecast API and linked archive types — https://open-meteo.com/en/docs/historical-forecast-api ; https://open-meteo.com/en/docs/previous-runs-api ; https://open-meteo.com/en/docs/single-runs-api
5. Open-Meteo Terms — https://open-meteo.com/en/terms
6. Open-Meteo Pricing — https://open-meteo.com/en/pricing
7. Open-Meteo Marine API provider credits — https://open-meteo.com/en/docs/marine-weather-api
8. Copernicus Baltic Wave — https://data.marine.copernicus.eu/product/BALTICSEA_ANALYSISFORECAST_WAV_003_010/description
9. Copernicus Baltic Wave Hindcast — https://data.marine.copernicus.eu/product/BALTICSEA_MULTIYEAR_WAV_003_015/description
10. Copernicus Baltic Physics — https://data.marine.copernicus.eu/product/BALTICSEA_ANALYSISFORECAST_PHY_003_006/description
11. Copernicus registration/access — https://help.marine.copernicus.eu/en/articles/4220332-how-to-register-for-copernicus-marine-service ; https://data.marine.copernicus.eu/product/BALTICSEA_ANALYSISFORECAST_WAV_003_010/services
12. Copernicus attribution — https://help.marine.copernicus.eu/en/articles/4444611-citing-copernicus-marine-products-and-services
13. Workers limits — https://developers.cloudflare.com/workers/platform/limits/
14. D1 limits — https://developers.cloudflare.com/d1/platform/limits/
15. D1 pricing — https://developers.cloudflare.com/d1/platform/pricing/
16. D1 quota enforcement — https://developers.cloudflare.com/changelog/post/2026-09-01-d1-free-tier-limit-enforcement/

Project sources: [Architecture](https://github.com/nick-yermak/amber-hunter/blob/main/docs/baseline/ARCHITECTURE.md), [Project State](https://github.com/nick-yermak/amber-hunter/blob/main/docs/baseline/PROJECT_STATE.md), [Operating Model](https://github.com/nick-yermak/amber-hunter/blob/main/docs/harness/OPERATING_MODEL.md), [Pilot beaches](https://github.com/nick-yermak/amber-hunter/blob/main/apps/web/src/app/shared/beaches/pilot-beaches.ts), and the Owner-supplied Codex experiment report dated 2026-11-24.
