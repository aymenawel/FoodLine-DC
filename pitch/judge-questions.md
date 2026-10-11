# Likely judge questions

**Is this real or a mockup?**
The lookup, the data and the live map are real and running on this laptop. The SMS part is simulated: the text line is a web page that behaves like a text conversation. The engine also answers real SMS through a Twilio-style webhook (`/api/sms`); attaching a phone number is configuration, not new code. The gap view uses labelled sample requests so there's something to rank; every dot from a live text is real.

**Where does the data come from? How accurate is it?**
Statistics: D.C. Hunger Solutions (Grocery Gap 2025), U.S. Census ACS 2020–2024, Capital Area Food Bank, DC Office of Planning/Food Policy Council — each shown with its source. Map layers: Open Data DC (grocery stores revised Aug 2026; low food access areas are a 2017 analysis, and we say so). The 50 food resources were researched one by one from the operators' own 2026 pages, CAFB's 2026 food finder and city program pages; each has a source link, a last-verified date and a confidence level. Pantry hours are partner-reported, so the reply for those says to call ahead when hours aren't published. We'd keep it current by having pantries update their own listing by text.

**Why 5 grocery stores when the city's dataset shows 4?**
The Open Data DC layer hasn't added the Marion Barry Avenue Market (opened Sept 2025). D.C. Hunger Solutions counts it, so we show 5 and add it to the map with a note.

**Privacy?**
We store only: time, ZIP or a location rounded to about 100 m, the kind of help asked for, and the language. Never names, phone numbers or message text. Over real SMS, the phone number is hashed in memory only to keep the conversation going and is never written down. The map shows patterns, not people.

**How does the AI work? Can it make things up?**
The lookup is plain, tested code: distance, hours, filters. AI (Claude Haiku) is optional and does two narrow jobs: understand messy messages ("my grandma lives near the Giant on Alabama") and make replies warmer. It only sees the places the lookup returned. If its rewrite drops a place, mentions one we didn't list, or changes a link, we throw it away and send the template. With no AI at all, everything still works in English and Spanish.

**How would it work over real SMS? What does it cost?**
Rent a local number (Twilio ~$1.15/month), register it for app-to-person texting (A2P 10DLC: about $20–60 in one-time fees, $1.50–10/month, about 10–15 days of review), and point it at `/api/sms`. Each request costs roughly 3–5 cents (one incoming text plus a three-part reply). 10,000 requests ≈ $300–500 a year in texting costs. Hosting is a small server.

**Who would use the map?**
Capital Area Food Bank and its partners deciding where to send mobile markets; DMPED and the Office of Planning (Capitol Gateway still has no grocer, and the next mayor has floated public grocery stores east of the river); councilmembers for Wards 7 and 8.

**Isn't the demand just where people know about FoodLine?**
Yes, that's a real bias. A pilot would advertise evenly (bus shelters, schools, pantries) and compare requests with population, so the map reports requests per resident rather than raw counts.

**What's different from existing tools?**
Existing finders need a smartphone, a browser or a weekday phone call (CAFB map, findhelp.org, DC 211). The USDA's text line is summer-only and only for children's meals. Planning maps are years old and measure stores, not requests. We found no DC tool that works by text on any phone, all year, and turns each request into a live, anonymous signal of unmet need.

**What would you build next?**
1. A real number with a food bank partner in Ward 8. 2. Pantries updating their own hours by text ("OPEN TODAY 2–5"). 3. Requests per resident, and a weekly report to CAFB. 4. More languages, chosen from what residents actually text in.

**Why did you choose Wards 7 and 8 only?**
That's where the gap is: 5 of 80 stores serve more than 150,000 people. The engine works for any city with a resource list and street data.
