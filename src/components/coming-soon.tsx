import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Construction } from "lucide-react";

export function ComingSoon({ title, description, features }: { title: string; description: string; features: string[] }) {
  return (
    <>
      <PageHeader title={title} description={description} />
      <Card>
        <CardContent className="flex flex-col items-center justify-center gap-4 p-12 text-center">
          <div className="rounded-full bg-secondary p-4 text-primary">
            <Construction className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">In Development</h2>
            <p className="mt-1 text-sm text-muted-foreground">This module is scaffolded and coming in the next build phase.</p>
          </div>
          <ul className="max-w-md space-y-1.5 text-left text-sm text-muted-foreground">
            {features.map((f) => <li key={f} className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" /> {f}</li>)}
          </ul>
        </CardContent>
      </Card>
    </>
  );
}