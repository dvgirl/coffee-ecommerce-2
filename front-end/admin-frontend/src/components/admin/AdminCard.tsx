import { cn } from "@/lib/utils";

type AdminCardProps = {
  title?: string;
  eyebrow?: string;
  className?: string;
  children: React.ReactNode;
};

export default function AdminCard({ title, eyebrow, className, children }: AdminCardProps) {
  return (
    <section
      className={cn(
        "rounded-[1.8rem] border border-black/6 bg-white/88 p-6 shadow-[0_16px_48px_rgba(42,28,22,0.05)] backdrop-blur-sm",
        className,
      )}
    >
      {(eyebrow || title) && (
        <header className="mb-5">
          {eyebrow && <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>}
          {title && <h3 className="mt-2 text-xl font-bold tracking-[-0.03em] text-foreground">{title}</h3>}
        </header>
      )}
      {children}
    </section>
  );
}
