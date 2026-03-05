"use client";

import React from "react";
import { motion } from "framer-motion";
import { Columns2, PenSquare } from "lucide-react";

import EntryEditor from "@/app/components/EntryEditor";
import EntryList from "@/app/components/EntryList";
import { Card, CardContent } from "@/app/components/ui/card";
import { Skeleton } from "@/app/components/ui/skeleton";
import type { Entry } from "@/app/types";

const USER_ID = "demo-user";

export default function JournalPage() {
  const [entries, setEntries] = React.useState<Entry[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [filter, setFilter] = React.useState("");
  const [mobilePane, setMobilePane] = React.useState<"timeline" | "editor">("timeline");

  async function loadEntries() {
    setLoading(true);
    try {
      const res = await fetch("/api/entries_list", {
        headers: {
          "X-User-Id": USER_ID
        }
      });
      if (!res.ok) {
        throw new Error();
      }
      const data = (await res.json()) as { entries: Entry[] };
      setEntries(data.entries || []);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    void loadEntries();
  }, []);

  return (
    <section className="space-y-4">
      <div className="flex gap-2 md:hidden">
        <button
          onClick={() => setMobilePane("timeline")}
          className={`inline-flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm ${
            mobilePane === "timeline" ? "bg-slate-900 text-white" : "bg-white/70"
          }`}
        >
          <Columns2 className="h-4 w-4" /> Timeline
        </button>
        <button
          onClick={() => setMobilePane("editor")}
          className={`inline-flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm ${
            mobilePane === "editor" ? "bg-slate-900 text-white" : "bg-white/70"
          }`}
        >
          <PenSquare className="h-4 w-4" /> Editor
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-[1.05fr_1.35fr]">
        <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className={mobilePane === "editor" ? "hidden md:block" : ""}>
          {loading ? (
            <Card>
              <CardContent className="space-y-3 p-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
              </CardContent>
            </Card>
          ) : (
            <EntryList entries={entries} filter={filter} onFilterChange={setFilter} />
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} className={mobilePane === "timeline" ? "hidden md:block" : ""}>
          <EntryEditor onCreated={loadEntries} />
        </motion.div>
      </div>
    </section>
  );
}
