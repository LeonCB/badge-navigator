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

(() => {
// Wordt bij een GitHub-release door de workflow vervangen door de tag.
const BADGE_NAVIGATOR_VERSION = "dev";

const STYLE = `
  :host {
    display: inline-flex;
  }
  .bar {
    box-sizing: border-box;
    height: 36px;
    display: flex;
    align-items: center;
    gap: var(--badge-navigator-spacing, 20px);
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
    background: color-mix(in srgb, var(--badge-navigator-inactive-color) 10%, transparent);
  }
  button:active {
    background: color-mix(in srgb, var(--badge-navigator-inactive-color) 22%, transparent);
  }
  button:focus-visible {
    outline: 2px solid var(--badge-navigator-inactive-color);
    outline-offset: 1px;
  }
  button.active {
    color: var(--badge-navigator-active-color);
    background: color-mix(in srgb, var(--badge-navigator-active-color) 18%, transparent);
  }
  button.active:hover {
    background: color-mix(in srgb, var(--badge-navigator-active-color) 28%, transparent);
  }
  button.active:active {
    background: color-mix(in srgb, var(--badge-navigator-active-color) 38%, transparent);
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
  @media (prefers-reduced-motion: reduce) {
    button { transition: none; }
  }
`;

// "/dashboard/keuken/" en "/dashboard/keuken" zijn dezelfde view.
const normalizePath = (p) => (p.length > 1 ? p.replace(/\/+$/, "") : p);

class BadgeNavigator extends HTMLElement {
  constructor() {
    super();
    this._onLocationChanged = () => this._updateActive();
  }

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
    this._render();
  }

  // Vereist door HA; de badge hangt niet af van entity-states, dus hier
  // hoeft niets opnieuw getekend te worden.
  set hass(hass) {
    this._hass = hass;
  }

  connectedCallback() {
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

  _navigate(path, ev) {
    // Ctrl/Cmd-klik of middelste muisknop: in een nieuw tabblad openen.
    if (ev && (ev.ctrlKey || ev.metaKey || ev.button === 1)) {
      window.open(path, "_blank", "noopener");
      return;
    }
    if (normalizePath(window.location.pathname) === normalizePath(path)) return;
    history.pushState(null, "", path);
    window.dispatchEvent(new CustomEvent("location-changed", { detail: { replace: false } }));
  }

  _ensureDom() {
    if (this._bar) return;
    const root = this.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = STYLE;
    this._bar = document.createElement("div");
    this._bar.className = "bar";
    this._bar.setAttribute("role", "navigation");
    root.append(style, this._bar);
  }

  _render() {
    this._ensureDom();
    const { active_color, inactive_color, spacing, show_labels, targets } = this._config;

    // Kleuren en afstand als CSS-variabelen i.p.v. in de stylesheet geplakt:
    // de stylesheet blijft vast en een config-waarde kan de CSS niet breken.
    this.style.setProperty("--badge-navigator-active-color", active_color);
    this.style.setProperty("--badge-navigator-inactive-color", inactive_color);
    this.style.setProperty("--badge-navigator-spacing", `${Number(spacing) || 0}px`);

    this._buttons = targets.map((target) => {
      const btn = document.createElement("button");
      btn.type = "button";
      if (target.text) {
        btn.title = target.text;
        btn.setAttribute("aria-label", target.text);
      }

      const icon = document.createElement("ha-icon");
      icon.icon = target.icon;
      btn.appendChild(icon);

      if (show_labels && target.text) {
        btn.classList.add("has-label");
        const label = document.createElement("span");
        label.className = "label";
        label.textContent = target.text;
        btn.appendChild(label);
      }

      btn.addEventListener("click", (ev) => this._navigate(target.path, ev));
      btn.addEventListener("auxclick", (ev) => {
        if (ev.button === 1) this._navigate(target.path, ev);
      });
      return { el: btn, path: normalizePath(target.path) };
    });

    this._bar.replaceChildren(...this._buttons.map((b) => b.el));
    this._updateActive();
  }

  _updateActive() {
    if (!this._buttons) return;
    const current = normalizePath(window.location.pathname);
    this._buttons.forEach(({ el, path }) => {
      const active = current === path;
      el.classList.toggle("active", active);
      if (active) el.setAttribute("aria-current", "page");
      else el.removeAttribute("aria-current");
    });
  }
}

// Dubbel laden (bv. zowel /local/ als /hacsfiles/ als bron) mag niet crashen.
if (!customElements.get("badge-navigator")) {
  customElements.define("badge-navigator", BadgeNavigator);

  window.customBadges = window.customBadges || [];
  window.customBadges.push({
    type: "badge-navigator",
    name: "Badge navigator",
    preview: false,
    description: "A single compact badge with a row of navigation shortcuts to other views, active view highlighted.",
    documentationURL: "https://github.com/LeonCB/badge-navigator",
  });

  console.info(
    `%c BADGE-NAVIGATOR %c ${BADGE_NAVIGATOR_VERSION} `,
    "color: white; background: #03a9f4; font-weight: 700;",
    "color: #03a9f4; background: transparent;"
  );
}
})();
