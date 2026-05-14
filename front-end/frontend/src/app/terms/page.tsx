import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-12 md:px-12 md:py-16">
      <div className="rounded-[2.2rem] border border-black/6 bg-coffee-light/20 p-8 md:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Legal</p>
        <h1 className="mt-4 text-4xl font-bold tracking-[-0.04em] text-foreground md:text-5xl">
          Terms of service
        </h1>
        <p className="mt-4 text-sm leading-7 text-muted md:text-base">
          Placeholder terms for development. Replace this content with your official terms before going live.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/privacy" className="rounded-full border border-black/10 bg-white px-6 py-3 text-xs font-black uppercase tracking-[0.18em] text-foreground transition hover:border-primary/30 hover:text-primary">
            Privacy policy
          </Link>
          <Link href="/contact" className="rounded-full bg-primary px-6 py-3 text-xs font-black uppercase tracking-[0.18em] text-white shadow-lg transition hover:bg-primary-dark">
            Contact
          </Link>
        </div>
      </div>

      <section className="mt-10 space-y-4">
        <article className="rounded-[1.8rem] border border-black/6 bg-background p-6">
          <h2 className="text-lg font-bold text-foreground">Using the site</h2>
          <p className="mt-3 text-sm leading-7 text-muted">
            By using this site, you agree to follow applicable laws and not misuse the platform, including any attempts to disrupt service.
          </p>
        </article>
        <article className="rounded-[1.8rem] border border-black/6 bg-background p-6">
          <h2 className="text-lg font-bold text-foreground">Orders</h2>
          <p className="mt-3 text-sm leading-7 text-muted">
            Pricing, availability, and fulfillment timelines are provided during checkout. We may contact you if additional details are needed.
          </p>
        </article>
        <article className="rounded-[1.8rem] border border-black/6 bg-background p-6">
          <h2 className="text-lg font-bold text-foreground">Liability</h2>
          <p className="mt-3 text-sm leading-7 text-muted">
            This content is a placeholder. Add your official limitation of liability, warranty disclaimers, and dispute resolution terms here.
          </p>
        </article>
      </section>
    </main>
  );
}

