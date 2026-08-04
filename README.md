# Badge navigator

A custom [Home Assistant](https://www.home-assistant.io/) badge that packs a whole row of
navigation shortcuts into **one badge**, instead of one `shortcut` badge per destination.
The badge that matches the current view is highlighted automatically.

Built because repeating 9+ `shortcut` badges (plus decorative arrow icons) in the badge row
of every view gets old fast — this reduces that whole block to a single line of config.

**Sizing:** badge height 36px, icon backgrounds 24px, icons 18x18px.

## Before / after

```yaml
# Before: one shortcut badge per destination, repeated in every view
badges:
  - type: custom:mushroom-template-badge
    icon: mdi:arrow-right
  - type: shortcut
    tap_action:
      action: navigate
      navigation_path: /dashboard-woonkamer/woonkamer
    text: " "
  - type: shortcut
    tap_action:
      action: navigate
      navigation_path: /dashboard-woonkamer/keuken
    text: " "
  # ...9 more of these...

# After
badges:
  - type: custom:badge-navigator
    targets:
      - path: /dashboard-woonkamer/woonkamer
        icon: mdi:sofa
        text: Woonkamer
      - path: /dashboard-woonkamer/keuken
        icon: mdi:countertop
        text: Keuken
      # ...
```

## Installation

### Via HACS (recommended)

1. Push this repository to your own GitHub account (public repo required for HACS).
2. In Home Assistant: HACS → the three-dot menu (top right) → **Custom repositories**.
3. Add your repo's URL, category **Dashboard**.
4. Install **Badge navigator** from HACS, then reload your browser.
5. HACS registers the resource for you automatically.

### Manual

1. Copy `badge-navigator.js` to `<config>/www/badge-navigator.js`.
2. Settings → Dashboards → three-dot menu → **Resources** → add resource:
   - URL: `/local/badge-navigator.js`
   - Type: JavaScript module
3. Reload your browser.

## Configuration

| Key            | Type    | Default                    | Description                                                   |
|----------------|---------|-----------------------------|-----------------------------------------------------------------|
| `targets`      | list    | *(required)*                | Ordered list of destinations, see below                        |
| `show_labels`  | boolean | `false`                     | Show text labels next to the icons, not just on hover-tooltip  |
| `active_color` | string  | `var(--primary-color)`      | Color used for the currently active destination                |
| `inactive_color`| string | `var(--secondary-text-color)`| Color used for the other destinations                         |
| `spacing`      | number  | `12`                         | Space in pixels between icons                                   |

Each entry in `targets`:

| Key    | Type   | Required | Description                                  |
|--------|--------|----------|-----------------------------------------------|
| `path` | string | yes      | Navigation path, e.g. `/dashboard-woonkamer/keuken` |
| `icon` | string | yes      | Any `mdi:` icon                               |
| `text` | string | no       | Used as the tooltip, and as the label when `show_labels: true` |

## Example: full navigation row for a 9-view dashboard

```yaml
badges:
  - type: custom:badge-navigator
    show_labels: false
    targets:
      - path: /dashboard-woonkamer/woonkamer
        icon: mdi:sofa
        text: Woonkamer
      - path: /dashboard-woonkamer/keuken
        icon: mdi:countertop
        text: Keuken
      - path: /dashboard-woonkamer/kantoor
        icon: mdi:chair-rolling
        text: Kantoor
      - path: /dashboard-woonkamer/slaapkamer
        icon: mdi:bed-empty
        text: Slaapkamer
      - path: /dashboard-woonkamer/het-weer
        icon: mdi:weather-partly-cloudy
        text: Het weer
      - path: /dashboard-woonkamer/reisinformatie
        icon: mdi:train
        text: Reisinformatie
      - path: /dashboard-woonkamer/muziek
        icon: mdi:music
        text: Muziek
      - path: /dashboard-woonkamer/asus-ax88u
        icon: mdi:wifi
        text: Asus AX88U
      - path: /dashboard-woonkamer/agenda
        icon: mdi:calendar
        text: Agenda
```

Since this is one badge config block, not eleven, it's small enough to copy into each
view's `badges:` list directly — no templating needed for the badge itself.

## Notes

- This is a **badge**, not a card — it goes in a view's `badges:` list. Badges render
  above the cards, same as the built-in `entity` and `shortcut` badges.
- No visual config editor is included (YAML-only for now) — PRs welcome.
- Tested against Home Assistant 2026.x sections-view dashboards.

## Versioning

Releases are tagged `yyyy.m.d` (year.month.day of the release), see [CHANGELOG.md](CHANGELOG.md).
When you cut a GitHub release, tag it to match — HACS reads the tag as the version.

## License

MIT — see [LICENSE](LICENSE).
