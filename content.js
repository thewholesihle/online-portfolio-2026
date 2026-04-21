/**
 * CONTENT DEFAULTS
 * This file provides the fallback data when content.json cannot be fetched
 * (e.g. opening index.html directly as a file:// URL).
 * The CMS server writes the live content to content.json — that always wins.
 */

window.CONTENT_DEFAULTS = {
  seo: {
    pageTitle:     "Sihle Bomela — Graphic Designer & Web Developer",
    description:   "Cape Town-based graphic designer and web developer crafting brand identities, visual systems, and digital experiences that feel intentional and alive.",
    keywords:      "graphic designer, web developer, brand identity, motion graphics, visual systems, South Africa, Cape Town",
    canonicalUrl:  "",
    ogImage:       "",
    twitterHandle: "@thewholesihle"
  },
  branding: {
    logoText:      "Sihle Bomela",
    logoImage:     "",
    font:          "Urbanist",
    fontUrl:       "https://fonts.googleapis.com/css2?family=Urbanist:ital,wght@0,100..900;1,100..900&display=swap",
    bodyFont:      "Urbanist",
    bodyFontUrl:   "https://fonts.googleapis.com/css2?family=Urbanist:ital,wght@0,100..900;1,100..900&display=swap",
    headingFont:   "Urbanist",
    headingFontUrl:"https://fonts.googleapis.com/css2?family=Urbanist:ital,wght@0,100..900;1,100..900&display=swap",
    theme:         { bg: "#0a0a0a", fg: "#f0ede8" },
    availDotColor: "#aaffaa"
  },
  nav: {
    availShow: true,
    availText: "Available from June 2025"
  },
  home: {
    heroName:         "Sihle\nBomela",
    heroBio:          "<strong>Graphic Designer & Web Developer</strong> based in South Africa.<br/>Currently working as Graphic Designer & Motion Graphics at <strong>Bushkoppies Agency</strong>. Creating visual systems, brand identities and digital experiences.",
    heroEmail:        "hey@thewholesihle",
    workSectionLabel: "Selected Work",
    clientsLabel:     "Selected Clients"
  },
  about: {
    bio:             "<strong>Sihle Bomela</strong> is a Graphic Designer & Web Developer based in South Africa. Currently working as Graphic Designer & Motion Graphics at <strong>Bushkoppies Agency</strong>, creating visual identities, motion graphics, and digital experiences that feel intentional and alive.\n\nThe work sits at the intersection of design craft and technical execution — from brand systems and print to interactive web experiences.",
    cvLabel:         "Download CV",
    cvUrl:           "#",
    experience: [
      { id: "e1", company: "Bushkoppies Agency", role: "Graphic Designer & Motion Graphics", period: "2024 — Present", type: "Full-time" },
      { id: "e2", company: "Freelance",          role: "Graphic Designer & Web Developer",    period: "2022 — Present", type: "Independent" }
    ],
    clients:  ["Bushkoppies Agency", "Wearhouse", "Others", "Skating is Risky"],
    services: [
      { id: "s1", name: "Brand Identity",    tag: "Design"   },
      { id: "s2", name: "Visual Systems",    tag: "Design"   },
      { id: "s3", name: "Motion Graphics",   tag: "Motion"   },
      { id: "s4", name: "Web Development",   tag: "Dev"      },
      { id: "s5", name: "Art Direction",     tag: "Creative" },
      { id: "s6", name: "Print & Editorial", tag: "Design"   }
    ],
    currentRole:     "Graphic Designer & Motion Graphics",
    currentCompany:  "Bushkoppies Agency",
    currentLocation: "South Africa",
    availText:       "Available from June 2025"
  },
  contact: {
    label:   "Get in touch",
    heading: "Let's make something worth remembering.",
    email:   "hey@thewholesihle",
    socials: [
      { id: "soc1", label: "Instagram", handle: "@thewholesihle",  url: "https://instagram.com/thewholesihle",  icon: "instagram" },
      { id: "soc2", label: "GitHub",    handle: "thewholesihle",   url: "https://github.com/thewholesihle",    icon: "github"    },
      { id: "soc3", label: "Cosmos",    handle: "thewholesihle",   url: "https://cosmos.so/thewholesihle",     icon: "cosmos"    }
    ]
  },
  footer: { copyright: "Sihle Bomela" },
  maintenance: {
    enabled:  false,
    heading:  "Back soon.",
    message:  "Something great is on its way. In the meantime, reach out directly.",
    email:    "hey@thewholesihle"
  },
  projects: [
    {
      id: "p1",
      name: "Wearhouse",
      type: "Branding + Visuals",
      year: "2025",
      role: "Brand Identity, Art Direction",
      duration: "6 weeks",
      desc: "A comprehensive brand identity and visual system for Wearhouse — capturing the intersection of streetwear culture and quality craftsmanship. Developed logo, color systems, typography, and campaign visuals.",
      images: [
        { id: "i1", ratio: "16/9", span: "full",  label: "Wearhouse — Brand Hero", src: "" },
        { id: "i2", ratio: "4/3",  span: "half",  label: "Logo System",            src: "" },
        { id: "i3", ratio: "4/3",  span: "half",  label: "Color Palette",          src: "" },
        { id: "i4", ratio: "3/4",  span: "third", label: "Brand Mark",             src: "" },
        { id: "i5", ratio: "3/4",  span: "third", label: "Typography",             src: "" },
        { id: "i6", ratio: "3/4",  span: "third", label: "Pattern System",         src: "" },
        { id: "i7", ratio: "16/9", span: "full",  label: "Campaign Visual",        src: "" },
        { id: "i8", ratio: "1/1",  span: "half",  label: "Apparel Mockup",         src: "" },
        { id: "i9", ratio: "1/1",  span: "half",  label: "Packaging",              src: "" }
      ]
    },
    {
      id: "p2",
      name: "Others × Skating is Risky",
      type: "Collab + Promo",
      year: "2025",
      role: "Campaign Design, Promo",
      duration: "4 weeks",
      desc: "Collaboration between Others and Skating is Risky — a promotional campaign spanning print, digital and social media. Designed to feel raw, underground and authentic to the skate community.",
      images: [
        { id: "i1", ratio: "16/9", span: "full",  label: "Others × SIR — Key Visual", src: "" },
        { id: "i2", ratio: "3/4",  span: "half",  label: "Poster Design",              src: "" },
        { id: "i3", ratio: "3/4",  span: "half",  label: "Flyer Design",               src: "" },
        { id: "i4", ratio: "16/9", span: "full",  label: "Digital Campaign",           src: "" },
        { id: "i5", ratio: "1/1",  span: "third", label: "Sticker Pack",              src: "" },
        { id: "i6", ratio: "1/1",  span: "third", label: "Social Asset",              src: "" },
        { id: "i7", ratio: "1/1",  span: "third", label: "Merch Preview",             src: "" }
      ]
    }
  ]
};
