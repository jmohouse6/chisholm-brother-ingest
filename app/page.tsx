"use client";

import { FormEvent, useMemo, useState } from "react";

const services = [
  "Interior Painting",
  "Exterior Painting",
  "Cabinet Painting",
  "Historic Restoration",
  "Wood Repair & Restoration",
  "Specialty Finishes",
  "Color Consultation",
  "Commercial Painting",
  "Other"
];

type Status = "idle" | "submitting" | "success" | "error";

export default function EstimatePage() {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [reference, setReference] = useState("");

  const company = useMemo(
    () => ({
      name: process.env.NEXT_PUBLIC_COMPANY_NAME || "Chisholm Brothers Painting",
      phone: process.env.NEXT_PUBLIC_COMPANY_PHONE || "(555) 555-5555",
      email: process.env.NEXT_PUBLIC_COMPANY_EMAIL || "estimates@example.com",
      city: process.env.NEXT_PUBLIC_COMPANY_CITY || "San Diego",
      privacyUrl: process.env.NEXT_PUBLIC_PRIVACY_URL || "#"
    }),
    []
  );

  function toggleService(service: string) {
    setSelectedServices((current) =>
      current.includes(service)
        ? current.filter((item) => item !== service)
        : [...current, service]
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          services: selectedServices,
          submittedFrom: window.location.href,
          referrer: document.referrer || null
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Submission failed.");

      setReference(data.reference);
      setStatus("success");
      form.reset();
      setSelectedServices([]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "We could not submit your request. Please try again."
      );
    }
  }

  if (status === "success") {
    return (
      <main>
        <section className="hero compact">
          <div className="hero-inner">
            <div className="eyebrow">Estimate request received</div>
            <h1>Thank you. We’ll be in touch soon.</h1>
            <p>
              Your request has been delivered to {company.name}. Your reference
              number is <strong>{reference}</strong>.
            </p>
            <button className="button" onClick={() => setStatus("idle")}>
              Submit another project
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="hero">
        <div className="hero-inner">
          <div className="brand-mark">CB</div>
          <div className="eyebrow">Professional painting and restoration</div>
          <h1>Tell us about your project.</h1>
          <p>
            Share a few details and our team will contact you to discuss the
            project and arrange the right next step.
          </p>
          <div className="hero-contact">
            <span>{company.city}</span>
            <a href={`tel:${company.phone}`}>{company.phone}</a>
            <a href={`mailto:${company.email}`}>{company.email}</a>
          </div>
        </div>
      </section>

      <section className="page-shell">
        <form onSubmit={handleSubmit} className="estimate-form">
          <section className="form-section">
            <div className="section-heading">
              <span>01</span>
              <div>
                <h2>Contact information</h2>
                <p>Who should we contact about the project?</p>
              </div>
            </div>
            <div className="grid two">
              <Field label="First name" name="firstName" required />
              <Field label="Last name" name="lastName" required />
              <Field label="Email" name="email" type="email" required />
              <Field label="Mobile phone" name="phone" type="tel" required />
              <Field label="Company, if applicable" name="company" />
              <Select
                label="Preferred contact method"
                name="preferredContact"
                options={["Phone", "Text message", "Email"]}
              />
            </div>
          </section>

          <section className="form-section">
            <div className="section-heading">
              <span>02</span>
              <div>
                <h2>Project location</h2>
                <p>Where will the work be completed?</p>
              </div>
            </div>
            <div className="grid two">
              <div className="full">
                <Field label="Street address" name="address" required />
              </div>
              <Field label="City" name="city" required />
              <Field label="ZIP code" name="zip" required />
              <Select
                label="Property type"
                name="propertyType"
                required
                options={[
                  "Single-family home",
                  "Condo or townhouse",
                  "Historic home",
                  "Rental property",
                  "Commercial property",
                  "Other"
                ]}
              />
              <Select
                label="Occupancy"
                name="occupancy"
                options={["Occupied", "Vacant", "Partially occupied"]}
              />
            </div>
          </section>

          <section className="form-section">
            <div className="section-heading">
              <span>03</span>
              <div>
                <h2>Services needed</h2>
                <p>Select every service that may apply.</p>
              </div>
            </div>
            <div className="service-grid">
              {services.map((service) => (
                <label
                  className={`service-card ${
                    selectedServices.includes(service) ? "selected" : ""
                  }`}
                  key={service}
                >
                  <input
                    type="checkbox"
                    checked={selectedServices.includes(service)}
                    onChange={() => toggleService(service)}
                  />
                  <span className="check">✓</span>
                  <span>{service}</span>
                </label>
              ))}
            </div>
            {selectedServices.length === 0 && (
              <p className="field-note">Please select at least one service.</p>
            )}
          </section>

          <section className="form-section">
            <div className="section-heading">
              <span>04</span>
              <div>
                <h2>Project details</h2>
                <p>Help us understand the scope and timing.</p>
              </div>
            </div>
            <div className="grid two">
              <div className="full">
                <label className="field">
                  <span>Describe the project *</span>
                  <textarea
                    name="description"
                    required
                    rows={6}
                    placeholder="Areas to be painted, current condition, repairs needed, colors, access concerns, or other useful details."
                  />
                </label>
              </div>
              <Select
                label="Estimated investment"
                name="budget"
                options={[
                  "Under $5,000",
                  "$5,000–$10,000",
                  "$10,000–$25,000",
                  "$25,000–$50,000",
                  "$50,000+",
                  "Not sure"
                ]}
              />
              <Select
                label="Desired timing"
                name="timeline"
                options={[
                  "As soon as possible",
                  "Within 30 days",
                  "1–3 months",
                  "3–6 months",
                  "Planning stage"
                ]}
              />
              <Select
                label="Your role"
                name="decisionMaker"
                options={[
                  "Property owner",
                  "Authorized decision-maker",
                  "Property manager",
                  "Tenant",
                  "Other"
                ]}
              />
              <Select
                label="Preferred consultation"
                name="consultationType"
                options={[
                  "On-site estimate",
                  "Phone consultation",
                  "Video consultation"
                ]}
              />
              <Field
                label="Preferred appointment date"
                name="preferredDate"
                type="date"
              />
              <Select
                label="Preferred time"
                name="preferredTime"
                options={["Morning", "Midday", "Afternoon", "Flexible"]}
              />
            </div>
          </section>

          <section className="form-section">
            <div className="section-heading">
              <span>05</span>
              <div>
                <h2>Final details</h2>
                <p>Tell us how you found us and how we may contact you.</p>
              </div>
            </div>
            <div className="grid two">
              <Select
                label="How did you hear about us?"
                name="leadSource"
                options={[
                  "Google search",
                  "Google Ads",
                  "Referral",
                  "Repeat client",
                  "Social media",
                  "Other"
                ]}
              />
              <Field
                label="Referral name, if applicable"
                name="referralName"
              />
              <div className="full">
                <label className="consent">
                  <input name="smsConsent" type="checkbox" value="yes" />
                  <span>
                    I agree to receive text messages about this estimate,
                    appointment updates, and project communication. Message and
                    data rates may apply. Reply STOP to opt out.
                  </span>
                </label>
                <label className="consent">
                  <input name="contactConsent" type="checkbox" required />
                  <span>
                    I agree to be contacted about this estimate request and
                    acknowledge the{" "}
                    <a href={company.privacyUrl} target="_blank">
                      privacy policy
                    </a>
                    .
                  </span>
                </label>
              </div>
            </div>
          </section>

          {status === "error" && <div className="error">{message}</div>}

          <div className="submit-row">
            <div>
              <strong>No-obligation estimate request</strong>
              <span>Your information is sent securely to our team.</span>
            </div>
            <button
              className="button"
              disabled={status === "submitting" || selectedServices.length === 0}
              type="submit"
            >
              {status === "submitting" ? "Sending…" : "Request an estimate"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="field">
      <span>
        {label}
        {required ? " *" : ""}
      </span>
      <input name={name} type={type} required={required} />
    </label>
  );
}

function Select({
  label,
  name,
  options,
  required = false
}: {
  label: string;
  name: string;
  options: string[];
  required?: boolean;
}) {
  return (
    <label className="field">
      <span>
        {label}
        {required ? " *" : ""}
      </span>
      <select name={name} required={required} defaultValue="">
        <option value="">Select an option</option>
        {options.map((option) => (
          <option value={option} key={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
