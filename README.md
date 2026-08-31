# bigeasypaintings-site

Static HTML preview of the **bigeasypaintings.com** homepage redesign.

**This is not the live site.** It is a design preview of work built on local staging and never
written to the client's production site. Every page carries `robots: noindex,nofollow`, because a
public copy of a client's own homepage copy on a crawlable domain would compete with them for
their own content.

## What it is

Homepage direction **H "Two Coats"** in font and colour theme **B "Job Site"**:
Archivo 800 headings over IBM Plex Sans, a graphite ground, optic white paper, and one safety
amber that only ever marks the act-here element.

## Structure

```
index.html            the homepage, 13 sections
assets/css/main.css   
assets/js/main.js     scroll reveals, the two-coats headline, the accordion
assets/img/           32 photographs, logo and rating marks
```

No build step and no dependencies. Open `index.html`, or serve the folder with any static host.
The only external requests are the two Google Fonts families.

## Differences from the staging build, all deliberate

1. **The preview motion flag is stripped.** `data-motion="force"` belongs to the review frame
   only, where it exists because the reviewing machine runs with Windows animation effects off.
   This page honours `prefers-reduced-motion` honestly: reduced means gentler, not zero.
2. **`noindex,nofollow` is added**, for the reason above.
3. **The estimate form is inert** and says so when submitted. On a static host it has nowhere to
   post, and a form that silently reloads the page reads as broken.

## Generated, not hand-written

Built by `canvas/build_static_site.py` from the same generator output the WordPress theme is
ported from, so the static page and the staging theme cannot drift. Edit the generator and
rebuild; a hand edit here is lost on the next build.
