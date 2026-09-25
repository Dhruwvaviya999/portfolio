import { getTerminalData } from "@/lib/terminal/data";
import { TerminalDialog } from "./terminal-dialog";

/**
 * Server wrapper that feeds the content snapshot to the global overlay.
 * Mounted once in the root layout.
 */
export function TerminalLauncher() {
  return <TerminalDialog data={getTerminalData()} />;
}
