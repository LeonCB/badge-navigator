# Badge navigator

![versie](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fapi.github.com%2Frepos%2FLeonCB%2Fbadge-navigator%2Freleases%2Flatest&query=%24.tag_name&label=versie&color=blue)

A custom [Home Assistant](https://www.home-assistant.io/) badge that packs a whole row of
navigation shortcuts into **one badge**, instead of one `shortcut` badge per destination.
The badge that matches the current view is highlighted automatically.

![Badge navigator](https://raw.githubusercontent.com/LeonCB/badge-navigator/main/images/badge-navigator.png)

In a dashboard's badge row, next to other badges:

![Badge navigator in a badge row](https://raw.githubusercontent.com/LeonCB/badge-navigator/main/images/all-badges.png)

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

Badge navigator is not in the default catalog (yet), so it is added as a **custom repository**.

### Home Assistant Marketplace (Home Assistant 2026.11 and newer, recommended)

[![Open your Home Assistant instance and open a repository in the Marketplace.](https://my.home-assistant.io/badges/marketplace_repository.svg)](https://my.home-assistant.io/redirect/marketplace_repository/?owner=LeonCB&repository=badge-navigator&category=plugin)

1. Click the button above to open the repository in **Settings → Marketplace**.
   Adding a custom repository requires a GitHub connection in the Marketplace.
2. Install **Badge navigator**, then reload your browser.
3. The Marketplace registers the dashboard resource for you automatically
   (served from `/local/community/badge-navigator/`).

Already installed via HACS? It moves to the Marketplace by itself when you update
Home Assistant to 2026.11 — no need to reinstall. Only if you load dashboard resources
from YAML, follow the repair Home Assistant shows to update the old `/hacsfiles/` path.

### HACS (Home Assistant 2026.10 and older)

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=LeonCB&repository=badge-navigator&category=plugin)

Or add it by hand:

1. In Home Assistant: HACS → the three-dot menu (top right) → **Custom repositories**.
2. Add `https://github.com/LeonCB/badge-navigator`, category **Dashboard**.
3. Install **Badge navigator** from HACS, then reload your browser.
4. HACS registers the resource for you automatically.

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
| `active_color` | string  | `var(--state-active-color)` | Color used for the currently active destination                |
| `inactive_color`| string | `var(--primary-color)`      | Color used for the other destinations                         |
| `spacing`      | number  | `20`                         | Space in pixels between icons                                   |

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

## License

MIT — see [LICENSE](LICENSE).
