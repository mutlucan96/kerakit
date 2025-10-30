This document provides the context, code style, and architectural rules for AI agents contributing to the **KeraKit** project. Adhering to these guidelines is mandatory to ensure code quality, consistency, and performance.

### 1. Project Overview

* **Project:** KeraKit
* **Goal:** To build a new, modern, and performant library for the Kera Desktop ecosystem.
* **Context:** This project supersedes `kerapi-old` and `kera-desktop-old`. These legacy projects serve **only as a reference** for existing functionality and user-facing features.
* **DO NOT** migrate code directly from the old projects. All functionality must be re-implemented from scratch using the modern principles outlined below.

---

### 2. Core Principles & Constraints

These are the non-negotiable rules for all code generation:

1.  **No TypeScript:** The project is strictly **JavaScript only**. Do not generate or suggest any TypeScript (`.ts`, `.tsx`, `interface`, `type`, etc.).
2.  **Latest ECMAScript:** Use the latest stable ECMAScript (ESM) features. All code must be written using ES Modules (`import`/`export`).
3.  **Functional Programming (FP):** This is a strong architectural preference.
    * **Immutability:** Avoid mutations. Use non-mutating array methods (`map`, `filter`, `reduce`, `toSorted`, `toSpliced`). Use `Object.freeze` in development where appropriate.
    * **Pure Functions:** Strive for pure functions whenever possible.
    * **Composition:** Favor function composition over class-based inheritance.
    * **State:** Avoid `let` in favor of `const`. Minimize and isolate state.
4.  **Simplicity:** **Do not over-complicate the code.** Prefer simple, clear, and readable solutions. Avoid clever "one-liners" that sacrifice readability.
5.  **Performance:** Performance is critical. Write efficient code, but **avoid micro-optimizations.** Focus on good algorithms, appropriate data structures, and avoiding unnecessary work.
6.  **Tooling:** The project uses **`pnpm`**. All package management commands must use `pnpm` (e.g., `pnpm install`, `pnpm add`, `pnpm run`).

---

### 3.  JavaScript (ECMAScript) Style Guide

#### JSDoc Standards

JSDoc is **mandatory** for all files, functions, and complex data structures.

**File Header:**
All `.js` and `.mjs` files **must** begin with this JSDoc block:

```javascript
/**
 * @file Brief description of what this file does.
 * @module KeraKit/YOUR_MODULE_NAME
 * @copyright (C) 2025 Mutlu Can Yilmaz
 * @license MIT
 */
````

**Type Definitions:**

* Use lowercase `object` for generic objects, not `Object`.
* Use `Array<string>` or `string[]` (prefer `Array<string>` for consistency).
* Use JSDoc typedefs for complex objects.

<!-- end list -->

```javascript
/**
 * Represents a user configuration.
 * @typedef {object} UserConfig
 * @property {string} id - The user's unique identifier.
 * @property {boolean} [isPremium] - Optional premium status.
 */
```

**Importing Types for JSDoc:**
To use a type defined in another file, use `@import` at the **top** of the JSDoc block (not inline).

```javascript
/**
 * @import { UserConfig } from './userTypes.js'
 *
 * Processes a user's configuration.
 *
 * @param {UserConfig} config - The user config object.
 * @returns {string} The processed ID.
 */
function processUser(config) {
  return `processed-${config.id}`;
}
```

#### General Syntax

* **Modules:** Always use `import` and `export`. Do not use CommonJS (`require`/`module.exports`).
* **Variables:** Default to `const`. Only use `let` when reassignment is necessary (and question if it can be refactored).
* **Functions:** Prefer arrow functions (`const myFunc = () => {}`) for most module-level functions and callbacks, especially when FP-style is desired.
* **Async/Await:** Use `async/await` for asynchronous operations. Use `try...catch` blocks for error handling.
* **Modern Features:** Use optional chaining (`?.`), nullish coalescing (`??`), and object/array destructuring where it improves clarity.
