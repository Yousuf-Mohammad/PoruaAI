"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import Link from "next/link";
import Wordmark from "@/components/Wordmark";
import ThemeToggle from "@/components/ThemeToggle";

const steps = [
  {
    label: "the page",
    body: "Add a PDF. Porua reads it end to end and keeps every passage within reach.",
  },
  {
    label: "the mark",
    body: "Highlight the line you are stuck on. That mark is the question.",
  },
  {
    label: "the margin",
    body: "The answer arrives beside your text, drawn from the document, and stays in your notes.",
  },
];

export default function Home() {
  const { user, isLoaded } = useUser();
  const createUser = useMutation(api.user.createUser);
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded || !user) return;

    const checkUser = async () => {
      try {
        await createUser({
          email: user?.primaryEmailAddress?.emailAddress,
          userName: user?.fullName || user?.username,
          imageUrl: user?.imageUrl,
        });
        router.push("/dashboard");
      } catch (error) {
        console.error("Error creating user:", error);
      }
    };

    checkUser();
  }, [user, isLoaded, createUser, router]);

  const destination = user?.primaryEmailAddress?.emailAddress
    ? "/dashboard"
    : "/sign-in";

  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Wordmark />
        <div className="flex items-center gap-4">
          <Link
            href={destination}
            className="font-mono text-[11px] uppercase tracking-label text-ink-soft transition-colors hover:text-ink"
          >
            Sign in
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-24">
        <section className="grid items-center gap-16 pt-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-20 lg:pt-20">
          <div className="animate-rise-in">
            <p className="eyebrow">A reading workspace</p>

            <h1 className="mt-6 font-display text-[2.75rem] font-medium leading-[1.08] tracking-tight sm:text-6xl">
              Read closer.
              <br />
              <span className="mark mark-animate" style={{ "--swipe-delay": "500ms" }}>
                Ask the margin.
              </span>
            </h1>

            <p className="mt-7 max-w-md text-[17px] leading-relaxed text-ink-soft">
              Porua reads your PDF, then answers out of it. Highlight the passage
              you are stuck on and the explanation appears next to your notes —
              grounded in the document, not guessed at.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-6">
              <Link
                href={destination}
                className="rounded-lg bg-ink px-7 py-3.5 text-sm font-medium text-page shadow-page transition-transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Open a document
              </Link>
              <span className="font-mono text-[11px] uppercase tracking-label text-ink-soft">
                Free for 5 documents
              </span>
            </div>
          </div>

          {/* The specimen: the product in one artifact — a marked passage,
              answered in the margin. */}
          <div
            className="relative animate-rise-in"
            style={{ animationDelay: "180ms" }}
          >
            <div className="rounded-xl border border-rule bg-page p-8 shadow-lift sm:p-10">
              <p className="eyebrow mb-6 border-b border-rule pb-4">
                attention-and-memory.pdf &nbsp;·&nbsp; p. 14
              </p>

              <p className="font-display text-[19px] leading-[1.75] text-ink">
                Readers who annotate retain more than readers who merely re-read.
                The act of marking a passage forces a judgement — this matters,
                that does not — and{" "}
                <span
                  className="mark mark-animate"
                  style={{ "--swipe-delay": "1000ms" }}
                >
                  it is the judgement, not the mark, that is remembered
                </span>
                .
              </p>

              <div
                className="mt-8 animate-rise-in border-l-2 border-marker-deep pl-4"
                style={{ animationDelay: "1500ms" }}
              >
                <p className="eyebrow mb-2">Porua</p>
                <p className="text-[15px] leading-relaxed text-ink-soft">
                  Marking works because it forces a decision. Re-reading feels
                  productive but skips the decision entirely, which is why it
                  leaves so little behind.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-32 border-t border-rule pt-14">
          <div className="grid gap-10 sm:grid-cols-3 sm:gap-12">
            {steps.map((step) => (
              <div key={step.label}>
                <h2 className="font-display text-xl font-medium lowercase">
                  {step.label}
                </h2>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-rule">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-8">
          <Wordmark />
          <p className="font-mono text-[11px] uppercase tracking-label text-ink-soft">
            Porua — পড়ুয়া — one who reads
          </p>
        </div>
      </footer>
    </div>
  );
}
