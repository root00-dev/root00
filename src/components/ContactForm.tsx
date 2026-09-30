import { useState, type FormEvent } from "react";

// TODO: wire this up to a backend or Formspree.
// Formspree: set action="https://formspree.io/f/<your-id>" method="post" on the
// <form> and delete the handleSubmit below. Or POST to your own endpoint.
export function ContactForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
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

      <button
        type="submit"
        className="mt-5 w-full rounded-md bg-primary px-5 py-3 font-mono text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
      >
        Send message
      </button>

      <p id="form-note" role="status" className="mt-3 font-mono text-xs text-muted-foreground">
        {sent
          ? "Thanks — message captured. Hook the form up to email delivery to receive it."
          : "This form isn't connected to email delivery yet."}
      </p>
    </form>
  );
}
