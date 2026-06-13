import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Calendar, ExternalLink, User } from "lucide-react";

import {
  getAdjacentProjects,
  getProject,
  getProjectMeta,
  getProjectSlugs,
  getRelatedProjects,
} from "@/lib/content/projects";
import { mdxOptions } from "@/lib/mdx";
import { mdxComponents } from "@/mdx-components";
import { siteConfig } from "@/lib/site";
import { breadcrumbJsonLd, projectJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/shared/json-ld";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { FadeIn, Reveal } from "@/components/motion";
import { Breadcrumbs } from "@/components/projects/breadcrumbs";
import { ProjectPager } from "@/components/projects/project-pager";
import { RelatedProjects } from "@/components/projects/related-projects";
import { SocialIcon } from "@/components/shared/icons";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectMeta(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    keywords: [...project.tags, ...project.stack],
    alternates: { canonical: `/projects/${slug}` },
    openGraph: {
      title: project.title,
      description: project.summary,
      type: "article",
      url: `/projects/${slug}`,
    },
  };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const { meta, content } = project;
  const related = getRelatedProjects(slug, 3);
  const { prev, next } = getAdjacentProjects(slug);

  return (
    <main className="flex-1">
      <JsonLd data={projectJsonLd(meta)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: siteConfig.url },
          { name: "Projects", url: `${siteConfig.url}/projects` },
          { name: meta.title, url: `${siteConfig.url}/projects/${slug}` },
        ])}
      />
      <article className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Projects", href: "/projects" },
            { label: meta.title },
          ]}
        />

        <header className="mt-8">
          <Reveal>
            <div className="max-w-3xl">
              <div className="flex flex-wrap gap-2">
                {meta.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>

              <h1 className="mt-4 text-4xl font-bold tracking-tight text-balance sm:text-5xl">
                {meta.title}
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">{meta.summary}</p>

              <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="size-4" />
                  {meta.year}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <User className="size-4" />
                  {meta.role}
                </span>
              </div>

              {(meta.links?.repo || meta.links?.live) && (
                <div className="mt-6 flex flex-wrap gap-3">
                  {meta.links?.live ? (
                    <a
                      href={meta.links.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={buttonVariants()}
                    >
                      <ExternalLink className="size-4" />
                      Live Demo
                    </a>
                  ) : null}
                  {meta.links?.repo ? (
                    <a
                      href={meta.links.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={buttonVariants({ variant: "outline" })}
                    >
                      <SocialIcon name="github" className="size-4" />
                      View Code
                    </a>
                  ) : null}
                </div>
              )}
            </div>
          </Reveal>

          {/* Cover (placeholder gradient) */}
          <FadeIn delay={0.1}>
            <div className="relative mt-10 flex aspect-[16/7] w-full items-center justify-center overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-brand/25 via-brand/5 to-transparent">
              <span
                aria-hidden="true"
                className="text-[8rem] font-bold leading-none text-brand/15"
              >
                {meta.title.charAt(0)}
              </span>
            </div>
          </FadeIn>

          {/* Tech stack */}
          <Reveal className="mt-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 text-sm font-medium text-muted-foreground">
                Built with
              </span>
              {meta.stack.map((tech) => (
                <Badge key={tech} variant="outline">
                  {tech}
                </Badge>
              ))}
            </div>
          </Reveal>
        </header>

        {/* Case study body */}
        <Reveal className="mt-12 max-w-3xl">
          <MDXRemote source={content} components={mdxComponents} options={mdxOptions} />
        </Reveal>
      </article>

      <ProjectPager prev={prev} next={next} />
      <RelatedProjects projects={related} />

      <div className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6">
        <Link href="/projects" className={buttonVariants({ variant: "ghost" })}>
          ← Back to all projects
        </Link>
      </div>
    </main>
  );
}
