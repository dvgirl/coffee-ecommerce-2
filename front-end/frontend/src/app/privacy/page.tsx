import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-12 md:px-12 md:py-16">
      <div className="rounded-[2.2rem] border border-black/6 bg-coffee-light/20 p-8 md:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Legal</p>
        <h1 className="mt-4 text-4xl font-bold tracking-[-0.04em] text-foreground md:text-5xl">
          Privacy policy
        </h1>
        <p className="mt-4 text-sm leading-7 text-muted md:text-base">
          This page provides general information about how personal data may be handled. Replace this placeholder with your official policy text.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/terms" className="rounded-full border border-black/10 bg-white px-6 py-3 text-xs font-black uppercase tracking-[0.18em] text-foreground transition hover:border-primary/30 hover:text-primary">
            Terms of service
          </Link>
          <Link href="/contact" className="rounded-full bg-primary px-6 py-3 text-xs font-black uppercase tracking-[0.18em] text-white shadow-lg transition hover:bg-primary-dark">
            Contact
          </Link>
        </div>
      </div>

      <section className="mt-10 space-y-4">
        <article className="rounded-[1.8rem] border border-black/6 bg-background p-6">
          <h2 className="text-lg font-bold text-foreground">Data we collect</h2>
          <p className="mt-3 text-sm leading-7 text-muted">
            Account details (like name and phone), order and shipping information, and analytics data to improve the site experience.
          </p>
        </article>
        <article className="rounded-[1.8rem] border border-black/6 bg-background p-6">
          <h2 className="text-lg font-bold text-foreground">How we use data</h2>
          <p className="mt-3 text-sm leading-7 text-muted">
            To process orders, provide customer support, prevent fraud, and improve products and user experience.
          </p>
        </article>
        <article className="rounded-[1.8rem] border border-black/6 bg-background p-6">
          <h2 className="text-lg font-bold text-foreground">Your choices</h2>
          <p className="mt-3 text-sm leading-7 text-muted">
            You can request updates or deletion of certain personal information by contacting support.
          </p>
        </article>
      </section>
    </main>
  );
}

