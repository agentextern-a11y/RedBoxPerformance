import { Link } from "wouter";
import { Check, Zap, Shield, Users } from "lucide-react";
import { Show } from "@clerk/react";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Get started with basic vehicle monitoring",
    icon: Zap,
    color: "border-gray-200",
    badge: null,
    features: [
      "1 vehicle",
      "Basic OBD diagnostics",
      "Live dashboard (limited)",
      "5 sessions per month",
      "Community support",
    ],
    cta: "Get Started Free",
    ctaVariant: "outline" as const,
    href: `${basePath}/sign-up`,
  },
  {
    name: "Pro",
    price: "$19",
    period: "per month",
    description: "Full AI diagnostics for serious drivers",
    icon: Shield,
    color: "border-red-600",
    badge: "Most Popular",
    features: [
      "Up to 5 vehicles",
      "Full AI fault diagnostics",
      "Predictive maintenance",
      "Unlimited live sessions",
      "ECU Map Vault access",
      "Real-time WebSocket alerts",
      "Priority support",
    ],
    cta: "Start Pro Trial",
    ctaVariant: "primary" as const,
    href: `${basePath}/sign-up`,
  },
  {
    name: "Team",
    price: "$79",
    period: "per month",
    description: "Built for workshops and fleets",
    icon: Users,
    color: "border-gray-200",
    badge: null,
    features: [
      "Unlimited vehicles",
      "All Pro features",
      "Team collaboration",
      "Custom ECU map uploads",
      "Fleet health dashboard",
      "API access",
      "Dedicated account manager",
    ],
    cta: "Contact Sales",
    ctaVariant: "outline" as const,
    href: `${basePath}/sign-up`,
  },
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gray-900 py-20 text-center">
        <div className="container mx-auto px-4">
          <div className="text-red-500 font-bold tracking-[0.2em] text-sm uppercase mb-4">
            Simple Pricing
          </div>
          <h1 className="font-display font-bold text-5xl md:text-6xl uppercase tracking-tight text-white mb-6">
            Choose Your <span className="text-red-500">Plan</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Start free, upgrade when you need more power. No hidden fees.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => {
              const Icon = plan.icon;
              return (
                <div
                  key={plan.name}
                  className={`relative border-2 ${plan.color} rounded-lg overflow-hidden flex flex-col ${
                    plan.badge ? "shadow-xl shadow-red-600/10 scale-105" : ""
                  }`}
                >
                  {plan.badge && (
                    <div className="bg-red-600 text-white text-xs font-bold uppercase tracking-widest text-center py-2">
                      {plan.badge}
                    </div>
                  )}
                  <div className="p-8 flex flex-col flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={`p-2 rounded ${plan.badge ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600"}`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <h2 className="font-display font-bold text-2xl uppercase tracking-tight text-gray-900">
                        {plan.name}
                      </h2>
                    </div>

                    <div className="mb-2">
                      <span className="font-display font-bold text-5xl text-gray-900">
                        {plan.price}
                      </span>
                      <span className="text-gray-500 ml-2 text-sm">
                        /{plan.period}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm mb-8">
                      {plan.description}
                    </p>

                    <ul className="space-y-3 mb-10 flex-1">
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-center gap-3 text-sm text-gray-700"
                        >
                          <Check className="h-4 w-4 text-red-600 shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Show when="signed-out">
                      <Link href={plan.href}>
                        <button
                          className={`w-full py-3 px-6 font-display font-bold uppercase tracking-wide rounded transition-all ${
                            plan.ctaVariant === "primary"
                              ? "bg-red-600 hover:bg-red-700 text-white"
                              : "border-2 border-gray-900 hover:bg-gray-900 hover:text-white text-gray-900"
                          }`}
                        >
                          {plan.cta}
                        </button>
                      </Link>
                    </Show>
                    <Show when="signed-in">
                      <Link href="/dashboard">
                        <button
                          className={`w-full py-3 px-6 font-display font-bold uppercase tracking-wide rounded transition-all ${
                            plan.ctaVariant === "primary"
                              ? "bg-red-600 hover:bg-red-700 text-white"
                              : "border-2 border-gray-900 hover:bg-gray-900 hover:text-white text-gray-900"
                          }`}
                        >
                          Go to Dashboard
                        </button>
                      </Link>
                    </Show>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-20 text-center">
            <h2 className="font-display font-bold text-3xl uppercase tracking-tight text-gray-900 mb-4">
              All plans include
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mt-8">
              {[
                "Web Bluetooth & WiFi OBD",
                "Real-time WebSocket feed",
                "Secure data encryption",
                "99.9% uptime SLA",
              ].map((item) => (
                <div
                  key={item}
                  className="flex flex-col items-center gap-2 text-center"
                >
                  <Check className="h-6 w-6 text-red-600" />
                  <span className="text-sm text-gray-600 font-medium">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
