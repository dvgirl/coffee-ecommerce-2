import { Search, Sparkles } from "lucide-react";

type AdminTopbarProps = {
  title: string;
  description: string;
  badge?: string;
  searchValue?: string;
  onSearch?: (value: string) => void;
  searchPlaceholder?: string;
};

export default function AdminTopbar({
  title,
  description,
  badge = "Live workspace",
  searchValue,
  onSearch,
  searchPlaceholder = "Search orders, products, or customers",
}: AdminTopbarProps) {
  return (
    <div className="flex flex-col gap-5 rounded-[2rem] border border-black/6 bg-white/85 p-6 shadow-[0_18px_50px_rgba(42,28,22,0.06)] backdrop-blur-sm xl:flex-row xl:items-start xl:justify-between">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          {badge}
        </div>
        <h2 className="mt-4 text-3xl font-bold tracking-[-0.04em] text-foreground md:text-4xl">{title}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted md:text-base">{description}</p>
      </div>

      {onSearch ? (
        <div className="flex w-full max-w-md items-center gap-3 rounded-[1.35rem] border border-black/8 bg-background px-4 py-3">
          <Search className="h-4 w-4 text-muted" />
          <input
            value={searchValue}
            onChange={(event) => onSearch(event.target.value)}
            placeholder={searchPlaceholder}
            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted"
          />
        </div>
      ) : null}
    </div>
  );
}
