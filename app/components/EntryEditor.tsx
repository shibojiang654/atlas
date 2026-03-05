"use client";

import React from "react";
import { motion } from "framer-motion";
import { Save } from "lucide-react";
import { toast } from "sonner";

import { readApiError } from "@/app/http";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";

type Props = {
  onCreated: () => Promise<void>;
};

const USER_ID = "demo-user";

function SliderField({
  label,
  value,
  setValue,
  accent
}: {
  label: string;
  value: number;
  setValue: (n: number) => void;
  accent: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <Label>{label}</Label>
        <span className="font-medium text-slate-600">{value}</span>
      </div>
      <input
        type="range"
        min={1}
        max={10}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200"
        style={{ accentColor: accent }}
      />
    </div>
  );
}

export default function EntryEditor({ onCreated }: Props) {
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [mood, setMood] = React.useState(6);
  const [energy, setEnergy] = React.useState(6);
  const [stress, setStress] = React.useState(4);
  const [loading, setLoading] = React.useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) {
      toast.error("Please add your reflection before saving.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/entries_create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": USER_ID
        },
        body: JSON.stringify({
          title: title || undefined,
          content: `${content}\n\n[mood:${mood} energy:${energy} stress:${stress}]`
        })
      });
      if (!res.ok) {
        throw new Error(await readApiError(res));
      }
      setTitle("");
      setContent("");
      setMood(6);
      setEnergy(6);
      setStress(4);
      await onCreated();
      toast.success("Entry saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save entry.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.form id="editor" onSubmit={submit} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <Card>
        <CardHeader>
          <CardTitle>Write Today&apos;s Reflection</CardTitle>
          <CardDescription>Capture what moved you, what drained you, and what you want to remember.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="entry-title">Title</Label>
            <Input
              id="entry-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="A softer day than yesterday"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="entry-content">Entry</Label>
            <Textarea
              id="entry-content"
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What happened? What did you feel?"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <SliderField label="Mood" value={mood} setValue={setMood} accent="#0284c7" />
            <SliderField label="Energy" value={energy} setValue={setEnergy} accent="#059669" />
            <SliderField label="Stress" value={stress} setValue={setStress} accent="#dc2626" />
          </div>
          <Button type="submit" disabled={loading} className="w-full sm:w-auto">
            <Save className="h-4 w-4" /> {loading ? "Saving..." : "Save Entry"}
          </Button>
        </CardContent>
      </Card>
    </motion.form>
  );
}
