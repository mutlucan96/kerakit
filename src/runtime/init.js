/**
 * @file Runtime handler for KeraKit
 * @copyright (C) 2025 Mutlu Can Yilmaz
 * @license GPL-3.0-or-later
 */
import { kerakit } from "../index.mjs";

export default function init(data) {
  kerakit.isKeraRuntime = true;
}
