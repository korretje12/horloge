"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Wristcheck } from "@/types/database";
import Image from "next/image";
import type { User } from "@supabase/supabase-js";

export default function WristcheckPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [wristchecks, setWristchecks] = useState<Wristcheck[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [watchModel, setWatchModel] = useState("");
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const { data, error } = await supabase
        .from("wristchecks")
        .select("*")
        .order("created_at", { ascending: false });

      if (cancelled) return;
      if (error) {
        console.error("Error fetching wristchecks:", error);
      }
      setWristchecks(data || []);
      setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [refreshKey]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push("/auth/login");
      return;
    }
    if (!file || !watchModel) {
      setMessage("Please select a photo and enter the watch model.");
      return;
    }

    setUploading(true);
    setMessage("");

    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("wristchecks")
      .upload(fileName, file);

    if (uploadError) {
      setMessage("Error uploading photo. Please try again.");
      setUploading(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("wristchecks").getPublicUrl(fileName);

    const { error: insertError } = await supabase.from("wristchecks").insert({
      user_id: user.id,
      watch_model: watchModel,
      image_url: publicUrl,
      caption: caption || null,
    });

    if (insertError) {
      setMessage("Error saving wristcheck. Please try again.");
    } else {
      setMessage("Wristcheck uploaded successfully!");
      setWatchModel("");
      setCaption("");
      setFile(null);
      setRefreshKey((k) => k + 1);
    }
    setUploading(false);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Wristcheck
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Share your wrist shots with the community!
        </p>
      </div>

      {user && (
        <div className="mb-8 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Upload Your Wristcheck
          </h2>
          {message && (
            <div
              className={`mb-4 rounded-lg px-4 py-3 text-sm ${
                message.includes("Error")
                  ? "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                  : "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
              }`}
            >
              {message}
            </div>
          )}
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Watch Model *
              </label>
              <input
                type="text"
                value={watchModel}
                onChange={(e) => setWatchModel(e.target.value)}
                placeholder="e.g. Rolex Submariner"
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Caption
              </label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Say something about your shot..."
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Photo *
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full text-sm text-zinc-500 file:mr-4 file:rounded-full file:border-0 file:bg-zinc-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-zinc-700 hover:file:bg-zinc-200 dark:text-zinc-400 dark:file:bg-zinc-800 dark:file:text-zinc-300"
                required
              />
            </div>
            <button
              type="submit"
              disabled={uploading}
              className="rounded-lg bg-zinc-900 px-6 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-300"
            >
              {uploading ? "Uploading..." : "Share Wristcheck"}
            </button>
          </form>
        </div>
      )}

      {!user && (
        <div className="mb-8 rounded-xl border border-zinc-200 bg-zinc-50 p-6 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-zinc-600 dark:text-zinc-400">
            <a href="/auth/login" className="text-blue-600 underline">
              Sign in
            </a>{" "}
            to share your own wristcheck photos!
          </p>
        </div>
      )}

      <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
        🏆 Wall of Fame
      </h2>
      {loading ? (
        <div className="py-10 text-center text-zinc-500">
          Loading wristchecks...
        </div>
      ) : wristchecks.length === 0 ? (
        <div className="py-10 text-center text-zinc-500">
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
    </div>
  );
}
