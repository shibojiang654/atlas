"use client";

import { motion } from "framer-motion";
import { CalendarDays, Search } from "lucide-react";

import type { Entry } from "@/app/types";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";

type Props = {
  entries: Entry[];
  filter: string;
  onFilterChange: (v: string) => void;
};

function groupByDay(entries: Entry[]) {
  return entries.reduce<Record<string, Entry[]>>((acc, entry) => {
    const key = new Date(entry.created_at).toLocaleDateString(undefined, {
      weekday: "long",
      month: "short",
      day: "numeric"
    });
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(entry);
    return acc;
  }, {});
}

export default function EntryList({ entries, filter, onFilterChange }: Props) {
  const filtered = entries.filter((entry) => {
    const hay = `${entry.title || ""} ${entry.content_preview}`.toLowerCase();
    return hay.includes(filter.toLowerCase());
  });
  const grouped = groupByDay(filtered);

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input value={filter} onChange={(e) => onFilterChange(e.target.value)} className="pl-9" placeholder="Filter entries" />
          </div>
          <div className="mt-3 flex gap-2">
            <Badge variant="default">All</Badge>
            <Badge variant="secondary">High Energy</Badge>
            <Badge variant="secondary">Low Stress</Badge>
          </div>
        </CardContent>
      </Card>

      {Object.keys(grouped).length === 0 ? (
        <Card>
          <CardContent className="p-6 text-sm text-slate-500">No matching entries yet.</CardContent>
        </Card>
      ) : null}

      {Object.entries(grouped).map(([day, dayEntries]) => (
        <section key={day} className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{day}</p>
          {dayEntries.map((entry, idx) => (
            <motion.article
              key={entry.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
            >
              <Card className="transition duration-200 hover:-translate-y-1 hover:shadow-lg">
                <CardContent className="space-y-2 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="text-sm font-semibold text-slate-900">{entry.title || "Untitled reflection"}</h4>
                    <div className="inline-flex items-center gap-1 text-xs text-slate-500">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {new Date(entry.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                  <p className="max-h-16 overflow-hidden text-sm text-slate-600">{entry.content_preview}</p>
                </CardContent>
              </Card>
            </motion.article>
          ))}
        </section>
      ))}
    </div>
  );
}
