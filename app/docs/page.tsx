import Breadcrumb from "@/components/Breadcrumb";
import { Card } from "@/components/ui/card";

const sections = [
  {
    title: "Getting Started",
    content:
      "Connect your creator platforms to start tracking metrics across YouTube, Twitter, Newsletter, and more. Use the navigation sidebar to switch between dashboards.",
  },
  {
    title: "API Integration",
    content:
      "The CreativeTreasury API allows you to pull your analytics data programmatically. Use the API_SECRET_KEY from your settings to authenticate requests. Endpoints include /api/metrics, /api/revenue, and /api/audience.",
  },
  {
    title: "FAQs",
    content:
      "Q: How often is data refreshed?\nA: Metrics update every 24 hours.\n\nQ: Can I export my data?\nA: Yes, use the Export CSV button on any chart or table.\n\nQ: Is my data secure?\nA: All data is encrypted at rest and in transit.",
  },
];

export default function DocsPage() {
  return (
    <div className="p-8 max-w-3xl">
      <Breadcrumb segments={[{ label: "Home" }, { label: "Docs" }]} />
      <h1 className="heading-page mb-6">Documentation</h1>
      <div className="space-y-6">
        {sections.map((s) => (
          <Card key={s.title} className="p-6">
            <h2 className="mb-2 text-sm font-semibold text-foreground">{s.title}</h2>
            <p className="text-sm whitespace-pre-line text-muted-foreground">{s.content}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
