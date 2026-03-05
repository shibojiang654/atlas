"use client";

import React from "react";
import { motion } from "framer-motion";
import { MessageCircleQuestion } from "lucide-react";

import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";

type Props = {
  onAsk: (question: string, dateRange?: { start: string; end: string }) => Promise<void>;
  loading: boolean;
};

export default function AskBox({ onAsk, loading }: Props) {
  const [question, setQuestion] = React.useState("");
  const [start, setStart] = React.useState("");
  const [end, setEnd] = React.useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim()) {
      return;
    }
    await onAsk(question, start && end ? { start, end } : undefined);
  }

  return (
    <motion.form initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} onSubmit={submit}>
      <Card>
        <CardHeader>
          <CardTitle className="inline-flex items-center gap-2">
            <MessageCircleQuestion className="h-5 w-5 text-primary" /> Ask Atlas
          </CardTitle>
          <CardDescription>Get grounded insight from your journal history with clear citations.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Question</Label>
            <Textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={4}
              placeholder="What thought loops showed up this week?"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>From date</Label>
              <Input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>To date</Label>
              <Input type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
            </div>
          </div>
          <Button disabled={loading}>{loading ? "Thinking..." : "Ask Atlas"}</Button>
        </CardContent>
      </Card>
    </motion.form>
  );
}
