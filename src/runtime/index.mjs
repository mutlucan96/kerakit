/**
 * @file Runtime handler for KeraKit
 * @copyright (C) 2025 Mutlu Can Yilmaz
 * @license MIT
 */
import { kerakit } from "../main.mjs";

export default function index(data) {
  kerakit.isKeraRuntime = true;
}
