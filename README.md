# FoodLine DC

A text line for food in Washington DC's Wards 7 and 8, east of the Anacostia River, and a live map of unmet need.

A resident texts a ZIP code, neighborhood or cross street. FoodLine replies with the three closest places to get food (grocery stores, free pantries and markets, farmers and mobile markets, Healthy Corners stores) with distance, today's hours, whether it's free and whether it takes SNAP/EBT — in English or Spanish. Every request also lands as an anonymous dot on a live map, so the city and food organizations can see where need is going unmet as it happens, instead of years later in census data.

Built for STEAM4U (theme: food deserts).

## Run it (one command)

Requirements: Node 22+ (tested on Node 24, Windows 11).

```bash
npm run demo
```

First run installs dependencies and builds (about a minute). Then open:

| Page | URL | What it is |
|---|---|---|
| Landing | http://localhost:3000/ | The problem, a QR code to the text line, links |
| Demo | http://localhost:3000/demo | Phone and live map side by side — use this for the screen share |
| Map | http://localhost:3000/map | Full live demand map (citywide → Wards 7 & 8 → gap view) |
| Text line | http://localhost:3000/chat | The simulated SMS conversation (works on a phone) |

After changing code: `npm run rebuild`. Tests: `npm test`.

### Let judges text from their own phones (video call)

```bash
winget install --id Cloudflare.cloudflared
npm run demo:tunnel
```

It prints a public `https://….trycloudflare.com/chat` link and a landing URL (`http://localhost:3000/?url=…`) whose QR code points at that link. Keep the map open on `localhost` on your laptop: the tunnel doesn't pass the live stream, so the map listens locally and phones only send messages through the tunnel. Phones on the same Wi-Fi can also use the `http://<laptop-ip>:3000/chat` address the script prints.

### Optional AI phrasing

Put `ANTHROPIC_API_KEY=...` in `web/.env.local` and rebuild. Claude Haiku 5.5 then (1) pulls a location out of messy messages when the rules can't, and (2) rewrites replies to sound warmer. It only ever sees the places the lookup returned; any rewrite that drops a listed place, mentions an unlisted one or changes a link is thrown away. Everything works without a key (built-in English and Spanish templates). Set `FOODLINE_AI=off` to disable it.

## Demo controls

| Key / button | Action |
|---|---|
| ← → (or 1, 2, 3) | Citywide → Wards 7 & 8 live → Gap view |
| P | Presentation mode (hides controls; hover top-right to reveal) |
| Shift+S / "Load sample data" | Load 140 clearly labelled SAMPLE requests so the gap view has something to rank |
| "Clear live requests" button | Clear texts between judges (sample data stays). Deliberately has no keyboard shortcut. |

## Text line commands

`20032` · `Congress Heights` · `1535 Alabama Ave SE` · `Minnesota Ave and Benning Rd` · `free food in Anacostia` · then `MORE`, `FREE`, `OPEN`, `DIRECTIONS 2`, `ALL`, `HELP`, `ESPAÑOL` / `ENGLISH` (Spanish: `MÁS`, `GRATIS`, `ABIERTO`, `DIRECCIONES 1`, `TODO`, `AYUDA`).

## How it works

- `web/lib/engine/` — deterministic, tested core: location resolution (ZIP centroids, 158 neighborhood names and aliases, 2,502 Ward 7/8 intersections, typo-tolerant), opening hours in America/New_York (seasons, monthly schedules, unknown hours never shown as open), nearest-place lookup, English/Spanish replies, gap scoring. No network calls.
- `web/lib/server/` — anonymous request log (`web/.data/requests.ndjson`), event bus, sessions, optional AI.
- `web/app/api/` — `message` (text line), `stream` (Server-Sent Events), `requests` (polling fallback), `gap`, `admin` (seed/reset), `sms` (Twilio-compatible webhook running the same engine).
- `web/components/LiveMap.tsx` — MapLibre GL with only local GeoJSON layers, so the map works with no internet.
- `scripts/geo/` — downloads Open Data DC layers and rebuilds everything in `data/` and `web/data/` (`npm run data`).

**Privacy.** Each request stores only: time, ZIP (or location rounded to ~100 m), need (any / free / open now) and language. No names, phone numbers or message text. The SMS webhook keeps only a one-way hash of the number in memory to follow the conversation.

## Data and sources

- Every number on screen and its source: `research/findings.md`.
- Map layers: Open Data DC (CC BY 4.0) — see `data/geo/README.md`.
- Food directory: `data/resources.json` (50 entries, each with source URL, last-verified date and confidence). **Hand-check the list in `research/findings.md` §6 before the event.**

## Real vs simulated vs sample

- **Real:** the statistics (sourced), the map layers (Open Data DC), the 50 food resources (researched, with sources), the lookup, hours and distances, the live link from text line to map, the gap ranking math.
- **Simulated:** the SMS. The text line is a web page that behaves like a text conversation. A real number would plug into `/api/sms` (Twilio) — see `pitch/judge-questions.md` for cost and registration time.
- **Sample:** the 140 "sample" requests used to fill the gap view. They are generated, labelled on screen, and not real residents. Every dot that appears from a live text during the demo is real.
