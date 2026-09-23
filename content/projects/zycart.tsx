import type { Project } from "@/types";
import { Callout, Metrics, Prose } from "@/components/projects/case-study";

export const zycart: Project = {
  slug: "zycart",
  title: "ZyCart — AI-Powered E-commerce Store",
  summary:
    "A full-stack online store with a shopping cart, Razorpay and cash-on-delivery checkout, returns and refunds, an admin console, and an AI shopping assistant that works on the live catalogue.",
  year: 2026,
  role: "Full-Stack Developer",
  featured: true,
  cover: "/images/projects/zycart.png",
  stack: [
    "Next.js",
    "TypeScript",
    "Node.js",
    "Express",
    "MongoDB",
    "Mongoose",
    "Razorpay",
    "Zustand",
    "Tailwind CSS",
    "Shadcn UI",
    "Zod",
    "Claude / Gemini",
  ],
  tags: ["Full Stack", "E-commerce", "AI", "MERN"],
  links: {
    live: "https://zycart.vercel.app",
    repo: "https://github.com/Dhruwvaviya999/zycart",
  },
};

export function ZycartCaseStudy() {
  return (
    <Prose>
      <h2>Overview</h2>
      <p>
        ZyCart is an online store where customers can browse products, add them
        to a cart or wishlist, and pay online with <strong>Razorpay</strong> or
        choose <strong>cash on delivery</strong>. After buying, they can track
        their shipment, request a return, and leave a review.
      </p>
      <p>
        It also has <strong>ZyCart AI</strong>, a shopping assistant that can
        search products, compare them, and add items to the cart. Store owners
        get an admin console for products, orders, stock, returns, and reviews.
      </p>

      <h2>Problem</h2>
      <p>
        A real store needs more than a product page and a cart. Stock has to
        stay correct when many people buy at once, payments have to be
        confirmed before an order is final, and customers expect tracking and
        easy returns. I wanted to build a store that handles all of this
        properly, not just the happy path.
      </p>

      <h2>Challenges</h2>
      <ul>
        <li>
          <strong>Correct stock.</strong> Two orders or two admins changing
          stock at the same time should never give a wrong or negative count.
        </li>
        <li>
          <strong>Safe payments.</strong> An abandoned checkout should not lock
          stock, and the same payment confirmed twice should only count once.
        </li>
        <li>
          <strong>A safe AI assistant.</strong> The assistant should show real
          prices and stock, but never touch the database directly or place an
          order.
        </li>
        <li>
          <strong>Emails that can fail.</strong> A failed email should not stop
          an order from being shipped or refunded.
        </li>
      </ul>

      <h2>Solution</h2>
      <p>
        The frontend is built with <strong>Next.js</strong> (App Router),{" "}
        <strong>TypeScript</strong>, <strong>Tailwind CSS</strong>, and{" "}
        <strong>Shadcn UI</strong>, with <strong>Zustand</strong> for cart,
        wishlist, and UI state. The backend is an <strong>Express</strong> and{" "}
        <strong>TypeScript</strong> API using <strong>MongoDB</strong> and{" "}
        <strong>Mongoose</strong>, with <strong>Zod</strong> validating every
        request.
      </p>
      <p>
        Stock changes run inside MongoDB transactions, and every change is saved
        in an inventory log with a reason. Online orders only take stock once
        Razorpay confirms the payment, and the same function handles both the
        browser callback and the webhook. Emails are saved first and sent
        after, so a failed email can simply be retried from the admin console.
      </p>

      <Callout type="info" title="How the AI assistant stays safe">
        ZyCart AI works only through five server-side tools: search products,
        get a product, compare products, get the cart, and add to the cart. Each
        tool calls the same services the store uses, so the assistant always
        shows the real price and stock.
      </Callout>

      <h2>Architecture</h2>
      <ul>
        <li>Next.js storefront and admin console in one frontend app.</li>
        <li>Express + TypeScript REST API with MongoDB and Mongoose.</li>
        <li>JWT sessions stored in an HTTP-only cookie.</li>
        <li>Razorpay payments with signature and webhook checks.</li>
        <li>
          AI assistant with a switchable provider: Claude, Gemini, or Hugging
          Face.
        </li>
        <li>Transactional emails sent through Nodemailer (SMTP).</li>
        <li>
          Helmet and CORS on the API, with rate limits on auth, AI, and admin
          routes.
        </li>
        <li>Frontend and backend deployed together on Vercel.</li>
      </ul>

      <h2>Key Features</h2>
      <ul>
        <li>Product catalogue with search, filters, sorting, and categories.</li>
        <li>Guest cart that merges into your account when you sign in.</li>
        <li>Wishlist with a move-to-cart option.</li>
        <li>Checkout with Razorpay or cash on delivery.</li>
        <li>Order history, cancellation, and shipment tracking.</li>
        <li>Item-level returns with partial refunds.</li>
        <li>Reviews only from customers who received the product.</li>
        <li>
          Smart search that understands queries like &quot;black shoes under
          ₹15,000&quot;.
        </li>
        <li>Similar products and personal recommendations.</li>
        <li>ZyCart AI shopping assistant.</li>
        <li>
          Admin console for products, orders, inventory, customers, returns,
          reviews, and emails.
        </li>
        <li>Light and dark theme.</li>
      </ul>

      <h2>Tech Stack</h2>
      <p>
        <strong>Next.js</strong>, <strong>React</strong>,{" "}
        <strong>TypeScript</strong>, <strong>Tailwind CSS</strong>,{" "}
        <strong>Shadcn UI</strong>, <strong>Zustand</strong>, and{" "}
        <strong>Axios</strong> on the frontend. <strong>Node.js</strong>,{" "}
        <strong>Express</strong>, <strong>MongoDB</strong>,{" "}
        <strong>Mongoose</strong>, <strong>Zod</strong>, <strong>JWT</strong>,
        and <strong>bcrypt</strong> on the backend. <strong>Razorpay</strong>{" "}
        for payments, <strong>Nodemailer</strong> for email, and the{" "}
        <strong>Anthropic</strong>, <strong>Google Gen AI</strong>, and{" "}
        <strong>OpenAI</strong> SDKs for the AI assistant.
      </p>

      <h2>Results</h2>
      <Metrics
        items={[
          { label: "Payment options", value: "Razorpay + Cash on delivery" },
          { label: "AI tools", value: "5 server-side tools" },
          { label: "AI providers", value: "Claude, Gemini, Hugging Face" },
          { label: "Backend test suites", value: "14" },
        ]}
      />

      <Callout type="success" title="Outcome">
        ZyCart covers the full shopping flow, from browsing to payment to
        returns, with an admin console to run the store and an AI assistant
        that helps customers find what they need.
      </Callout>

      <h2>Future Improvements</h2>
      <ul>
        <li>Integration with a real shipping provider.</li>
        <li>SMS and in-app notifications.</li>
        <li>Exchanges and store credit.</li>
        <li>Image search and review summaries.</li>
      </ul>
    </Prose>
  );
}
