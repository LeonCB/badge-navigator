/*!
 * Badge navigator for Home Assistant
 * A single badge that renders a compact row of navigation shortcuts
 * (e.g. to other views/dashboards), with the current view highlighted.
 *
 * https://github.com/LeonCB/badge-navigator
 *
 * Usage in a view's `badges:` list:
 *
 *   - type: custom:badge-navigator
 *     targets:
 *       - path: /dashboard-woonkamer/woonkamer
 *         icon: mdi:sofa
 *         text: Woonkamer
 *       - path: /dashboard-woonkamer/keuken
 *         icon: mdi:countertop
 *         text: Keuken
 *
 * See README.md for the full config reference.
 */

const BADGE_NAVIGATOR_VERSION = "2026.8.5";

class BadgeNavigator extends HTMLElement {
  setConfig(config) {
    if (!config || !Array.isArray(config.targets) || config.targets.length === 0) {
      throw new Error("badge-navigator: 'targets' must be a non-empty list of { path, icon } entries");
    }
    config.targets.forEach((t, i) => {
      if (!t.path) throw new Error(`badge-navigator: targets[${i}] is missing 'path'`);
      if (!t.icon) throw new Error(`badge-navigator: targets[${i}] is missing 'icon'`);
    });

    this._config = {
      show_labels: false,
      active_color: "var(--state-active-color)",
      inactive_color: "var(--primary-color)",
      spacing: 20,
      ...config,
    };
    this._built = false;
    this._render();
  }

  // Required by HA; badge content here doesn't depend on entity state,
  // so we only use this to trigger the first render if setConfig ran first.
  set hass(hass) {
    this._hass = hass;
    if (!this._built) this._render();
  }

  connectedCallback() {
    this._onLocationChanged = () => this._updateActive();
    window.addEventListener("location-changed", this._onLocationChanged);
    window.addEventListener("popstate", this._onLocationChanged);
    this._updateActive();
  }

  disconnectedCallback() {
    window.removeEventListener("location-changed", this._onLocationChanged);
    window.removeEventListener("popstate", this._onLocationChanged);
  }

  getCardSize() {
    return 1;
  }

  static getStubConfig() {
    return {
      targets: [
        { path: "/lovelace/home", icon: "mdi:home", text: "Home" },
        { path: "/lovelace/settings", icon: "mdi:cog", text: "Instellingen" },
      ],
    };
  }

  _navigate(path) {
    if (window.location.pathname === path) return;
    history.pushState(null, "", path);
    window.dispatchEvent(new CustomEvent("location-changed", { bubbles: true, composed: true }));
  }

  _render() {
    if (!this._config) return;
    this._built = true;

    const root = this.shadowRoot || this.attachShadow({ mode: "open" });
    root.innerHTML = "";

    const style = document.createElement("style");
    style.textContent = `
      :host {
        display: inline-flex;
        --badge-navigator-active-color: ${this._config.active_color};
        --badge-navigator-inactive-color: ${this._config.inactive_color};
      }
      .bar {
        box-sizing: border-box;
        height: 36px;
        display: flex;
        align-items: center;
        gap: ${this._config.spacing}px;
        background: var(--ha-card-background, var(--card-background-color, #fff));
        border-radius: 18px;
        padding: 0 6px;
      }
      button {
        all: unset;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        height: 24px;
        min-width: 24px;
        padding: 0;
        line-height: 0;
        cursor: pointer;
        border-radius: 12px;
        color: var(--badge-navigator-inactive-color);
        transition: background-color 0.18s ease-in-out, color 0.18s ease-in-out;
      }
      button.has-label {
        padding: 0 8px 0 4px;
      }
      button:hover {
        background: color-mix(in srgb, var(--badge-navigator-inactive-color) 4%, transparent);
      }
      button:active {
        background: color-mix(in srgb, var(--badge-navigator-inactive-color) 12%, transparent);
      }
      button.active {
        color: var(--badge-navigator-active-color);
        background: color-mix(in srgb, var(--badge-navigator-active-color) 16%, transparent);
      }
      button.active:hover {
        background: color-mix(in srgb, var(--badge-navigator-active-color) 20%, transparent);
      }
      button.active:active {
        background: color-mix(in srgb, var(--badge-navigator-active-color) 28%, transparent);
      }
      ha-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        --mdc-icon-size: 18px;
        pointer-events: none;
      }
      span.label {
        font-size: var(--ha-font-size-s, 12px);
        font-weight: 500;
        white-space: nowrap;
        pointer-events: none;
      }
    `;
    root.appendChild(style);

    const bar = document.createElement("div");
    bar.className = "bar";

    this._buttons = [];
    this._config.targets.forEach((target) => {
      const btn = document.createElement("button");
      btn.type = "button";
      if (target.text) btn.title = target.text;

      const showLabel = this._config.show_labels && target.text;
      if (showLabel) btn.classList.add("has-label");

      const icon = document.createElement("ha-icon");
      icon.icon = target.icon;
      btn.appendChild(icon);

      if (showLabel) {
        const label = document.createElement("span");
        label.className = "label";
        label.textContent = target.text;
        btn.appendChild(label);
      }

      btn.addEventListener("click", () => this._navigate(target.path));
      bar.appendChild(btn);
      this._buttons.push({ el: btn, path: target.path });
    });

    root.appendChild(bar);
    this._updateActive();
  }

  _updateActive() {
    if (!this._buttons) return;
    const current = window.location.pathname;
    this._buttons.forEach(({ el, path }) => {
      el.classList.toggle("active", current === path);
    });
  }
}

customElements.define("badge-navigator", BadgeNavigator);

window.customBadges = window.customBadges || [];
window.customBadges.push({
  type: "badge-navigator",
  name: "Badge navigator",
  preview: false,
  description: "A single compact badge with a row of navigation shortcuts to other views, active view highlighted.",
  documentationURL: "https://github.com/LeonCB/badge-navigator",
});

console.info(`%c BADGE-NAVIGATOR %c v${BADGE_NAVIGATOR_VERSION} `, "color: white; background: #03a9f4; font-weight: 700;", "color: #03a9f4; background: transparent;");
