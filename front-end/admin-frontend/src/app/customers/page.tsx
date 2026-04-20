import AdminCard from "@/components/admin/AdminCard";
import AdminTopbar from "@/components/admin/AdminTopbar";
import { customerSegments } from "@/lib/admin-data";

const customers = [
  { name: "Aanya Verma", segment: "Club members", lifetimeValue: "$642", frequency: "Every 24 days", note: "Buys subscriptions and seasonal teas." },
  { name: "Daniel Roy", segment: "Wholesale partners", lifetimeValue: "$8,420", frequency: "Every 11 days", note: "Cafe partner, stable espresso reorder pattern." },
  { name: "Nisha Shah", segment: "Gift buyers", lifetimeValue: "$184", frequency: "Quarterly", note: "Responds strongly to curation bundles." },
];

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <AdminTopbar
        title="Customer intelligence"
        description="Guide retention, service prioritization, and targeting with a focused CRM-facing dashboard."
        badge="CRM view"
      />
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <AdminCard title="Key segments" eyebrow="Audience map">
          <div className="space-y-4">
            {customerSegments.map((segment) => (
              <div key={segment.name} className="rounded-[1.4rem] border border-black/6 bg-background p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-foreground">{segment.name}</p>
                  <span className="text-sm font-bold text-primary">{segment.size}</span>
                </div>
                <p className="mt-2 text-sm text-muted">{segment.note}</p>
                <p className="mt-3 text-xs font-bold uppercase tracking-[0.16em] text-muted">
                  {segment.spend} • Loyalty {segment.loyalty}
                </p>
              </div>
            ))}
          </div>
        </AdminCard>
        <AdminCard title="High context customers" eyebrow="Relationship notes">
          <div className="grid gap-4">
            {customers.map((customer) => (
              <div key={customer.name} className="rounded-[1.4rem] border border-black/6 bg-background p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-lg font-semibold text-foreground">{customer.name}</p>
                    <p className="mt-1 text-sm text-muted">{customer.segment}</p>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="font-bold text-primary">{customer.lifetimeValue}</p>
                    <p className="text-sm text-muted">{customer.frequency}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-muted">{customer.note}</p>
              </div>
            ))}
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
