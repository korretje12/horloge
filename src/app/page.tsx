"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Wristcheck } from "@/types/database";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const [wristchecks, setWristchecks] = useState<Wristcheck[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatest = async () => {
      const { data } = await supabase
        .from("wristchecks")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(6);

      setWristchecks(data || []);
      setLoading(false);
    };
    fetchLatest();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      {/* Hero */}
      <section className="mb-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
          ⌚ Horloge
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
          Browse the watch database, build your virtual watchbox, and share your
          wristchecks with the community.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/watches"
            className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            Browse Watches
          </Link>
          <Link
            href="/wristcheck"
            className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
          >
            Share a Wristcheck
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="mb-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
          <div className="mb-3 text-3xl">📋</div>
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
            Watch Database
          </h3>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Browse a curated collection of watches with search and filter
            capabilities.
          </p>
        </div>
        <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
          <div className="mb-3 text-3xl">📦</div>
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
            Virtual Watchbox
          </h3>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Build your personal collection and wishlist. Track what you own and
            what you dream of.
          </p>
        </div>
        <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
          <div className="mb-3 text-3xl">📸</div>
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
            Wristcheck
          </h3>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Upload wrist shots and share them on the Wall of Fame.
          </p>
        </div>
      </section>

      {/* Latest Wristchecks Feed */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Latest Wristchecks
          </h2>
          <Link
            href="/wristcheck"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            View All →
          </Link>
        </div>
        {loading ? (
          <div className="py-10 text-center text-zinc-500">Loading...</div>
        ) : wristchecks.length === 0 ? (
          <div className="rounded-xl border border-zinc-200 py-10 text-center text-zinc-500 dark:border-zinc-800">
            No wristchecks yet. Be the first to share!
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {wristchecks.map((wc) => (
              <div
                key={wc.id}
                className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="relative aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                  <Image
                    src={wc.image_url}
                    alt={wc.watch_model}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    unoptimized
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                    {wc.watch_model}
                  </h3>
                  {wc.caption && (
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                      {wc.caption}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-500">
                    {new Date(wc.created_at).toLocaleDateString("nl-NL", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
