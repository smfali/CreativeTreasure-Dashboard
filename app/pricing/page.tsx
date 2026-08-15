"use client";

import Breadcrumb from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "/mo",
    desc: "Get started with basic insights",
    features: ["1 platform", "Basic metrics", "7-day history", "Community support"],
    cta: "Get Started",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/mo",
    desc: "For serious creators",
    features: ["Unlimited platforms", "Advanced analytics", "Unlimited history", "Priority email support"],
    cta: "Start Free Trial",
    highlight: true,
  },
  {
    name: "Business",
    price: "$49",
    period: "/mo",
    desc: "For teams and agencies",
    features: ["Everything in Pro", "API access", "Custom reports", "Dedicated account manager"],
    cta: "Contact Sales",
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <div className="p-8">
      <Breadcrumb segments={[{ label: "Home" }, { label: "Pricing" }]} />
      <h1 className="heading-page mb-2">Pricing</h1>
      <p className="mb-8 text-sm text-muted-foreground">Choose the plan that fits your needs.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
        {tiers.map((tier) => (
          <Card
            key={tier.name}
            className={`relative flex flex-col p-6 ${
              tier.highlight ? "border-emerald-500 ring-1 ring-emerald-500" : ""
            }`}
          >
            {tier.highlight && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-black">
                Most Popular
              </span>
            )}
            <h3 className="text-lg font-semibold text-foreground">{tier.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{tier.desc}</p>
            <div className="mt-4 mb-6">
              <span className="text-4xl font-bold text-foreground">{tier.price}</span>
              <span className="text-sm text-muted-foreground">{tier.period}</span>
            </div>
            <ul className="flex-1 space-y-3">
              {tier.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 shrink-0 text-emerald-500" />
                  {f}
                </li>
              ))}
            </ul>
            <Button
              size="md"
              className={`mt-8 w-full ${
                tier.highlight
                  ? "bg-emerald-500 text-black hover:bg-emerald-400"
                  : "bg-zinc-800 text-zinc-100 hover:bg-zinc-700"
              }`}
            >
              {tier.cta}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
