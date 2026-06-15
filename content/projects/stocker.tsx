import type { Project } from "@/types";
import { Callout, Metrics, Prose } from "@/components/projects/case-study";

export const meta: Project = {
  slug: "stocker",
  title: "Stocker — Inventory Management System",
  summary:
    "A full-stack inventory and stock-management system for tracking products, stock movements, suppliers, and orders in real time.",
  year: 2025,
  role: "Full-Stack Developer",
  featured: true,
  cover: "/images/projects/stocker.png",
  stack: [
    "Next.js",
    "React",
    "TypeScript",
    "Node.js",
    "Express",
    "MongoDB",
    "Tailwind CSS",
    "Chart.js",
  ],
  tags: ["Full Stack", "Dashboard", "Enterprise"],
  links: {
    live: "https://example.com",
    repo: "https://github.com/dhruwvaviya999/stocker",
  },
};

export function StockerCaseStudy() {
  return (
    <Prose>
      <h2>Overview</h2>
      <p>
        Stocker is a full-stack inventory management system that gives small and
        mid-sized businesses a single place to track <strong>products</strong>,{" "}
        <strong>stock levels</strong>, <strong>suppliers</strong>, and{" "}
        <strong>orders</strong>. Every stock movement — purchases in, sales out,
        adjustments — is recorded, so the on-hand quantity you see is always the
        quantity you actually have.
      </p>
      <p>
        A real-time dashboard surfaces low-stock alerts, top products, and sales
        trends, turning raw stock data into decisions a manager can act on.
      </p>

      <h2>Problem</h2>
      <p>
        Most small businesses still run inventory on spreadsheets. Counts drift
        out of sync the moment two people edit them, stockouts go unnoticed until
        a customer asks, and there&apos;s no history of who changed what. Owners
        had no quick answer to simple questions like &quot;what&apos;s running
        low?&quot; or &quot;what sold best this month?&quot;
      </p>

      <h2>Challenges</h2>
      <ul>
        <li>
          <strong>Stock accuracy.</strong> Every sale, purchase, and adjustment
          has to update quantities atomically so numbers never drift.
        </li>
        <li>
          <strong>Role-based access.</strong> Owners, managers, and staff need
          different permissions over products, orders, and reports.
        </li>
        <li>
          <strong>Fast search at scale.</strong> Finding a product among
          thousands by name, SKU, or category has to feel instant.
        </li>
        <li>
          <strong>Actionable reporting.</strong> Raw tables aren&apos;t enough —
          the data needed to become charts and alerts people actually use.
        </li>
      </ul>

      <h2>Solution</h2>
      <p>
        Stocker is built on a <strong>MERN-style</strong> stack: a{" "}
        <strong>React / Next.js</strong> front end talking to a{" "}
        <strong>Node.js + Express</strong> REST API backed by{" "}
        <strong>MongoDB</strong>. Authentication uses <strong>JWT</strong> with
        role-based middleware, so each request is authorized on the server.
      </p>
      <p>
        Stock changes are modeled as <strong>movements</strong> rather than
        direct edits to a quantity field — each sale or purchase writes a movement
        record and updates the product total in one operation, giving both an
        accurate on-hand count and a complete history.
      </p>

      <Callout type="info" title="Why movement-based stock">
        Storing every in/out as a movement (instead of overwriting a number)
        means the current quantity is always derivable and auditable — you can
        answer not just &quot;how many&quot; but &quot;why&quot; and &quot;when&quot;.
      </Callout>

      <h2>Architecture</h2>
      <ul>
        <li>React / Next.js front end with a responsive, dashboard-first UI.</li>
        <li>Node.js + Express REST API organized by resource (products, orders, suppliers).</li>
        <li>MongoDB with indexed fields for fast search by name, SKU, and category.</li>
        <li>JWT auth with role-based middleware (owner / manager / staff).</li>
        <li>Chart.js dashboards for stock, sales, and low-stock insights.</li>
      </ul>

      <h2>Key Features</h2>
      <ul>
        <li>Product management (CRUD) with SKU, category, price, and reorder level.</li>
        <li>Stock in / out with movement history for a full audit trail.</li>
        <li>Automatic low-stock alerts based on per-product reorder thresholds.</li>
        <li>Supplier and customer management.</li>
        <li>Purchase and sales orders that update stock automatically.</li>
        <li>Dashboard with charts: stock value, sales trends, and top products.</li>
        <li>Fast search and filtering across the catalog.</li>
        <li>Role-based access for owners, managers, and staff.</li>
      </ul>

      <h2>Tech Stack</h2>
      <p>
        React and Next.js with TypeScript powered the UI and dashboards; Node.js
        and Express served a typed REST API over MongoDB. Tailwind CSS handled
        the design system, and Chart.js turned stock and sales data into the
        visualizations that make the app genuinely useful day to day.
      </p>

      <h2>Results</h2>
      <Metrics
        items={[
          { label: "Stock tracking", value: "Spreadsheets → real-time" },
          { label: "Low-stock visibility", value: "Manual checks → auto alerts" },
          { label: "Product lookup", value: "Instant search by name / SKU" },
          { label: "Reporting", value: "Live dashboards & charts" },
        ]}
      />
      <Callout type="success" title="Outcome">
        Stock counts stay trustworthy because every change is recorded, and the
        dashboard turns inventory from a chore into a decision-making tool.
      </Callout>

      <h2>Lessons Learned</h2>
      <ul>
        <li>
          <strong>Model events, not just state.</strong> Recording stock
          movements made history, audits, and reports fall out naturally.
        </li>
        <li>
          <strong>Index early.</strong> Adding the right MongoDB indexes kept
          search fast as the catalog grew.
        </li>
        <li>
          <strong>Design the dashboard around questions</strong> users actually
          ask, not around the tables in the database.
        </li>
      </ul>

      <h2>Future Improvements</h2>
      <ul>
        <li>Barcode scanning for faster stock-in and checkout.</li>
        <li>Multi-warehouse support with per-location stock.</li>
        <li>Exportable PDF / CSV reports and scheduled email summaries.</li>
      </ul>
    </Prose>
  );
}
