import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <main className="flex max-w-2xl flex-col items-center gap-8 text-center">
        <h1 className="font-heading text-5xl tracking-tight text-foreground">
          Inkfluence AI
        </h1>
        <p className="text-lg text-muted-foreground">
          Transform your ideas into complete, formatted ebooks in minutes.
        </p>
        <div className="flex gap-4">
          <Button>Get Started</Button>
          <Button variant="outline">Learn More</Button>
        </div>
        <p className="text-sm text-muted-foreground">
          v0.1.0 &mdash; Project bootstrap complete
        </p>
      </main>
    </div>
  );
}
