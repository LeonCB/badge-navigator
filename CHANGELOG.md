# Changelog

Versioning scheme: `yyyy.m.d` — year, month, day of the commit (not a semantic-version
counter). Multiple releases on the same calendar day are not expected to occur; if they
do, bump the day forward rather than reusing it.

## 2026.8.6

- Raised the hover/press tint opacities (10%/22% inactive, 18%/28%/38% active-base/
  hover/press) — HA's literal `ha-ripple` values (4%/12%) render through a radial
  ripple element and read stronger in practice than the same numbers on a flat
  `color-mix` overlay, so a flat overlay needs higher percentages to actually be visible.

## 2026.8.5

- Replaced the scale-on-hover effect with a proper background hover, modeled on HA's
  own `ha-badge` component (which uses `ha-ripple` with `--ha-ripple-hover-opacity: 0.04`
  / `--ha-ripple-pressed-opacity: 0.12`): each icon now gets a subtle tint of its own
  color at 4% on hover and 12% on press, layered on top of the existing 16% active-state
  tint for the current view's icon.

## 2026.8.4

- Added a hover effect to the icon buttons, inspired by HA's built-in entity badges:
  a soft color-tinted background plus a slight scale-up on hover, and a scale-down
  on press for tactile feedback.

## 2026.8.3

- Removed the border around the badge bar (bar height stays 36px).
- New defaults: `inactive_color: var(--primary-color)`, `active_color: var(--state-active-color)`,
  `spacing: 20`.
- README trimmed (dropped the intro rationale/sizing blurb, the "push to your own GitHub"
  install step, extra Notes bullets, and the Versioning section) and pointed at the real
  repo URL (`https://github.com/LeonCB/badge-navigator`).
- LICENSE copyright holder set to LeonCB.

## 2026.8.2

- Renamed the badge from `nav-badge` to `badge-navigator` (element tag, badge type,
  file, repo name, hacs.json).
- Badge height fixed at 36px, icon backgrounds at 24px, icons at 18x18px.
- Fixed vertical icon alignment (`ha-icon` defaults to `inline-block`, which offset it
  within the 24px circle — switched to `display: flex` with centering).
- Added a `spacing` config option (pixels between icons), default `12`.

## 2026.8.1

- Initial version, as `nav-badge`: single badge rendering a row of navigation
  shortcuts with the active view highlighted.
