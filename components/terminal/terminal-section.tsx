import { getTerminalData } from "@/lib/terminal/data";
import { Reveal } from "@/components/motion";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { Terminal } from "./terminal";

/**
 * Terminal — a second way to explore the site. Server component: snapshots
 * the content layer into plain data and hands it to the client terminal.
 */
export function TerminalSection() {
  const data = getTerminalData();

  return (
    <Section id="terminal">
      <SectionHeading
        eyebrow="Terminal"
        title="Prefer the command line?"
        description="Everything on this page, one command away. Type help to get started — or press ` anywhere to open it."
      />

      <Reveal className="mt-12">
        <Terminal data={data} boot className="mx-auto max-w-4xl" />
      </Reveal>
    </Section>
  );
}
