import type { Project } from "@/types";
import { Callout, Metrics, Prose } from "@/components/projects/case-study";

export const meta: Project = {
  slug: "erp-system",
  title: "Enterprise Resource Planning System",
  summary:
    "A modular ERP platform unifying inventory, procurement, and reporting for mid-market manufacturers.",
  year: 2023,
  role: "Full-Stack Engineer",
  featured: true,
  cover: "",
  stack: [
    "Next.js",
    "TypeScript",
    "PostgreSQL",
    "Prisma",
    "tRPC",
    "Redis",
    "Docker",
    "Tailwind CSS",
  ],
  tags: ["ERP", "Enterprise", "Full Stack", "Dashboard"],
  links: {
    live: "https://example.com",
    repo: "https://github.com/dhruwvaviya999/erp-system",
  },
};

export function ErpSystemCaseStudy() {
  return (
    <Prose>
      <h2>Overview</h2>
      <p>
        The ERP System is an internal platform that replaced a tangle of
        spreadsheets and legacy desktop tools used to run a mid-market
        manufacturing business. It brings <strong>inventory</strong>,{" "}
        <strong>procurement</strong>, <strong>order management</strong>, and{" "}
        <strong>financial reporting</strong> into a single, role-aware web
        application that the whole company depends on daily.
      </p>
      <p>
        The goal wasn&apos;t to build &quot;yet another dashboard&quot; — it was
        to model the company&apos;s real operational workflows accurately enough
        that staff would trust the system as the source of truth.
      </p>

      <h2>Problem</h2>
      <p>
        The business ran on a patchwork of disconnected spreadsheets and aging
        desktop software. Stock levels in one file never matched another,
        purchase orders were emailed around for approval, and month-end
        reporting meant days of manual reconciliation. There was no single
        source of truth — and no audit trail when numbers didn&apos;t add up.
      </p>

      <h2>Challenges</h2>
      <ul>
        <li>
          <strong>Complex domain.</strong> Inventory, purchasing, and accounting
          are deeply interconnected — a single goods-receipt event touches stock
          levels, supplier balances, and the general ledger at once.
        </li>
        <li>
          <strong>Data integrity is non-negotiable.</strong> Financial records
          must always reconcile; there&apos;s no room for eventual-consistency
          hand-waving.
        </li>
        <li>
          <strong>Many roles, one system.</strong> Warehouse staff, buyers, and
          finance each need a different view and permissions over the same data.
        </li>
        <li>
          <strong>Legacy migration.</strong> Years of historical records had to
          be imported from inconsistent spreadsheets without corrupting the books.
        </li>
      </ul>

      <h2>Solution</h2>
      <p>
        I built the platform on <strong>Next.js</strong> with a fully typed stack
        end-to-end. <strong>tRPC</strong> connects the React frontend to the
        server without a hand-written API layer, so a change to a server
        procedure surfaces as a type error in the UI immediately.{" "}
        <strong>Prisma</strong> models the relational schema over{" "}
        <strong>PostgreSQL</strong>, and every multi-entity operation runs inside
        a database transaction so the books can never end up half-updated.
      </p>
      <p>
        Permissions are enforced server-side in a single authorization layer
        rather than scattered across components, and <strong>Redis</strong>{" "}
        caches expensive aggregate reports that would otherwise hammer the
        database on every dashboard load.
      </p>

      <Callout type="info" title="Design principle">
        Model the real workflow, not the screens. Every mutation maps to a domain
        event (goods received, order approved) so the UI, the ledger, and the
        audit log all stay consistent by construction.
      </Callout>

      <h2>Architecture</h2>
      <ul>
        <li>App Router + Server Components for data-heavy pages, small bundles.</li>
        <li>tRPC routers per domain (inventory, procurement, finance) with shared Zod schemas.</li>
        <li>Prisma + PostgreSQL with transactional writes for any multi-table change.</li>
        <li>Redis for cached report aggregates and rate-limiting sensitive endpoints.</li>
        <li>Role-based access control centralized in middleware, not components.</li>
        <li>Docker for parity between local, staging, and production.</li>
      </ul>

      <h2>Key Features</h2>
      <ul>
        <li>Real-time inventory tracking with automatic low-stock alerts.</li>
        <li>Purchase-order workflow with multi-step approvals and supplier management.</li>
        <li>Transactional accounting that keeps the ledger always reconciled.</li>
        <li>Role-based access control across every module.</li>
        <li>Exportable financial reports (P&amp;L, stock valuation, aging), cached for speed.</li>
        <li>Full audit trail on every record change for compliance.</li>
      </ul>

      <h2>Tech Stack</h2>
      <p>
        Next.js and TypeScript gave a single language across the stack; tRPC
        removed an entire class of client/server contract bugs. PostgreSQL via
        Prisma handled the relational, transactional core, while Redis absorbed
        the read-heavy reporting load. Docker kept environments reproducible.
      </p>

      <h2>Results</h2>
      <Metrics
        items={[
          { label: "Monthly stock-count effort", value: "~3 days → ~2 hours" },
          { label: "Order processing time", value: "~15 min → < 1 min" },
          { label: "Reporting accuracy", value: "Always reconciled" },
          { label: "Tooling", value: "6+ spreadsheets → 1 system" },
        ]}
      />
      <Callout type="success" title="Outcome">
        Staff stopped keeping private &quot;shadow spreadsheets&quot; because the
        system finally reflected reality — the clearest signal that they trusted it.
      </Callout>

      <h2>Lessons Learned</h2>
      <ul>
        <li>
          <strong>Invest in the domain model first.</strong> Getting the schema
          and domain events right paid back every week afterward.
        </li>
        <li>
          <strong>Transactions over cleverness.</strong> Strict DB transactions
          were simpler and safer than app-level reconciliation logic.
        </li>
        <li>
          <strong>Migrations need a dry run.</strong> An idempotent import with a
          preview mode caught data issues before they touched the books.
        </li>
      </ul>

      <h2>Future Improvements</h2>
      <ul>
        <li>Demand forecasting using historical order data.</li>
        <li>A mobile companion app for warehouse scanning.</li>
        <li>Pluggable integrations for shipping carriers and accounting exports.</li>
      </ul>
    </Prose>
  );
}
