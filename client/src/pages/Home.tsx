import { useEffect, useState } from "react";
import { ArrowDownRight, ArrowUpRight, ChevronRight, Compass, Leaf, Menu, X } from "lucide-react";

const images = {
  hero: "/images/piraeus-hero.jpg",
  courtyard: "/images/piraeus-courtyard.jpg",
  lounge: "/images/piraeus-lounge.jpg",
  rooftop: "/images/piraeus-rooftop.jpg",
  detail: "/images/piraeus-detail.jpg",
  workplace: "/images/piraeus-workplace.jpg",
};

const buildings = [
  { id: "A", phase: "Initial release", floors: "Indicative 6 levels", mix: "Studios / 1BR / 2BR", detail: "The first address in the oasis, opening toward the planted central court.", image: images.courtyard },
  { id: "B", phase: "Planned phase", floors: "Indicative 6 levels", mix: "1BR / 2BR / 3BR", detail: "A calm residential volume with morning light and a generous shared threshold.", image: images.hero },
  { id: "C", phase: "Planned phase", floors: "Indicative 7 levels", mix: "Studios / 1BR / 2BR", detail: "Compact, connected living with views toward the evolving Piraeus skyline.", image: images.lounge },
  { id: "D", phase: "Planned phase", floors: "Indicative 7 levels", mix: "1BR / 2BR / 3BR", detail: "A family-oriented building balancing privacy, landscape and amenity access.", image: images.rooftop },
  { id: "E", phase: "Planned phase", floors: "Indicative 6 levels", mix: "Studios / 1BR / 2BR", detail: "A flexible typology for residents looking for a more effortless urban base.", image: images.detail },
  { id: "F", phase: "Future release", floors: "Indicative 7 levels", mix: "1BR / 2BR / 3BR", detail: "Designed to complete the western edge of the masterplan.", image: images.courtyard },
  { id: "G", phase: "Future release", floors: "Indicative 6 levels", mix: "Selected larger homes", detail: "A final residential marker with a more private relationship to the horizon.", image: images.rooftop },
];

const residences = [
  { name: "Studios", size: "Indicative 35–48 sqm", copy: "Efficient, light-filled homes for a connected urban life.", image: images.detail },
  { name: "1-bedroom", size: "Indicative 52–68 sqm", copy: "A considered balance of privacy, storage and everyday flexibility.", image: images.lounge },
  { name: "2-bedroom", size: "Indicative 78–96 sqm", copy: "Generous shared living areas designed to adapt over time.", image: images.courtyard },
  { name: "3-bedroom", size: "Indicative 105+ sqm", copy: "Larger residences with room for family life, guests and work.", image: images.rooftop },
];

const rationale = [
  ["01", "Early entry pricing", "Indicative access before later public sales phases, subject to availability and final terms."],
  ["02", "Large-scale development", "A planned ecosystem of nearly 400 residences across seven residential buildings."],
  ["03", "Multiple exit strategies", "Potential to hold for rental income or consider a later-stage resale, subject to market conditions."],
  ["04", "Piraeus growth story", "Participation in a broader district narrative that is evolving around the port, mobility and new urban life."],
];

const timeline = ["Architectural study submitted", "Current project maturation", "Partner network formation", "Initial investor release", "Public sales releases", "Construction phases", "Indicative delivery"];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeBuilding, setActiveBuilding] = useState(0);
  const [activeResidence, setActiveResidence] = useState(0);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Motion note: keep this observer lightweight. It reveals whole editorial chapters;
  // individual tab transitions are handled by keyed media elements below.
  useEffect(() => {
    const shell = document.querySelector<HTMLElement>(".site-shell");
    const sections = Array.from(document.querySelectorAll<HTMLElement>(".site-shell > section:not(.hero-panel)"));
    shell?.classList.add("motion-ready");

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8%" });
    sections.forEach((section) => observer.observe(section));

    let frame = 0;
    const updateParallax = () => {
      const hero = document.querySelector<HTMLElement>(".hero-panel");
      if (hero) hero.style.setProperty("--hero-scroll", `${Math.min(window.scrollY * 0.12, 90)}px`);
      frame = 0;
    };
    const onScroll = () => { if (!frame) frame = window.requestAnimationFrame(updateParallax); };
    window.addEventListener("scroll", onScroll, { passive: true });
    updateParallax();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const building = buildings[activeBuilding];
  const residence = residences[activeResidence];

  return (
    <main className="site-shell">
      <header className={`site-header ${menuOpen ? "is-open" : ""}`}>
        <div className="utility-bar">
          <span className="utility-cell utility-brand">Urban Piraeus Oasis</span>
          <span className="utility-cell utility-fill" aria-hidden="true" />
          <button className="utility-cell utility-cta" onClick={() => scrollTo("contact")}>Investor log in <ArrowUpRight size={13} /></button>
        </div>
        <div className="site-nav">
          <button className="brand-mark" onClick={() => scrollTo("top")} aria-label="Back to top"><span className="brand-monogram">PU</span><span className="brand-name">Urban Piraeus<br />Oasis</span></button>
          <nav className="desktop-nav" aria-label="Primary navigation">
            <button onClick={() => scrollTo("masterplan")}>Masterplan</button><button onClick={() => scrollTo("location")}>Location</button><button onClick={() => scrollTo("residences")}>Residences</button><button onClick={() => scrollTo("investors")}>Investors</button><button onClick={() => scrollTo("overview")}>Gallery</button>
          </nav>
          <button className="nav-cta" onClick={() => scrollTo("contact")}>Request information <ArrowUpRight size={15} /></button>
          <button className="menu-button" onClick={() => setMenuOpen((value) => !value)} aria-label="Toggle menu">{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
          {menuOpen && <div className="mobile-nav">{["overview", "location", "masterplan", "residences", "investors"].map((id, index) => <button key={id} onClick={() => scrollTo(id)}><span>0{index + 1}</span>{id}</button>)}<button className="mobile-nav-contact" onClick={() => scrollTo("contact")}>Request information <ArrowUpRight size={16} /></button></div>}
        </div>
      </header>

      <section id="top" className="hero-panel investor-hero">
        {/* Media note: keep the MP4 external on Bunny CDN; the local poster preserves the design if video is unavailable. */}
        <video className="hero-image" autoPlay muted loop playsInline preload="auto" aria-label="Indicative moving view of Urban Piraeus Oasis overlooking the waterfront">
          <source src="https://piraeusgate.b-cdn.net/kling_20260915_VIDEO__4577_0.mp4" type="video/mp4" />
        </video>
        <div className="hero-copy">
          <h1>Where Business<br />Comes Together</h1>
        </div>
      </section>

      <section id="overview" className="workplace-section">
        <div className="workplace-intro">
          <div className="workplace-copy">
            <p>Located at the entrance of Piraeus, Piraeus Urban Oasis combines exceptional connectivity with four-sided window exposures, bringing abundant natural light and expansive city views to every floor.</p>
            <p>Piraeus Urban Oasis sits within a broader transformation of Piraeus, where residential, hospitality, commercial and lifestyle uses are coming together to create a more connected urban environment.</p>
          </div>
          <div className="workplace-tagline">
            <p className="workplace-tagline-title">Every Morning<br />Looks Different.</p>
            <p className="workplace-scroll">Scroll to Explore</p>
          </div>
        </div>
        <div className="workplace-media">
          <img src={images.workplace} alt="Urban Piraeus Oasis building" />
          <div className="workplace-media-overlay">
            <span>A Workplace</span>
            <span className="workplace-dot" aria-hidden="true" />
            <span>That Works</span>
          </div>
        </div>
        <div className="workplace-stats">
          <div><span>Rentable area</span><strong>648,000 sf</strong></div>
          <div><span>Total floors</span><strong>31</strong></div>
          <div><span>Year renovated</span><strong>2021</strong></div>
        </div>
      </section>

      <section className="ink-section vision-panel"><div className="section-kicker light"><span>01</span><span>The vision</span></div><div className="intro-grid"><div className="intro-title"><p className="eyebrow light">A new residential community</p><h2>Quality living,<br /><span>within reach.</span></h2></div><div className="intro-copy"><p className="large-copy">Urban Piraeus Oasis brings together contemporary architecture, different types of homes and shared spaces that make everyday life feel more complete.</p><p className="body-copy muted-light">The project is conceived as a connected residential destination within the broader, evolving Piraeus ecosystem — a place where landscape, amenities and access work together.</p><button className="text-link light-link" onClick={() => scrollTo("location")}>Why Piraeus <ArrowDownRight size={17} /></button></div></div><div className="outline-words" aria-hidden="true"><span>OASIS</span><span>OASIS</span></div></section>

      <section id="location" className="location-section location-investor"><div className="location-copy"><div className="section-kicker"><span>02</span><span>Why Piraeus</span></div><p className="eyebrow">The location</p><h2>Connected to<br /><em>what’s next.</em></h2><p className="large-copy dark-copy">Piraeus is a city in transition — a port, a mobility hub and an increasingly important part of the wider Athens urban story.</p><div className="reasons-list"><div><span>01</span><strong>Port city momentum</strong><p>A major gateway with a distinct local identity and an expanding economic ecosystem.</p></div><div><span>02</span><strong>New urban life</strong><p>Residential, hospitality and public-realm investment are reshaping the experience of the city.</p></div><div><span>03</span><strong>Mobility by nature</strong><p>A connected metropolitan location with access to the port, rail and wider Athens network.</p></div><div><span>04</span><strong>Everyday relevance</strong><p>A real city with services, culture, education and the Aegean at its edge.</p></div></div></div><div className="map-card location-map" aria-label="Indicative map of Urban Piraeus Oasis and surrounding points"><div className="map-grid" /><div className="map-orbit orbit-one" /><div className="map-orbit orbit-two" /><div className="map-pin"><span>PU</span><i /></div><div className="map-labels"><span className="label-oasis">Project site</span><span className="label-port">Piraeus Port</span><span className="label-sea">Aegean Sea</span><span className="label-metro">Metro / rail</span><span className="label-athens">Athens</span><span className="label-airport">Airport</span></div><div className="map-compass"><Compass size={18} /><span>N</span></div><p className="map-note">Indicative location diagram.<br />Distances and travel times to be confirmed.</p></div></section>

      <section id="masterplan" className="masterplan-section"><div className="section-kicker"><span>03</span><span>Masterplan</span></div><div className="gallery-head"><div><p className="eyebrow">Seven buildings / one ecosystem</p><h2>Explore the<br /><em>masterplan.</em></h2></div><p className="body-copy">An indicative overview for early conversations. Building mix, floors, layouts and phasing remain subject to final approvals and availability.</p></div><div className="masterplan-layout"><div className="masterplan-visual"><div className="masterplan-water" /><div className="masterplan-road road-one" /><div className="masterplan-road road-two" /><div className="masterplan-park" /><div className="building-cluster">{buildings.map((item, index) => <button key={item.id} className={`building-block building-${item.id.toLowerCase()} ${index === activeBuilding ? "active" : ""}`} onClick={() => setActiveBuilding(index)} aria-label={`Explore Building ${item.id}`}>{item.id}</button>)}</div><span className="masterplan-label label-center">Central landscape</span><span className="masterplan-label label-south">Piraeus / waterfront direction</span></div><div className="building-detail"><div className="building-detail-image"><img key={building.id} className="slide-media" src={building.image} alt={`Indicative render for Building ${building.id}`} /><span className="image-label">Building {building.id} / Indicative</span></div><p className="eyebrow">Building {building.id} · {building.phase}</p><h3>{building.detail}</h3><div className="building-specs"><div><span>Height</span><strong>{building.floors}</strong></div><div><span>Unit mix</span><strong>{building.mix}</strong></div></div><button className="text-link" onClick={() => setLightbox(building.image)}>View indicative render <ArrowUpRight size={17} /></button></div></div><p className="disclaimer">Indicative masterplan and building information. Final building count, unit mix, specifications and phasing are subject to design development, approvals and availability.</p></section>

      <section id="residences" className="rhythm-section residence-section"><div className="section-kicker light"><span>04</span><span>The residences</span></div><div className="rhythm-head"><div><p className="eyebrow light">A home for every stage</p><h2>Find your<br /><em>right size.</em></h2></div><p className="body-copy muted-light">A range of residential typologies designed for accessible, contemporary urban living.</p></div><div className="space-switcher residence-switcher" role="tablist" aria-label="Explore residence types">{residences.map((item, index) => <button key={item.name} className={index === activeResidence ? "active" : ""} onClick={() => setActiveResidence(index)} role="tab" aria-selected={index === activeResidence}><span>0{index + 1}</span>{item.name}<ChevronRight size={15} /></button>)}</div><div className="space-feature residence-feature"><div className="space-image"><img key={residence.name} className="slide-media" src={residence.image} alt={`Indicative ${residence.name} residence interior`} /><span className="image-label">{residence.name} / Indicative</span></div><div className="space-copy"><p className="eyebrow light">{residence.size}</p><h3>{residence.name}</h3><p className="body-copy muted-light">{residence.copy}</p><div className="plan-placeholder"><div className="plan-room room-one" /><div className="plan-room room-two" /><div className="plan-room room-three" /><span>Indicative layout</span></div><p className="disclaimer light-disclaimer">Indicative layouts and specifications. Final availability and details are provided upon request.</p></div></div></section>

      <section id="investors" className="investor-section"><div className="section-kicker"><span>05</span><span>Initial investor allocation</span></div><div className="investor-grid"><div><p className="eyebrow">A limited early-investor opportunity</p><h2>Enter early.<br /><em>Think longer.</em></h2><p className="large-copy dark-copy">Approximately 2,500 sqm of selected residential inventory is being made available through a limited network of partners.</p><button className="solid-button terracotta-button" onClick={() => scrollTo("contact")}>Request investor information <ArrowUpRight size={16} /></button></div><div className="opportunity-list"><div><span>01</span><strong>Preferential pre-launch entry pricing</strong><p>Indicative pricing positioned ahead of later public phases, subject to final terms.</p></div><div><span>02</span><strong>Hold for potential rental income</strong><p>A possible strategy for investors seeking a longer-term residential holding.</p></div><div><span>03</span><strong>Potential for later-stage upside</strong><p>Any appreciation is market-dependent and not guaranteed.</p></div><div><span>04</span><strong>Selected inventory, limited release</strong><p>Detailed terms and specific inventory are provided upon request.</p></div></div></div><p className="disclaimer">This is an indicative opportunity summary, not an offer, guarantee or financial advice. Availability, pricing, rental performance and future value are subject to market conditions, final documentation and applicable approvals.</p></section>

      <section className="rationale-section"><div className="section-kicker light"><span>06</span><span>Investment rationale</span></div><div className="rationale-head"><h2>One project.<br /><em>Several paths.</em></h2><p className="body-copy muted-light">A clear, disciplined thesis for engaging with a large-scale residential development at an early stage.</p></div><div className="rationale-grid">{rationale.map(([number, title, copy]) => <div className="rationale-card" key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></div>)}</div></section>

      <section className="timeline-section"><div className="section-kicker"><span>07</span><span>Development status</span></div><div className="timeline-head"><div><p className="eyebrow">Indicative timeline</p><h2>From study<br /><em>to delivery.</em></h2></div><p className="body-copy dark-copy">The project is being matured in phases. Dates and milestones will be updated as they are confirmed.</p></div><div className="timeline">{timeline.map((item, index) => <div className={`timeline-item ${index === 0 ? "complete" : ""}`} key={item}><span>{String(index + 1).padStart(2, "0")}</span><i /><strong>{item}</strong><small>{index === 0 ? "Current status" : "Indicative milestone"}</small></div>)}</div></section>

      <section className="developer-section"><div className="section-kicker light"><span>08</span><span>About DKG Development</span></div><div className="developer-grid"><div><p className="eyebrow light">The team behind the opportunity</p><h2>Built on<br /><em>delivery.</em></h2></div><div><p className="large-copy">DKG Development is building a platform for residential, hospitality and investment opportunities, with a focus on thoughtful places and long-term value creation.</p><p className="body-copy muted-light">The developer profile, completed and ongoing projects, total area under development and representative portfolio will be expanded here with confirmed corporate information.</p><button className="text-link light-link" onClick={() => scrollTo("contact")}>Request the developer profile <ArrowUpRight size={17} /></button></div></div><div className="developer-pillars"><div><Leaf size={18} /><span>Residential</span></div><div><Compass size={18} /><span>Hospitality</span></div><div><ArrowUpRight size={18} /><span>Investment</span></div><div><span className="pillar-plus">+</span><span>Greece / International network</span></div></div></section>

      <section id="contact" className="contact-section contact-investor"><div className="contact-mark"><span>PU</span><Leaf size={20} /></div><div className="contact-grid"><div className="contact-content"><p className="eyebrow light">Initial investor allocation</p><h2>Interested in<br /><em>the opportunity?</em></h2><p className="large-copy muted-light">Share a few details and a member of the team will come back to you with the relevant information.</p><a className="contact-link" href="https://wa.me/306900000000" target="_blank" rel="noreferrer">Contact via WhatsApp <ArrowUpRight size={18} /></a></div><form className="investor-form" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}><div className="form-row"><label>Name<input required name="name" placeholder="Your name" /></label><label>Company<input name="company" placeholder="Company name" /></label></div><div className="form-row"><label>Country / market<input name="country" placeholder="Country or market" /></label><label>Email<input required type="email" name="email" placeholder="you@company.com" /></label></div><div className="form-row"><label>Phone / WhatsApp<input name="phone" placeholder="+30 ..." /></label><label>Investor profile<select name="profile" defaultValue=""><option value="" disabled>Select one</option><option>Private investor</option><option>Family office</option><option>Institutional investor</option><option>Partner / advisor</option></select></label></div><label>Indicative interest<textarea name="message" rows={3} placeholder="Tell us what you would like to explore" /></label><div className="form-actions"><button type="submit" className="solid-button">{submitted ? "Request received" : "Request further information"} <ArrowUpRight size={16} /></button><button type="button" className="form-link" onClick={() => window.location.href = "mailto:investors@urbanpiraeusoasis.com"}>Schedule a call</button></div>{submitted && <p className="form-success">Thank you. Your request has been captured for the project team.</p>}<p className="form-note">Your details will be shared with the designated project contact and relevant CRM workflow.</p></form></div><div className="contact-footer"><span>UPO — 01</span><span>© 2026 Urban Piraeus Oasis</span><span>Privacy / Terms</span></div></section>

      {lightbox && <div className="lightbox" role="dialog" aria-modal="true" onClick={() => setLightbox(null)}><button className="lightbox-close" onClick={() => setLightbox(null)} aria-label="Close image"><X size={22} /></button><img src={lightbox} alt="Expanded Urban Piraeus Oasis render" onClick={(event) => event.stopPropagation()} /></div>}
    </main>
  );
}
