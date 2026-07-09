import type { Project } from "@/types";
import { Callout, Metrics, Prose } from "@/components/projects/case-study";

export const stocker: Project = {
  slug: "stocker",
  title: "Stocker — Inventory Management System",
  summary:
    "A full-stack inventory and stock-management system for tracking products, stock movements, suppliers, and orders in real time.",
  year: 2026,
  role: "Full-Stack Developer",
  featured: true,
  cover: "/images/projects/stocker.png",
  stack: [
    "Next.js",
    "React",
    "TypeScript",
    "PostgreSQL",
    "Prisma",
    "Auth.js",
    "Tailwind CSS",
    "Shadcn UI",
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
        Stocker is a full-stack inventory management system built for small and
        mid-sized businesses that need a clear and reliable way to track{" "}
        <strong>products</strong>, <strong>stock levels</strong>,{" "}
        <strong>suppliers</strong>, and <strong>orders</strong> in one place. It
        helps teams manage inventory with better speed, accuracy, and
        visibility.
      </p>
      <p>
        Every stock movement such as purchase, sale, transfer, or adjustment is
        recorded, so the on-hand quantity always stays accurate and easy to
        audit. A real-time dashboard top products, and sales trends to help
        managers take action quickly.
      </p>

      <h2>Problem</h2>
      <p>
        Many small businesses still manage inventory with spreadsheets or manual
        updates. This creates problems like wrong stock counts, delayed updates,
        poor visibility into fast-moving items, and no clear history of stock
        changes. Teams often do not know what is running low, what is selling
        well, or when they need to reorder.
      </p>

      <h2>Challenges</h2>
      <ul>
        <li>
          <strong>Stock accuracy.</strong> Every stock update had to stay
          correct across purchases, sales, and adjustments.
        </li>
        <li>
          <strong>Role-based access.</strong> Different users needed different
          permissions for products, orders, and reports.
        </li>
        <li>
          <strong>Fast search and filtering.</strong> Users needed to find
          products quickly by name, article number, brand, color, or size.
        </li>
      </ul>

      <h2>Solution</h2>
      <p>
        Stocker is built with a modern <strong>Next.js</strong> and{" "}
        <strong>React</strong> frontend using <strong>TypeScript</strong> for
        safer, cleaner code. The backend logic uses <strong>Prisma</strong> with{" "}
        <strong>PostgreSQL</strong> for reliable data management and structured
        relationships between companies, products, suppliers, and orders.
      </p>
      <p>
        Authentication is handled with <strong>Auth.js</strong>, and forms are
        built with <strong>React Hook Form</strong> and <strong>Zod</strong> for
        validation. The UI uses <strong>Tailwind CSS</strong> and{" "}
        <strong>Shadcn UI</strong>, while <strong>Recharts</strong> is used for
        dashboard charts and <strong>Nodemailer</strong> is used for email
        notifications.
      </p>

      <Callout type="info" title="Why this architecture works">
        Using PostgreSQL with Prisma gives Stocker a strong and scalable data
        structure, while Next.js keeps the app fast and flexible for both
        dashboard pages and business workflows.
      </Callout>

      <h2>Architecture</h2>
      <ul>
        <li>
          Next.js App Router for fast routing, server rendering, and scalable
          page structure.
        </li>
        <li>
          React + TypeScript frontend for a clean and maintainable user
          experience.
        </li>
        <li>
          PostgreSQL database with Prisma ORM for structured inventory data.
        </li>
        <li>
          Auth.js authentication for secure login and user session handling.
        </li>
        <li>Role-based permissions for admin, manager, and staff workflows.</li>
        <li>
          Recharts-based dashboards for stock trends, and performance insights.
        </li>
        <li>Cloudinary support for image uploads and media storage.</li>
      </ul>

      <h2>Key Features</h2>
      <ul>
        <li>Product management with article number, name, price, and stock.</li>
        <li>Variant handling by size and color.</li>
        <li>Separate stock tracking for shop and godown locations.</li>
        <li>Purchase and sales workflows with automatic inventory updates.</li>
        <li>Supplier management and order tracking.</li>
        <li>Inventory movement history for full audit visibility.</li>
        <li>Search and filtering for fast product lookup.</li>
        <li>Dashboard charts for sales, stock, and product insights.</li>
        <li>Responsive mobile-first UI for daily use on any device.</li>
      </ul>

      <h2>Tech Stack</h2>
      <p>
        Stocker uses <strong>Next.js</strong>, <strong>React</strong>, and{" "}
        <strong>TypeScript</strong> for the frontend and application layer.
        <strong>PostgreSQL</strong> and <strong>Prisma</strong> power the data
        layer, while <strong>Auth.js</strong> handles authentication.
        <strong>Tailwind CSS</strong> and <strong>Shadcn UI</strong> are used
        for design, <strong>Zod</strong> and <strong>React Hook Form</strong>{" "}
        manage form validation, <strong>Recharts</strong> powers analytics,{" "}
        <strong>Axios</strong> handles requests, and <strong>Nodemailer</strong>{" "}
        and <strong>Cloudinary</strong> support communication and media.
      </p>

      <h2>Results</h2>
      <Metrics
        items={[
          { label: "Stock tracking", value: "Manual sheets → live system" },
          {
            label: "Inventory updates",
            value: "Delayed edits → real-time flow",
          },
          { label: "Product lookup", value: "Slow search → fast filtering" },
          { label: "Reporting", value: "Raw data → dashboards" },
        ]}
      />

      <Callout type="success" title="Outcome">
        Stocker makes inventory easier to manage by keeping stock data accurate,
        improving visibility, and turning day-to-day operations into a simple
        dashboard-driven workflow.
      </Callout>

      {/* <h2>Lessons Learned</h2>
      <ul>
        <li>
          <strong>Strong data modeling matters.</strong> A good database
          structure makes inventory logic much easier to scale.
        </li>
        <li>
          <strong>Validation saves time.</strong> Using Zod and form validation
          reduced bad input and improved reliability.
        </li>
        <li>
          <strong>Good dashboards need focus.</strong> The best reports are the
          ones that answer real business questions quickly.
        </li>
      </ul> */}

      <h2>Future Improvements</h2>
      <ul>
        <li>Barcode scanning for faster stock-in and checkout.</li>
        <li>Exportable PDF and CSV reports.</li>
        <li>Scheduled email summaries and stock alerts.</li>
      </ul>
    </Prose>
  );
}
