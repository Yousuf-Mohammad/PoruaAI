import React from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Starter",
    price: "Free",
    cadence: "",
    blurb: "Enough to read a semester's worth of papers.",
    features: [
      "Up to 5 documents",
      "Unlimited questions",
      "Notes saved per document",
      "Help centre access",
    ],
    cta: "Your current plan",
    current: true,
  },
  {
    name: "Pro",
    price: "$9.99",
    cadence: "/month",
    blurb: "For readers whose shelf keeps growing.",
    features: [
      "Unlimited documents",
      "Unlimited questions",
      "Notes saved per document",
      "Email and phone support",
    ],
    cta: "Upgrade to Pro",
    current: false,
  },
];

const UpgradePlans = () => {
  return (
    <div className="mx-auto max-w-4xl">
      <div>
        <p className="eyebrow">Plans</p>
        <h1 className="mt-2 font-display text-3xl font-medium tracking-tight">
          Room for more documents
        </h1>
        <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-soft">
          The free plan holds five. Upgrade when your shelf runs out of room.
        </p>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className="flex flex-col rounded-xl border border-rule bg-page p-8 shadow-page"
          >
            <div className="flex items-baseline justify-between">
              <h2 className="font-display text-xl font-medium">{plan.name}</h2>
              {plan.current && <span className="eyebrow">Current</span>}
            </div>

            <p className="mt-5 flex items-baseline gap-1">
              <span
                className={
                  plan.current
                    ? "font-display text-4xl font-medium tracking-tight"
                    : "mark font-display text-4xl font-medium tracking-tight"
                }
              >
                {plan.price}
              </span>
              <span className="font-mono text-[11px] uppercase tracking-label text-ink-soft">
                {plan.cadence}
              </span>
            </p>

            <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
              {plan.blurb}
            </p>

            <ul className="mt-8 space-y-3 border-t border-rule pt-6">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-[15px]">
                  <Check
                    className="mt-1 h-3.5 w-3.5 shrink-0 text-ink-soft"
                    strokeWidth={2.5}
                    aria-hidden
                  />
                  {feature}
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-8">
              <Button
                className="w-full"
                variant={plan.current ? "secondary" : "default"}
                disabled={plan.current}
              >
                {plan.cta}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpgradePlans;
