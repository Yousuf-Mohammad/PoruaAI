import { SignUp } from "@clerk/nextjs";
import Wordmark from "@/components/Wordmark";
import { clerkAppearance } from "@/configs/clerkAppearance";

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-10 bg-paper px-6 py-16">
      <div className="text-center">
        <Wordmark className="justify-center" />
        <p className="mt-5 font-display text-2xl font-medium tracking-tight text-ink">
          Start reading closer.
        </p>
      </div>
      <SignUp appearance={clerkAppearance} />
    </div>
  );
}
