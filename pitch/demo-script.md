# Demo script (2 min 45 s)

**Setup before you share your screen**
1. `npm run demo` (or `npm run demo:tunnel` if you want judges to text from their phones).
2. Open three tabs: `http://localhost:3000/` (landing), `http://localhost:3000/demo`, `http://localhost:3000/map`.
3. On `/map`: press **Shift+R** to clear old live requests, then make sure sample data is loaded (button says "Remove sample data"; if not, press **Shift+S**).
4. On `/demo`: click the map and press **2** so the map shows "Wards 7 & 8 live". Click into the phone's text box once so typing goes there.
5. Browser zoom 100%, full screen (F11). Close notifications.

---

**0:00–0:25 · The problem** (landing page on screen)
> "In Washington DC there are 80 full-service grocery stores. Five of them are east of the Anacostia River, where more than 150,000 people live, in Wards 7 and 8. Ward 3 alone has seventeen. Forty percent of DC households were food insecure last year."

Point at the source line under each number. "Every number we show has its source on screen."

**0:25–0:45 · Citywide map** (switch to `/map`, press **1**)
> "Here is every full-service grocery store in DC, from the city's own open data. You don't need a legend to see it: the stores thin out at the river." (Press **→**.)

**0:45–1:35 · The text line → the map** (switch to `/demo`)
> "Food help exists east of the river — pantries, free markets, farmers markets, mobile markets — but finding it takes a smartphone and a search. FoodLine is a text line. Any phone."

Type **`Congress Heights`** and press Enter.
> "Three closest places: distance, today's hours, free or not, SNAP or not."

**Pause on the map.** The amber ping appears: "New request · Congress Heights".
> "And that text just became a dot on this map. No name, no phone number, no message — just when, roughly where, and what kind of help."

Type **`gratis`** (or `free`).
> "Follow-ups work, in English or Spanish." Optionally type **`directions 1`**.

**1:35–2:15 · Gap view** (click the map once so the keyboard leaves the text box, then press **→** or **3**)
> "When enough people text, the pattern shows where need is going unmet. This ranks the three places where a mobile market would help most: many requests, far from a grocery store, no free food nearby — and suggests an actual street corner for the stop."
> "These dots are labelled sample data so you can see the ranking; every amber dot from tonight is real."

**2:15–2:45 · Why it matters / ask**
> "Food-desert maps are built from census data that is years old — DC's official low-access map is from 2017. This one updates every time a neighbor asks for help. Real SMS is one step away: the same engine already answers a Twilio webhook, for about three to five cents a request. We'd like to pilot it with a food bank partner in Ward 8."

If judges are on the tunnel: "Scan the code and text your own ZIP — watch the map."

---

**If something breaks**
- Map stuck? It falls back to polling every second automatically. Reload `/demo` (F5).
- No ping? You're probably on a tunnel URL; use `localhost` for the map.
- Wi-Fi down? Everything runs offline except the optional AI and the tunnel. Templates take over silently.
