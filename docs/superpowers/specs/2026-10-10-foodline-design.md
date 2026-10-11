# FoodLine DC — design spec (2026-10-10)

## Intent (from the user)
A STEAM4U hackathon entry on food deserts, demoed live over a video-call screen share in 2–3 minutes. Two connected screens for DC Wards 7 and 8 (east of the Anacostia): a simulated SMS food finder (`/chat`) and a live demand map (`/map`), plus a landing page (`/`). The demo moment: a text sent on `/chat` appears on `/map` within 1–2 s with an animation. It must genuinely work (real lookup, real logging, real live updates), not be a scripted animation.

Pitch: existing food-desert maps rely on old census data; this one updates every time a neighbor asks for help.

## Decisions
- Visual direction **A · Night Ledger** (dark editorial; Instrument Serif display, Geist UI, Geist Mono numerals; amber `#F4B740` reserved for live requests). All colors and fonts are tokens so B/C can be swapped in.
- AI: Claude `claude-haiku-5-5`, optional (`ANTHROPIC_API_KEY`), 2.5 s timeout, template fallback. AI may only (a) extract a location phrase from messy text, (b) rephrase a reply built from lookup results. It never adds places; output is rejected if it mentions no listed name or exceeds length.
- SMS simulated in the web UI. A Twilio-compatible webhook `/api/sms` runs the same engine (never stores the phone number) so a real number could be attached later.
- Stack: Next 16.4 (App Router, TS), Tailwind 4, Motion, MapLibre GL (own GeoJSON layers as the basemap — fully offline), vitest. Request log: NDJSON file. Live updates: SSE with 1 s polling fallback (Cloudflare quick tunnels don't support SSE).
- Data: `data/resources.json` (50 curated, researched), `data/geo/*` (Open Data DC, CC BY 4.0). All geocoding is precomputed: ZIP polygon centroids, neighborhood label points, Ward 7/8 street intersections.

## Text line behavior
- Input: ZIP (5 digits), neighborhood name (aliases, fuzzy), cross streets (`X and Y`, `X & Y`, `X at Y`, `X y Y`), or follow-ups: `more`/`más`, `open`/`abierto` (open now), `free`/`gratis`, `directions`/`direcciones` [n], `help`/`ayuda`, `español`/`english`.
- Output: 3 nearest resources: name, type, address, distance (mi), today's hours or schedule note, free, SNAP/EBT when known. Short, warm, plain text (SMS-length friendly).
- Language: detected per message (Spanish keyword heuristic), sticky per session, manual toggle.
- Unknown location → friendly prompt with examples. Location outside DC → say we cover Wards 7 and 8 and still return nearest.
- Hours are evaluated in America/New_York; seasonal entries outside their season are excluded from "open now" and labelled.

## Logging (privacy)
Each request logs only `{ts, zip|null, lat, lng (rounded to 3 dp), need: any|free|open_now, lang, source: live|sample|sms}`. No message text, names or phone numbers. Sample data is flagged `source:"sample"` and labelled "Sample" on screen.

## Map
- Citywide state: DC land, water, 2022 wards, every operating full-service grocery store (east of river highlighted). Headline: 4 of 78 operating stores are east of the river.
- Focus state (Wards 7 & 8): resource pins by type, low food access areas (labelled 2017 vintage), neighborhood names, live request pings (amber ring) arriving via SSE.
- Gap view: hex/grid cells over the east-of-river area; score = requests (last 24 h, sample included when seeded) ÷ (1 + resources within 1 km weighted by type); top 3 cells → "where a mobile market would help most" with reasoning (request count, distance to nearest full-service grocery, free sites nearby, nearest named intersection as proposed stop).
- Stats strip: each number with its source (from research notes).
- Controls: Seed sample data, Reset live requests, presentation mode (`P`, arrow keys step: citywide → focus → live → gap).

## Demo page
`/demo` (presentation layout): phone (`/chat` engine) on the left, map on the right, so one screen share shows the cause and the effect.

## Out of scope
Accounts, hosted DB, real SMS provisioning, geocoding street addresses (we ask for a cross street instead).
