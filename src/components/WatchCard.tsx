"use client";

import { Watch } from "@/types/database";
import Image from "next/image";

interface WatchCardProps {
  watch: Watch;
  onAdd?: (watchId: string, status: "owned" | "wishlist") => void;
  showActions?: boolean;
}

export default function WatchCard({
  watch,
  onAdd,
  showActions = false,
}: WatchCardProps) {
  return (
    <div className="group overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      <div className="relative aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        {watch.image_url ? (
          <Image
            src={watch.image_url}
            alt={`${watch.brand} ${watch.model}`}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl">
            ⌚
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          {watch.brand}
        </p>
        <h3 className="mt-1 font-semibold text-zinc-900 dark:text-zinc-50">
          {watch.model}
        </h3>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Ref. {watch.reference_number}
        </p>
        {watch.movement && (
          <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
            {watch.movement}
          </p>
        )}
        {watch.category && (
          <span className="mt-2 inline-block rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
            {watch.category}
          </span>
        )}
        {showActions && onAdd && (
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => onAdd(watch.id, "owned")}
              className="flex-1 rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-300"
            >
              + Collection
            </button>
            <button
              onClick={() => onAdd(watch.id, "wishlist")}
              className="flex-1 rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              + Wishlist
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
