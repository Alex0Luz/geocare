# GeoCare

**Know what the climate is doing where you live, whether the change is real, and how to prepare.**

A project for the **NASA Space Apps Challenge 2026**, challenge *Be An Earth System Trend Detective!*, by team GeoCare (Ciudad del Este, Paraguay).

> Prototype built during the 48-hour hackathon (14–15 November 2026).

## What it does

Type an address anywhere on Earth, tap the map, or use your location. The app is a guided path of nine numbered sections in three groups: Detect, Care and Understand.

1. **My place.** Eight climate signals for that spot, 1981–2025: average temperature, very hot days, yearly rainfall, heavy-rain days, dry days, air humidity, topsoil wetness, and the length of the season that is thermally suitable for dengue transmission. Every signal goes through the Mann-Kendall test and the Theil-Sen slope with a 95% confidence interval, and **two independent datasets are compared before a verdict is given**: *confirmed*, *likely*, *sources disagree*, *one source only* or *no clear trend*. A 5 × 5 grid shows where the change is happening, and a calendar shows what each month usually brings.
2. **This week.** A 7-day view with the NOAA heat index, heavy-rain flags, air quality, river discharge compared with its own history, recent earthquakes, open natural events from NASA EONET and, for farms, the hours inside the weather limits that Paraguayan law sets for spraying.
3. **Health.** A private profile feeds a transparent heat traffic light. Six topics are ordered by urgency for the place, each with the data that triggered it and plain prevention steps.
4. **Be ready.** *What usually happens here*: for each hazard (extreme heat, heavy rain and flooding, tropical storms, tornadoes, earthquakes, dry spells, frost, landslides) the app shows how often it happens, in which months, why here, the trend and what this week's forecast adds, with fixed cut-offs written in the code. *Seasonal illnesses to expect* (dengue season, respiratory infections, diarrhoea and leptospirosis after floods, asthma in the dry months) are estimated from the climate of the address, not from case counts. Then official guidance for ten hazards, safe places and walking routes, a kit checklist with a water calculator, a family plan and emergency numbers. Every item links to the matching health topic, guide, evidence chart and map animation.
5. **Community.** A map for reports (flooding, mosquito breeding sites, no water, spraying near homes) and for places that need or collect donations. *Prototype: stored on the device only, with fictional examples.*
6. **Region's health.** Thirty-one national health indicators tested with the same trend method, plus *pressures made by people* (pesticide use and bans, water quality, sewage treatment, plastic carried by rivers) and *nature* (forest area over time, threatened species, protected land).
7. **Cities, industry and farms.** Evidence-based actions ordered by what the data show for that place, with real cases from around the world.
8. **World.** A screening of 300 large cities ranked by how far their climate has shifted.
9. **Compare.** Two addresses side by side.

**Maps in motion.** A control on the map plays NASA GIBS layers through time anywhere in the world: rain, ground heat, smoke and dust, vegetation (month by month) and land use (year by year, 2001–2024). For Paraguay it also plays reported dengue cases by department, month by month from 2019 to 2023.

The interface is available in English, Spanish and Portuguese and works on a phone.

## Why a second opinion matters

While building this we found that one dataset alone can mislead. For Ciudad del Este, MERRA-2 shows hot nights doubling and rainfall falling since the 1980s. ERA5, nearby weather stations, the AIRS satellite instrument and GPM IMERG do not support those two claims: they show a smaller warming and no rainfall trend. We also found that AIRS daytime and night-time passes drift in opposite directions in all eight cities we checked, which points to the instrument rather than the climate. The app therefore never gives its strongest verdict from a single source, and it says so on screen.

## Data

| Source | Used for | Access |
|---|---|---|
| **NASA Giovanni Time Series Service** (MERRA-2 daily temperature, AIRS/Aqua surface air temperature, GPM IMERG precipitation) | official NASA series for eight demonstration cities, stored as archived data in `docs/data/giovanni.json` | Earthdata Login |
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
- Seasonal illnesses are expected seasons derived from climate (for respiratory infections, the cold-dry and humid-rainy patterns of Tamerius et al. 2013). They are not surveillance data.
- Pesticide, water and sewage figures are national. A low count of banned pesticides can mean missing information, not weak rules. River plastic values are model estimates.
- There is no lightning or wildfire history by address in this version; both appear only from the forecast and from active events.
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

The idea, the choice of problem and the health priorities come from the team: a physician who sees climate-related illness in her clinic, and a developer. We used an AI coding assistant (Claude, by Anthropic) to speed up the work: writing most of the application and analysis code under our direction, drafting interface texts and translations, and helping us search and read documentation. Statistics are computed by deterministic code, never by a language model. Draft health texts are based on PAHO/WHO and CDC guidance and are reviewed by the team's physician. No AI-generated images, audio or video are used.

## Licence

Code: MIT. Data remain under the terms of their providers.
