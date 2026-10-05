import { useEffect, useState, type FormEvent } from "react";
import { Link, useSearch } from "wouter";
import { ArrowLeft } from "lucide-react";
import { unitTypes } from "@/data/unitTypes";

const buildingKeys = ["N1", "N2", "N3", "N4", "N5"];

const personalFields = [
  { name: "firstName", label: "Name", autoComplete: "given-name" },
  { name: "lastName", label: "Surname", autoComplete: "family-name" },
  { name: "fatherName", label: "Father's name", autoComplete: "off" },
  { name: "idNumber", label: "ID number", autoComplete: "off" },
  { name: "country", label: "Country", autoComplete: "country-name" },
] as const;

type Details = Record<string, string>;

// Test form for management review: submission only shows a summary on screen. Nothing is sent or stored.
export default function Agreement() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const [building, setBuilding] = useState(buildingKeys.includes(params.get("building") ?? "") ? params.get("building")! : "N1");
  const [unitType, setUnitType] = useState(unitTypes.some((u) => u.name === params.get("unit")) ? params.get("unit")! : unitTypes[0].name);
  const [details, setDetails] = useState<Details>({});
  const [submitted, setSubmitted] = useState<Details | null>(null);
  const price = unitTypes.find((u) => u.name === unitType)?.ticket ?? "";

  useEffect(() => window.scrollTo(0, 0), [submitted]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const entered = Object.fromEntries(new FormData(event.currentTarget)) as Details;
    setDetails(entered);
    setSubmitted(entered);
  };

  return (
    <main className="docs-shell">
      <header className="explore-bar">
        <Link href={`/down-payment${search ? `?${search}` : ""}`} className="explore-back"><ArrowLeft size={16} /> Back to down payment</Link>
        <span className="explore-title">Urban Piraeus Oasis — Agreement</span>
      </header>

      <section className="docs-intro">
        <p className="eyebrow">Down-payment agreement · Test form</p>
        <h1>Your agreement<br /><em>details.</em></h1>
        <p className="docs-lede">These details are used to prepare the standard down-payment agreement for review. This is a demonstration form — nothing you enter is sent or stored.</p>
      </section>

      {submitted ? (
        <section className="docs-group agreement-summary">
          <div className="docs-group-head">
            <span>✓</span>
            <h2>Test submission received</h2>
            <p>In the live version this would be sent to the team to prepare your agreement. Nothing has been sent or stored.</p>
          </div>
          <div>
            <dl>
              {[
                ["Building", submitted.building],
                ["Unit type", submitted.unitType],
                ["Unit #", submitted.unitNumber],
                ["Indicative price", submitted.price],
                ...personalFields.map((f) => [f.label, submitted[f.name]]),
                ["Address", submitted.address],
              ].map(([label, value]) => (
                <div key={label}><dt>{label}</dt><dd>{value || "—"}</dd></div>
              ))}
            </dl>
            <button type="button" className="agreement-secondary" onClick={() => setSubmitted(null)}>Edit details</button>
          </div>
        </section>
      ) : (
        <form className="agreement-form" onSubmit={handleSubmit}>
          <section className="docs-group">
            <div className="docs-group-head">
              <span>01</span>
              <h2>The unit</h2>
              <p>Price is filled in automatically from the unit type you selected.</p>
            </div>
            <div className="agreement-fields">
              <label>Building
                <select name="building" value={building} onChange={(e) => setBuilding(e.target.value)}>
                  {buildingKeys.map((key) => <option key={key} value={key}>Building {key}</option>)}
                </select>
              </label>
              <label>Unit type
                <select name="unitType" value={unitType} onChange={(e) => setUnitType(e.target.value)}>
                  {unitTypes.map((u) => <option key={u.name} value={u.name}>{u.name} · {u.size}</option>)}
                </select>
              </label>
              <label>Unit #
                <input required name="unitNumber" defaultValue={details.unitNumber} placeholder={`e.g. ${building}-204`} />
              </label>
              <label>Price (indicative)
                <input name="price" value={price} readOnly />
              </label>
            </div>
          </section>

          <section className="docs-group">
            <div className="docs-group-head">
              <span>02</span>
              <h2>Your details</h2>
              <p>As they appear on your identity document.</p>
            </div>
            <div className="agreement-fields">
              {personalFields.map((field) => (
                <label key={field.name}>{field.label}
                  <input required name={field.name} defaultValue={details[field.name]} autoComplete={field.autoComplete} />
                </label>
              ))}
              <label className="agreement-wide">Address
                <textarea required name="address" defaultValue={details.address} rows={3} autoComplete="street-address" />
              </label>
            </div>
          </section>

          <div className="docs-next">
            <button type="submit" className="docs-next-button">Submit details (test)</button>
          </div>
        </form>
      )}

      <p className="docs-disclaimer">Prices are indicative ranges and not an offer. The final agreement is prepared and reviewed by the team before anything is signed.</p>
    </main>
  );
}
