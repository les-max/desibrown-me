---
name: Desi Brown
description: A personal blog that feels like a marked-up script — warm, honest, and a little wacky.
colors:
  warm-ash-cream: "#FAF7F4"
  deep-charcoal: "#2A2520"
  terracotta: "#B5725A"
  warm-gray: "#8A7F78"
  cream-border: "#E5DED7"
  surface-white: "#FFFFFF"
typography:
  display:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "clamp(3rem, 8vw, 6rem)"
    fontWeight: 900
    lineHeight: 0.95
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "clamp(1.75rem, 4vw, 2.5rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "1.25rem"
    fontWeight: 500
    lineHeight: 1.3
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.8
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.7rem"
    fontWeight: 500
    letterSpacing: "0.1em"
rounded:
  none: "0px"
  sm: "2px"
  md: "4px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "32px"
  xl: "64px"
components:
  button-primary:
    backgroundColor: "{colors.deep-charcoal}"
    textColor: "{colors.warm-ash-cream}"
    rounded: "{rounded.sm}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.terracotta}"
    textColor: "{colors.warm-ash-cream}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.deep-charcoal}"
    rounded: "{rounded.sm}"
    padding: "12px 24px"
  nav:
    backgroundColor: "{colors.warm-ash-cream}"
    textColor: "{colors.deep-charcoal}"
  post-card:
    backgroundColor: "transparent"
    textColor: "{colors.deep-charcoal}"
---

# Design System: Desi Brown

## 1. Overview

**Creative North Star: "The Marked-Up Script"**

This is a blog that feels like a working document — a script with pencil marks in the margins, dog-eared pages, a coffee ring on the cover. It's warm, personal, and a little wacky. Not designed to impress; designed to *feel like her*. The theater reference lives in the subtext: there's a sense of performance and timing in how content is revealed, but the costume never shows.

The typographic palette is anchored by Fraunces, a quirky variable serif with optical size variation and irregular letterforms that carry genuine personality. At large display sizes it has drama; at smaller sizes it stays readable and warm. Paired with clean Inter for body copy, the contrast is intentional — the "voice" is expressive, the "words" are clear.

Color strategy is Restrained: one warm cream field, one terracotta accent used sparingly. The cream is never stark white — it has warmth baked in. The charcoal is never black — it leans brown.

**Key Characteristics:**
- Fraunces for all display and headline typography
- Warm cream (#FAF7F4) base, never clinical white
- Terracotta accent used at ≤10% of any surface
- Loose, unhurried spacing — generous but not wasteful
- Flat elevation: no shadows, depth through tonal contrast only
- Loose and approachable components: soft but with clear intent

## 2. Colors: The Warm Stage Palette

A restrained palette where the warmth is structural, not decorative. Every neutral has a brown lean; nothing is cool or clinical.

### Primary
- **Terracotta** (#B5725A): The single accent. Used for hover states, links, and emphasis moments. Never backgrounds, never borders. Its rarity is the point.

### Neutral
- **Warm Ash Cream** (#FAF7F4): The dominant surface. Every page, every card. It reads warm, not white.
- **Deep Charcoal** (#2A2520): All body text and primary UI. A brown-leaning near-black. Never #000.
- **Warm Gray** (#8A7F78): Secondary text — dates, metadata, captions. Muted but still warm.
- **Cream Border** (#E5DED7): Dividers and structural lines. Barely-there; texture, not wall.
- **Surface White** (#FFFFFF): Reserved for form fields and input backgrounds only.

### Named Rules
**The Rarity Rule.** Terracotta appears on ≤10% of any given screen. It's a punctuation mark, not a sentence. Use it on hover states, post-card title hover, and active links — nowhere else.

**The Never Cool Rule.** Every color tilts warm. If a new color is needed, it must lean brown or amber before anything else is considered.

## 3. Typography: Fraunces + Inter

**Display Font:** Fraunces (variable — use optical size axis `opsz` for large display, normal `opsz` for smaller headings)
**Body Font:** Inter (with system-ui fallback)

**Character:** Fraunces has the personality of a handwritten letter that was very carefully set in type. It's expressive, a little eccentric, and completely at home on a personal blog. Inter provides contrast — clean, invisible, efficient — so the words don't compete with the voice.

### Hierarchy
- **Display** (900 weight, clamp(3rem → 6rem), line-height 0.95, letter-spacing -0.02em): The site name on the homepage only. Set huge, tight, and slightly unexpected.
- **Headline** (700 weight, clamp(1.75rem → 2.5rem), line-height 1.1): Individual post titles on the post page.
- **Title** (500 weight, 1.25rem, line-height 1.3): Post card titles in the blog list.
- **Body** (400 weight, 1rem, line-height 1.8): All post body copy. Max 65ch line length. Inter only.
- **Label** (Inter 500, 0.7rem, letter-spacing 0.1em, uppercase): Dates, metadata, tags. The only uppercase in the system.

### Named Rules
**The One Serif Rule.** Fraunces is the only serif in the system. Do not introduce a second serif for any reason — not for blockquotes, not for captions, not for the admin.

**The Optical Size Rule.** At display sizes (>3rem), use `font-variation-settings: 'opsz' 144` to activate Fraunces's large-optical-size variant. At title sizes (<2rem), use `'opsz' 9` for the text-optimized cut.

## 4. Elevation

This system is entirely flat. No drop shadows, no blur, no glassmorphism. Depth is created through tonal contrast alone: the cream background, the near-white surface, and the border color are three tonal steps that establish hierarchy without shadows.

**The Flat Rule.** If depth is needed, step up the background tone. Never reach for a shadow. A photo already lifts off the cream page — that's the only elevation this system needs.

## 5. Components

### Buttons
Loose and approachable — they have clear intent without being demanding.
- **Shape:** Nearly square (2px radius). Not rounded pills, not hard right-angles — just a hint of give.
- **Primary:** Deep Charcoal background, Warm Ash Cream text. Full-width on mobile, auto on desktop.
- **Hover:** Transitions to Terracotta in 200ms. No movement, just color.
- **Ghost:** No background, Deep Charcoal border (1px Cream Border), text matches foreground. Used for secondary actions.

### Post Card
The workhorse component. Loose, editorial, not boxed.
- **No card container.** Posts sit directly on the cream field separated by a hairline border rule.
- **Photo:** Full-width, aspect-ratio 4/3, no border-radius. A photo should feel pasted-in, not inset.
- **Title:** Fraunces Title weight (500), transitions to Terracotta on hover.
- **Date:** Inter Label — tiny, uppercase, letter-spaced. The smallest element on the card.
- **Excerpt:** Warm Gray Inter body. It steps back; the title leads.

### Navigation
- **Height:** 56px. Single row.
- **Site name:** Fraunces at 1.25rem, 500 weight — not display size. Confident, not shouting.
- **No background change on scroll.** The nav stays cream; no sticky shadow.
- **Single item:** The site name is the only nav element on the public site.

### Inputs / Fields
- **Style:** 1px Cream Border stroke, Surface White background, 2px radius.
- **Focus:** Border shifts to Terracotta at 200ms. No glow, no shadow — just color.
- **Placeholder:** Warm Gray text.

## 6. Do's and Don'ts

### Do:
- **Do** use Fraunces for every heading and display text — it's the only expressive element.
- **Do** set the homepage site name extremely large: clamp(3rem, 8vw, 6rem), weight 900, tight leading.
- **Do** keep photos full-bleed with no border-radius — they should feel pasted onto the page.
- **Do** use the label style (0.7rem, uppercase, Inter 500) for dates and metadata everywhere, consistently.
- **Do** let whitespace breathe — `space-y-14` between post cards, `py-16` on the main container.
- **Do** use `font-variation-settings: 'opsz' 144` at display sizes.

### Don't:
- **Don't** make it look like a generic Squarespace blog — no cookie-cutter layout, no stock-photo hero.
- **Don't** make it slick or polished — rough edges and imperfect spacing are features, not bugs.
- **Don't** make it look like a fashion magazine — no editorial-glossy color, no overstyled layout grids.
- **Don't** make literal theater references: no playbill typography, no curtain motifs, no spotlight effects.
- **Don't** use Terracotta for backgrounds, large blocks, or borders — its power is in rarity.
- **Don't** introduce any cool-leaning color. If something new is needed, it must lean warm.
- **Don't** use rounded pills for buttons or images — this system is nearly square.
- **Don't** add shadows. Ever.
