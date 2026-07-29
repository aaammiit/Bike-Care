// Direct image URLs for high performance and reliable builds - strictly motorcycle and bike repair assets (no cars or people)
const workshopLiftImg = "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=1200";
const clutchEngineImg = "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=1200";
const suspensionImg = "https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&q=80&w=1200";
const foamWashImg = "https://images.unsplash.com/photo-1558981359-219d6364c9c8?auto=format&fit=crop&q=80&w=1200";
const engineOilImg = "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=1200";

export interface MechanicInfo {
  photo: string;
  name: string;
  age: number;
  experience: string;
  phone: string;
  skills: string[];
  languages: string[];
  availableTime: string;
  rating: number;
  totalRepairs: number;
  happyCustomers: number;
  certificates: string[];
  timeline: { year: string; title: string; desc: string }[];
}

export interface ReviewItem {
  id: string;
  name: string;
  photo: string;
  bike: string;
  service: string;
  rating: number;
  review: string;
  date: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: "servicing" | "engine" | "brake" | "painting" | "washing" | "polishing" | "chain" | "suspension";
  categoryLabel: string;
  img: string;
  desc: string;
}

export interface BeforeAfterItem {
  id: string;
  title: string;
  bike: string;
  beforeImg: string;
  afterImg: string;
  desc: string;
  duration: string;
  satisfaction: string;
  cost: number;
}

export interface ServicePackage {
  id: string;
  name: string;
  price: number;
  time: string;
  popular: boolean;
  features: string[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export const mechanicData: MechanicInfo = {
  photo: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=400&h=400&q=80",
  name: "Rana Singh",
  age: 38,
  experience: "12+ Years",
  phone: "+91 97678 24216",
  skills: [
    "Complete Engine Overhauling",
    "ECU Remapping & Spark Calibration",
    "Precision Carby Tuning",
    "Suspension Valve Re-damping",
    "Custom Chassis Restorations",
    "Wiring Loom Diagnostics"
  ],
  languages: ["Hindi", "Punjabi", "Marathi", "English"],
  availableTime: "9:00 AM - 8:00 PM (Mon - Sat)",
  rating: 4.9,
  totalRepairs: 5420,
  happyCustomers: 3200,
  certificates: [
    "Certified Master Technician (Yamaha India)",
    "Bosch Automotive Electrical Diagnostics Specialist",
    "Royal Enfield Vintage Restoration Laureate (2022)"
  ],
  timeline: [
    { year: "2014", title: "Apprentice", desc: "Started as junior tech in Yamaha Service Terminal, Mumbai." },
    { year: "2017", title: "Restoration Head", desc: "Led classic rebuilds at vintage custom hub in Pune." },
    { year: "2020", title: "Rana Garage Founded", desc: "Launched first physical workshop in Koregaon Park." },
    { year: "2024", title: "Smart Workshop Launch", desc: "Expanded to 3 bays with digital diagnostics boards." }
  ]
};

export const reviewsData: ReviewItem[] = [];

export { workshopLiftImg, clutchEngineImg, suspensionImg, foamWashImg, engineOilImg };

export const galleryData: GalleryItem[] = [
  {
    id: "g1",
    title: "Clutch & Flywheel Assembly Overhaul",
    category: "engine",
    categoryLabel: "Engine & Clutch",
    img: clutchEngineImg,
    desc: "Disassembling clutch basket plates, replacing worn friction discs, and torquing flywheel bolts to OEM specification."
  },
  {
    id: "g2",
    title: "Rear Shock Absorber & Coilover Service",
    category: "suspension",
    categoryLabel: "Suspension & Damping",
    img: suspensionImg,
    desc: "Precision tuning of rear coilover shock absorber preload, replacing nitrogen seals, and adjusting damping rebound."
  },
  {
    id: "g3",
    title: "Hydraulic Lift Bay Scooter Servicing",
    category: "servicing",
    categoryLabel: "Hydraulic Lift Bay",
    img: workshopLiftImg,
    desc: "Elevated hydraulic lift servicing for automatic scooters, including variator belt checks, brake drums, and engine fluid flush."
  },
  {
    id: "g4",
    title: "Microfiber Buffing & Vintage Detailing",
    category: "polishing",
    categoryLabel: "Detailing & Polish",
    img: foamWashImg,
    desc: "Hand-wiping, microfiber detailing, and applying Teflon wax sealant on custom black vintage bike tanks."
  },
  {
    id: "g5",
    title: "Engine Oil Level & Dipstick Inspection",
    category: "servicing",
    categoryLabel: "Routine Diagnostics",
    img: engineOilImg,
    desc: "Inspecting oil viscosity and contamination with protective white gloves before draining and filling fresh Motul 4T 10W40."
  },
  {
    id: "g6",
    title: "Inverted USD Fork Resealing",
    category: "suspension",
    categoryLabel: "Brakes & Suspension",
    img: "https://images.unsplash.com/photo-1542128962-9d50ad7bf744?auto=format&fit=crop&w=600&q=80",
    desc: "Replacing leaking oil seals with double-lip NOK seals, polishing the stanchion tubes, and refilling premium 10W fork fluid."
  },
  {
    id: "g7",
    title: "Mikuni Twin-Carb Calibration",
    category: "engine",
    categoryLabel: "Vintage Tuning",
    img: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=600&q=80",
    desc: "Ultrasonic chemical tank bath for clogged brass jets, setting correct float pin height, and synchronizing vacuum draws."
  },
  {
    id: "g8",
    title: "Laser Drivetrain & Gold Chain Alignment",
    category: "chain",
    categoryLabel: "Drive Transmission",
    img: "https://images.unsplash.com/photo-1558981804-05561a35563a?auto=format&fit=crop&w=600&q=80",
    desc: "Installing a gold-plated DID O-Ring drive chain with precise alignment using a professional laser line alignment guide."
  }
];

export const beforeAfterData: BeforeAfterItem[] = [
  {
    id: "ba1",
    title: "Enfield 350 Decarbonization",
    bike: "Royal Enfield Bullet 350",
    beforeImg: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80",
    afterImg: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=800&q=80",
    desc: "Removed thick carbon deposits on piston rings, resulting in restored cylinder compression from 85 PSI to 130 PSI.",
    duration: "12 Hours",
    satisfaction: "100%",
    cost: 4500
  },
  {
    id: "ba2",
    title: "Cafe Racer Wheel Restoration",
    bike: "Yamaha RX100 Vintage",
    beforeImg: "https://images.unsplash.com/photo-1558981804-05561a35563a?auto=format&fit=crop&w=800&q=80",
    afterImg: "https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=800&q=80",
    desc: "Frame sandblasting, rust conversion spray, electrostatic powder coating, and wheel chrome detailing.",
    duration: "24 Hours",
    satisfaction: "100%",
    cost: 8500
  },
  {
    id: "ba3",
    title: "WP USD Fork Resealing",
    bike: "KTM Duke 250",
    beforeImg: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80",
    afterImg: "https://images.unsplash.com/photo-1542128962-9d50ad7bf744?auto=format&fit=crop&w=800&q=80",
    desc: "Polished stanchion pits, fitted high-pressure dual-lip NOK seals, and filled Motul 10W racing fork fluid.",
    duration: "4 Hours",
    satisfaction: "98%",
    cost: 2200
  },
  {
    id: "ba4",
    title: "Exhaust Muffler Ceramic Coat",
    bike: "Harley Davidson Street 750",
    beforeImg: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80",
    afterImg: "https://images.unsplash.com/photo-1558981359-219d6364c9c8?auto=format&fit=crop&w=800&q=80",
    desc: "Polished mud scaling from cruiser chrome pipes, repainted muffler core with matte black ceramic thermal spray.",
    duration: "6 Hours",
    satisfaction: "100%",
    cost: 3800
  }
];

export const pricingPackages: ServicePackage[] = [
  {
    id: "p1",
    name: "Basic Service",
    price: 499,
    time: "2 Hours",
    popular: false,
    features: [
      "42-Point Detailed Inspection",
      "Chain Cleaning & Lubrication",
      "Air Filter Dust Cleaning",
      "Brake Adjustment (Front/Rear)",
      "Spark Plug Spark Calibration",
      "Clutch Lever Play Check"
    ]
  },
  {
    id: "p2",
    name: "Standard Service",
    price: 1299,
    time: "4 Hours",
    popular: true,
    features: [
      "Everything in Basic Service",
      "Engine Oil Replacement (Castrol 4T)",
      "Carburetor Tuning & Vent Cleaning",
      "Full Active Foam Snow Wash",
      "Battery Charge & Terminal Polish",
      "Cables Greasing & Free Play Set"
    ]
  },
  {
    id: "p3",
    name: "Premium Service",
    price: 2499,
    time: "6 Hours",
    popular: false,
    features: [
      "Everything in Standard Service",
      "Teflon High-Gloss Wax Buffing",
      "Brake Fluid Top-up & Caliper Bleed",
      "Wheel Hub Axle Lubrication",
      "OBD Digital Diagnostic Code Clear",
      "6-Month Tuning Warranty Sheet"
    ]
  }
];

export const faqItems: FAQItem[] = [
  {
    question: "Do I need to pay online while booking an appointment?",
    answer: "No, Rana Garage supports 100% offline billing. You describe your problem and book your slot online. Once the bike is serviced, you inspect the work in person and pay securely via Cash or UPI at our counter."
  },
  {
    question: "How long does a Standard Service typically take?",
    answer: "A standard oil change, wash, and complete safety diagnostic check takes about 3 to 4 hours. If there are major engine or wiring repairs required, we will inform you on WhatsApp with an exact turnaround time estimate."
  },
  {
    question: "Do you repair premium superbikes and foreign brands?",
    answer: "Yes, we specialize in everything from Hero commuter bikes to KTM, Harley-Davidson, BMW Motorrad, Triumph, and Kawasaki. Rana Singh has spent 12 years rebuilding engines across a wide spectrum of multi-cylinder and single-cylinder layouts."
  },
  {
    question: "What parts do you use? Are they genuine?",
    answer: "We source only 100% genuine OEM spares (Hero, Bajaj, Enfield, KTM, etc.) or high-quality certified aftermarket parts (like Motul oils, NGK plugs, Exide batteries, CEAT tyres). Every part used is listed on your digital job card."
  },
  {
    question: "How does the WhatsApp appointment work?",
    answer: "When you fill out our form, our system automatically organizes all details (name, bike, date, preferred time, and issue description) into a neat message. Clicking book opens WhatsApp directly to Rana Singh with the text prefilled, allowing you to establish a direct chat in 1-click."
  },
  {
    question: "Do you offer emergency roadside breakdown support?",
    answer: "Yes, we support local puncture, starting, and towing emergency requests within a 5km radius of Koregaon Park, Pune. Toggle the 'Emergency Repair Request' button in the form to flag your ticket instantly!"
  }
];

export const majorBrands = [
  { name: "Hero Motocorp", origin: "India" },
  { name: "Honda Wing", origin: "Japan" },
  { name: "TVS Motor", origin: "India" },
  { name: "Bajaj Auto", origin: "India" },
  { name: "Royal Enfield", origin: "UK/India" },
  { name: "KTM Racing", origin: "Austria" },
  { name: "Yamaha Blue", origin: "Japan" },
  { name: "Suzuki Gixxer", origin: "Japan" },
  { name: "Jawa Motorcycles", origin: "Czech/India" },
  { name: "Harley-Davidson", origin: "USA" },
  { name: "BMW Motorrad", origin: "Germany" },
  { name: "Triumph", origin: "UK" },
  { name: "Ducati Corse", origin: "Italy" },
  { name: "Kawasaki Lime", origin: "Japan" },
  { name: "Aprilia Sport", origin: "Italy" }
];
