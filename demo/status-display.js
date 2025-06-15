/**
 * @file Lit component for displaying KeraKit status.
 * @license MIT
 * @copyright 2025 Mutlu Can Yilmaz
 */

import { LitElement, html, css } from "lit";

export class StatusDisplay extends LitElement {
  static properties = {
    runtimeInfo: { type: Object },
    detectionStatus: { type: String },
    themeInfo: { type: Object },
    settingsInfo: { type: Object },
  };

  static styles = css`
    :host {
      display: block;
      --card-bg: var(--card-bg, #f9f9f9);
      --card-border: var(--card-border, #eee);
      --card-shadow: var(--card-shadow, rgba(0, 0, 0, 0.05));
      --heading-text: var(--app-heading-text, #444);
      --pre-bg: var(--pre-bg, #eee);
      --pre-text: var(--pre-text, #333);
    }
    .grid-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin-bottom: 20px;
    }
    .card {
      background-color: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 4px var(--card-shadow);
    }
    h2 {
      margin-top: 0;
      color: var(--heading-text);
      border-bottom: 1px solid var(--card-border);
      padding-bottom: 10px;
      margin-bottom: 15px;
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
    this.runtimeInfo = { message: "Waiting for host..." };
    this.detectionStatus = "pending";
    this.themeInfo = { message: "Waiting..." };
    this.settingsInfo = { message: "Waiting..." };
  }

  render() {
    return html`
      <div>
        <h2>KeraKit Detection Status</h2>
        <pre>${this.detectionStatus}</pre>
      </div>
      <div class="grid-container">
        <div class="card">
          <h2>KeraKit Runtime Info</h2>
          <pre>${JSON.stringify(this.runtimeInfo, null, 2)}</pre>
        </div>
        <div class="card">
          <h2>Theme Info</h2>
          <pre>${JSON.stringify(this.themeInfo, null, 2)}</pre>
        </div>
        <div class="card">
          <h2>Settings Info</h2>
          <pre>${JSON.stringify(this.settingsInfo, null, 2)}</pre>
        </div>
      </div>
    `;
  }
}

customElements.define("status-display", StatusDisplay);
