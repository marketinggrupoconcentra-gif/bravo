export interface BrandAsset {
  id: string;
  type: "human" | "vector" | "background" | "data-viz";
  src: string;
  mobileSrc?: string;
  alt: string;
  status: "approved" | "provisional" | "client-required";
  origin: "official" | "generated" | "custom-svg";
  usage: string;
  objectPositionDesktop?: string;
  objectPositionMobile?: string;
  provenance: string;
  dimensions?: { width: number; height: number };
}

export const brandAssets: Record<string, BrandAsset> = {
  // ==========================================================================
  // HUMAN PHOTOGRAPHY ASSETS (STRICT LIMIT: MAX 3 ON HOMEPAGE)
  // ==========================================================================
  "hero-human": {
    id: "bravo-hero-human",
    type: "human",
    src: "/images/brand/human/bravo-hero-human-desktop.webp",
    mobileSrc: "/images/brand/human/bravo-hero-human-mobile.webp",
    alt: "Persona organizando información sobre sus deudas en casa",
    status: "approved",
    origin: "generated",
    usage: "home-hero",
    objectPositionDesktop: "65% 35%",
    objectPositionMobile: "50% 30%",
    provenance: "GENERATED BRAND PHOTOGRAPHY — MODEL (Mexican adult 40yo, middle-class home context, documentary lighting)",
    dimensions: { width: 1600, height: 1067 },
  },
  "household-planning": {
    id: "bravo-household-planning",
    type: "human",
    src: "/images/brand/human/bravo-household-planning.webp",
    alt: "Pareja revisando y organizando sus finanzas en casa",
    status: "approved",
    origin: "generated",
    usage: "home-como-funciona",
    objectPositionDesktop: "50% 50%",
    objectPositionMobile: "50% 40%",
    provenance: "GENERATED BRAND PHOTOGRAPHY — MODEL (Mexican couple 38-42yo, calm collaborative planning, middle-class home)",
    dimensions: { width: 1200, height: 900 },
  },
  "advisor-human": {
    id: "bravo-advisor-human",
    type: "human",
    src: "/images/brand/human/bravo-advisor-human.webp",
    alt: "Asesora conversando con personas sobre su situación financiera",
    status: "approved",
    origin: "generated",
    usage: "home-advisor-section",
    objectPositionDesktop: "50% 45%",
    objectPositionMobile: "50% 35%",
    provenance: "GENERATED BRAND PHOTOGRAPHY — MODEL (Mexican female advisor 35yo, smart casual, modern consultation studio)",
    dimensions: { width: 1200, height: 900 },
  },

  // ==========================================================================
  // VECTOR & BRAND BACKGROUND ASSETS
  // ==========================================================================
  "case-avatar": {
    id: "bravo-case-avatar",
    type: "vector",
    src: "/images/brand/vector/bravo-case-avatar.svg",
    alt: "Avatar ilustrativo de caso",
    status: "approved",
    origin: "custom-svg",
    usage: "case-study-profile",
    provenance: "CUSTOM VECTOR ASSET (Geometric rounded profile in Bravo purple and cyan)",
    dimensions: { width: 64, height: 64 },
  },
  "cta-path": {
    id: "bravo-cta-path",
    type: "background",
    src: "/images/brand/vector/bravo-cta-path.svg",
    alt: "",
    status: "approved",
    origin: "custom-svg",
    usage: "final-cta-background",
    provenance: "CUSTOM VECTOR ASSET (Curved milestone trajectory in violet-to-cyan gradient)",
    dimensions: { width: 1200, height: 400 },
  },
  "footer-pattern": {
    id: "bravo-footer-pattern",
    type: "background",
    src: "/images/brand/vector/bravo-footer-pattern.svg",
    alt: "",
    status: "approved",
    origin: "custom-svg",
    usage: "footer-background-texture",
    provenance: "CUSTOM VECTOR ASSET (Bravo V chevron geometry at 4% opacity)",
    dimensions: { width: 800, height: 400 },
  },
  "official-logo-white": {
    id: "bravo-logo-white",
    type: "vector",
    src: "/50ac38d4-bravo-logo-blanco_105602x05601l00000o028.png",
    alt: "Bravo México",
    status: "approved",
    origin: "official",
    usage: "header-footer-brand-mark",
    provenance: "OFFICIAL BRAVO BRAND ASSET",
    dimensions: { width: 140, height: 38 },
  },
};
