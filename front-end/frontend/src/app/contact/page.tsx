"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const disabled = useMemo(() => {
    const n = name.trim();
    const e = email.trim();
    const m = message.trim();
    return !n || !e || !m;
  }, [name, email, message]);

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-12 md:px-12 md:py-16">
      <div className="rounded-[2.2rem] border border-black/6 bg-coffee-light/20 p-8 md:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Support</p>
        <h1 className="mt-4 text-4xl font-bold tracking-[-0.04em] text-foreground md:text-5xl">
          Contact us
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-muted md:text-base">
          Questions about an order, shipping, or subscriptions? Send a message and we’ll get back to you.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/faq" className="rounded-full border border-black/10 bg-white px-6 py-3 text-xs font-black uppercase tracking-[0.18em] text-foreground transition hover:border-primary/30 hover:text-primary">
            View FAQ
          </Link>
          <Link href="/shipping" className="rounded-full border border-black/10 bg-white px-6 py-3 text-xs font-black uppercase tracking-[0.18em] text-foreground transition hover:border-primary/30 hover:text-primary">
            Shipping & returns
          </Link>
        </div>
      </div>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[1.9rem] border border-black/6 bg-background p-6">
          <h2 className="text-lg font-bold text-foreground">Send a message</h2>
          <p className="mt-2 text-sm text-muted">This is a simple local form UI. Hook it up to an email/ticketing backend anytime.</p>

          {sent ? (
            <div className="mt-6 rounded-[1.4rem] border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
              <p className="font-semibold">Message saved</p>
              <p className="mt-2 text-sm">Thanks. We’ll respond to the email you provided.</p>
            </div>
          ) : (
            <form
              className="mt-6 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <label className="block">
                <span className="text-sm font-semibold text-foreground">Name</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary/40 focus:ring-4 focus:ring-primary/10"
                  placeholder="Your name"
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-foreground">Email</span>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary/40 focus:ring-4 focus:ring-primary/10"
                  placeholder="you@example.com"
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-foreground">Message</span>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  className="mt-2 w-full resize-none rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-primary/40 focus:ring-4 focus:ring-primary/10"
                  placeholder="Tell us what you need help with…"
                />
              </label>
              <button
                type="submit"
                disabled={disabled}
                className={cn(
                  "w-full rounded-2xl px-5 py-4 text-xs font-black uppercase tracking-[0.18em] transition",
                  disabled
                    ? "bg-black/5 text-muted"
                    : "bg-primary text-white shadow-lg hover:bg-primary-dark",
                )}
              >
                Submit
              </button>
            </form>
          )}
        </div>

        <div className="rounded-[1.9rem] border border-black/6 bg-background p-6">
          <h2 className="text-lg font-bold text-foreground">Fast help</h2>
          <p className="mt-2 text-sm text-muted">Before you send a message, these usually solve it.</p>
          <div className="mt-6 space-y-3">
            <div className="rounded-[1.4rem] border border-black/6 bg-coffee-light/20 p-4">
              <p className="font-semibold text-foreground">Order issues</p>
              <p className="mt-2 text-sm leading-6 text-muted">Include your order code and what went wrong (missing items, address correction, damage, etc.).</p>
            </div>
            <div className="rounded-[1.4rem] border border-black/6 bg-coffee-light/20 p-4">
              <p className="font-semibold text-foreground">Shipping questions</p>
              <p className="mt-2 text-sm leading-6 text-muted">Check estimated timelines and policy details on the Shipping & Returns page.</p>
              <Link href="/shipping" className="mt-3 inline-flex text-sm font-semibold text-primary hover:underline">
                View shipping policy
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

