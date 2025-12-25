/**
 * @file A simple Kr button component.
 * @module KeraKit/Components/Button
 * @copyright (C) 2025 Mutlu Can Yilmaz
 * @license MIT
 */

import { LitElement, html, css } from "lit";
import { subscribeToState } from "../../core/state/index.mjs";

/**
 * @element kr-button
 * @fires click
 * @slot - Default content
 */
export class KrButton extends LitElement {
  static get properties() {
    return {
      type: { type: String },
      disabled: { type: Boolean, reflect: true },
    };
  }

  static styles = css`
    :host {
      display: inline-block;
    }
    button {
      background-color: var(--kr-button-background-color, #007bff);
      color: var(--kr-button-text-color, white);
      border: none;
      padding: var(--kr-button-padding, 0.5em 1em);
      border-radius: 0.3em;
      cursor: pointer;
      font-family: inherit;
      font-size: inherit;
      transition: background-color 0.2s ease-in-out;
    }
    button:hover:not([disabled]) {
      background-color: color-mix(
        in srgb,
        var(--kr-button-background-color, #007bff) 80%,
        black
      );
    }
    button:active:not([disabled]) {
      background-color: color-mix(
        in srgb,
        var(--kr-button-background-color, #007bff) 60%,
        black
      );
    }
    :host([disabled]) button {
      background-color: #cccccc;
      color: #666666;
      cursor: not-allowed;
    }
  `;

  constructor() {
    super();
    this.type = "button";
    this.disabled = false;
    this._unsubscribe = null;
  }

  connectedCallback() {
    super.connectedCallback();
    // Subscribe to state changes
    this._unsubscribe = subscribeToState(({ slice }) => {
      if (slice === "theme") {
        // Since we use CSS variables, the browser handles the visual update.
        // But if we needed JS logic:
        // console.log("Theme changed:", value.mode);
        this.requestUpdate();
      }
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    // Clean up subscription to prevent memory leaks
    if (this._unsubscribe) {
      this._unsubscribe();
      this._unsubscribe = null;
    }
  }

  render() {
    return html`
      <button
        type=${this.type}
        ?disabled=${this.disabled}
        @click=${this._handleClick}
      >
        <slot></slot>
      </button>
    `;
  }
}

customElements.define("kr-button", KrButton);
