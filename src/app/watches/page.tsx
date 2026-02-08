"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Watch } from "@/types/database";
import WatchCard from "@/components/WatchCard";

export default function WatchesPage() {
  const router = useRouter();
  const [watches, setWatches] = useState<Watch[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const { data, error } = await supabase
        .from("watches")
        .select("*")
        .order("brand");

      if (cancelled) return;
      if (error) {
        console.error("Error fetching watches:", error);
        setLoading(false);
        return;
      }

      setWatches(data || []);
      const uniqueCategories = [
        ...new Set((data || []).map((w: Watch) => w.category).filter(Boolean)),
      ] as string[];
      setCategories(uniqueCategories);
      setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const handleAddToCollection = async (
    watchId: string,
    status: "owned" | "wishlist"
  ) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/auth/login");
      return;
    }

    const { error } = await supabase.from("user_collection").upsert(
      { user_id: user.id, watch_id: watchId, status },
      { onConflict: "user_id,watch_id" }
    );

    if (error) {
      setMessage("Error adding to collection.");
    } else {
      setMessage(
        status === "owned"
          ? "Added to your collection!"
          : "Added to your wishlist!"
      );
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const filteredWatches = watches.filter((watch) => {
    const matchesSearch =
      search === "" ||
      watch.brand.toLowerCase().includes(search.toLowerCase()) ||
      watch.model.toLowerCase().includes(search.toLowerCase()) ||
      watch.reference_number.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === "" || watch.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Watch Database
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Browse our collection of watches. Filter by category or search for a
          specific model.
        </p>
      </div>

      {message && (
        <div className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">
          {message}
        </div>
      )}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <input
          type="text"
          placeholder="Search by brand, model, or reference..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-500"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="py-20 text-center text-zinc-500">
          Loading watches...
        </div>
      ) : filteredWatches.length === 0 ? (
        <div className="py-20 text-center text-zinc-500">
          No watches found. Try adjusting your search or filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredWatches.map((watch) => (
            <WatchCard
              key={watch.id}
              watch={watch}
              onAdd={handleAddToCollection}
              showActions
            />
          ))}
        </div>
      )}
    </div>
  );
}
