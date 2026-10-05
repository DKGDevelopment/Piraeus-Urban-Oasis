import { useEffect } from "react";
import { Link, useSearch } from "wouter";
import { ArrowLeft, ArrowRight } from "lucide-react";

// Placeholder steps until the client supplies the agreement terms (amount, timeline, refund conditions).
const steps = [
  { title: "Reserve your unit", copy: "Details of how a unit is reserved will be published here." },
  { title: "Sign the down-payment agreement", copy: "Details of the standard agreement and its key terms will be published here." },
  { title: "Transfer the down payment", copy: "Details of the amount, timing and payment method will be published here." },
  { title: "Proceed to the final contract", copy: "Details of the next steps through to the final sale contract will be published here." },
];

export default function DownPayment() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const building = params.get("building");
  const unit = params.get("unit");

  useEffect(() => window.scrollTo(0, 0), []);

  return (
    <main className="docs-shell">
      <header className="explore-bar">
        <Link href={`/documents${search ? `?${search}` : ""}`} className="explore-back"><ArrowLeft size={16} /> Back to documents</Link>
        <span className="explore-title">Urban Piraeus Oasis — Down payment</span>
      </header>

      <section className="docs-intro">
        <p className="eyebrow">Down payment</p>
        <h1>How the down<br /><em>payment works.</em></h1>
        {(building || unit) && <p className="docs-context">{[building && `Building ${building}`, unit].filter(Boolean).join(" · ")}</p>}
        <p className="docs-lede">A step-by-step guide to the down-payment agreement. Full terms are being finalised and will be published here.</p>
      </section>

      <section className="docs-group">
        <div className="docs-group-head">
          <span>01</span>
          <h2>The process</h2>
          <p>Placeholder outline — content to follow.</p>
        </div>
        <ol className="dp-steps">
          {steps.map((step, index) => (
            <li key={step.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <strong>{step.title}</strong>
                <p>{step.copy}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <div className="docs-next">
        <Link href={`/agreement${search ? `?${search}` : ""}`} className="docs-next-button">Fill in agreement details <ArrowRight size={16} /></Link>
      </div>

      <p className="docs-disclaimer">This page is an indicative overview, not an offer or a binding agreement. Terms are subject to final documentation.</p>
    </main>
  );
}
