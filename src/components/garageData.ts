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

export const reviewsData: ReviewItem[] = [
  {
    id: "r1",
    name: "Rahul Deshmukh",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
    bike: "Royal Enfield Classic 350",
    service: "Engine Overhaul",
    rating: 5,
    review: "Rana Bhai completely cured my engine knocking issue. The bike runs smoother than the day I bought it. Highly recommended!",
    date: "12 July 2026"
  },
  {
    id: "r2",
    name: "Pooja Sharma",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
    bike: "Honda Activa 6G",
    service: "General Maintenance",
    rating: 5,
    review: "As a student, I don't know much about engines. Rana explained the spark issues clearly, didn't charge for extra parts, and booked me on WhatsApp easily.",
    date: "09 July 2026"
  },
  {
    id: "r3",
    name: "Amit Patel",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
    bike: "KTM Duke 390",
    service: "Fork Oil & Suspension",
    rating: 5,
    review: "WP forks were leaking damping fluid. They replaced seals, refilled high-performance oil, and the front end feels rock-solid on high corners.",
    date: "05 July 2026"
  },
  {
    id: "r4",
    name: "Sandeep Gill",
    photo: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&h=150&q=80",
    bike: "Suzuki Hayabusa",
    service: "Chain Replacement",
    rating: 5,
    review: "Exceptional care taken for my superbike. Cleaned the sprocket shaft, torqued the DID chain to exact specs. True professionals here.",
    date: "28 June 2026"
  },
  {
    id: "r5",
    name: "Neha Nair",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
    bike: "Yamaha R15 V4",
    service: "Brake Service & Pads",
    rating: 5,
    review: "Superb stopping power now. They put in ceramic brake pads and cleaned the rear calipers perfectly. Pricing was very reasonable.",
    date: "25 June 2026"
  },
  {
    id: "r6",
    name: "Vikram Rathore",
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80",
    bike: "Jawa 42",
    service: "Wiring & Spark Issue",
    rating: 4,
    review: "My Jawa had a weird headlight flicker. Rana found a pinched wire inside the loom. Solved it quickly and wrapped it in heat-shield tape.",
    date: "21 June 2026"
  },
  {
    id: "r7",
    name: "Aditya Roy",
    photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&h=150&q=80",
    bike: "TVS Apache RTR 200",
    service: "Oil Change & Carb Clean",
    rating: 5,
    review: "My throttle response is so crisp now! Cleaned the carb jets and filled premium Motul oil. Best local garage in Pune, hands down.",
    date: "18 June 2026"
  },
  {
    id: "r8",
    name: "Meera Sen",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80",
    bike: "Vespa VXL 150",
    service: "Polishing & Washing",
    rating: 5,
    review: "The foam wash and Teflon coat made my pink Vespa look absolutely sparkling! Not a speck of mud left. Splendid service.",
    date: "14 June 2026"
  },
  {
    id: "r9",
    name: "Gaurav Joshi",
    photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&h=150&q=80",
    bike: "Harley-Davidson Iron 883",
    service: "Battery Replacement",
    rating: 5,
    review: "Quick and easy. Old battery died during monsoons, they fitted an Exide battery, checked the alternator voltage, and got me on my way.",
    date: "10 June 2026"
  },
  {
    id: "r10",
    name: "Ananya Dave",
    photo: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=150&h=150&q=80",
    bike: "KTM RC 200",
    service: "Accident Repair",
    rating: 5,
    review: "Damaged my fairings in a slide. Rana Garage sourced original parts, matched the paint perfectly, and got the insurance inspection done smoothly.",
    date: "04 June 2026"
  },
  {
    id: "r11",
    name: "Rohan Kulkarni",
    photo: "https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&w=150&h=150&q=80",
    bike: "Bajaj Pulsar 150",
    service: "General Maintenance",
    rating: 4,
    review: "Very honest pricing. They cleaned my air filter, adjusted my chain, and changed spark plugs for a tiny charge. Bike feels light!",
    date: "30 May 2026"
  },
  {
    id: "r12",
    name: "Deepak Chawla",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80",
    bike: "BMW G310GS",
    service: "Tyre Replacement",
    rating: 5,
    review: "Fitted Metzeler dual-sport tyres. Wheel balancing was done professionally. This place has better tools than many authorized showrooms.",
    date: "26 May 2026"
  }
];

export const galleryData: GalleryItem[] = [
  {
    id: "g1",
    title: "Classic Engine Head Rebuild",
    category: "engine",
    categoryLabel: "Engine Rebuild",
    img: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80",
    desc: "Scrubbing heavy carbon crust from cylinder heads and seating new valves for optimal compression on a Classic 350."
  },
  {
    id: "g2",
    title: "Cafe Racer Frame Welding",
    category: "painting",
    categoryLabel: "Restorations",
    img: "https://images.unsplash.com/photo-1615887023516-9b6bcd559e87?auto=format&fit=crop&w=600&q=80",
    desc: "Stripping surface rust scaling and executing precision TIG welds on a vintage custom cafe racer frame."
  },
  {
    id: "g3",
    title: "Hydraulic Caliper Overhaul",
    category: "brake",
    categoryLabel: "Brakes & Suspension",
    img: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=600&q=80",
    desc: "Replacing piston dust seals, rebuilding corroded caliper guides, and executing a complete brake fluid vacuum flush."
  },
  {
    id: "g4",
    title: "Laser Drivetrain Alignment",
    category: "chain",
    categoryLabel: "Drive Transmission",
    img: "https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=600&q=80",
    desc: "Installing a gold-plated DID O-Ring drive chain with precise alignment using a professional laser line alignment guide."
  },
  {
    id: "g5",
    title: "ECU Diagnostics & Map Flash",
    category: "servicing",
    categoryLabel: "Tuning & Tech",
    img: "https://images.unsplash.com/photo-1542128962-9d50ad7bf744?auto=format&fit=crop&w=600&q=80",
    desc: "Mapping high-rpm fuel delivery curves on the electronic control unit (ECU) to resolve cold-idle stutter and lag."
  },
  {
    id: "g6",
    title: "Inverted USD Fork Resealing",
    category: "suspension",
    categoryLabel: "Brakes & Suspension",
    img: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=600&q=80",
    desc: "Replacing leaking oil seals with double-lip NOK seals, polishing the stanchion tubes, and refilling premium 10W fork fluid."
  },
  {
    id: "g7",
    title: "Mikuni Twin-Carb Calibration",
    category: "engine",
    categoryLabel: "Vintage Tuning",
    img: "https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=600&q=80",
    desc: "Ultrasonic chemical tank bath for clogged brass jets, setting correct float pin height, and synchronizing vacuum draws."
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
    beforeImg: "https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=800&q=80",
    afterImg: "https://images.unsplash.com/photo-1615887023516-9b6bcd559e87?auto=format&fit=crop&w=800&q=80",
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
    afterImg: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80",
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
