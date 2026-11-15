# GeoCare

**Know what the climate is doing where you live, whether the change is real, and how to prepare.**

A project for the **NASA Space Apps Challenge 2026**, challenge *Be An Earth System Trend Detective!*, by team GeoCare (Ciudad del Este, Paraguay).

> Prototype built during the 48-hour hackathon (14–15 November 2026).

## What it does

GeoCare is a trend detective for one place. Type an address anywhere on Earth, tap the map, or use your location. The app builds yearly series from 1981 to 2025 for eight climate signals, measures the rate of change with the Theil-Sen slope, tests it with the Mann-Kendall test, and compares two independent datasets before giving a verdict. Everything else in the app is what is done with that result.

The app has nine numbered sections in four groups.

**Detect**

1. **My place.** Eight climate signals for that spot, yearly values 1981–2025: average temperature, very hot days, yearly rainfall, heavy-rain days, dry days, air humidity, topsoil wetness, and the length of the season that is thermally suitable for dengue transmission. Every signal goes through the Mann-Kendall test and the Theil-Sen slope with a 95% confidence interval. Yearly values remove the seasonal cycle. **Two independent datasets (NASA POWER and ERA5) are compared before a verdict is given**: *confirmed* (both significant, same direction), *likely*, *sources disagree*, *one source only* or *no clear trend*. Six signals have two sources; air humidity and topsoil wetness have one, so they are never *confirmed*. The evidence chart shades the first and the last ten years, and a table shows one row per source. For 18 places, official NASA Giovanni series (MERRA-2, AIRS, GPM IMERG) are added as extra witnesses. A 5 × 5 grid shows where the change is happening, and the series can be exported as CSV.
2. **Compare.** Two addresses side by side.
3. **World.** The same test on 300 large cities in 106 countries, as a one-source screening, and the 1,500 river mouths that carry the most plastic to the sea in a published model.

**Anticipate**

4. **What to expect.** *What usually happens here*: for each hazard (extreme heat, heavy rain and flooding, tropical storms, tornadoes in the United States, earthquakes, dry spells, frost, landslides, and lightning from NASA's LIS sensor) the app shows how often it happens, the usual months, why here, the trend since 1981 and what this week's forecast adds, with fixed cut-offs written in the code. *Health calendar of this address*: one row per illness group and twelve months (dengue and other mosquito-borne diseases, heat illness, respiratory infections, diarrhoea, leptospirosis, asthma from smoke and dust, food poisoning, cold), with who is most at risk, what helps and when to seek care. It is estimated from the climate of the address, not from case counts. Then official guidance before, during and after for ten hazards, safe places and walking routes, a kit checklist with a water calculator, a family plan and emergency numbers.
5. **This week.** A 7-day view with the NOAA heat index, heavy-rain flags, air quality, river discharge compared with its own history, recent earthquakes, open natural events from NASA EONET and, for farms, the hours inside the weather limits that Paraguayan law sets for spraying.

**Care**

6. **Health.** A private profile, stored on the device, feeds a transparent heat traffic light. Seven topics are ordered by urgency for the place, each with the data that triggered it and plain prevention steps. *Next 3 months* shows which illness seasons are coming. Guidance on medicines and heat explains the risk and says to talk to a doctor; it never says to stop a medicine.
7. **Community.** A map for reports (flooding, mosquito breeding sites, no water, spraying near homes) and for places that need or collect donations. *Prototype: stored on the device only, with fictional examples.*

**Understand**

8. **Region's health.** Thirty-one national health indicators tested with the same trend method, plus *pressures made by people* (pesticide use and bans, water quality, sewage treatment, plastic carried by rivers) and *nature* (forest area over time, threatened species, protected land).
9. **Cities & companies.** Actions with evidence for city governments, industry and farms, ordered by what the data show for that place, with real cases from around the world.

**Maps in motion.** A control on the map plays data through time anywhere in the world: rain, ground heat, smoke and dust, vegetation and lightning month by month, the tropical-storm season with the storm tracks, the tornado season in the United States, and land use year by year (2001–2024). For Paraguay it plays reported dengue by department, month by month from 2019 to 2023. It also shows where each hazard usually happens (floods, drought, landslides and volcanoes from NASA SEDAC; lightning; tropical storms; tornadoes; earthquakes). Colours come in discrete classes with their limits in the legend, in everyday units, with the value at the chosen address.

**Guided demonstrations.** The *Demo* button (or `?demo=1&lang=es` in the address) runs seven short demonstrations of the real app with captions, about two minutes in total, in Miami, Phoenix, Asunción, Ciudad del Este, Oklahoma City and Los Angeles: what a family, someone who takes medicines, a health unit, a farmer, a family choosing where to live and a city hall can find out, and how anyone can watch the Earth change. Arrow keys change demonstration, Space pauses, Esc closes.

The start screen is a world map with example cities of the United States and of the world. The interface is available in English, Spanish and Portuguese and works on a phone.

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
| Copernicus DEM (90 m) via Open-Meteo | terrain screening | open |
| Copernicus GloFAS via Open-Meteo | river discharge | open |
| CAMS via Open-Meteo | air quality | open |
| NOAA GHCN-Daily (Climate Data Online archive) | station check in the analysis | open |
| InfoDengue (Fiocruz / FGV, Brazil) | notified dengue cases for ten Brazilian cities | open |
| OpenStreetMap (Nominatim, Overpass) | address search, health services nearby | open |
| NOAA IBTrACS v04r01 | tropical storms passing near each point since 1981 (1-degree grid in `docs/data/cyclones.json`) | open |
| USGS Earthquake Catalog | earthquakes of magnitude 5 or more within 300 km since 1981 | open |
| World Bank Open Data (WHO, UNICEF, UN agencies) | 31 national health indicators | open |
| GeoNames | list of world cities for the 300-city panorama | open |
| NASA LIS lightning climatology (TRMM, 1998–2013) and NASA SEDAC Natural Disaster Hotspots, through NASA GIBS | lightning by address and by month; maps of where floods, drought, landslides and volcanoes happen | open |
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
