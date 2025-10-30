/**
 * @license MIT
 * @copyright 2025 Mutlu Can Yilmaz
 */

/** @typedef {import('@storybook/web-components').Meta} Meta */
/** @typedef {import('@storybook/web-components').StoryObj} StoryObj */
/** @typedef {import('lit').TemplateResult} TemplateResult */

import { html } from "lit";
import "./kr-button.mjs";

/** @type {Meta} */
export default {
  title: "Components/KrButton",
  component: "kr-button",
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: { type: "select" },
      options: ["button", "submit", "reset"],
      description: "The type of the button.",
      table: { defaultValue: { summary: "button" } },
    },
    disabled: {
      control: "boolean",
      description: "Whether the button is disabled.",
      table: { defaultValue: { summary: "false" } },
    },
    slotContent: {
      control: "text",
      name: "Default Slot Content",
      description: "Content for the button's default slot.",
    },
    "--kr-button-background-color": {
      control: "color",
      description: "Custom background color.",
    },
    "--kr-button-text-color": {
      control: "color",
      description: "Custom text color.",
    },
    "--kr-button-padding": {
      control: "text",
      description: 'Custom padding (e.g., "0.5em 1em").',
    },
  },
};

/**
 * Renders the kr-button with provided arguments.
 * @param {object} args - The arguments for the component.
 * @returns {TemplateResult}
 */
const Template = ({ type, disabled, slotContent, ...cssProps }) => {
  const styleString = Object.entries(cssProps)
    .map(([key, value]) => (value ? `${key}: ${value};` : ""))
    .filter(Boolean) // Remove empty strings if a prop value is cleared in Storybook
    .join(" ");

  return html`
    <kr-button
      .type=${type}
      ?disabled=${disabled}
      style=${styleString || undefined}
    >
      ${slotContent || "Button Text"}
    </kr-button>
  `;
};

/** @type {StoryObj} */
export const Default = {
  args: {
    slotContent: "Default Button",
    type: "button",
    disabled: false,
  },
  render: Template,
};

/** @type {StoryObj} */
export const Disabled = {
  args: {
    slotContent: "Disabled Button",
    type: "button",
    disabled: true,
  },
  render: Template,
};

/** @type {StoryObj} */
export const CustomStyled = {
  args: {
    slotContent: "Styled Button",
    type: "button",
    disabled: false,
    "--kr-button-background-color": "darkslateblue",
    "--kr-button-text-color": "white",
    "--kr-button-padding": "0.75em 1.5em",
  },
  render: Template,
};
