import { MapPin } from "lucide-react";

import { profile } from "@/content/profile";
import { socialLinks } from "@/lib/navigation";
import { siteConfig } from "@/lib/site";
import { Reveal } from "@/components/motion";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { SocialIcon } from "@/components/shared/icons";
import { ContactForm } from "./contact-form";

/**
 * Contact — scannable contact details on the left, a UI-only form on the right.
 * Details come from the content/site/navigation layers.
 */
export function ContactSection() {
  const details = [
    {
      label: "Email",
      value: siteConfig.links.email,
      href: `mailto:${siteConfig.links.email}`,
      icon: "mail" as const,
    },
    ...socialLinks
      .filter((s) => s.icon === "github" || s.icon === "linkedin")
      .map((s) => ({ label: s.label, value: s.label, href: s.href, icon: s.icon })),
  ];

  return (
    <Section id="contact">
      <SectionHeading
        eyebrow="Contact"
        title="Let's work together"
        description="Have a project in mind or just want to say hi? My inbox is always open."
      />

      <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-2">
        <Reveal>
          <ul className="space-y-4">
            {details.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  target={item.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3"
                >
                  <span className="flex size-10 items-center justify-center rounded-lg border border-border bg-muted/40 text-muted-foreground transition-colors group-hover:border-brand/40 group-hover:text-brand">
                    <SocialIcon name={item.icon} className="size-[1.1rem]" />
                  </span>
                  <span>
                    <span className="block text-xs text-muted-foreground">
                      {item.label}
                    </span>
                    <span className="text-sm font-medium transition-colors group-hover:text-brand">
                      {item.value}
                    </span>
                  </span>
                </a>
              </li>
            ))}
            <li className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-lg border border-border bg-muted/40 text-muted-foreground">
                <MapPin className="size-[1.1rem]" />
              </span>
              <span>
                <span className="block text-xs text-muted-foreground">Location</span>
                <span className="text-sm font-medium">{profile.location}</span>
              </span>
            </li>
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          <ContactForm />
        </Reveal>
      </div>
    </Section>
  );
}
