import Link from "next/link";
import { BookMarked } from "lucide-react";

import type { Citation } from "@/app/types";
import { Card, CardContent } from "@/app/components/ui/card";

export default function CitationCard({ citation }: { citation: Citation }) {
  return (
    <Card className="transition duration-200 hover:-translate-y-1 hover:shadow-lg">
      <CardContent className="space-y-2 p-4">
        <div className="inline-flex items-center gap-2 text-xs text-slate-500">
          <BookMarked className="h-3.5 w-3.5" />
          {new Date(citation.createdAt).toLocaleDateString()}
        </div>
        <p className="text-sm text-slate-700">{citation.snippet}</p>
        <Link href={`/journal?entryId=${citation.entryId}`} className="text-xs font-medium text-primary hover:underline">
          Open entry #{citation.entryId}
        </Link>
      </CardContent>
    </Card>
  );
}
