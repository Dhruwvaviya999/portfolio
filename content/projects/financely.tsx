import type { Project } from "@/types";
import { Callout, Metrics, Prose } from "@/components/projects/case-study";

export const financely: Project = {
  slug: "financely",
  title: "Financely — Personal Finance Tracker",
  summary:
    "A finance tracker for logging income and expenses, watching your balance update in real time, and understanding where the money goes through charts and analytics.",
  year: 2024,
  role: "Full Stack Developer",
  featured: true,
  cover: "/images/projects/financely.png",
  stack: [
    "React",
    "Vite",
    "Firebase",
    "Ant Design",
    "React Router",
    "Papa Parse",
  ],
  tags: ["Full Stack", "Finance", "Dashboard", "Analytics"],
  links: {
    live: "my-financely.vercel.app",
    repo: "https://github.com/Dhruwvaviya999/financely-finance-tracker",
  },
};

export function FinancelyCaseStudy() {
  return (
    <Prose>
      <h2>Overview</h2>
      <p>
        Financely is a personal finance tracker that turns scattered spending
        into a clear picture. Users log their <strong>income</strong> and{" "}
        <strong>expenses</strong>, watch their <strong>balance</strong> update
        in real time, and explore where the money actually went through charts
        and analytics.
      </p>
      <p>
        Every transaction lands in a searchable, sortable table that can be
        exported to CSV or re-imported later — so the data belongs to the user,
        not the app.
      </p>

      <h2>Problem</h2>
      <p>
        Most people track money in a notes app or a spreadsheet, or not at all.
        The balance is never current, spending patterns are invisible, and there
        is no quick way to answer &quot;where did this month go?&quot; A tracker
        only works if logging a transaction takes seconds and the insight comes
        for free.
      </p>

      <h2>Challenges</h2>
      <ul>
        <li>
          <strong>Real-time balance.</strong> Income, expenses, and the running
          balance all had to stay in sync as transactions were added.
        </li>
        <li>
          <strong>Meaningful analytics.</strong> Raw transactions needed to be
          aggregated into charts that answer real questions, not just look busy.
        </li>
        <li>
          <strong>Data portability.</strong> Users needed to get their data out
          (and back in) via CSV without a fragile custom parser.
        </li>
      </ul>

      <h2>Solution</h2>
      <p>
        Financely is a <strong>React</strong> single-page app built with{" "}
        <strong>Vite</strong>. <strong>Firebase</strong> handles authentication
        and stores transactions, with <strong>react-firebase-hooks</strong>{" "}
        binding auth state straight into React so the balance reflects the
        database live.
      </p>
      <p>
        The interface is built on <strong>Ant Design</strong>, with{" "}
        <strong>@ant-design/charts</strong> powering the line charts and pie
        charts that break spending down over time and by category.{" "}
        <strong>Papa Parse</strong> handles CSV import and export,{" "}
        <strong>Moment.js</strong> formats and groups transactions by date, and{" "}
        <strong>React Toastify</strong> surfaces feedback on every action.
      </p>

      <Callout type="info" title="Why Firebase">
        Firebase removed an entire backend from the project. Auth, storage, and
        live reads come from one SDK, which kept the focus on the analytics and
        transaction experience rather than on plumbing.
      </Callout>

      <h2>Architecture</h2>
      <ul>
        <li>React + Vite SPA with React Router for page-level routing.</li>
        <li>Firebase Authentication for sign-up and login.</li>
        <li>
          Firestore as the transaction store, read live via
          react-firebase-hooks.
        </li>
        <li>
          Ant Design for the component layer and Ant Design Charts for
          analytics.
        </li>
        <li>Papa Parse for CSV import and export of transaction history.</li>
        <li>Moment.js for date formatting and time-based grouping.</li>
      </ul>

      <h2>Key Features</h2>
      <ul>
        <li>Add income and expense transactions.</li>
        <li>Real-time balance that updates as transactions change.</li>
        <li>Line chart of spending over time and a pie chart by category.</li>
        <li>Analytics summarising income, expenses, and net position.</li>
        <li>Recent transactions list with full history.</li>
        <li>Search, sort, and filter across all transactions.</li>
        <li>Export transactions to CSV and import them back.</li>
        <li>Toast notifications for every action.</li>
      </ul>

      <h2>Tech Stack</h2>
      <p>
        <strong>React</strong> and <strong>Vite</strong> form the frontend, with{" "}
        <strong>Ant Design</strong> and <strong>Ant Design Charts</strong> for
        UI and visualisation. <strong>Firebase</strong> provides auth and data,{" "}
        <strong>React Router</strong> handles navigation,{" "}
        <strong>Papa Parse</strong> covers CSV, <strong>Moment.js</strong>{" "}
        handles dates, and <strong>React Toastify</strong> delivers feedback.
      </p>

      <h2>Results</h2>
      <Metrics
        items={[
          { label: "Balance", value: "Manual math → real-time" },
          { label: "Spending insight", value: "Raw rows → charts" },
          { label: "Transaction lookup", value: "Scrolling → search + sort" },
          { label: "Data ownership", value: "Locked in → CSV in/out" },
        ]}
      />

      <Callout type="success" title="Outcome">
        Financely makes logging a transaction fast enough to actually do, and
        turns that habit into charts that show exactly where the money goes.
      </Callout>

      <h2>Future Improvements</h2>
      <ul>
        <li>Monthly budgets with overspend alerts.</li>
        <li>Recurring transactions for rent and subscriptions.</li>
        <li>Multi-currency support.</li>
      </ul>
    </Prose>
  );
}
