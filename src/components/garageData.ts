import regularServiceImg from "../assets/images/regular_bike_service_1785392002803.jpg";
import engineRepairImg from "../assets/images/engine_repair_service_1785392016029.jpg";
import brakeServiceImg from "../assets/images/brake_pad_service_1785392030526.jpg";
import batteryElectricalImg from "../assets/images/battery_electrical_service_1785392046998.jpg";
import chainClutchImg from "../assets/images/chain_clutch_service_1785392059464.jpg";
import tyrePunctureImg from "../assets/images/tyre_puncture_service_1785392071114.jpg";
import bikeWashImg from "../assets/images/bike_wash_polish_1785392083459.jpg";
import generalInspectionImg from "../assets/images/general_bike_inspection_1785392095824.jpg";
import ranaMechanicImg from "../assets/images/rana_singh_mechanic_1785394023899.jpg";

// Direct image URLs for high performance and reliable builds
const workshopLiftImg = regularServiceImg;
const clutchEngineImg = engineRepairImg;
const suspensionImg = brakeServiceImg;
const foamWashImg = bikeWashImg;
const engineOilImg = regularServiceImg;

export interface MechanicInfo {
  photo: string;
  name: string;
  roleTitle?: string;
  bio?: string;
  age: number;
  experience: string;
  phone: string;
  address?: string;
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
  photo: ranaMechanicImg,
  name: "Rana Singh",
  roleTitle: "Owner & Motorcycle Mechanic",
  age: 40,
  experience: "15+ Years",
  phone: "+91 92724 96996",
  address: "Rana Auto garage, Dapodi, Pimpri Chinchwad, Pune, Maharashtra 411012",
  bio: "With over 15 years of hands-on experience, Rana Singh has been repairing motorcycles for riders across the local community.\n\nFrom regular servicing and oil changes to engine repairs and electrical work, every motorcycle is inspected and repaired personally.\n\nRana believes in honest advice, transparent pricing, quality workmanship, and treating every customer's bike like his own.",
  skills: [
    "Regular Servicing",
    "Engine Repair",
    "Oil Change",
    "Brake Repair",
    "Clutch Repair",
    "Electrical Repair",
    "Chain & Sprocket",
    "Tyre & Puncture",
    "Battery Replacement"
  ],
  languages: ["Hindi", "Marathi", "English"],
  availableTime: "Monday – Saturday: 10:00 AM – 9:00 PM",
  rating: 4.9,
  totalRepairs: 3500,
  happyCustomers: 3200,
  certificates: [
    "15+ Years Hands-on Local Experience",
    "Genuine OEM Spare Parts Guarantee"
  ],
  timeline: [
    { year: "2010", title: "Mechanic Apprentice", desc: "Learned hands-on two-wheeler engine repair in local neighborhood workshop." },
    { year: "2015", title: "Rana Garage Founded", desc: "Opened neighborhood workshop serving Pune commuters with honest advice and fair prices." }
  ]
};

export const reviewsData: ReviewItem[] = [];

export { workshopLiftImg, clutchEngineImg, suspensionImg, foamWashImg, engineOilImg };

export const galleryData: GalleryItem[] = [
  {
    id: "g1",
    title: "Engine Oil & Filter Service (Splendor Pro)",
    category: "servicing",
    categoryLabel: "Commuter Servicing",
    img: regularServiceImg,
    desc: "Drained dark used oil, cleaned wire mesh filter screen, refilled fresh 900ml 10W-30 engine oil, and lubed drive chain."
  },
  {
    id: "g2",
    title: "Clutch Plate & Engine Overhaul (Pulsar 150)",
    category: "engine",
    categoryLabel: "Engine Work",
    img: engineRepairImg,
    desc: "Replaced worn clutch friction plates, fitted fresh clutch housing gasket, adjusted clutch lever play for smooth gear shift."
  },
  {
    id: "g3",
    title: "Front Disc Brake Pad Fitting (Honda Shine)",
    category: "brake",
    categoryLabel: "Brake Service",
    img: brakeServiceImg,
    desc: "Replaced squeaking front disc brake pads, cleaned disc caliper assembly, topped up brake fluid and tested lever bite."
  },
  {
    id: "g4",
    title: "Battery & Self-Start Diagnostics (TVS Raider)",
    category: "servicing",
    categoryLabel: "Electrical Check",
    img: batteryElectricalImg,
    desc: "Tested battery terminal voltage with multimeter, cleaned corroded starter relay contacts, and fixed self-start issue."
  },
  {
    id: "g5",
    title: "Drive Chain Cleaning & Adjustment (Hero Passion)",
    category: "chain",
    categoryLabel: "Chain & Clutch",
    img: chainClutchImg,
    desc: "Cleaned heavy road grime from drive chain and sprockets, adjusted wheel chain slack to 25mm, applied heavy chain spray."
  },
  {
    id: "g6",
    title: "Tubeless Tyre Puncture Fix (Honda Unicorn)",
    category: "servicing",
    categoryLabel: "Tyre Repair",
    img: tyrePunctureImg,
    desc: "Extracted sharp nail from rear tubeless tyre, inserted sticky puncture plug strip, inflated to 33 PSI, checked air seal."
  },
  {
    id: "g7",
    title: "Foam Wash & Body Polish (Honda SP125)",
    category: "washing",
    categoryLabel: "Washing & Cleaning",
    img: bikeWashImg,
    desc: "High-pressure foam wash, degreased engine block, hand-wiped tank with microfiber cloth, applied protective shine polish."
  },
  {
    id: "g8",
    title: "Pre-Monsoon General Inspection (Bajaj Pulsar)",
    category: "servicing",
    categoryLabel: "General Checkup",
    img: generalInspectionImg,
    desc: "30-point checkup covering lights, horn, tyre tread, brake shoe wear, spark plug gap, battery voltage, and 3km road test."
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
    answer: "Yes, we support local puncture, starting, and towing emergency requests within Dapodi, Pimpri Chinchwad, and Pune. Toggle the 'Emergency Repair Request' button in the form to flag your ticket instantly!"
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
