import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { site, waLink } from "@/data/site";

export function ContactForm() {
  const [service, setService] = useState("");

  useEffect(() => {
    const selectService = (event: Event) => {
      if (event instanceof CustomEvent && typeof event.detail === "string") {
        setService(event.detail);
      }
    };
    window.addEventListener("select-service", selectService);
    return () => window.removeEventListener("select-service", selectService);
  }, []);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();
    const topic = service || "General enquiry";
    const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;

    if (submitter?.value === "whatsapp") {
      const text = `Hi ${site.handle}, I'm ${name} (${email}).\n\n${message}\n\nService: ${topic}`;
      window.open(`${waLink}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
      return;
    }

    const subject = `Project enquiry: ${service || "General"}`;
    const body = `Hi ${site.handle},\n\n${message}\n\nService: ${topic}\nName: ${name}\nReply to: ${email}`;
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
          <input
            id="name"
            name="name"
            required
            autoComplete="name"
            className={field}
            placeholder="Tanaka M."
          />
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
        <select
          id="service"
          name="service"
          value={service}
          onChange={(event) => setService(event.target.value)}
          className={field}
        >
          <option value="">Choose a service</option>
          {site.services.map((item) => (
            <option key={item.title} value={item.title}>
              {item.title}
            </option>
          ))}
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

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Button
          type="submit"
          name="via"
          value="whatsapp"
          className="h-auto w-full py-3 font-mono font-semibold"
        >
          Send on WhatsApp
        </Button>
        <Button
          type="submit"
          name="via"
          value="email"
          variant="outline"
          className="h-auto w-full py-3 font-mono font-semibold"
        >
          Send by email
        </Button>
      </div>

      <p id="form-note" className="mt-3 font-mono text-xs text-muted-foreground">
        Opens WhatsApp or your email app with the message filled in. Nothing is sent until you press
        send there.
      </p>
    </form>
  );
}
