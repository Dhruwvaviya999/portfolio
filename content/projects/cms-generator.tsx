import type { Project } from "@/types";
import { Callout, Metrics, Prose } from "@/components/projects/case-study";

export const cmsGenerator: Project = {
  slug: "cms-generator",
  title: "Generator CMS — AI Content & Image Platform",
  summary:
    "An AI-powered CMS for rewriting, expanding, and shortening content, generating articles and SEO metadata, and creating images from text prompts — with full history for every generation.",
  year: 2026,
  role: "Full-Stack Developer",
  featured: true,
  cover: "/images/projects/cms-generator.png",
  stack: [
    "React",
    "Node.js",
    "Express",
    "MongoDB",
    "Mongoose",
    "JWT",
    "Gemini API",
    "Hugging Face",
    "Cloudinary",
    "Redis",
    "Tailwind CSS",
  ],
  tags: ["Full Stack", "MERN", "AI", "Content"],
  links: {
    live: "https://cms-tawny-eight.vercel.app",
    repo: "https://github.com/Dhruwvaviya999/cms",
  },
};

export function CmsGeneratorCaseStudy() {
  return (
    <Prose>
      <h2>Overview</h2>
      <p>
        Generator CMS is a full-stack, AI-powered content management platform
        that brings <strong>writing</strong>, <strong>SEO</strong>, and{" "}
        <strong>image generation</strong> into one workspace. Users can
        rewrite, expand, or shorten existing text, generate full articles from a
        topic, produce SEO titles, keywords, and meta descriptions, and turn
        text prompts into images.
      </p>
      <p>
        Every generation is saved to the user&apos;s account, so past content
        and images can be searched, reopened, copied, or downloaded at any time
        instead of being lost after a single session.
      </p>

      <h2>Problem</h2>
      <p>
        Content teams and creators usually juggle several tools: one for
        rewriting, another for SEO copy, another for images. Outputs end up
        scattered across tabs and chat windows, nothing is saved in one place,
        and finding a piece of copy generated last week means starting over.
      </p>

      <h2>Challenges</h2>
      <ul>
        <li>
          <strong>Many actions, one pipeline.</strong> Five different content
          actions needed consistent prompts, validation, and storage without
          duplicating logic for each one.
        </li>
        <li>
          <strong>Expensive image generation.</strong> Text-to-image calls are
          slow and costly, so repeated prompts should not hit the model twice.
        </li>
        <li>
          <strong>Serverless deployment.</strong> Running Express on Vercel
          meant handling cold starts and reusing database connections across
          requests.
        </li>
        <li>
          <strong>Private, per-user history.</strong> Each user&apos;s content
          and images had to stay isolated and quick to query.
        </li>
      </ul>

      <h2>Solution</h2>
      <p>
        The backend is a <strong>Node.js</strong> and <strong>Express</strong>{" "}
        REST API backed by <strong>MongoDB</strong> through{" "}
        <strong>Mongoose</strong>. A single action-driven route (
        <code>/content/:action</code>) maps each action to its own system prompt
        and sends it to <strong>Google Gemini 2.5 Flash</strong>, then saves
        the input, output, and action type to the user&apos;s history.
      </p>
      <p>
        Image generation uses <strong>Hugging Face Inference</strong> with the{" "}
        <strong>FLUX.1-schnell</strong> model. Generated images are streamed to{" "}
        <strong>Cloudinary</strong>, and the resulting URL is cached in{" "}
        <strong>Redis</strong> by prompt and resolution, so identical requests
        return instantly. Authentication uses <strong>JWT</strong> with{" "}
        <strong>bcrypt</strong>-hashed passwords.
      </p>
      <p>
        The frontend is a <strong>React 19</strong> and <strong>Vite</strong>{" "}
        SPA styled with <strong>Tailwind CSS</strong>, with{" "}
        <strong>React Hook Form</strong> and <strong>Zod</strong> for form
        validation and lazy-loaded, protected routes for every tool.
      </p>

      <Callout type="info" title="Why a config-driven action map">
        Every content action — rewrite, expand, shorten, article, SEO — is a
        single entry in one config object holding its prompt and success
        message. Adding a new AI tool means adding one entry, not a new
        controller, route, and model.
      </Callout>

      <h2>Architecture</h2>
      <ul>
        <li>
          React + Vite SPA with React Router, lazy-loaded pages, and protected
          routes behind an auth context.
        </li>
        <li>
          Axios client with a request interceptor that attaches the JWT to
          every API call.
        </li>
        <li>
          Express REST API versioned under <code>/api/v1</code>, split into
          auth, content, and image routers.
        </li>
        <li>
          MongoDB with Mongoose models for users, content, and images, indexed
          on user and creation date for fast history queries.
        </li>
        <li>
          Gemini for text generation; Hugging Face FLUX.1-schnell for images;
          Cloudinary for image storage.
        </li>
        <li>Optional Redis cache for generated image URLs.</li>
        <li>
          Global rate limiting, centralised error handling, and a shared
          response format across all endpoints.
        </li>
        <li>
          Frontend and backend deployed together on Vercel, with a cached
          MongoDB connection reused across serverless invocations.
        </li>
      </ul>

      <h2>Key Features</h2>
      <ul>
        <li>Rewrite content for clarity, grammar, and tone.</li>
        <li>Expand short text into more detailed copy.</li>
        <li>Shorten long text while keeping the core meaning.</li>
        <li>Generate full articles from a topic.</li>
        <li>Generate SEO titles, keywords, and meta descriptions.</li>
        <li>AI image generation with multiple resolutions and aspect ratios.</li>
        <li>Content history with full-text search across prompts and outputs.</li>
        <li>Image history gallery with one-click download.</li>
        <li>Copy-to-clipboard on every generated result.</li>
        <li>Secure sign-up and login with JWT sessions.</li>
      </ul>

      <h2>Tech Stack</h2>
      <p>
        <strong>React</strong>, <strong>Vite</strong>, and{" "}
        <strong>Tailwind CSS</strong> power the frontend, with{" "}
        <strong>React Router</strong>, <strong>React Hook Form</strong>,{" "}
        <strong>Zod</strong>, <strong>Axios</strong>, <strong>Moment.js</strong>
        , and <strong>React Toastify</strong>. The backend runs on{" "}
        <strong>Node.js</strong> and <strong>Express</strong> with{" "}
        <strong>MongoDB</strong> and <strong>Mongoose</strong>.{" "}
        <strong>Google Gemini</strong> handles text generation,{" "}
        <strong>Hugging Face</strong> handles images,{" "}
        <strong>Cloudinary</strong> stores media, <strong>Redis</strong> caches
        results, and <strong>JWT</strong>, <strong>bcrypt</strong>, and{" "}
        <strong>express-rate-limit</strong> secure the API.
      </p>

      <h2>Results</h2>
      <Metrics
        items={[
          { label: "Content tools", value: "Scattered apps → one workspace" },
          { label: "Past generations", value: "Lost → searchable history" },
          { label: "Repeat image prompts", value: "Regenerated → cached" },
          { label: "New AI actions", value: "New code → one config entry" },
        ]}
      />

      <Callout type="success" title="Outcome">
        Generator CMS turns content writing, SEO copy, and image creation into a
        single workflow, and keeps every result saved, searchable, and ready to
        reuse.
      </Callout>

      <h2>Future Improvements</h2>
      <ul>
        <li>Streaming responses so long articles appear as they generate.</li>
        <li>Editing and versioning of saved content.</li>
        <li>Per-user usage quotas and plan tiers.</li>
        <li>Export content to Markdown or publish directly to a blog.</li>
      </ul>
    </Prose>
  );
}
