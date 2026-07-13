"use client";
import React from "react";
import { SignIn, SignUp } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import Wordmark from "@/components/Wordmark";
import ThemeToggle from "@/components/ThemeToggle";
import { clerkAppearance } from "@/configs/clerkAppearance";

const AuthPanel = ({ mode, headline }) => {
  const { resolvedTheme } = useTheme();
  const appearance = clerkAppearance(resolvedTheme === "dark");
  const Form = mode === "sign-up" ? SignUp : SignIn;

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-10 bg-paper px-6 py-16">
      <ThemeToggle className="absolute right-6 top-6" />

      <div className="text-center">
        <Wordmark className="justify-center" />
        <p className="mt-5 font-display text-2xl font-medium tracking-tight text-ink">
          {headline}
        </p>
      </div>

      <Form appearance={appearance} />
    </div>
  );
};

export default AuthPanel;
