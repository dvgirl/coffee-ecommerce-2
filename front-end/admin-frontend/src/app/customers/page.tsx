"use client";

import { useEffect, useState } from "react";
import AdminCard from "@/components/admin/AdminCard";
import AdminTopbar from "@/components/admin/AdminTopbar";
import { customerSegments } from "@/lib/admin-data";
import { getUsers, type AdminUserRecord } from "@/lib/admin-user-api";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<AdminUserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await getUsers(1, 20); // Get first 20 customers
        setCustomers(response.items);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load customers");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <AdminTopbar
          title="Customer intelligence"
          description="Guide retention, service prioritization, and targeting with a focused CRM-facing dashboard."
          badge="CRM view"
        />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-muted">Loading customers...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <AdminTopbar
          title="Customer intelligence"
          description="Guide retention, service prioritization, and targeting with a focused CRM-facing dashboard."
          badge="CRM view"
        />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="text-red-500">
              <p className="font-medium">Error loading customers</p>
              <p className="text-sm text-muted mt-1">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
        <AdminCard title="Customer list" eyebrow="Recent customers">
          <div className="grid gap-4">
            {customers.map((customer) => (
              <div key={customer.id} className="rounded-[1.4rem] border border-black/6 bg-background p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-lg font-semibold text-foreground">{customer.name}</p>
                    <p className="mt-1 text-sm text-muted">{customer.phoneNumber}</p>
                  </div>
                  <div className="text-left md:text-right">
                    <p className={`text-sm font-bold ${customer.isVerified ? 'text-green-600' : 'text-amber-600'}`}>
                      {customer.isVerified ? 'Verified' : 'Unverified'}
                    </p>
                    <p className="text-sm text-muted">{customer.addressesCount} addresses</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-muted">
                  Joined {new Date(customer.createdAt).toLocaleDateString()}
                  {customer.lastLoginAt && ` • Last login ${new Date(customer.lastLoginAt).toLocaleDateString()}`}
                </p>
              </div>
            ))}
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
