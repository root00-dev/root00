import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { site } from "@/data/site";

export function ContactForm() {
  const [service, setService] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();
    const subject = `Project enquiry: ${service || "General"}`;
    const body = `Hi _root,\n\n${message}\n\nService: ${service || "General enquiry"}\nName: ${name}\nReply to: ${email}`;
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  const field =
    "w-full rounded-md border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-border bg-surface p-5 sm:p-6"
      aria-describedby="form-note"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block font-mono text-xs text-muted-foreground">
            Name
          </label>
          <input id="name" name="name" required autoComplete="name" className={field} placeholder="Tanaka M." />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block font-mono text-xs text-muted-foreground">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={field}
            placeholder="you@company.com"
          />
        </div>
      </div>
      <div className="mt-4">
        <label htmlFor="service" className="mb-1.5 block font-mono text-xs text-muted-foreground">
          What do you need?
        </label>
        <select id="service" name="service" value={service} onChange={(event) => setService(event.target.value)} className={field}>
          <option value="">Choose a service</option>
          {site.services.map((item) => <option key={item.title} value={item.title}>{item.title}</option>)}
          <option value="Other">Something else</option>
        </select>
      </div>
      <div className="mt-4">
        <label htmlFor="message" className="mb-1.5 block font-mono text-xs text-muted-foreground">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className={field}
          placeholder="What are you building, or what hosting do you need?"
        />
      </div>

      <Button
        type="submit"
        className="mt-5 h-auto w-full py-3 font-mono font-semibold"
      >
        Open email draft
      </Button>

      <p id="form-note" className="mt-3 font-mono text-xs text-muted-foreground">
        Opens your email app with your message ready to send. Nothing is sent until you press send there.
      </p>
    </form>
  );
}
