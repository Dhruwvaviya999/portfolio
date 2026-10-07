/**
 * Barrel for the terminal feature — server entry points only (both read the
 * content layer through `server-only` code). Client code that needs to open
 * the overlay imports `openTerminal` from `./terminal-dialog` directly.
 */

export { TerminalSection } from "./terminal-section";
export { TerminalLauncher } from "./terminal-launcher";
