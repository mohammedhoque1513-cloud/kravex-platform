export const constructionNiches = [
  "Roofing",
  "Plumbing",
  "HVAC",
  "Electrical",
  "Home Remodelling",
  "Concrete",
  "Foundation Repair",
] as const;

export const contactNiches = [...constructionNiches, "Other construction trade"] as const;

export const subNichesByTrade: Record<(typeof constructionNiches)[number], string[]> = {
  Roofing: [
    "Storm damage repair",
    "Full roof replacement",
    "Roof repair",
    "Insurance claim support",
    "Other roofing work",
  ],
  Plumbing: [
    "Emergency plumbing",
    "Drain cleaning",
    "Water heater installation",
    "Leak repair",
    "Other plumbing work",
  ],
  HVAC: [
    "AC installation",
    "Furnace replacement",
    "Heat pump installation",
    "Emergency HVAC repair",
    "Other HVAC work",
  ],
  Electrical: [
    "EV charger installation",
    "Full rewiring",
    "Consumer unit upgrade",
    "Commercial electrical",
    "Other electrical work",
  ],
  "Home Remodelling": [
    "Kitchen remodel",
    "Bathroom remodel",
    "Whole-home renovation",
    "Other remodelling work",
  ],
  Concrete: [
    "Driveway",
    "Patio",
    "Foundation work",
    "Decorative concrete",
    "Other concrete work",
  ],
  "Foundation Repair": [
    "Underpinning",
    "Structural repair",
    "Basement waterproofing",
    "Other foundation work",
  ],
};
