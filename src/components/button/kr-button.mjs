/**
 * @file A simple Kr button component.
 * @module KeraKit/Components/Button
 * @license MIT
 * @copyright 2025 Mutlu Can Yilmaz
 */

import { LitElement, html, css } from "lit";

/**
 * @element kr-button
 * @fires click - Dispatched when the button is clicked.
 * @slot - The default slot for the button's text or content.
 * @cssprop [--kr-button-background-color=#007bff] - Background color of the button.
 * @cssprop [--kr-button-text-color=white] - Text color of the button.
 * @cssprop [--kr-button-padding="0.5em 1em"] - Padding of the button.
 */

export class KrButton extends LitElement {
  /**
   * Defines the component's properties.
   * @returns {Object} The properties object.
   */
  static get properties() {
    return {
      /**
       * The type of the button.
       * @type {'button' | 'submit' | 'reset'}
       */
      type: { type: String },

      /**
       * Whether the button is disabled.
       * @type {boolean}
       */
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
    // Initialize properties with default values
    this.type = "button";
    this.disabled = false;
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
