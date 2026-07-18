export type EntityId = "chism-brothers" | "chism-commercial";

export interface EntityConfig {
  id: EntityId;
  name: string;
  shortName: string;
  tagline: string;
  prefix: string;
  services: string[];
  propertyTypes: string[];
  heroEyebrow: string;
  heroTitle: string;
  heroBody: string;
  submitLabel: string;
  confirmationTitle: string;
  confirmationBody: string;
}

export const entities: Record<EntityId, EntityConfig> = {
  "chism-brothers": {
    id: "chism-brothers",
    name: "Chism Brothers Painting",
    shortName: "Chism Brothers",
    tagline: "Residential painting and restoration",
    prefix: "CB",
    services: [
      "Interior Painting",
      "Exterior Painting",
      "Cabinet Painting",
      "Historic Restoration",
      "Wood Repair & Restoration",
      "Specialty Finishes",
      "Color Consultation",
      "Other"
    ],
    propertyTypes: [
      "Single-family home",
      "Condo or townhouse",
      "Historic home",
      "Rental property",
      "Other"
    ],
    heroEyebrow: "Residential painting and restoration",
    heroTitle: "Tell us about your project.",
    heroBody:
      "Share a few details and our team will contact you to discuss the project and arrange the right next step.",
    submitLabel: "Request an estimate",
    confirmationTitle: "Thank you. We’ll be in touch soon.",
    confirmationBody:
      "Your request has been delivered to {company}. Your reference number is {reference}."
  },
  "chism-commercial": {
    id: "chism-commercial",
    name: "Chism Commercial Painting and Contracting",
    shortName: "Chism Commercial",
    tagline: "Commercial painting and contracting",
    prefix: "CC",
    services: [
      "Interior Commercial Painting",
      "Exterior Commercial Painting",
      "Tenant Improvement",
      "New Construction Painting",
      "Repaint & Maintenance",
      "Waterproofing & Coatings",
      "Wallcovering",
      "Specialty Finishes",
      "Other"
    ],
    propertyTypes: [
      "Office building",
      "Retail / storefront",
      "Multi-family / HOA",
      "Industrial / warehouse",
      "Hospitality / restaurant",
      "Medical / healthcare",
      "Educational / institutional",
      "Other"
    ],
    heroEyebrow: "Commercial painting and contracting",
    heroTitle: "Tell us about your project.",
    heroBody:
      "Share a few details about your commercial project and our team will contact you to discuss scope, timing, and next steps.",
    submitLabel: "Request a quote",
    confirmationTitle: "Thank you. We’ll be in touch soon.",
    confirmationBody:
      "Your request has been delivered to {company}. Your reference number is {reference}."
  }
};

export const defaultEntityId: EntityId = "chism-brothers";

export function getEntity(id: EntityId | string): EntityConfig {
  const key = id as EntityId;
  if (entities[key]) return entities[key];
  return entities[defaultEntityId];
}

export const entityIds = Object.keys(entities) as EntityId[];

export const entityLabels: Record<EntityId, string> = {
  "chism-brothers": "Residential",
  "chism-commercial": "Commercial"
};
