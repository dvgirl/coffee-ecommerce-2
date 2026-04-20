"use client";

import { FormEvent, useEffect, useState } from "react";
import AdminCard from "@/components/admin/AdminCard";
import AdminTopbar from "@/components/admin/AdminTopbar";
import {
  createCategory,
  deleteCategory,
  getCategories,
  type AdminCategoryRecord,
  updateCategory,
} from "@/lib/admin-product-api";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<AdminCategoryRecord[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeChangeId, setActiveChangeId] = useState<string | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [draftCategoryName, setDraftCategoryName] = useState("");
  const [rowLoadingId, setRowLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = async () => {
    setLoading(true);
    setError(null);

    try {
      const items = await getCategories();
      setCategories(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadCategories();
  }, []);

  const handleCreateCategory = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newCategory.trim()) {
      setError("Category name cannot be empty.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await createCategory({ name: newCategory.trim() });
      setNewCategory("");
      await loadCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create category.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartEdit = (category: AdminCategoryRecord) => {
    setEditingCategoryId(category.id);
    setDraftCategoryName(category.name);
    setError(null);
  };

  const handleCancelEdit = () => {
    setEditingCategoryId(null);
    setDraftCategoryName("");
  };

  const handleSaveCategory = async (categoryId: string) => {
    if (!draftCategoryName.trim()) {
      setError("Category name cannot be empty.");
      return;
    }

    setRowLoadingId(categoryId);
    setError(null);

    try {
      await updateCategory(categoryId, { name: draftCategoryName.trim() });
      await loadCategories();
      handleCancelEdit();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save category.");
    } finally {
      setRowLoadingId(null);
    }
  };

  const handleToggleActive = async (category: AdminCategoryRecord) => {
    setActiveChangeId(category.id);
    setError(null);

    try {
      await updateCategory(category.id, { active: !category.active });
      await loadCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update category status.");
    } finally {
      setActiveChangeId(null);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    const confirmed = window.confirm("Delete this category? This cannot be undone.");
    if (!confirmed) return;

    setRowLoadingId(categoryId);
    setError(null);

    try {
      await deleteCategory(categoryId);
      await loadCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete category.");
    } finally {
      setRowLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <AdminTopbar
        title="Category management"
        description="Create and review product categories that power the catalog and storefront filters."
        badge="Catalog"
      />

      <div className="grid gap-4 xl:grid-cols-[1fr_0.85fr]">
        <AdminCard>
          <p className="text-sm text-muted">Total categories</p>
          <p className="mt-3 text-3xl font-bold tracking-[-0.03em] text-foreground">{categories.length}</p>
          <p className="mt-4 text-sm leading-6 text-muted">
            Categories created here are available in the admin product form and in the storefront category filters.
          </p>
        </AdminCard>

        <AdminCard title="New category" eyebrow="Add category">
          <form onSubmit={handleCreateCategory} className="space-y-4">
            <label className="space-y-2 text-sm">
              <span className="font-medium text-foreground">Category name</span>
              <input
                value={newCategory}
                onChange={(event) => setNewCategory(event.target.value)}
                placeholder="Single origin, Espresso, Decaf..."
                className="w-full rounded-3xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-900 focus:ring-4 focus:ring-emerald-100"
              />
            </label>
            {error ? <p className="text-sm text-rose-700">{error}</p> : null}
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex h-12 items-center justify-center rounded-full bg-emerald-950 px-6 text-sm font-semibold text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {submitting ? "Saving…" : "Create category"}
            </button>
          </form>
        </AdminCard>
      </div>

      <AdminCard title="Categories" eyebrow="Category list">
        <div className="overflow-hidden rounded-[1.5rem] border border-black/6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-black/6 text-left">
              <thead className="bg-background">
                <tr className="text-xs uppercase tracking-[0.16em] text-muted">
                  <th className="px-4 py-3 font-bold">Name</th>
                  <th className="px-4 py-3 font-bold">Identifier</th>
                  <th className="px-4 py-3 font-bold">Status</th>
                  <th className="px-4 py-3 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/6 bg-white">
                {categories.map((category) => {
                  const isEditing = editingCategoryId === category.id;
                  const isBusy = rowLoadingId === category.id || activeChangeId === category.id;

                  return (
                    <tr key={category.id}>
                      <td className="px-4 py-4 text-sm text-foreground">
                        {isEditing ? (
                          <input
                            value={draftCategoryName}
                            onChange={(event) => setDraftCategoryName(event.target.value)}
                            className="w-full rounded-3xl border border-black/10 bg-white px-4 py-2 text-sm outline-none transition focus:border-emerald-900 focus:ring-4 focus:ring-emerald-100"
                          />
                        ) : (
                          category.name
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm text-muted">{category.id}</td>
                      <td className="px-4 py-4 text-sm">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${
                            category.active ? "bg-emerald-100 text-emerald-900" : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {category.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <div className="flex flex-wrap gap-2">
                          {isEditing ? (
                            <>
                              <button
                                type="button"
                                onClick={() => void handleSaveCategory(category.id)}
                                disabled={isBusy}
                                className="inline-flex items-center justify-center rounded-full bg-emerald-950 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:bg-slate-300"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={handleCancelEdit}
                                disabled={isBusy}
                                className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-semibold text-foreground transition hover:border-emerald-900 hover:text-emerald-900 disabled:cursor-not-allowed disabled:text-slate-400"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => handleStartEdit(category)}
                                disabled={isBusy}
                                className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-semibold text-foreground transition hover:border-emerald-900 hover:text-emerald-900 disabled:cursor-not-allowed disabled:text-slate-400"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleToggleActive(category)}
                                disabled={isBusy}
                                className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-semibold text-foreground transition hover:border-emerald-900 hover:text-emerald-900 disabled:cursor-not-allowed disabled:text-slate-400"
                              >
                                {category.active ? "Deactivate" : "Activate"}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteCategory(category.id)}
                                disabled={isBusy}
                                className="inline-flex items-center justify-center rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 hover:text-rose-900 disabled:cursor-not-allowed disabled:text-slate-400"
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {categories.length === 0 && !loading ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-sm text-muted">
                      No categories have been created yet. Add a category to get started.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </AdminCard>
    </div>
  );
}
