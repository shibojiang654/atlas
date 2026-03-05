import { AlertTriangle } from "lucide-react";

import { Card, CardContent } from "@/app/components/ui/card";

export default function SafetyBanner({ message }: { message: string }) {
  return (
    <Card className="border-rose-200 bg-rose-50/80">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 text-rose-600" />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-rose-700">Safety Support</p>
            <p className="text-sm text-rose-700">{message}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
