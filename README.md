# Cloud Cert Mock Exams

Timed mock exams for AWS and CNCF certifications, hosted on GitHub Pages:
**https://chalvinwz.github.io/cert-prep/**

| Exam | Questions in bank | Exam length |
| --- | --- | --- |
| AWS CLF-C02 Cloud Practitioner | 136 | 65 q · 90 min |
| AWS SAA-C03 Solutions Architect – Associate | 130 | 65 q · 130 min |
| AWS SOA-C03 CloudOps Engineer – Associate | 130 | 65 q · 130 min |
| CNCF KCNA | 120 | 60 q · 90 min |
| CNCF KCSA | 120 | 60 q · 90 min |

Each exam has an exam mode (timed, scored at the end) and a practice mode (check answers as you go), plus per-domain scores and an explanation for every question.

## Use it on any device

- Open the URL in any browser. After the first visit it also works offline.
- Install it like an app: on iPhone, Safari → Share → **Add to Home Screen**. On Android or desktop Chrome/Edge, use **Install app** in the browser menu.
- Progress (score history, an unfinished attempt, questions already seen) is saved in that browser only. Your phone and laptop keep separate histories, and on iPhone the home-screen app keeps its own history apart from Safari.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The whole app: UI, logic and all question banks inline |
| `sw.js` | Service worker for offline use |
| `manifest.webmanifest` | App name, colors and icons for installing |
| `icons/` | Favicon and app icons (SVG sources plus rendered PNGs) |
| `.nojekyll` | Tells GitHub Pages to serve files as-is, without a Jekyll build |

## Update the questions or the app

Replace `index.html` with the new version, then commit and push. GitHub Pages redeploys in about a minute. The service worker fetches the page from the network first, so an online visit picks up the new version. Bump `VERSION` in `sw.js` only if you add or rename files in its `PRECACHE` list.

Keep the `<head>` tags (manifest, icons, description) and the service-worker `<script>` at the end of the body when you swap in a new `index.html`.

## Run locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000. Service workers need `http://localhost` or HTTPS, so opening the file directly (`file://`) works but without offline support.
