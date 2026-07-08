"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    fbq?: (
      method: "track" | "init",
      eventName: string,
      parameters?: Record<string, string | number | boolean>,
    ) => void;
  }
}

const heroBullets = [
  "140+ Five-Star Google Reviews",
  "Same-Day Digital Reports",
  "Serving Metro Atlanta within a 50-mile radius",
  "Licensed & Insured",
  "Drone Roof Inspections Included",
];

const formTrustItems = [
  "140+ Reviews",
  "Same-Day Reports",
  "Licensed & Insured",
  "Local Atlanta Inspector",
];

const pricingPlans = [
  {
    title: "Homes Under 2,500 Sq Ft",
    price: "$395 Flat Rate",
    button: "Request My Inspection",
    featured: true,
  },
  {
    title: "Homes 2,500-4,000 Sq Ft",
    price: "$450 Flat Rate",
    button: "Request My Inspection",
    featured: false,
  },
  {
    title: "Homes Over 4,000 Sq Ft",
    price: "Call for Pricing",
    description: "Every home is unique. Contact us for a quick custom quote.",
    button: "Request a Quote",
    featured: false,
  },
];

const inspectionCategories = [
  {
    title: "Exterior & Structure",
    items: [
      "Foundation",
      "Slab",
      "Structural framing",
      "Exterior siding",
      "Brick veneer",
      "Trim",
      "Exterior doors",
      "Windows",
      "Garage doors",
      "Driveway",
      "Walkways",
      "Porches",
      "Patios",
      "Landscaping",
      "Grading",
      "Drainage",
      "Erosion",
    ],
  },
  {
    title: "Roof",
    items: [
      "Roof covering",
      "Shingles",
      "Flashing",
      "Roof penetrations",
      "Drone inspection",
      "Gutters",
      "Downspouts",
      "Roof ventilation",
      "General roof condition",
    ],
  },
  {
    title: "Plumbing",
    items: [
      "Main water line",
      "Water pressure",
      "Supply piping",
      "Drain piping",
      "Vent piping",
      "Fixtures",
      "Faucets",
      "Toilets",
      "Tubs",
      "Showers",
      "Water heater",
      "Water shutoff",
      "Hose bibs",
    ],
  },
  {
    title: "Electrical",
    items: [
      "Electrical panel",
      "Main disconnect",
      "Circuit breakers",
      "Grounding",
      "Electrical wiring",
      "Switches",
      "Receptacles",
      "Lighting",
      "Ceiling fans",
      "Service capacity",
    ],
  },
  {
    title: "HVAC",
    items: [
      "Heat pump",
      "Air conditioner",
      "Furnace",
      "Thermostat",
      "Evaporator coil",
      "Condensate drain",
      "Air filter",
      "Supply vents",
      "Return vents",
      "Temperature split testing",
      "Heating performance",
    ],
  },
  {
    title: "Attic",
    items: [
      "Attic framing",
      "Insulation",
      "Ventilation",
      "Soffit vents",
      "Ridge vents",
      "Vapor barrier",
      "Visible moisture",
      "General attic condition",
    ],
  },
  {
    title: "Interior",
    items: [
      "Walls",
      "Ceilings",
      "Floors",
      "Interior doors",
      "Exterior doors",
      "Windows",
      "Smoke detectors",
      "General finishes",
    ],
  },
  {
    title: "Kitchen",
    items: [
      "Sink",
      "Faucets",
      "Drain",
      "Cabinets",
      "Countertops",
      "Cooktop",
      "Oven",
      "Microwave",
      "Dishwasher",
      "Garbage disposal",
      "Vent hood",
      "Refrigerator",
    ],
  },
  {
    title: "Bathrooms",
    items: [
      "Sink",
      "Toilet",
      "Tub",
      "Shower",
      "Drain",
      "Fixtures",
      "Ventilation",
      "Cabinets",
    ],
  },
  {
    title: "Garage",
    items: [
      "Garage door",
      "Garage opener",
      "Garage floor",
      "Fire separation wall",
      "Garage walls",
      "Garage ceiling",
    ],
  },
  {
    title: "Laundry",
    items: ["Washer plumbing", "Dryer outlet", "Dryer vent", "Laundry drain"],
  },
];

const includedFeatures = [
  "Drone Roof Inspection",
  "Same-Day Digital Report",
  "High Resolution Photos",
  "200+ Inspection Points",
  "Maintenance Recommendations",
  "Safety Concern Identification",
  "Repair Recommendations",
  "Professional Summary",
  "Easy-to-Understand Report",
  "Post Inspection Support",
];

const inspectorBullets = [
  "Hundreds of Atlanta inspections completed",
  "Same-day digital reports",
  "Clear explanations in plain English",
  "Trusted by buyers, agents, and investors",
  "Local expertise throughout Metro Atlanta",
];

const reviews = [
  {
    quote:
      "The report was clear, detailed, and delivered quickly. We felt confident about what to ask for before closing.",
    name: "Danielle M.",
  },
  {
    quote:
      "Toussaint was professional, responsive, and very thorough. My buyers understood the home without feeling overwhelmed.",
    name: "Marcus R.",
  },
  {
    quote:
      "Great communication and practical notes. The inspection helped us move fast on a tight contract timeline.",
    name: "Priya S.",
  },
];

const buyerReasons = [
  "Same-Day Reports",
  "Drone Roof Inspections",
  "Flexible Scheduling",
  "Detailed Digital Reports",
  "Local Market Experience",
  "Responsive Communication",
];

const faqs = [
  {
    question: "How long does the inspection take?",
    answer:
      "Most inspections take about two to four hours depending on the home's size, age, systems, and accessibility.",
  },
  {
    question: "Can my Realtor attend?",
    answer:
      "Yes. Your Realtor is welcome to attend, and we can coordinate access directly after your request is received.",
  },
  {
    question: "How quickly do I receive my report?",
    answer:
      "Most clients receive a digital report the same day, including photos, clear notes, and priority recommendations.",
  },
  {
    question: "What happens after the inspection?",
    answer:
      "You receive a clear report and can use it to understand the home, ask better questions, and discuss next steps with your agent.",
  },
  {
    question: "Do you inspect new construction?",
    answer:
      "Yes. New homes can still have defects, missed details, or installation issues that are worth documenting before closing.",
  },
  {
    question: "Do you inspect older homes?",
    answer:
      "Yes. Older homes are inspected carefully with attention to structure, moisture, electrical, plumbing, HVAC, roof, and safety conditions.",
  },
  {
    question: "Do I need to be present?",
    answer:
      "You do not have to be present, but attending the final walkthrough portion can help you understand the most important findings.",
  },
  {
    question: "How much does it cost?",
    answer:
      "Pricing depends on the property size, age, and inspection scope. Submit the form and we will confirm the quote before scheduling.",
  },
  {
    question: "What counties do you serve?",
    answer:
      "HDMK Greater Atlanta serves Metro Atlanta and a 50-mile radius of downtown, including many surrounding counties.",
  },
];

const serviceAreas = [
  "Gwinnett",
  "Fulton",
  "Dekalb",
  "Cobb",
  "Henry",
  "Clayton",
  "Douglas",
  "Rockdale",
  "Forsyth",
  "Cherokee",
  "Hall",
  "Jackson",
  "Barrow",
  "Walton",
  "Newton",
  "50-mile service radius",
];

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "HDMK Inspection Services Greater Atlanta",
  image: "https://hdmk-atlanta.com/assets/hdmk-full-logo.png",
  description:
    "Home inspection services for buyers, agents, sellers, and investors across Metro Atlanta.",
  areaServed: "Metro Atlanta within a 50-mile radius of downtown Atlanta",
  founder: {
    "@type": "Person",
    name: "Toussaint Hill",
  },
  makesOffer: {
    "@type": "Offer",
    itemOffered: {
      "@type": "Service",
      name: "Home Inspection",
      serviceType: "Home Inspection",
      areaServed: "Metro Atlanta",
    },
  },
};

function Field({
  label,
  name,
  type = "text",
  wide = false,
  required = true,
}: {
  label: string;
  name: string;
  type?: string;
  wide?: boolean;
  required?: boolean;
}) {
  return (
    <label className={wide ? "field field-wide" : "field"}>
      <span>
        {label}
        {required ? <em>Required</em> : <em>Optional</em>}
      </span>
      <input name={name} type={type} required={required} />
    </label>
  );
}

function InspectionAccordion({
  title,
  items,
  defaultOpen = false,
}: {
  title: string;
  items: string[];
  defaultOpen?: boolean;
}) {
  return (
    <details className="inspection-accordion" open={defaultOpen}>
      <summary>
        <span>{title}</span>
        <i aria-hidden="true" />
      </summary>
      <div className="accordion-panel">
        {items.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </details>
  );
}

export default function Home() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [activeReview, setActiveReview] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveReview((current) => (current + 1) % reviews.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError("");
    setIsSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const searchParams = new URLSearchParams(window.location.search);
    const trackingKeys = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
      "fbclid",
      "gclid",
    ];

    trackingKeys.forEach((key) => {
      const value = searchParams.get(key);

      if (value) {
        formData.set(key, value);
      }
    });

    formData.set("pageUrl", window.location.href);

    try {
      const response = await fetch("/api/inspection-request", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const result = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(result?.error || "We could not submit your request.");
      }

      window.fbq?.("track", "Lead", {
        content_name: "Inspection Request",
        content_category: "Home Inspection",
      });

      router.push("/thank-you");
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again or call us directly.",
      );
      setIsSubmitting(false);
    }
  };

  const currentReview = reviews[activeReview];

  return (
    <div className="site-shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />

      <header className="topbar">
        <a className="brand" href="#top" aria-label="HDMK Inspection Services Greater Atlanta">
          <Image
            src="/assets/hdmk-full-logo.png"
            alt="HDMK Inspection Services"
            width={260}
            height={98}
            priority
          />
        </a>
        <nav aria-label="Page sections">
          <a href="#pricing">Pricing</a>
          <a href="#services">Included</a>
          <a href="#inspector">Inspector</a>
          <a href="#reviews">Reviews</a>
          <a href="#faq">FAQ</a>
        </nav>
        <a className="button button-primary topbar-cta" href="#contact-form">
          Request My Inspection
        </a>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-inner">
            <div className="hero-copy">
              {/*
                Alternate headlines for future A/B testing:
                - Know exactly what you're buying before closing.
                - Avoid expensive surprises after moving in.
                - Buy your next home with confidence.
              */}
              <h1>Buying a Home in Atlanta?</h1>
              <p className="hero-subhead">
                Request a thorough home inspection with same-day reports from one of Atlanta&apos;s highest-rated local inspectors.
              </p>
              <div className="trust-row" aria-label="Trust highlights">
                {heroBullets.map((item) => (
                  <div key={item}>
                    <span />
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <aside id="contact-form" className="lead-card" aria-labelledby="form-title">
              <div className="form-heading">
                <h2 id="form-title">Get On The Schedule.</h2>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <Field label="First Name" name="firstName" />
                  <Field label="Last Name" name="lastName" />
                  <Field label="Phone" name="phone" type="tel" />
                  <Field label="Email" name="email" type="email" />
                  <Field label="Property Address" name="propertyAddress" wide />
                  <Field label="Preferred Inspection Date" name="preferredInspectionDate" type="date" required={false} />
                  <label className="field">
                    <span>
                      Buyer / Seller / Agent / Investor
                      <em>Optional</em>
                    </span>
                    <select name="leadType" defaultValue="">
                      <option value="" disabled>
                        Select one
                      </option>
                      <option>Buyer</option>
                      <option>Seller</option>
                      <option>Agent</option>
                      <option>Investor</option>
                    </select>
                  </label>
                  <label className="field field-wide">
                    <span>
                      Message
                      <em>Optional</em>
                    </span>
                    <textarea name="message" rows={3} />
                  </label>
                </div>
                {submitError ? <p className="form-error">{submitError}</p> : null}
                <button className="button button-primary button-full" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Request My Inspection"}
                </button>
              </form>
              <div className="form-trust-row" aria-label="Trust proof">
                {formTrustItems.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </aside>
          </div>
        </section>

        <section id="pricing" className="section pricing-section">
          <div className="section-heading">
            <h2>Transparent Flat-Rate Pricing</h2>
            <p>Simple pricing. No hidden fees. Same-day digital reports included.</p>
          </div>
          <div className="pricing-grid">
            {pricingPlans.map((plan) => (
              <article
                key={plan.title}
                className={plan.featured ? "pricing-card pricing-card-featured" : "pricing-card"}
              >
                {plan.featured ? <span className="popular-badge">Most Popular</span> : null}
                <h3>{plan.title}</h3>
                <strong>{plan.price}</strong>
                {plan.description ? <p>{plan.description}</p> : null}
                <a className="button button-primary button-full" href="#contact-form">
                  {plan.button}
                </a>
              </article>
            ))}
          </div>
          <div className="price-guarantee">
            <div className="shield-icon" aria-hidden="true" />
            <div>
              <h3>We&apos;ll Beat Any Written Competitor&apos;s Price by $25</h3>
              <p>
                Buying a home is expensive enough.
              </p>
              <p>
                If you&apos;ve received a written quote from another licensed home inspector, we&apos;ll beat their price by $25 while still providing the same thorough inspection, same-day reporting, and outstanding customer service HDMK is known for.
              </p>
            </div>
          </div>
          <p className="pricing-trust-line">
            Premium inspections. Transparent pricing. No hidden fees.
          </p>
        </section>

        <section id="services" className="section inspection-section">
          <div className="section-heading">
            <h2>Over 200 Components Checked During Every Inspection</h2>
            <p>
              Our inspections go far beyond a quick walkthrough. We carefully evaluate every major system and component so you know exactly what you&apos;re buying before closing.
            </p>
          </div>
          <div className="accordion-grid">
            {inspectionCategories.map((category) => (
              <InspectionAccordion
                key={category.title}
                title={category.title}
                items={category.items}
                defaultOpen={false}
              />
            ))}
          </div>
        </section>

        <section className="section included-section">
          <div className="section-heading">
            <h2>Detailed Reporting Built For Real Estate Decisions.</h2>
          </div>
          <div className="feature-grid">
            {includedFeatures.map((feature, index) => (
              <article key={feature} className="feature-card">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{feature}</h3>
              </article>
            ))}
          </div>
        </section>

        <section id="inspector" className="section inspector-section">
          <div className="inspector-card">
            <Image
              src="/assets/toussaint-field-photo.jpg"
              alt="Toussaint Hill, HDMK Greater Atlanta inspector"
              width={420}
              height={420}
              loading="lazy"
            />
            <div>
              <h2>Meet Toussaint Hill</h2>
              <p className="inspector-role">Owner | Home Inspector | Real Estate Professional</p>
              <p>
                Toussaint combines home inspection detail with real estate experience, helping buyers, agents, and investors understand what matters before the next deadline.
              </p>
              <ul className="inspector-list">
                {inspectorBullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <a className="button button-primary" href="#contact-form">
                Request My Inspection
              </a>
            </div>
          </div>
        </section>

        <section id="reviews" className="section reviews-section">
          <div className="section-heading centered">
            <h2>Trusted By Buyers, Agents, And Investors.</h2>
          </div>
          <div className="google-proof">
            <div className="google-badge" aria-label="Google rating badge">
              <span>G</span>
              <div>
                <strong>Google Rating</strong>
                <p>140+ Reviews</p>
              </div>
            </div>
            <article className="featured-review" aria-live="polite">
              <div className="stars" aria-label="Five star review">
                *****
              </div>
              <p>&quot;{currentReview.quote}&quot;</p>
              <strong>{currentReview.name}</strong>
            </article>
          </div>
          <div className="review-dots" aria-label="Review carousel position">
            {reviews.map((review, index) => (
              <button
                key={review.name}
                type="button"
                className={index === activeReview ? "active" : ""}
                aria-label={`Show review ${index + 1}`}
                onClick={() => setActiveReview(index)}
              />
            ))}
          </div>
        </section>

        <section className="section why-section">
          <div className="section-heading">
            <h2>Premium Inspection Support Without Slowing Down Your Contract Timeline.</h2>
          </div>
          <div className="reason-grid">
            {buyerReasons.map((reason) => (
              <article key={reason}>
                <span />
                <h3>{reason}</h3>
              </article>
            ))}
          </div>
        </section>

        <section className="section service-area">
          <div>
            <h2>Serving All Of Metro Atlanta Including A 50 Mile Radius Of Downtown.</h2>
          </div>
          <div className="area-list">
            {serviceAreas.map((area) => (
              <span key={area}>{area}</span>
            ))}
          </div>
        </section>

        <section id="faq" className="section faq-section">
          <div className="section-heading centered">
            <h2>Questions Before Requesting An Appointment.</h2>
          </div>
          <div className="faq-list">
            {faqs.map((faq) => (
              <details key={faq.question}>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="final-cta">
          <h2>Request Your Greater Atlanta Home Inspection.</h2>
          <a className="button button-primary" href="#contact-form">
            Request My Inspection
          </a>
        </section>
      </main>

      <footer>
        <p>Copyright 2026 HDMK Inspection Services Greater Atlanta</p>
        <a href="https://manager.hdmk.net/schedule">
          Already have an account? Schedule directly through HDMK.
        </a>
      </footer>

      <a className="mobile-sticky-cta" href="#contact-form">
        Request My Inspection
      </a>
    </div>
  );
}
