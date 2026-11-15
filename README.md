# geocare.life

**Know what the climate is doing where you live, whether the change is real, and how to prepare.**

A project for the **NASA Space Apps Challenge 2026**, challenge *Be An Earth System Trend Detective!*, by team GeoCare (Ciudad del Este, Paraguay).

**Open the app:** https://geocare.life · **The planet view:** https://geocare.life/earth/ · **How to use it, step by step:** https://geocare.life/tutorial/

**One screen.** On a computer the app opens with the planet where the map is: the whole Earth, today. A click on the planet asks first and then hands the place to the app; the street map takes over, with everything the app draws on it, and a switch at the top of the map goes back and forth between *Planet* and *Map*. On a phone, where the map area is small, the planet stays a page of its own.

**The planet view** starts from space and zooms down to the street. It shows the Earth as it was yesterday in true colour (NASA VIIRS), rain (NASA IMERG), wind as moving lines, dust and smoke in the air (NASA MODIS), water in the soil (NASA SMAP), the history of floods, landslides, droughts and cyclones (NASA SEDAC), natural events open now (NASA EONET) and earthquakes of the last week (USGS). It also draws 40 years of records: signs of a changing climate in 300 cities (one dataset, to be confirmed in the app), the paths of the strongest tropical storms and where tornadoes start (NOAA). Each layer shows what its colours mean. Tapping any place opens its 40 years of temperature and rain in one sentence and one small line each, its year in one table, estimated from the NASA POWER climatology of that point and from NOAA storm records, and the chains of consequences that matter there: how heat, heavy rain, drought or storms lead to illness, what a family can do and how a community breaks the chain.

> Prototype built during the 48-hour hackathon (14–15 November 2026).

## What it does

geocare.life is a trend detective for one place. Type an address anywhere on Earth, tap the map, or use your location. The app builds yearly series from 1981 to 2025 for eight climate signals, measures the rate of change with the Theil-Sen slope, tests it with the Mann-Kendall test, and compares two independent datasets before giving a verdict.

Then it answers twice: in plain words for the person who lives there, and with the data for the specialist. The plain version adds no data. It rewrites what the other sections already know as short sentences with one action each. The idea comes from the team's physician: people are told it will rain, but not what that means for them.

**The start screen** asks two things. *Where do you live?* takes an address, the device location or an example city. *Who are you?* is optional: age, health conditions, work, classes of medicines and housing. It is not a login: there is no account and no server, and the answers stay on the device. They are saved only after a consent box is ticked, and a *Delete my answers* button removes them. An optional line for allergies to medicines is only stored and shown back in the emergency box; no guidance is derived from it. Four example profiles show how it works without answering.

The app has nine numbered sections in two groups.

**For you**

1. **My home.** Everything in one page, in plain words:
   - *This week for you*: the forecast as short sentences, ordered by the profile.
   - *Next 3 months*: which illness seasons the climate of the place favours.
   - *Your year in one table*: weather events and illnesses by month.
   - *Has the climate changed here?*: how many of the eight signals changed, in one sentence. It counts *confirmed* and *likely* changes.
   - *Is the ground here safe?*: three questions (can the ground slide, can water reach the house, is the soil holding water), each with one of three levels, the facts behind it and what to do. It joins the NASA SEDAC Natural Disaster Hotspots maps of landslides, floods and drought, read within about 15 km of the address, with the Copernicus elevation model, heavy-rain days, the river nearby and the NASA POWER trend in topsoil wetness. A screening, not a survey of the land.
   - *Help and donations*: a prototype with fictional examples, plus a link to the directory of Red Cross and Red Crescent societies.
   - *Learn more: the data for specialists*, at the end of the page: the eight climate signals with yearly values 1981–2025 (average temperature, very hot days, yearly rainfall, heavy-rain days, dry days, air humidity, topsoil wetness, and the length of the season that is thermally suitable for dengue transmission). Every signal goes through the Mann-Kendall test and the Theil-Sen slope with a 95% confidence interval. Yearly values remove the seasonal cycle. **Two independent datasets (NASA POWER and ERA5) are compared before a verdict is given**: *confirmed* (both significant, same direction), *likely*, *sources disagree*, *one source only* or *no clear trend*. Six signals have two sources; air humidity and topsoil wetness have one, so they are never *confirmed*. The evidence chart shades the first and the last ten years, and a table shows one row per source. For 18 places, official NASA Giovanni series (MERRA-2, AIRS, GPM IMERG) are added as extra witnesses. A 5 × 5 grid shows where the change is happening, and the series can be exported as CSV.
2. **My health.** A private profile, stored on the device, feeds a transparent heat traffic light. Seven topics are ordered by urgency for the place, each with the data that triggered it and plain prevention steps. Guidance on medicines and heat explains the risk and says to talk to a doctor; it never says to stop a medicine. Emergency numbers are one tap away.
3. **What's ahead.** *What usually happens here*: for each hazard (extreme heat, heavy rain and flooding, tropical storms, tornadoes in the United States, earthquakes, dry spells, frost, landslides, and lightning from NASA's LIS sensor) the app shows how often it happens, the usual months, why here, the trend since 1981 and what this week's forecast adds, with fixed cut-offs written in the code. *Health calendar of this address*: one row per illness group and twelve months, with who is most at risk, what helps and when to seek care. It is estimated from the climate of the address, not from case counts. Then the ground check in full, official guidance before, during and after for ten hazards, safe places and walking routes, a kit checklist with a water calculator, a family plan and emergency numbers.
4. **This week.** A 7-day view with the NOAA heat index, heavy-rain flags, air quality, river discharge compared with its own history, recent earthquakes, open natural events from NASA EONET and, for farms, the hours inside the weather limits that Paraguayan law sets for spraying.
5. **Help and donate.** A community board for reports (flooding, mosquito breeding sites, no water, spraying near homes) and for places that need or collect donations. *Prototype: stored on the device only, with fictional examples.*

**Learn more**

6. **Compare.** Two addresses side by side.
7. **World.** The same test on 300 large cities in 106 countries, as a one-source screening, and the 1,500 river mouths that carry the most plastic to the sea in a published model.
8. **Region's health.** Thirty-one national health indicators tested with the same trend method, plus *pressures made by people* (pesticide use and bans, water quality, sewage treatment, plastic carried by rivers) and *nature* (forest area over time, threatened species, protected land).
9. **Cities & companies.** Actions with evidence for city governments, industry and farms, ordered by what the data show for that place, with real cases from around the world.

**Maps in motion.** A control on the map plays data through time anywhere in the world: rain, ground heat, smoke and dust, vegetation and lightning month by month, the tropical-storm season with the storm tracks, the tornado season in the United States, and land use year by year (2001–2024). For Paraguay it plays reported dengue by department, month by month from 2019 to 2023. It also shows where each hazard usually happens (floods, drought, landslides and volcanoes from NASA SEDAC; lightning; tropical storms; tornadoes; earthquakes). Colours come in discrete classes with their limits in the legend, in everyday units, with the value at the chosen address.

**The map follows the reading.** On the *My home* page the text is on one side and the map on the other. While a person reads a card, the map plays the moving map of that subject (heat, rain, lightning, smoke, floods, landslides, and dengue in Paraguay); *Show on the map* on each card and the lines of the year table do the same at once; and when nobody touches anything for a while, the map goes through the subjects of the place by itself. A button on the map switches this off, and it stays off for people who asked their device for less motion. In the other sections, opening a subject does the same: a health topic, a hazard of *What is ahead*, a guide, a day of *This week*. In *Health of the region*, the rivers near the address come into view, with a link to the same rivers on the planet view.

**One thing leads to the next.** The *My home* page shows the chains of consequences that matter at the address, each as a small sum with the months in which its pieces come together there: heat + rain = the dengue mosquito, heat and heat illness, heavy rain and diarrhoea and leptospirosis, cold and respiratory infections, dry weather, tropical storms, tornadoes. Opening a chain shows every link, what a family can do, how a community breaks it and a real case with its source; a button shows it on the map. The months are the same climate estimate as the year table, not counts of cases.

**See my year.** A button on the year table walks through the twelve months ahead, starting with the current one: for each month it says in one sentence what weighs most at that address, lists the weather events and the illnesses the weather favours with how likely each is, marks the month in the table, and shows the same month on the map.

**Guided demonstrations.** The *Demo* button (or `?demo=1&lang=es` in the address) runs seven short demonstrations of the real app with captions, about two minutes in total, in Miami, Phoenix, Asunción, Ciudad del Este, Oklahoma City and Los Angeles: what a family, someone who takes medicines, a health unit, a farmer, a family choosing where to live and a city hall can find out, and how anyone can watch the Earth change. Arrow keys change demonstration, Space pauses, Esc closes.

The interface is available in English, Spanish and Portuguese and works on a phone.

## Why a second opinion matters

While building this we found that one dataset alone can mislead. For Ciudad del Este, MERRA-2 shows hot nights doubling and rainfall falling since the 1980s. ERA5 shows no change in hot nights and a smaller warming; for rainfall it points the same way without reaching significance, and GPM IMERG shows no trend. The AIRS satellite instrument shows a warming that is not statistically significant. We also found the AIRS daytime pass cooling and the night-time pass warming in 14 of the 18 places we downloaded, which points to the instrument rather than the climate. The app therefore never gives its strongest verdict from a single source, and it says so on screen.

## Data

| Source | Used for | Access |
|---|---|---|
| **NASA Giovanni Time Series Service** (MERRA-2 daily temperature, AIRS/Aqua surface air temperature, GPM IMERG precipitation, OMI nitrogen dioxide, GRACE groundwater, GLDAS soil moisture) | official NASA series for 18 places, stored as archived data in `docs/data/giovanni.json` | Earthdata Login |
| **NASA POWER** (MERRA-2) | live monthly and daily series for any point; second witness for very hot days, heavy-rain days and dry days | open |
| **NASA GIBS** (GPM IMERG rain rate, MODIS land surface temperature, MODIS true colour) | map layers | open |
| **NASA EONET** | natural events nearby | open |
| ERA5 (ECMWF / Copernicus) via Open-Meteo | independent second dataset, daily | open |
| Copernicus DEM (90 m) via Open-Meteo | terrain screening and ground check | open |
| Copernicus GloFAS via Open-Meteo | river discharge | open |
| CAMS via Open-Meteo | air quality | open |
| NOAA GHCN-Daily (Climate Data Online archive) | station check in the analysis | open |
| InfoDengue (Fiocruz / FGV, Brazil) | notified dengue cases for ten Brazilian cities | open |
| OpenStreetMap (Nominatim, Overpass) | address search, health services nearby | open |
| NOAA IBTrACS v04r01 | tropical storms passing near each point since 1981 (1-degree grid in `docs/data/cyclones.json`) | open |
| USGS Earthquake Catalog | earthquakes of magnitude 5 or more within 300 km since 1981 | open |
| World Bank Open Data (WHO, UNICEF, UN agencies) | 31 national health indicators | open |
| GeoNames | list of world cities for the 300-city panorama | open |
| NASA LIS lightning climatology (TRMM, 1998–2013) and NASA SEDAC Natural Disaster Hotspots, through NASA GIBS | lightning by address and by month; maps of where floods, drought, landslides and volcanoes happen; landslide, flood and drought values read around the address for the ground check | open |
| geoBoundaries (Paraguay ADM1) | department outlines for the dengue map | open (CC BY) |
| NOAA Storm Prediction Center | tornadoes rated EF1 or stronger since 1981, United States only (`docs/data/tornadoes.json`) | open |
| FAO via Our World in Data | pesticide use per hectare of cropland, by country | open (CC BY) |
| PAN International consolidated list of banned pesticides (2024) | number of pesticide ingredients recorded as banned, by country (counts only) | public list |
| UN SDG Global Database (UNEP, WHO, UN-Habitat) | water bodies with good quality (6.3.2) and safely treated household wastewater (6.3.1) | open |
| Meijer et al. 2021, *Science Advances* (data: The Ocean Cleanup) | modelled plastic carried to the sea at 1,500 river mouths | open (CC BY) |
| World Bank Open Data (FAO, IUCN, UNEP-WCMC) | forest area, threatened species, protected land | open (CC BY) |
| Care99/dengue-cluster (Zenodo), from DGVS bulletins; INE census 2022; geoBoundaries | dengue by department in Paraguay, 2019–2023 | open (CC BY) |

Thermal suitability for *Aedes aegypti* follows the temperature curve in Mordecai et al. (2017), *PLoS Neglected Tropical Diseases* 11(4): e0005568. It describes suitability, not cases.

## Limits

- Gridded climate data describe areas of roughly 25–50 km, not a single building.
- Routes use the street network from OpenStreetMap and are not official evacuation routes.
- The 300-city panorama uses one source and is a screening.
- The "what usually happens here" counts come from a daily record that averages about 50 km. On coasts, in mountains and in city centres it can read cooler or drier than the exact spot; when ERA5 is available the app shows both counts for heavy rain and uses the larger.
- The health calendar shows expected seasons derived from climate (for respiratory infections, the cold-dry and humid-rainy patterns of Tamerius et al. 2013). They are not surveillance data.
- Pesticide, water and sewage figures are national. A low count of banned pesticides can mean missing information, not weak rules. River plastic values are model estimates.
- Lightning history comes from NASA's LIS sensor (1998–2013) and is read from the map tile of the layer, so it is a class value, not an exact count. There is no wildfire history by address: fires appear only as active events.
- The second dataset (ERA5) comes from a free service with a daily request limit. Demonstration places are archived in `docs/data/era5/` (listed in `index.json`); elsewhere, when the limit is reached, verdicts fall back to one source and the app says so.
- The terrain flag is a screening from a 90 m elevation model. It is not an official flood or landslide map.
- The ground check ("Is the ground here safe?") is a screening from global data. The NASA SEDAC maps are older products (floods 1985–2003, drought 1980–2000) on grids of 5 to 50 km, and the value is the highest one read within about 15 km of the address. It does not replace an inspection of the land or the advice of civil defence.
- The plain-language summary counts *confirmed* and *likely* changes together; the verdict of each signal is in the specialist block.
- The profile, the consent date and the optional allergy line are stored in the browser of the device only. There is no account and no server.
- River discharge is modelled and does not represent dam operations well.
- Health guidance is general prevention information, not a diagnosis.
- Community reports in this prototype are unverified and stay on the device. The app does not handle money.
- Correlation is not causation: dengue also rises with new virus types, urban growth and better reporting.

## Repository layout

- `docs/` — the web app (static HTML, CSS and JavaScript; no build step, no server code). Served by GitHub Pages.
- `analysis/` — Python scripts and data used to check the method: Mann-Kendall on NASA POWER (`mk.py`), heat extremes (`calor.py`), 30 cities (`mundo.py`), climate twins (`gemeos.py`), dengue (`dengue_gemeos.py`), stations (`estacao.py`) and the official Giovanni download and analysis (`giovanni_baixar.py`, `giovanni_analisar.py`). Script comments are in Portuguese.

## Run locally

```bash
python -m http.server 8765 --directory docs
```

Then open `http://localhost:8765`.

## Use of AI

The idea, the choice of problem and the health priorities come from the team: a physician who sees climate-related illness in her clinic, an agronomy student and a developer. We used an AI coding assistant (Claude, by Anthropic) to speed up the work: writing most of the application and analysis code under our direction, drafting interface texts and translations, and helping us search and read documentation. Statistics are computed by deterministic code, never by a language model. Draft health texts are based on PAHO/WHO and CDC guidance and are pending review by the team's physician. No AI-generated images, audio or video are used.

## Licence

Code: MIT. Data remain under the terms of their providers.
