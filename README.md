# Ak Construction and Interiors — Website

A static, five-page marketing website for Ak Construction and Interiors, a
proprietor-run construction and real estate firm in Vidyaranyapura,
Bangalore. No build step, no framework, no backend.

## Pages

| File | Page |
| --- | --- |
| `index.html` | Home — full-bleed video hero, services, why-us, process, credentials |
| `about.html` | About — story, business profile, numbers, service area |
| `services.html` | Services — seven services in detail (construction + real estate), process, FAQ |
| `projects.html` | Projects — filterable grid of recent work |
| `contact.html` | Contact — enquiry form, office details, map |

## Running it

No build step. Serve the folder:

```
python3 -m http.server 8000
```

Then open <http://localhost:8000>. Opening `index.html` directly from the file
system also works, though the map iframe and Google Fonts need a network
connection.

## Design system

Defined as CSS custom properties at the top of `assets/css/style.css`.

**Palette — "Ochre Terracotta"**

| Token | Hex | Use |
| --- | --- | --- |
| `--bone` | `#F7F1E6` | Page background (warm sand) |
| `--bone-2` | `#F0E6D3` | Alternating section bands |
| `--ink` | `#241C14` | Body text, dark sections, footer |
| `--muted` | `#756751` | Secondary text (passes 4.5:1 on bone) |
| `--taupe` | `#8E7E63` | Borders, decorative, text on dark |
| `--clay` | `#9C5A1E` | Accent — CTAs and active nav only (a burnt-ochre pulled from the logo's gold, darkened to clear 4.5:1 text/button contrast; the CSS variable keeps its original name) |

The accent is deliberately restricted to primary buttons, active navigation
and section labels. That restraint is the point of the palette; adding it to
headings or backgrounds will undo it.

**Typography** — Archivo (display, 500/600/700) and Inter (body, 400/500/600),
loaded from Google Fonts.

The section labels (`.sheet-label`) and numbered cards borrow the annotation
style of the architectural drawing used as the hero poster. The checkmark
"business profile" grid on `about.html` (`.profile-grid`) echoes the layout of
a business-directory listing — properties served, commercial/residential
types, building type, services, status — using only the facts supplied for
this business, not invented categories.

## Hero video

`index.html` uses `Hero video.mp4` as a muted, looping, full-bleed hero with no
text overlay, and `Hero image.png` as the poster frame. The video is H.264/AAC,
8 seconds, ~11 MB.

**Recommendation before launch:** 11 MB is heavy for mobile data. Re-encode to
roughly 2–3 MB, for example:

```
ffmpeg -i "Hero video.mp4" -vf "scale=1280:-2" -c:v libx264 -crf 30 \
       -preset slow -an -movflags +faststart hero.mp4
```

`-an` drops the audio track, which is unused because the video is muted.
`+faststart` lets playback begin before the whole file downloads.

Under `prefers-reduced-motion`, the video does not autoplay and the poster
image is shown instead.

## Animation

Handled in `assets/js/main.js` and the "Motion layer" section of the
stylesheet:

- Page-load sequence on the top bar, header, hero and info strip
- Scroll reveals with directional variants (`.reveal--left/right/scale`)
- Count-up numbers on any element with `data-count`
- Header hides on scroll down, returns on scroll up
- Scroll progress bar (injected by JS)
- Looping marquee, paused on hover and focus
- Hover states on cards, buttons, stats and feature rows

Every one of these is disabled or neutralised under `prefers-reduced-motion`.

## Before going live

1. **Enquiry form** — `contact.html` validates input but is **not connected to a
   backend**. Submitting shows a local confirmation only; nothing is emailed or
   stored. Wire it to a form service (Formspree, Web3Forms) or your own endpoint
   before launch. See the comment in `main.js`.
2. **Project photographs** — the project cards use a hatched placeholder.
   Drop real photos into `assets/images/projects/` and replace each
   `.proj__placeholder` block with `<img src="..." alt="...">`.
3. **No star rating or review count is shown anywhere.** The site previously
   carried a "4.8 rating · 82 reviews" claim that was placeholder data from an
   earlier draft of this site, invented for a different business name. It has
   been removed rather than carried over, since there was no verified review
   data for Ak Construction and Interiors. In its place the site shows only what was
   confirmed: Government Approved status, established 2014, proprietor Uday
   Jain. If you have real Google review numbers, they can be added back in the
   same slots (hero info-strip card, homepage credentials card, contact page
   credentials item — search for "Government Approved" to find them).
4. **"12+ years" is a real, derived figure** (current year − 2014), not a
   placeholder — but re-check it periodically since it is written as a static
   number, not computed from the current date.
5. **Social links** — the Facebook, Instagram and YouTube icons in every footer
   point to `#`.
6. **"+2 More" / "+1 More" categories** — the business-profile grid on
   `about.html` shows only the property types that were confirmed (e.g.
   Agriculture, Residential under "Properties Served"). The source listing
   this was drawn from indicated more categories existed without stating what
   they were, so none were invented. Add the real ones if you have them.

## Business details used throughout

- **Business name:** Ak Construction and Interiors
- **Proprietor:** Uday Jain
- **Established:** 2014
- **Address:** # 10, Sai Nagar, 3rd Cross, Amba Bhavani Temple Road,
  Vidyaranyapura, Bangalore, Karnataka, India
- **Phone:** 097389 99144 (linked as `tel:+919738999144`)
- **Email:** akconstructionsinteriors@gmail.com
- **Hours:** Monday–Saturday, 9am–7pm
- **Status:** Government Approved
- **Services:** Building construction, structural/RCC work, interiors
  (including Gypsum False Ceiling), and real estate consulting (residential &
  commercial rentals, land and agricultural property sales, leasing, buying
  and selling — independent houses, residential plots, hotels, warehouses)

These appear in the hero info-strip, footer and contact page of every page.
Search for `99144` to find each phone occurrence, or `Vidyaranyapura` for the
address, when updating.

## Accessibility

Skip link, visible focus rings, keyboard-operable nav, filters and FAQ,
`aria-expanded`/`aria-pressed` state, labelled form fields with inline errors,
4.5:1 minimum text contrast, and full `prefers-reduced-motion` support. Verified
with no horizontal overflow at 390px, 768px, 1024px and 1440px.
