# Dhruw Vaviya — Developer Portfolio

A modern, interactive portfolio built with Next.js and TypeScript to showcase my experience, skills, and full-stack projects. It combines project case studies with a command-line-style terminal and a 3D robot that can optionally respond to webcam hand gestures.

**Live site:** [dhruwvaviya.vercel.app](https://dhruwvaviya.vercel.app) · **GitHub:** [Dhruwvaviya999](https://github.com/Dhruwvaviya999)

## Highlights

- **Portfolio sections** — introduction, about, skills, work experience, projects, and contact.
- **Project case studies** — browse and filter project cards, open detailed write-ups, and follow live-demo or source links where available.
- **Interactive terminal** — explore portfolio information using commands such as `help`, `whoami`, `skills`, `projects`, `experience`, and `contact`.
- **3D robot** — an interactive Three.js character with optional webcam hand tracking powered by MediaPipe; a lighter fallback is used when WebGL is unavailable or reduced motion is preferred.
- **Responsive experience** — mobile navigation, light/dark themes, motion effects, and accessible reduced-motion behavior.
- **SEO support** — page metadata, Open Graph images, sitemap, robots rules, and structured JSON-LD data.
- **Contact form and resume** — contact form delivered through Web3Forms and a downloadable resume PDF.

## Tech Stack

- **Framework:** Next.js 15 App Router, React 19, TypeScript
- **Styling and UI:** Tailwind CSS 4, shadcn/ui, Base UI, Lucide icons
- **Animation:** Framer Motion
- **3D and vision:** Three.js, React Three Fiber, Drei, MediaPipe Tasks Vision
- **Content:** TypeScript-based project and profile data, with MDX-related tooling available
- **Deployment:** Vercel

## Getting Started

**Prerequisites:** Node.js 20+ and pnpm.

```bash
git clone https://github.com/Dhruwvaviya999/portfolio.git
cd portfolio
pnpm install
```

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_WEB3FORMS_KEY=your_web3forms_access_key
```

`NEXT_PUBLIC_SITE_URL` is used to build canonical and social metadata URLs. The Web3Forms access key enables contact-form submissions; obtain your own key from [Web3Forms](https://web3forms.com/). Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser, so do not put private server credentials in them.

Start the development server:

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000).

## Available Scripts

| Command | Purpose |
|---|---|
| `pnpm dev` | Start the development server |
| `pnpm build` | Create a production build |
| `pnpm start` | Serve the production build locally |
| `pnpm lint` | Run ESLint |

## Project Structure

```text
app/              Next.js routes, layouts, metadata, and global styles
components/       Page sections, shared UI, 3D robot, motion, and terminal
content/          Profile, skills, experience, and project case studies
hooks/            Reusable interaction and terminal hooks
lib/              Site config, content helpers, SEO, and terminal commands
public/           Project images, icons, and resume PDF
types/            Shared TypeScript types
```

## Customizing the Portfolio

- Update profile and contact details in `content/profile.ts` and `lib/site.ts`.
- Update work history and skills in `content/experience.ts` and `content/skills.ts`.
- Add or edit project case studies in `content/projects/` and register them in `content/projects/index.ts`.
- Replace `public/resume.pdf` with the current resume and use your own Web3Forms access key for the contact form.

## License

No license file is currently included. Unless a license is added, the source remains subject to the copyright holder's default rights.
