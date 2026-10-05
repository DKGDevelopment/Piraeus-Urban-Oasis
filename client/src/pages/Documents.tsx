import { useEffect } from "react";
import { Link, useSearch } from "wouter";
import { ArrowLeft, ArrowRight, FileText } from "lucide-react";

// Placeholder set until the client supplies the real files; the same documents apply to every unit for now.
// Give an entry a `url` (e.g. a Bunny CDN link to the PDF) to make it viewable.
const documentGroups: { title: string; intro: string; docs: { name: string; note: string; url?: string }[] }[] = [
  {
    title: "Legal documents",
    intro: "Title, permits and contractual documents for you and your legal advisers to review.",
    docs: [
      { name: "Title & ownership documents", note: "Land registry extracts for the plot" },
      { name: "Building permit", note: "Issued permit and approvals" },
      { name: "Draft sale & purchase agreement", note: "Standard terms, subject to final documentation" },
    ],
  },
  {
    title: "Floor plans",
    intro: "Architectural plans showing the layout of the building and the unit.",
    docs: [
      { name: "Site plan", note: "Buildings, access and landscaping" },
      { name: "Typical floor plan", note: "Unit positions on a typical floor" },
      { name: "Unit floor plan", note: "Dimensioned layout of the selected unit type" },
    ],
  },
  {
    title: "Technical specifications",
    intro: "Construction, materials and performance information.",
    docs: [
      { name: "Technical specifications", note: "Structure, building systems and services" },
      { name: "Materials & finishes schedule", note: "Indicative interior and exterior finishes" },
      { name: "Energy performance", note: "Target energy class and systems" },
    ],
  },
];

export default function Documents() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const building = params.get("building");
  const unit = params.get("unit");
  const backHref = building ? `/explore?building=${encodeURIComponent(building)}` : "/explore";
  const nextHref = `/down-payment${search ? `?${search}` : ""}`;

  useEffect(() => window.scrollTo(0, 0), []);

  return (
    <main className="docs-shell">
      <header className="explore-bar">
        <Link href={backHref} className="explore-back"><ArrowLeft size={16} /> Back to 3D view</Link>
        <span className="explore-title">Urban Piraeus Oasis — Documents</span>
      </header>

      <section className="docs-intro">
        <p className="eyebrow">Documents room</p>
        <h1>Review before<br /><em>you commit.</em></h1>
        {(building || unit) && <p className="docs-context">{[building && `Building ${building}`, unit].filter(Boolean).join(" · ")}</p>}
        <p className="docs-lede">Everything you and your lawyers need to inspect the property. Documents are being prepared and will be published here as they become available.</p>
      </section>

      {documentGroups.map((group, index) => (
        <section className="docs-group" key={group.title}>
          <div className="docs-group-head">
            <span>0{index + 1}</span>
            <h2>{group.title}</h2>
            <p>{group.intro}</p>
          </div>
          <ul>
            {group.docs.map((doc) => (
              <li key={doc.name}>
                <FileText size={18} />
                <div>
                  <strong>{doc.name}</strong>
                  <span>{doc.note}</span>
                </div>
                {doc.url ? (
                  <a href={doc.url} target="_blank" rel="noreferrer">View PDF</a>
                ) : (
                  <em>Coming soon</em>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}

      <div className="docs-next">
        <Link href={nextHref} className="docs-next-button">Continue to down payment <ArrowRight size={16} /></Link>
      </div>

      <p className="docs-disclaimer">All documents are provided for information and due-diligence purposes. Plans and specifications are indicative and subject to final approvals and documentation.</p>
    </main>
  );
}
