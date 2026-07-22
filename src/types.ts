export type ServiceType =
  | "General Service"
  | "Engine Repair"
  | "Oil Change"
  | "Chain Cleaning"
  | "Chain Adjustment"
  | "Brake Service"
  | "Brake Pad Replacement"
  | "Clutch Repair"
  | "Clutch Plate Replacement"
  | "Battery Replacement"
  | "Electrical Repair"
  | "Headlight Repair"
  | "Indicator Repair"
  | "Horn Repair"
  | "Tyre Replacement"
  | "Tube Replacement"
  | "Wheel Alignment"
  | "Wheel Balancing"
  | "Suspension Repair"
  | "Fork Oil Change"
  | "Spark Plug Replacement"
  | "Air Filter Cleaning"
  | "Air Filter Replacement"
  | "Carburetor Cleaning"
  | "Fuel Injection Service"
  | "Accelerator Cable Replacement"
  | "Clutch Cable Replacement"
  | "Speedometer Repair"
  | "Puncture Repair"
  | "Washing"
  | "Polishing"
  | "Full Bike Checkup"
  | "Insurance Inspection"
  | "Accident Repair"
  | "Custom Repair";

export interface Bike {
  id: string;
  registrationNumber: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  fuelType: "Petrol" | "Electric";
  engineNumber?: string;
  chassisNumber?: string;
  odometer: number;
}

export type BookingStatus = "Pending" | "Confirmed" | "Cancelled" | "Rejected";

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  customerMobile: string;
  bikeId: string;
  bikeDetails: string; // Brand Model (RegNo)
  serviceType: ServiceType;
  date: string;
  timeSlot: string;
  pickupOption: "None" | "Pickup" | "Drop" | "Both";
  notes?: string;
  receiveSmsUpdates?: boolean;
  status: BookingStatus;
  rejectionReason?: string;
  acceptedDate?: string;
  acceptedTimeSlot?: string;
  createdAt: string;
}

export type RepairStatus =
  | "Vehicle Received"
  | "Inspection"
  | "Estimate Generated"
  | "Approved"
  | "Repair Started"
  | "Quality Check"
  | "Ready"
  | "Delivered";

export interface RepairTimelineItem {
  status: RepairStatus;
  timestamp: string;
  updatedBy: string;
  notes?: string;
}

export interface PartItem {
  id: string;
  name: string;
  cost: number;
  quantity: number;
}

export interface RepairJob {
  id: string;
  bookingId: string;
  customerId: string;
  customerName: string;
  customerMobile: string;
  bikeId: string;
  bikeDetails: {
    brand: string;
    model: string;
    registrationNumber: string;
    odometer: number;
  };
  serviceType: ServiceType;
  assignedMechanicId?: string;
  assignedMechanicName?: string;
  status: RepairStatus;
  timeline: RepairTimelineItem[];
  estimatedCost: {
    labour: number;
    parts: number;
    total: number;
  };
  partsUsed: PartItem[];
  images: string[]; // Base64 or sample URLs
  mechanicNotes?: string;
  completionDate?: string;
  isApprovedByCustomer: boolean;
  createdAt: string;
}

export interface Invoice {
  id: string;
  repairId: string;
  bookingId: string;
  garageName: string;
  customerName: string;
  customerMobile: string;
  bikeDetails: {
    brand: string;
    model: string;
    registrationNumber: string;
    odometer: number;
  };
  servicesPerformed: {
    name: string;
    cost: number;
  }[];
  sparePartsUsed: {
    name: string;
    quantity: number;
    unitCost: number;
    totalCost: number;
  }[];
  labourCharges: number;
  partsCost: number;
  taxes: number; // e.g. 18% GST standard or simplified
  discount: number;
  finalAmount: number;
  paymentMethod?: "Cash" | "UPI at Garage" | "UPI Online (Simulated)";
  paymentStatus: "Unpaid" | "Paid";
  paidDate?: string;
  mechanicName?: string;
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  supplier: string;
  cost: number;
  minAlertQuantity: number;
}

export interface Employee {
  id: string;
  name: string;
  role: "Admin" | "Mechanic" | "Receptionist";
  status: "Active" | "Inactive";
  jobsCompleted: number;
  mobile: string;
}

export interface Testimonial {
  id: string;
  name: string;
  bike: string;
  text: string;
  rating: number;
  date: string;
}

export const BIKE_SERVICES_LIST: {
  name: ServiceType;
  estimatedLabour: number;
  estimatedPartsCost: number;
  typicalDuration: string;
  description: string;
}[] = [
  {
    name: "General Service",
    estimatedLabour: 650,
    estimatedPartsCost: 350,
    typicalDuration: "3-4 hours",
    description: "Complete bike checkup, washing, oiling, air filter clean, brake adjustments, spark plug check, general tightening."
  },
  {
    name: "Engine Repair",
    estimatedLabour: 2500,
    estimatedPartsCost: 4500,
    typicalDuration: "1-2 days",
    description: "Complete engine diagnostics, piston replacement, valve lapping, gasket seals, and timing adjustments."
  },
  {
    name: "Oil Change",
    estimatedLabour: 150,
    estimatedPartsCost: 450,
    typicalDuration: "30 mins",
    description: "Engine oil flush and premium 4T synthetic oil replacement appropriate for your engine capacity."
  },
  {
    name: "Chain Cleaning",
    estimatedLabour: 100,
    estimatedPartsCost: 50,
    typicalDuration: "20 mins",
    description: "High-pressure chain wash, debris removal, multi-point lubrication, and slack adjustment."
  },
  {
    name: "Chain Adjustment",
    estimatedLabour: 80,
    estimatedPartsCost: 0,
    typicalDuration: "15 mins",
    description: "Alignment of rear wheel, checking sprockets, and tension adjustment to precise manufacturer specs."
  },
  {
    name: "Brake Service",
    estimatedLabour: 250,
    estimatedPartsCost: 100,
    typicalDuration: "1 hour",
    description: "Brake caliper cleaning, brake fluid bleeding/top-up, shoe cleaning, drum adjustment."
  },
  {
    name: "Brake Pad Replacement",
    estimatedLabour: 200,
    estimatedPartsCost: 380,
    typicalDuration: "45 mins",
    description: "Removal of worn disc brake pads, system cleaning, installing OEM/high-performance pads."
  },
  {
    name: "Clutch Repair",
    estimatedLabour: 800,
    estimatedPartsCost: 1200,
    typicalDuration: "3 hours",
    description: "Clutch housing check, pressure plates check, clutch friction plate replacement and alignment."
  },
  {
    name: "Battery Replacement",
    estimatedLabour: 100,
    estimatedPartsCost: 1150,
    typicalDuration: "20 mins",
    description: "Battery voltage health check, terminal rust cleaning, installation of 48-month warranty battery."
  },
  {
    name: "Electrical Repair",
    estimatedLabour: 400,
    estimatedPartsCost: 200,
    typicalDuration: "2 hours",
    description: "Wiring harness check, fuse boxes audit, short-circuit diagnostics, bulb replacements."
  },
  {
    name: "Tyre Replacement",
    estimatedLabour: 300,
    estimatedPartsCost: 1850,
    typicalDuration: "1 hour",
    description: "Rear/front wheel removal, professional tyre de-mounting, replacement with MRF/CEAT gripper tyre."
  },
  {
    name: "Fork Oil Change",
    estimatedLabour: 500,
    estimatedPartsCost: 150,
    typicalDuration: "2 hours",
    description: "Front fork disassembly, cleaning, replacement of fork oil and fork oil seals."
  },
  {
    name: "Spark Plug Replacement",
    estimatedLabour: 80,
    estimatedPartsCost: 120,
    typicalDuration: "15 mins",
    description: "Cleaning the plug port, adjusting the gap, or replacing with NGK/Champion spark plug."
  },
  {
    name: "Carburetor Cleaning",
    estimatedLabour: 300,
    estimatedPartsCost: 50,
    typicalDuration: "1 hour",
    description: "Detailed carburetor dismantling, jets clearing, tuning fuel-air mixture ratio for optimal mileage."
  },
  {
    name: "Washing",
    estimatedLabour: 200,
    estimatedPartsCost: 20,
    typicalDuration: "45 mins",
    description: "High-pressure active foam wash, mud removal, tire shining, and air jet drying."
  },
  {
    name: "Polishing",
    estimatedLabour: 300,
    estimatedPartsCost: 100,
    typicalDuration: "1 hour",
    description: "Applying premium wax/teflon coat to tank and fiber panels, and buffer polishing for maximum shine."
  },
  {
    name: "Full Bike Checkup",
    estimatedLabour: 400,
    estimatedPartsCost: 0,
    typicalDuration: "2 hours",
    description: "42-point thorough inspection including chassis alignment, engine acoustics, brake pad life, and battery health."
  },
  {
    name: "Custom Repair",
    estimatedLabour: 600,
    estimatedPartsCost: 500,
    typicalDuration: "Varies",
    description: "Custom tailored mechanical or cosmetic repair depending on physical inspection and customer description."
  }
];
