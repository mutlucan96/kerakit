// noinspection CssUnresolvedCustomProperty,CssUnusedSymbol

/**
 * @file Lit component for the Kera Host Simulator control panel.
 * @license MIT
 * @copyright 2025 Mutlu Can Yilmaz
 */

import { css, html, LitElement } from "lit";

export class HostPanel extends LitElement {
  static properties = {
    runtimeExists: { type: Boolean, state: true },
    runtimeInstalled: { type: Boolean, state: true },
    runtimeType: { type: String, state: true },
    themeMode: { type: String, state: true },
    colorPrimary: { type: String, state: true },
    colorSecondary: { type: String, state: true },
    colorTertiary: { type: String, state: true },
    runtimeInfoPayload: { type: Object, state: true },
    hostStatus: { type: String },
    clientReadyPayload: { type: Object },
    sentRuntimeInfo: { type: Object },
    _isPanelOpen: { type: Boolean, state: true },
  };

  static styles = css`
    :host {
      --panel-width: 350px;
      position: relative;
      width: var(--panel-width);
      transition: width 0.3s ease-in-out;
      flex-shrink: 0;
    }

    :host(.closed) {
      width: 0;
    }

    .panel {
      width: 100%;
      height: 100vh;
      background: var(--panel-bg);
      border-left: 1px solid var(--border-color);
      box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .panel-toggle-button {
      position: absolute;
      left: -30px;
      top: 50%;
      transform: translateY(-50%);
      width: 30px;
      height: 60px;
      border: 1px solid var(--border-color);
      border-right: none;
      background: var(--panel-bg);
      color: var(--text-color);
      cursor: pointer;
      border-radius: 8px 0 0 8px;
      font-size: 20px;
      line-height: 60px;
      padding: 0;
      z-index: 10;
    }

    .panel-content {
      padding: 20px;
      overflow-y: auto;
      width: var(--panel-width);
      height: 100%;
      box-sizing: border-box;
      color: var(--text-color);
    }

    h2 {
      margin-top: 0;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 10px;
    }

    .control-group,
    .status-group {
      margin-bottom: 20px;
    }
    label {
      display: block;
      margin-bottom: 5px;
      box-sizing: border-box;
    }
    input[type="checkbox"] {
      width: auto;
      display: inline-block;
      margin-right: 5px;
      accent-color: var(--text-color);
    }

    input[type="text"],
    select,
    textarea {
      display: block;
      width: 100%;
      box-sizing: border-box;
      padding: 8px;
      border-radius: 4px;
      border: 1px solid var(--border-color);
      background-color: var(--input-bg);
      color: var(--text-color);
      font-family: inherit;
      font-size: 14px;
    }

    select {
      appearance: none;
      background-image:
        linear-gradient(45deg, transparent 50%, var(--text-color) 50%),
        linear-gradient(135deg, var(--text-color) 50%, transparent 50%);
      background-position:
        calc(100% - 20px) calc(1em + 2px),
        calc(100% - 15px) calc(1em + 2px);
      background-size:
        5px 5px,
        5px 5px;
      background-repeat: no-repeat;
      padding-right: 30px;
    }

    pre {
      background-color: var(--pre-bg);
      color: var(--pre-text);
      padding: 10px;
      border-radius: 4px;
      white-space: pre-wrap;
      word-wrap: break-word;
      font-size: 13px;
    }
  `;

  constructor() {
    super();
    this._isPanelOpen = true;
    this.hostStatus = "Inactive";
    this.clientReadyPayload = null;
    this.sentRuntimeInfo = null;

    this.runtimeExists = true;
    this.runtimeInstalled = true;
    this.runtimeType = "window";
    this.themeMode = "system";
    this.colorPrimary = "#007bff";
    this.colorSecondary = "#6c757d";
    this.colorTertiary = "#f8f9fa";
    this.runtimeInfoPayload = {
      runtimeName: "Kera Host Simulator",
      runtimeVersion: "0.1.0-dev",
      capabilities: [],
      settings: {
        initialSetting: "valueFromHost",
      },
    };
  }

  updated(changedProperties) {
    if (changedProperties.has("_isPanelOpen")) {
      this.classList.toggle("closed", !this._isPanelOpen);
    }
  }

  _togglePanel() {
    this._isPanelOpen = !this._isPanelOpen;
  }

  _handleInputChange(e, property) {
    const { target } = e;
    this[property] = target.type === "checkbox" ? target.checked : target.value;
    this._dispatchConfigChange();
  }

  _handlePayloadChange(e) {
    try {
      this.runtimeInfoPayload = JSON.parse(e.target.value);
      this._dispatchConfigChange();
    } catch (err) {
      console.warn("Invalid JSON in payload textarea.", err);
    }
  }

  _dispatchConfigChange() {
    const detail = {
      runtimeExists: this.runtimeExists,
      runtimeInstalled: this.runtimeInstalled,
      runtimeType: this.runtimeType,
      theme: {
        mode: this.themeMode,
        colors: {
          primary: this.colorPrimary,
          secondary: this.colorSecondary,
          tertiary: this.colorTertiary,
        },
      },
      payload: this.runtimeInfoPayload,
    };
    this.dispatchEvent(
      new CustomEvent("host-config-change", {
        detail,
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    return html`
      <button class="panel-toggle-button" @click=${this._togglePanel}>
        ${this._isPanelOpen ? "→" : "←"}
      </button>
      <aside class="panel">
        <div class="panel-content">
          <h2>Host Controls</h2>

          <div class="control-group">
            <label>
              <input
                type="checkbox"
                .checked=${this.runtimeExists}
                @change=${(e) => this._handleInputChange(e, "runtimeExists")}
              />
              Runtime Exists
            </label>
            <label>
              <input
                type="checkbox"
                .checked=${this.runtimeInstalled}
                @change=${(e) => this._handleInputChange(e, "runtimeInstalled")}
              />
              <code>kera-runtime-installed</code>
            </label>
          </div>

          <div class="control-group">
            <label for="runtime-type">Runtime Type</label>
            <select
              id="runtime-type"
              .value=${this.runtimeType}
              @change=${(e) => this._handleInputChange(e, "runtimeType")}
            >
              <option value="window">window</option>
              <option value="extension">extension</option>
              <option value="drawer">drawer</option>
              <option value="widget">widget</option>
              <option value="command">command</option>
              <option value="background">background</option>
            </select>
          </div>

          <div class="control-group">
            <label for="theme-mode">Theme Mode</label>
            <select
              id="theme-mode"
              .value=${this.themeMode}
              @change=${(e) => this._handleInputChange(e, "themeMode")}
            >
              <option value="system">system</option>
              <option value="light">light</option>
              <option value="dark">dark</option>
            </select>
          </div>

          <div class="control-group">
            <label for="color-primary">Primary Color</label>
            <input
              type="text"
              id="color-primary"
              .value=${this.colorPrimary}
              @change=${(e) => this._handleInputChange(e, "colorPrimary")}
            />
            <label for="color-secondary">Secondary Color</label>
            <input
              type="text"
              id="color-secondary"
              .value=${this.colorSecondary}
              @change=${(e) => this._handleInputChange(e, "colorSecondary")}
            />
            <label for="color-tertiary">Tertiary Color</label>
            <input
              type="text"
              id="color-tertiary"
              .value=${this.colorTertiary}
              @change=${(e) => this._handleInputChange(e, "colorTertiary")}
            />
          </div>

          <div class="control-group">
            <label for="runtime-info-payload">Runtime Info Payload</label>
            <textarea
              id="runtime-info-payload"
              rows="10"
              .value=${JSON.stringify(this.runtimeInfoPayload, null, 2)}
              @change=${this._handlePayloadChange}
            ></textarea>
          </div>

          <hr />

          <h2>Host Status</h2>
          <div class="status-group">
            <strong>Runtime Status:</strong>
            <pre>${this.hostStatus}</pre>
          </div>
          <div class="status-group">
            <strong>Client <code>client-ready</code> Payload:</strong>
            <pre>
              ${this.clientReadyPayload
                ? JSON.stringify(this.clientReadyPayload, null, 2)
                : "No message received."}
            </pre
            >
          </div>
          <div class="status-group">
            <strong>Sent <code>runtime-detected</code> Payload:</strong>
            <pre>
              ${this.sentRuntimeInfo
                ? JSON.stringify(this.sentRuntimeInfo, null, 2)
                : "No message sent."}
            </pre
            >
          </div>
        </div>
      </aside>
    `;
  }
}

customElements.define("host-panel", HostPanel);
