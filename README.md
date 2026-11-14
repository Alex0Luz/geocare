# GeoCare

**Know what the climate is doing where you live, whether the change is real, and how to prepare.**

A project for the **NASA Space Apps Challenge 2026**, challenge *Be An Earth System Trend Detective!*, by team GeoCare (Ciudad del Este, Paraguay).

> Prototype built during the 48-hour hackathon (14–15 November 2026).

## What it does

Type an address anywhere on Earth, tap the map, or use your location. The app:

1. **Detects trends.** It builds 45-year time series (1981–2025) for eight climate signals at that spot: average temperature, very hot days, yearly rainfall, heavy-rain days, dry days, air humidity, topsoil wetness, and the length of the season that is thermally suitable for dengue transmission.
2. **Tests whether each trend is real.** Every signal goes through the Mann-Kendall test and the Theil-Sen slope with a 95% confidence interval. Where possible, **two independent datasets are compared before a verdict is given**: *confirmed*, *likely*, *sources disagree*, *one source only* or *no clear trend*.
3. **Translates the result into health.** Vector-borne disease, heat illness, floods and leptospirosis, smoke, and water and hygiene are ordered by urgency for that place, each with the data that triggered it and plain prevention steps.
4. **Shows this week.** A 7-day forecast with heat and heavy-rain flags, air quality, river discharge compared with its own history, and open natural events from NASA EONET.
5. **Connects neighbours.** A community map for reports (flooding, mosquito breeding sites, no water) and for places that need or collect donations. *Prototype: stored on the device only, with fictional examples.*
6. **Compares two addresses** for people deciding where to live.

The interface is available in English, Spanish and Portuguese.

## Why a second opinion matters

While building this we found that one dataset alone can mislead. For Ciudad del Este, MERRA-2 shows hot nights doubling and rainfall falling since the 1980s. ERA5, nearby weather stations, the AIRS satellite instrument and GPM IMERG do not support those two claims: they show a smaller warming and no rainfall trend. We also found that AIRS daytime and night-time passes drift in opposite directions in all eight cities we checked, which points to the instrument rather than the climate. The app therefore never gives its strongest verdict from a single source, and it says so on screen.

## Data

| Source | Used for | Access |
|---|---|---|
| **NASA Giovanni Time Series Service** (MERRA-2 daily temperature, AIRS/Aqua surface air temperature, GPM IMERG precipitation) | official NASA series for eight demonstration cities, stored as archived data in `docs/data/giovanni.json` | Earthdata Login |
| **NASA POWER** (MERRA-2) | live monthly series for any point | open |
| **NASA GIBS** (GPM IMERG rain rate, MODIS land surface temperature, MODIS true colour) | map layers | open |
| **NASA EONET** | natural events nearby | open |
| ERA5 (ECMWF / Copernicus) via Open-Meteo | independent second dataset, daily | open |
| Copernicus DEM (90 m) via Open-Meteo | terrain screening | open |
| Copernicus GloFAS via Open-Meteo | river discharge | open |
| CAMS via Open-Meteo | air quality | open |
| NOAA GHCN-Daily (Climate Data Online archive) | station check in the analysis | open |
| InfoDengue (Fiocruz / FGV, Brazil) | notified dengue cases for ten Brazilian cities | open |
| OpenStreetMap (Nominatim, Overpass) | address search, health services nearby | open |

Thermal suitability for *Aedes aegypti* follows the temperature curve in Mordecai et al. (2017), *PLoS Neglected Tropical Diseases* 11(4): e0005568. It describes suitability, not cases.

## Limits

- Gridded climate data describe areas of roughly 25–50 km, not a single building.
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
