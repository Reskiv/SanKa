const CAFE_ART = "/assets/sanka/coffee-cat.svg";

const source = [
  {
    id: "moonbeam-nook",
    name: "Moonbeam Nook",
    summary: "A hushed reading room with cocoa-toned corners.",
    description: "An imaginary late-afternoon nook for quiet pages, gentle conversation, and small-batch brews.",
    price: "$$",
    location: "north",
    vibes: ["quiet", "bookish", "cozy"],
    amenities: ["wifi", "sockets", "aircon"],
    motif: "book",
    image: { src: CAFE_ART, alt: "SanKa coffee cat mascot illustration for this fictional cafe listing" },
    samplePoint: { x: 24, y: 30 }
  },
  {
    id: "apricot-table",
    name: "The Apricot Table",
    summary: "A bright shared table for cheerful catch-ups.",
    description: "A fictional sunny room imagined around long tables, apricot accents, and an easygoing social hum.",
    price: "$",
    location: "garden",
    vibes: ["bright", "social"],
    amenities: ["wifi", "aircon"],
    motif: "table",
    image: { src: CAFE_ART, alt: "SanKa coffee cat mascot illustration for this fictional cafe listing" },
    samplePoint: { x: 70, y: 24 }
  },
  {
    id: "moss-and-mug",
    name: "Moss & Mug",
    summary: "A leafy hideaway with a small open-air table.",
    description: "An invented garden cafe where a sheltered patio and mossy palette make an unhurried sample stop.",
    price: "$$",
    location: "garden",
    vibes: ["outdoorsy", "quiet", "cozy"],
    amenities: ["wifi", "sockets"],
    motif: "leaf",
    image: { src: CAFE_ART, alt: "SanKa coffee cat mascot illustration for this fictional cafe listing" },
    samplePoint: { x: 78, y: 65 }
  },
  {
    id: "paper-boat-coffee",
    name: "Paper Boat Coffee",
    summary: "A breezy riverside-inspired counter for quick cups.",
    description: "A fictional counter with folded-paper details, bright window seats, and an entirely sample waterside setting.",
    price: "$",
    location: "riverside",
    vibes: ["bright", "social"],
    amenities: ["wifi", "aircon"],
    motif: "river",
    image: { src: CAFE_ART, alt: "SanKa coffee cat mascot illustration for this fictional cafe listing" },
    samplePoint: { x: 35, y: 72 }
  },
  {
    id: "cocoa-compass",
    name: "Cocoa Compass",
    summary: "A warm corner built for notebooks and slow plans.",
    description: "An imaginary cafe with deep cocoa surfaces, softly lit booths, and plenty of room for planning a next discovery.",
    price: "$$$",
    location: "north",
    vibes: ["bookish", "cozy"],
    amenities: ["wifi", "sockets", "aircon"],
    motif: "compass",
    image: { src: CAFE_ART, alt: "SanKa coffee cat mascot illustration for this fictional cafe listing" },
    samplePoint: { x: 52, y: 18 }
  },
  {
    id: "driftwood-kettle",
    name: "Driftwood Kettle",
    summary: "An airy sample stop with generous window light.",
    description: "A made-up riverside room with shared benches, a playful kettle shelf, and no connection to a real business or place.",
    price: "$$$",
    location: "riverside",
    vibes: ["outdoorsy", "bright", "social"],
    amenities: ["sockets", "aircon"],
    motif: "kettle",
    image: { src: CAFE_ART, alt: "SanKa coffee cat mascot illustration for this fictional cafe listing" },
    samplePoint: { x: 18, y: 58 }
  }
];

function deepFreeze(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    Object.values(value).forEach(deepFreeze);
  }
  return value;
}

export const CAFES = deepFreeze(source);
export const CAFE_IDS = Object.freeze(CAFES.map((cafe) => cafe.id));
export const FILTER_OPTIONS = deepFreeze({
  price: ["$", "$$", "$$$"],
  location: ["north", "garden", "riverside"],
  vibe: ["quiet", "bookish", "cozy", "bright", "social", "outdoorsy"],
  amenity: ["wifi", "sockets", "aircon"]
});

export const FILTER_LABELS = deepFreeze({
  price: { $: "Budget", $$: "Moderate", $$$: "Special occasion" },
  location: { north: "North quarter", garden: "Garden quarter", riverside: "Riverside quarter" },
  vibe: {
    quiet: "Quiet",
    bookish: "Bookish",
    cozy: "Cozy",
    bright: "Bright",
    social: "Social",
    outdoorsy: "Outdoorsy"
  },
  amenity: { wifi: "Wi-Fi", sockets: "Power sockets", aircon: "Air conditioning" }
});
