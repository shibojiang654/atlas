import { ShieldCheck, SlidersHorizontal } from "lucide-react";

import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";

export default function SettingsPage() {
  return (
    <section className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
      <Card>
        <CardHeader>
          <CardTitle className="inline-flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-primary" /> Privacy & Data Controls
          </CardTitle>
          <CardDescription>Adjust how Atlas stores and uses your reflections.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            "Store entries with encrypted-at-rest defaults",
            "Allow RAG search over past entries",
            "Include mood sliders in analysis",
            "Use weekly summaries for experiment suggestions"
          ].map((label, idx) => (
            <label key={label} className="flex items-center justify-between rounded-2xl border border-white/70 bg-white/70 px-4 py-3">
              <span className="text-sm text-slate-700">{label}</span>
              <input type="checkbox" defaultChecked={idx !== 2} className="h-4 w-4" />
            </label>
          ))}
          <div className="flex gap-2">
            <Button>Save preferences</Button>
            <Button variant="secondary">Request data export</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-amber-200 bg-amber-50/80">
        <CardHeader>
          <CardTitle className="inline-flex items-center gap-2 text-amber-900">
            <ShieldCheck className="h-5 w-5" /> Disclaimer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-amber-900">
          <p>
            Atlas is a reflection companion, not a clinical diagnosis tool. For urgent mental health support in the U.S., call or text 988.
          </p>
          <p>Your entries are personal data. Review exports and delete data regularly if needed.</p>
          <Badge variant="outline" className="border-amber-300 text-amber-900">
            MVP auth uses X-User-Id header
          </Badge>
        </CardContent>
      </Card>
    </section>
  );
}
