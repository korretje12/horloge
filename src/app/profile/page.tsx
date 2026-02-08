"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { UserCollection, Watch } from "@/types/database";
import WatchCard from "@/components/WatchCard";
import type { User } from "@supabase/supabase-js";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [ownedWatches, setOwnedWatches] = useState<Watch[]>([]);
  const [wishlistWatches, setWishlistWatches] = useState<Watch[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (cancelled) return;
      if (!user) {
        router.push("/auth/login");
        return;
      }
      setUser(user);

      const { data, error } = await supabase
        .from("user_collection")
        .select("*, watch:watches(*)")
        .eq("user_id", user.id);

      if (cancelled) return;
      if (error) {
        console.error("Error fetching collection:", error);
        setLoading(false);
        return;
      }

      const collection = (data || []) as unknown as (UserCollection & {
        watch: Watch;
      })[];
      setOwnedWatches(
        collection.filter((c) => c.status === "owned").map((c) => c.watch)
      );
      setWishlistWatches(
        collection.filter((c) => c.status === "wishlist").map((c) => c.watch)
      );
      setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [router, refreshKey]);

  const handleRemove = async (watchId: string) => {
    if (!user) return;
    await supabase
      .from("user_collection")
      .delete()
      .eq("user_id", user.id)
      .eq("watch_id", watchId);
    setRefreshKey((k) => k + 1);
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-zinc-500">
        Loading your watchbox...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          My Watchbox
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Signed in as {user?.email}
        </p>
      </div>

      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          🏠 My Collection
        </h2>
        {ownedWatches.length === 0 ? (
          <p className="text-zinc-500">
            No watches in your collection yet. Browse the{" "}
            <a href="/watches" className="text-blue-600 underline">
              database
            </a>{" "}
            to add some!
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {ownedWatches.map((watch) => (
              <div key={watch.id} className="relative">
                <WatchCard watch={watch} />
                <button
                  onClick={() => handleRemove(watch.id)}
                  className="absolute right-2 top-2 rounded-full bg-red-500 p-1.5 text-xs text-white hover:bg-red-600"
                  title="Remove from collection"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          ⭐ Wishlist
        </h2>
        {wishlistWatches.length === 0 ? (
          <p className="text-zinc-500">
            Your wishlist is empty. Browse the{" "}
            <a href="/watches" className="text-blue-600 underline">
              database
            </a>{" "}
            to add watches to your wishlist!
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {wishlistWatches.map((watch) => (
              <div key={watch.id} className="relative">
                <WatchCard watch={watch} />
                <button
                  onClick={() => handleRemove(watch.id)}
                  className="absolute right-2 top-2 rounded-full bg-red-500 p-1.5 text-xs text-white hover:bg-red-600"
                  title="Remove from wishlist"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
