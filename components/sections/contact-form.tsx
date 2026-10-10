"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Mail, MessageSquare, Send, User } from "lucide-react";

import { siteConfig } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";

const labelClass = "text-sm font-medium";

/** Web3Forms access key — sends submissions to the inbox registered with the key. */
const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

/**
 * Contact form — submits to Web3Forms, which delivers the message to the
 * inbox registered with WEB3FORMS_KEY (dhruwvaviya123@gmail.com).
 */
export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("sending");

    try {
      const formData = new FormData(form);
      formData.append("access_key", WEB3FORMS_KEY ?? "");
      formData.append("subject", "New message from your portfolio contact form");
      formData.append("from_name", siteConfig.name);

      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        form.reset();
        setStatus("sent");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card p-8 text-center">
        <CheckCircle2 className="size-10 text-brand" />
        <p className="font-medium">Thanks for reaching out!</p>
        <p className="text-sm text-muted-foreground">
          Your message is on its way — I&apos;ll get back to you soon. You can
          also email me directly at{" "}
          <a
            href={`mailto:${siteConfig.links.email}`}
            className="text-brand hover:underline"
          >
            {siteConfig.links.email}
          </a>
          .
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() => setStatus("idle")}
        >
          Send another
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-xl border border-border bg-card p-6"
    >
      <div className="space-y-2">
        <label htmlFor="contact-name" className={labelClass}>
          Name
        </label>
        <Input
          id="contact-name"
          name="name"
          type="text"
          required
          autoComplete="name"
          placeholder="Your name"
          icon={<User />}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="contact-email" className={labelClass}>
          Email
        </label>
        <Input
          id="contact-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          icon={<Mail />}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="contact-message" className={labelClass}>
          Message
        </label>
        <Textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          placeholder="Tell me about your project…"
          icon={<MessageSquare />}
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-destructive">
          Something went wrong sending your message. Please try again or email me
          directly at{" "}
          <a
            href={`mailto:${siteConfig.links.email}`}
            className="font-medium hover:underline"
          >
            {siteConfig.links.email}
          </a>
          .
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={status === "sending"}
      >
        {status === "sending" ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Sending…
          </>
        ) : (
          <>
            <Send className="size-4" />
            Send message
          </>
        )}
      </Button>
    </form>
  );
}
