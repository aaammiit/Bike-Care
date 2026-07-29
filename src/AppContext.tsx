import React, { createContext, useContext, useState, useEffect } from "react";
import { generateGoogleMapsUrl } from "./utils/locationUtils";
import {
  Bike,
  Booking,
  RepairJob,
  Invoice,
  InventoryItem,
  Employee,
  ServiceType,
  BIKE_SERVICES_LIST,
  RepairStatus,
  BookingStatus,
  PartItem,
  UserRequest,
  CustomerReviewItem,
  MechanicProfile
} from "./types";
import { mechanicData, reviewsData } from "./components/garageData";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "alert";
  timestamp: string;
  read: boolean;
  recipientRole: "Customer" | "Admin" | "Mechanic";
}

interface AppContextType {
  currentRole: "Customer" | "Admin" | "Mechanic";
  setCurrentRole: (role: "Customer" | "Admin" | "Mechanic") => void;
  // Auth simulation
  currentCustomer: {
    id: string;
    name: string;
    email: string;
    mobile: string;
    address: string;
  };
  updateCustomerProfile: (name: string, email: string, mobile: string, address: string) => void;
  
  // Data lists
  bikes: Bike[];
  bookings: Booking[];
  repairs: RepairJob[];
  invoices: Invoice[];
  inventory: InventoryItem[];
  employees: Employee[];
  notifications: Notification[];
  userRequests: UserRequest[];
  customerReviews: CustomerReviewItem[];
  mechanicProfile: MechanicProfile;
  
  // Mechanic Profile Methods
  updateMechanicProfile: (profile: MechanicProfile) => void;
  
  // User Request Methods
  addUserRequest: (reqData: Omit<UserRequest, "id" | "createdAt" | "status">) => UserRequest;
  updateUserRequestStatus: (id: string, status: UserRequest["status"]) => void;
  deleteUserRequest: (id: string) => void;
  clearAllUserRequests: () => void;
  exportRequestsCSV: () => void;

  // Customer Review Methods
  addCustomerReview: (reviewData: Omit<CustomerReviewItem, "id" | "date">) => CustomerReviewItem;
  deleteCustomerReview: (id: string) => void;
  clearAllCustomerReviews: () => void;
  exportReviewsCSV: () => void;
  
  // Core methods
  addBike: (bike: Omit<Bike, "id">) => Bike;
  createBooking: (bookingData: Omit<Booking, "id" | "customerId" | "customerName" | "customerMobile" | "status" | "createdAt">) => Booking;
  cancelBooking: (bookingId: string) => void;
  confirmBooking: (bookingId: string, assignedMechanicId?: string, acceptedDate?: string, acceptedTimeSlot?: string) => void;
  rejectBooking: (bookingId: string, rejectionReason: string) => void;
  
  // Repair Methods
  startRepair: (repairId: string) => void;
  updateRepairStatus: (repairId: string, status: RepairStatus, notes?: string) => void;
  approveEstimate: (repairId: string) => void;
  assignMechanic: (repairId: string, mechanicId: string) => void;
  addPartsToRepair: (repairId: string, partId: string, qty: number) => void;
  removePartFromRepair: (repairId: string, partId: string) => void;
  completeRepairJob: (repairId: string, mechanicNotes?: string) => void;
  
  // Invoice & Payment Methods
  generateInvoice: (repairId: string, discount?: number) => Invoice;
  markInvoiceAsPaid: (invoiceId: string, method: "Cash" | "UPI at Garage" | "UPI Online (Simulated)") => void;
  
  // Inventory Management
  updateInventoryQuantity: (partId: string, newQty: number) => void;
  addInventoryItem: (item: Omit<InventoryItem, "id">) => void;
  
  // Notifications
  addNotification: (title: string, message: string, type: "info" | "success" | "warning" | "alert", recipientRole: "Customer" | "Admin" | "Mechanic") => void;
  markNotificationsAsRead: (role: "Customer" | "Admin" | "Mechanic") => void;
  
  // Simulated System alerts (WhatsApp, SMS logs)
  sentMessagesLog: {
    id: string;
    type: "WhatsApp" | "SMS";
    to: string;
    message: string;
    timestamp: string;
  }[];
  triggerSmsWhatsApp: (to: string, message: string, type: "WhatsApp" | "SMS") => void;
  triggerSOS: (sosData: {
    bikeId: string;
    bikeDetails: string;
    issueType: string;
    description: string;
    location: string;
  }) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial Seed Data
const DEFAULT_CUSTOMER = {
  id: "cust_rahul",
  name: "Rahul Sharma",
  email: "worksample822@gmail.com",
  mobile: "+91 98765 43210",
  address: "Row House No. 4, Koregaon Park, Pune, MH - 411001"
};

const INITIAL_BIKES: Bike[] = [
  {
    id: "bike_bullet",
    registrationNumber: "MH-12-QE-4567",
    brand: "Royal Enfield",
    model: "Classic 350",
    year: 2021,
    color: "Stealth Black",
    fuelType: "Petrol",
    engineNumber: "RE350U92840",
    chassisNumber: "MBL3RE840XJ293",
    odometer: 14520
  },
  {
    id: "bike_ktm",
    registrationNumber: "MH-12-RT-8899",
    brand: "KTM",
    model: "Duke 390",
    year: 2022,
    color: "Ceramic Orange",
    fuelType: "Petrol",
    engineNumber: "KTM373D82749",
    chassisNumber: "MBL9KT829AL304",
    odometer: 8210
  },
  {
    id: "bike_ather",
    registrationNumber: "MH-12-EV-1122",
    brand: "Ather",
    model: "450X Gen 3",
    year: 2023,
    color: "Space Grey",
    fuelType: "Electric",
    engineNumber: "ATH450X28490",
    chassisNumber: "MBL4AT294KL102",
    odometer: 3400
  }
];

const INITIAL_EMPLOYEES: Employee[] = [
  { id: "mech_1", name: "Karan Singh", role: "Mechanic", status: "Active", jobsCompleted: 45, mobile: "+91 90001 22222" },
  { id: "mech_2", name: "Sanjay Dutta", role: "Mechanic", status: "Active", jobsCompleted: 38, mobile: "+91 90001 33333" },
  { id: "mech_3", name: "Vijay Patil", role: "Mechanic", status: "Active", jobsCompleted: 52, mobile: "+91 90001 44444" },
  { id: "admin_1", name: "Rajesh Shinde", role: "Admin", status: "Active", jobsCompleted: 0, mobile: "+91 90001 55555" }
];

const INITIAL_INVENTORY: InventoryItem[] = [
  { id: "part_oil", name: "Motul 10W40 Synthetic Engine Oil (1L)", quantity: 24, supplier: "Motul Distributors Ltd", cost: 450, minAlertQuantity: 5 },
  { id: "part_brake_re", name: "Classic 350 Front Brake Pads", quantity: 12, supplier: "Royal Enfield Genuine Parts", cost: 380, minAlertQuantity: 3 },
  { id: "part_brake_ktm", name: "KTM Duke Brembo Brake Pads", quantity: 2, supplier: "Brembo India Pvt Ltd", cost: 750, minAlertQuantity: 3 }, // Alert active
  { id: "part_clutch_re", name: "RE Classic 350 Clutch Plate Set", quantity: 5, supplier: "RE Genuine Parts", cost: 1200, minAlertQuantity: 2 },
  { id: "part_chain_spray", name: "Premium Microfiber Chain Lube (400ml)", quantity: 18, supplier: "Wurth India", cost: 220, minAlertQuantity: 4 },
  { id: "part_spark_ngk", name: "NGK Spark Plug CR9EIX", quantity: 3, supplier: "NGK Spark Plugs Ltd", cost: 140, minAlertQuantity: 4 }, // Alert active
  { id: "part_air_filter", name: "RE Classic Air Filter", quantity: 8, supplier: "RE Genuine Parts", cost: 250, minAlertQuantity: 2 },
  { id: "part_clutch_cable", name: "KTM Duke Clutch Cable", quantity: 1, supplier: "KTM Genuine Spares", cost: 180, minAlertQuantity: 2 } // Alert active
];

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: "book_1",
    customerId: "cust_rahul",
    customerName: "Rahul Sharma",
    customerMobile: "+91 98765 43210",
    bikeId: "bike_bullet",
    bikeDetails: "Royal Enfield Classic 350 (MH-12-QE-4567)",
    serviceType: "General Service",
    date: "2026-07-17",
    timeSlot: "10:00 AM - 12:00 PM",
    pickupOption: "Both",
    notes: "Chain is slipping and sound in front suspension.",
    status: "Confirmed",
    createdAt: "2026-07-15T14:30:00Z"
  },
  {
    id: "book_2",
    customerId: "cust_rahul",
    customerName: "Rahul Sharma",
    customerMobile: "+91 98765 43210",
    bikeId: "bike_ktm",
    bikeDetails: "KTM Duke 390 (MH-12-RT-8899)",
    serviceType: "Brake Pad Replacement",
    date: "2026-07-18",
    timeSlot: "02:00 PM - 04:00 PM",
    pickupOption: "None",
    notes: "Rear brakes grinding a lot.",
    status: "Confirmed",
    createdAt: "2026-07-16T09:15:00Z"
  },
  {
    id: "book_pending",
    customerId: "cust_rahul",
    customerName: "Rahul Sharma",
    customerMobile: "+91 98765 43210",
    bikeId: "bike_ather",
    bikeDetails: "Ather 450X Gen 3 (MH-12-EV-1122)",
    serviceType: "Full Bike Checkup",
    date: "2026-07-19",
    timeSlot: "11:00 AM - 01:00 PM",
    pickupOption: "Pickup",
    notes: "Ather dashboard showing software warning.",
    status: "Pending",
    createdAt: "2026-07-16T11:00:00Z"
  },
  {
    id: "book_past",
    customerId: "cust_rahul",
    customerName: "Rahul Sharma",
    customerMobile: "+91 98765 43210",
    bikeId: "bike_bullet",
    bikeDetails: "Royal Enfield Classic 350 (MH-12-QE-4567)",
    serviceType: "Oil Change",
    date: "2026-06-10",
    timeSlot: "09:00 AM - 11:00 AM",
    pickupOption: "None",
    notes: "Regular oil change interval.",
    status: "Confirmed",
    createdAt: "2026-06-08T10:00:00Z"
  }
];

const INITIAL_REPAIRS: RepairJob[] = [
  // 1. A completed repair (leads to completed invoice)
  {
    id: "rep_past",
    bookingId: "book_past",
    customerId: "cust_rahul",
    customerName: "Rahul Sharma",
    customerMobile: "+91 98765 43210",
    bikeId: "bike_bullet",
    bikeDetails: { brand: "Royal Enfield", model: "Classic 350", registrationNumber: "MH-12-QE-4567", odometer: 13200 },
    serviceType: "Oil Change",
    assignedMechanicId: "mech_1",
    assignedMechanicName: "Karan Singh",
    status: "Delivered",
    timeline: [
      { status: "Vehicle Received", timestamp: "2026-06-10T09:15:00Z", updatedBy: "Rajesh Shinde", notes: "Bike received physically at garage." },
      { status: "Inspection", timestamp: "2026-06-10T09:30:00Z", updatedBy: "Karan Singh", notes: "Confirmed regular oil change and air filter cleaning requested." },
      { status: "Estimate Generated", timestamp: "2026-06-10T09:40:00Z", updatedBy: "Rajesh Shinde", notes: "Estimated oil + filter cleaner." },
      { status: "Approved", timestamp: "2026-06-10T09:45:00Z", updatedBy: "Rahul Sharma", notes: "Approved estimate online." },
      { status: "Repair Started", timestamp: "2026-06-10T10:00:00Z", updatedBy: "Karan Singh", notes: "Draining old engine oil." },
      { status: "Quality Check", timestamp: "2026-06-10T10:35:00Z", updatedBy: "Karan Singh", notes: "Engine sound smooth, levels checked." },
      { status: "Ready", timestamp: "2026-06-10T10:45:00Z", updatedBy: "Rajesh Shinde", notes: "Invoice generated and ready for pickup." },
      { status: "Delivered", timestamp: "2026-06-10T11:15:00Z", updatedBy: "Rajesh Shinde", notes: "Bike handed over to owner after payment." }
    ],
    estimatedCost: { labour: 150, parts: 450, total: 600 },
    partsUsed: [
      { id: "part_oil", name: "Motul 10W40 Synthetic Engine Oil (1L)", cost: 450, quantity: 1 }
    ],
    images: [],
    mechanicNotes: "Changed engine oil with synthetic Motul 10w40. Spark plug cleaned, air filter blew out with air compressor.",
    completionDate: "2026-06-10T10:45:00Z",
    isApprovedByCustomer: true,
    createdAt: "2026-06-10T09:15:00Z"
  },
  // 2. An active job waiting for Customer approval of Estimate
  {
    id: "rep_bullet_general",
    bookingId: "book_1",
    customerId: "cust_rahul",
    customerName: "Rahul Sharma",
    customerMobile: "+91 98765 43210",
    bikeId: "bike_bullet",
    bikeDetails: { brand: "Royal Enfield", model: "Classic 350", registrationNumber: "MH-12-QE-4567", odometer: 14520 },
    serviceType: "General Service",
    assignedMechanicId: "mech_1",
    assignedMechanicName: "Karan Singh",
    status: "Estimate Generated",
    timeline: [
      { status: "Vehicle Received", timestamp: "2026-07-16T10:00:00Z", updatedBy: "Rajesh Shinde", notes: "Bike picked up from customer residence. Arrived at garage." },
      { status: "Inspection", timestamp: "2026-07-16T11:00:00Z", updatedBy: "Karan Singh", notes: "General inspection completed. Suspension fork oil needs changing due to a minor leak on left seal. Chain sprocket is dry but reusable after deep clean and adjustment. Front brake pads are worn down to 10% and need replacement." },
      { status: "Estimate Generated", timestamp: "2026-07-16T11:30:00Z", updatedBy: "Rajesh Shinde", notes: "Generated revised estimate including front brake pads and fork oil." }
    ],
    estimatedCost: { labour: 1150, parts: 880, total: 2030 },
    partsUsed: [
      { id: "part_brake_re", name: "Classic 350 Front Brake Pads", cost: 380, quantity: 1 },
      { id: "part_oil", name: "Motul 10W40 Synthetic Engine Oil (1L)", cost: 450, quantity: 1 }
    ],
    images: [],
    mechanicNotes: "Left fork seal leaking minorly. Fork oil needs replacement. Front disc pads worn out completely. Washing and chain service included in standard service.",
    isApprovedByCustomer: false, // USER CAN CLICK TO APPROVE IN CUSTOMER DASHBOARD!
    createdAt: "2026-07-16T10:00:00Z"
  },
  // 3. An active job currently in PROGRESS (Repair Started)
  {
    id: "rep_ktm_brakes",
    bookingId: "book_2",
    customerId: "cust_rahul",
    customerName: "Rahul Sharma",
    customerMobile: "+91 98765 43210",
    bikeId: "bike_ktm",
    bikeDetails: { brand: "KTM", model: "Duke 390", registrationNumber: "MH-12-RT-8899", odometer: 8210 },
    serviceType: "Brake Pad Replacement",
    assignedMechanicId: "mech_2",
    assignedMechanicName: "Sanjay Dutta",
    status: "Repair Started",
    timeline: [
      { status: "Vehicle Received", timestamp: "2026-07-16T11:15:00Z", updatedBy: "Sanjay Dutta", notes: "Bike brought in by customer. Rear brake squealing loudly." },
      { status: "Inspection", timestamp: "2026-07-16T11:30:00Z", updatedBy: "Sanjay Dutta", notes: "Confirmed rear brake pads completely worn out, scraping disc slightly. Rotor has minor marks but safe. Cleaning caliper pistons needed." },
      { status: "Estimate Generated", timestamp: "2026-07-16T11:45:00Z", updatedBy: "Rajesh Shinde", notes: "Brembo premium brake pad change: Rs. 750 parts, Rs. 200 labor." },
      { status: "Approved", timestamp: "2026-07-16T12:00:00Z", updatedBy: "Rahul Sharma", notes: "Customer clicked approve via SMS link." },
      { status: "Repair Started", timestamp: "2026-07-16T12:15:00Z", updatedBy: "Sanjay Dutta", notes: "Dismantling rear rear caliper and bleeding old brake fluid." }
    ],
    estimatedCost: { labour: 200, parts: 750, total: 950 },
    partsUsed: [
      { id: "part_brake_ktm", name: "KTM Duke Brembo Brake Pads", cost: 750, quantity: 1 }
    ],
    images: [],
    mechanicNotes: "Bleeding lines, cleaning pistons with wire brush, sliding pins lubrication. Installing Brembo sintered pads.",
    isApprovedByCustomer: true,
    createdAt: "2026-07-16T11:15:00Z"
  }
];

const INITIAL_INVOICES: Invoice[] = [
  {
    id: "inv_past_1",
    repairId: "rep_past",
    bookingId: "book_past",
    garageName: "Rana Garage",
    customerName: "Rahul Sharma",
    customerMobile: "+91 98765 43210",
    bikeDetails: { brand: "Royal Enfield", model: "Classic 350", registrationNumber: "MH-12-QE-4567", odometer: 13200 },
    servicesPerformed: [
      { name: "Oil Change (Labour)", cost: 150 }
    ],
    sparePartsUsed: [
      { name: "Motul 10W40 Synthetic Engine Oil (1L)", quantity: 1, unitCost: 450, totalCost: 450 }
    ],
    labourCharges: 150,
    partsCost: 450,
    taxes: 108, // 18% of 600
    discount: 50,
    finalAmount: 658, // 150+450+108-50
    paymentMethod: "UPI at Garage",
    paymentStatus: "Paid",
    paidDate: "2026-06-10T11:15:00Z",
    mechanicName: "Karan Singh",
    createdAt: "2026-06-10T10:45:00Z"
  }
];

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "not_1",
    title: "New Booking Request",
    message: "Rahul Sharma requested a Full Bike Checkup for Ather 450X on 2026-07-19.",
    type: "info",
    timestamp: "2026-07-16T11:00:00Z",
    read: false,
    recipientRole: "Admin"
  },
  {
    id: "not_2",
    title: "Estimate Needs Approval",
    message: "The general service estimate for Royal Enfield Classic 350 is generated. Please review and approve.",
    type: "warning",
    timestamp: "2026-07-16T11:30:00Z",
    read: false,
    recipientRole: "Customer"
  },
  {
    id: "not_3",
    title: "Inventory Alert",
    message: "KTM Duke Brembo Brake Pads are below minimum stock level (Current: 2).",
    type: "alert",
    timestamp: "2026-07-16T11:30:00Z",
    read: false,
    recipientRole: "Admin"
  }
];

const INITIAL_USER_REQUESTS: UserRequest[] = [];

const INITIAL_MECHANIC_PROFILE: MechanicProfile = {
  name: mechanicData.name,
  phone: mechanicData.phone,
  experience: mechanicData.experience,
  age: mechanicData.age,
  photo: mechanicData.photo,
  roleTitle: "Founder & Master Mechanic",
  availableTime: mechanicData.availableTime,
  address: "Lane 7, Koregaon Park, Pune, MH - 411001",
  bio: "Rana personally diagnoses, tunes, and rebuilds every machine that enters the garage. From single-cylinder commuter bikes to high-performance multi-cylinder superbikes, he handles every machine with mathematical precision.",
  skills: mechanicData.skills,
  languages: mechanicData.languages,
  certificates: mechanicData.certificates,
  pin: "123456"
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<"Customer" | "Admin" | "Mechanic">(() => {
    return (localStorage.getItem("garage_role") as any) || "Customer";
  });

  const [currentCustomer, setCurrentCustomer] = useState(() => {
    const saved = localStorage.getItem("garage_customer");
    return saved ? JSON.parse(saved) : DEFAULT_CUSTOMER;
  });

  const [mechanicProfile, setMechanicProfile] = useState<MechanicProfile>(() => {
    const saved = localStorage.getItem("garage_mechanic_profile");
    return saved ? JSON.parse(saved) : INITIAL_MECHANIC_PROFILE;
  });

  const [userRequests, setUserRequests] = useState<UserRequest[]>(() => {
    const saved = localStorage.getItem("garage_user_requests");
    return saved ? JSON.parse(saved) : INITIAL_USER_REQUESTS;
  });

  const [customerReviews, setCustomerReviews] = useState<CustomerReviewItem[]>(() => {
    const saved = localStorage.getItem("garage_customer_reviews");
    return saved ? JSON.parse(saved) : reviewsData;
  });

  const [bikes, setBikes] = useState<Bike[]>(() => {
    const saved = localStorage.getItem("garage_bikes");
    return saved ? JSON.parse(saved) : INITIAL_BIKES;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem("garage_bookings");
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [repairs, setRepairs] = useState<RepairJob[]>(() => {
    const saved = localStorage.getItem("garage_repairs");
    return saved ? JSON.parse(saved) : INITIAL_REPAIRS;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem("garage_invoices");
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem("garage_inventory");
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });

  const [employees] = useState<Employee[]>(INITIAL_EMPLOYEES);

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem("garage_notifications");
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // SMS and WhatsApp simulation log
  const [sentMessagesLog, setSentMessagesLog] = useState<{
    id: string;
    type: "WhatsApp" | "SMS";
    to: string;
    message: string;
    timestamp: string;
  }[]>(() => {
    const saved = localStorage.getItem("garage_message_log");
    return saved ? JSON.parse(saved) : [
      {
        id: "msg_1",
        type: "WhatsApp",
        to: DEFAULT_CUSTOMER.mobile,
        message: "Your Booking at Rana Garage for General Service has been CONFIRMED for 2026-07-17. Live Tracking: https://rana.garage/track/book_1",
        timestamp: "2026-07-15T14:35:00Z"
      },
      {
        id: "msg_2",
        type: "SMS",
        to: DEFAULT_CUSTOMER.mobile,
        message: "Rana Garage: Estimate generated for Royal Enfield Classic 350. Labour: Rs 1150, Parts: Rs 880. Total: Rs 2030. Tap to approve: https://rana.garage/est/rep_bullet_general",
        timestamp: "2026-07-16T11:32:00Z"
      }
    ];
  });

  // Safe localStorage helper functions to prevent quota crashes in production
  const safeSetItem = (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn(`localStorage setItem failed for key "${key}":`, e);
    }
  };

  // Sync to local storage
  useEffect(() => {
    safeSetItem("garage_role", currentRole);
  }, [currentRole]);

  useEffect(() => {
    safeSetItem("garage_customer", JSON.stringify(currentCustomer));
  }, [currentCustomer]);

  useEffect(() => {
    safeSetItem("garage_bikes", JSON.stringify(bikes));
  }, [bikes]);

  useEffect(() => {
    safeSetItem("garage_bookings", JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    safeSetItem("garage_repairs", JSON.stringify(repairs));
  }, [repairs]);

  useEffect(() => {
    safeSetItem("garage_invoices", JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    safeSetItem("garage_inventory", JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    safeSetItem("garage_notifications", JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    safeSetItem("garage_message_log", JSON.stringify(sentMessagesLog));
  }, [sentMessagesLog]);

  useEffect(() => {
    safeSetItem("garage_user_requests", JSON.stringify(userRequests));
  }, [userRequests]);

  useEffect(() => {
    safeSetItem("garage_customer_reviews", JSON.stringify(customerReviews));
  }, [customerReviews]);

  useEffect(() => {
    safeSetItem("garage_mechanic_profile", JSON.stringify(mechanicProfile));
  }, [mechanicProfile]);

  // Methods
  const updateMechanicProfile = (newProfile: MechanicProfile) => {
    setMechanicProfile(newProfile);
  };

  const clearAllUserRequests = () => {
    setUserRequests([]);
    safeSetItem("garage_user_requests", JSON.stringify([]));
  };

  const clearAllCustomerReviews = () => {
    setCustomerReviews([]);
    safeSetItem("garage_customer_reviews", JSON.stringify([]));
  };
  const addUserRequest = (reqData: Omit<UserRequest, "id" | "createdAt" | "status">) => {
    const newReq: UserRequest = {
      ...reqData,
      id: "req_" + Math.random().toString(36).substring(2, 9),
      status: "New",
      createdAt: new Date().toISOString()
    };
    setUserRequests(prev => [newReq, ...prev]);

    addNotification(
      "New Website User Request",
      `${reqData.name} (${reqData.phone}) submitted a request for ${reqData.bikeModel}: ${reqData.serviceCategory}.`,
      "info",
      "Admin"
    );
    return newReq;
  };

  const updateUserRequestStatus = (id: string, status: UserRequest["status"]) => {
    setUserRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const deleteUserRequest = (id: string) => {
    setUserRequests(prev => prev.filter(r => r.id !== id));
  };

  const exportRequestsCSV = (userPin?: string) => {
    // CSV Export Security PIN Check
    const requiredPin = "271201";
    let pinToVerify = userPin;
    if (!pinToVerify) {
      pinToVerify = window.prompt("🔐 Enter CSV Database Export Security PIN (Default PIN: 271201):", "271201") || "";
    }

    if (pinToVerify !== requiredPin) {
      alert("❌ Invalid PIN Code! CSV Export Denied. Correct Security PIN is 271201.");
      return;
    }

    const headers = [
      "Request ID",
      "Customer Name",
      "Phone Number",
      "WhatsApp Active",
      "Bike Model",
      "Service Category",
      "Preferred Date",
      "Preferred Time Slot",
      "Area PIN Code",
      "Description",
      "Pickup Option",
      "Location",
      "Status",
      "Request Timestamp"
    ];

    const rows = userRequests.map(r => [
      `"${r.id}"`,
      `"${(r.name || "").replace(/"/g, '""')}"`,
      `"${(r.phone || "").replace(/"/g, '""')}"`,
      `"${r.isWhatsApp === false ? "No (Call Only)" : "Yes (WhatsApp)"}"`,
      `"${(r.bikeModel || "").replace(/"/g, '""')}"`,
      `"${(r.serviceCategory || "").replace(/"/g, '""')}"`,
      `"${r.preferredDate || new Date().toISOString().slice(0, 10)}"`,
      `"${r.preferredSlot || "10:00 AM - 12:00 PM"}"`,
      `"271201"`,
      `"${(r.description || "").replace(/"/g, '""')}"`,
      `"${r.pickupOption || "None"}"`,
      `"${(r.location || "").replace(/"/g, '""')}"`,
      `"${r.status}"`,
      `"${r.createdAt || new Date().toISOString()}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `rana_garage_requests_PIN271201_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const addCustomerReview = (reviewData: Omit<CustomerReviewItem, "id" | "date">) => {
    const newRev: CustomerReviewItem = {
      ...reviewData,
      id: "rev_" + Math.random().toString(36).substring(2, 9),
      date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }),
      photo: reviewData.photo || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80"
    };
    setCustomerReviews(prev => [newRev, ...prev]);
    return newRev;
  };

  const deleteCustomerReview = (id: string) => {
    setCustomerReviews(prev => prev.filter(r => r.id !== id));
  };

  const exportReviewsCSV = () => {
    const headers = ["Review ID", "Customer Name", "Bike Model", "Service Received", "Rating (Stars)", "Review Comment", "Date"];
    const rows = customerReviews.map(r => [
      `"${r.id}"`,
      `"${(r.name || "").replace(/"/g, '""')}"`,
      `"${(r.bike || "").replace(/"/g, '""')}"`,
      `"${(r.service || "").replace(/"/g, '""')}"`,
      `"${r.rating}"`,
      `"${(r.review || "").replace(/"/g, '""')}"`,
      `"${r.date}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `rana_garage_customer_reviews_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const updateCustomerProfile = (name: string, email: string, mobile: string, address: string) => {
    setCurrentCustomer({ ...currentCustomer, name, email, mobile, address });
  };

  const triggerSmsWhatsApp = (to: string, message: string, type: "WhatsApp" | "SMS") => {
    const logItem = {
      id: "msg_" + Math.random().toString(36).substr(2, 9),
      type,
      to,
      message,
      timestamp: new Date().toISOString()
    };
    setSentMessagesLog(prev => [logItem, ...prev]);
  };

  const addNotification = (title: string, message: string, type: "info" | "success" | "warning" | "alert", recipientRole: "Customer" | "Admin" | "Mechanic") => {
    const newNotif: Notification = {
      id: "not_" + Math.random().toString(36).substr(2, 9),
      title,
      message,
      type,
      timestamp: new Date().toISOString(),
      read: false,
      recipientRole
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationsAsRead = (role: "Customer" | "Admin" | "Mechanic") => {
    setNotifications(prev => prev.map(n => n.recipientRole === role ? { ...n, read: true } : n));
  };

  const addBike = (bikeData: Omit<Bike, "id">) => {
    const newBike: Bike = {
      ...bikeData,
      id: "bike_" + Math.random().toString(36).substr(2, 9)
    };
    setBikes(prev => [...prev, newBike]);
    return newBike;
  };

  const createBooking = (bookingData: any) => {
    const newBooking: Booking = {
      id: "book_" + Math.random().toString(36).substr(2, 9),
      customerId: currentCustomer.id,
      customerName: currentCustomer.name,
      customerMobile: currentCustomer.mobile,
      status: "Pending",
      createdAt: new Date().toISOString(),
      ...bookingData
    };

    setBookings(prev => [newBooking, ...prev]);
    
    // Notify admin
    addNotification(
      "New Booking Request",
      `${currentCustomer.name} booked a ${bookingData.serviceType} for ${bookingData.bikeDetails}.`,
      "info",
      "Admin"
    );

    // Trigger customer SMS simulation if enabled
    if (bookingData.receiveSmsUpdates !== false) {
      triggerSmsWhatsApp(
        currentCustomer.mobile,
        `Rana Garage: Your service booking for ${bookingData.serviceType} has been received and is pending confirmation! We will contact you shortly.`,
        "SMS"
      );
    }

    return newBooking;
  };

  const triggerSOS = (sosData: {
    bikeId: string;
    bikeDetails: string;
    issueType: string;
    description: string;
    location: string;
  }) => {
    const newBookingId = "book_sos_" + Math.random().toString(36).substr(2, 9);
    const newBooking: Booking = {
      id: newBookingId,
      customerId: currentCustomer.id,
      customerName: currentCustomer.name,
      customerMobile: currentCustomer.mobile,
      bikeId: sosData.bikeId,
      bikeDetails: sosData.bikeDetails,
      serviceType: "Accident Repair",
      date: new Date().toISOString().split('T')[0],
      timeSlot: "Immediate Breakdown",
      pickupOption: "Both",
      notes: `[CRITICAL SOS BREAKDOWN] ${sosData.issueType}: ${sosData.description} | Location: ${sosData.location}`,
      status: "Confirmed",
      createdAt: new Date().toISOString()
    };

    setBookings(prev => [newBooking, ...prev]);

    // Create an immediate active RepairJob
    const newRepair: RepairJob = {
      id: "rep_sos_" + Math.random().toString(36).substr(2, 9),
      bookingId: newBookingId,
      customerId: currentCustomer.id,
      customerName: currentCustomer.name,
      customerMobile: currentCustomer.mobile,
      bikeId: sosData.bikeId,
      bikeDetails: {
        brand: sosData.bikeDetails.split(" ")[0] || "Unknown",
        model: sosData.bikeDetails.split(" ").slice(1).join(" ") || "Bike",
        registrationNumber: "MH-12-SOS-HELP",
        odometer: 1000
      },
      serviceType: "Accident Repair",
      assignedMechanicId: "mech_1", // Karan Singh is dispatched
      assignedMechanicName: "Karan Singh",
      status: "Vehicle Received",
      timeline: [
        {
          status: "Vehicle Received",
          timestamp: new Date().toISOString(),
          updatedBy: "System GPS Dispatcher",
          notes: `SOS Emergency Alert received for ${sosData.bikeDetails} at ${sosData.location}.`
        },
        {
          status: "Inspection",
          timestamp: new Date().toISOString(),
          updatedBy: "Rajesh Shinde",
          notes: `SOS Confirmed. Mechanic Karan Singh is dispatched to ${sosData.location} for emergency recovery.`
        }
      ],
      estimatedCost: { labour: 300, parts: 0, total: 300 },
      partsUsed: [],
      images: [],
      mechanicNotes: `Emergency rescue in progress. Dispatching to location: ${sosData.location}. Issue reported: ${sosData.issueType}.`,
      isApprovedByCustomer: true,
      createdAt: new Date().toISOString()
    };

    setRepairs(prev => [newRepair, ...prev]);

    // Send notifications to all roles!
    addNotification(
      "🚨 CRITICAL SOS ALERT",
      `${currentCustomer.name} triggered an SOS for ${sosData.bikeDetails} at ${sosData.location}! Dispatching Karan Singh.`,
      "alert",
      "Admin"
    );

    addNotification(
      "🚨 EMERGENCY DISPATCH",
      `Rescue dispatch: Go to ${sosData.location} immediately for ${currentCustomer.name}'s ${sosData.bikeDetails}. Issue: ${sosData.issueType}.`,
      "alert",
      "Mechanic"
    );

    addNotification(
      "🚨 SOS Rescue Active",
      `Your SOS Breakdown request has been received. Mechanic Karan Singh has been dispatched to ${sosData.location}!`,
      "success",
      "Customer"
    );

    // Simulated SMS & WhatsApp
    const mapsUrl = generateGoogleMapsUrl(sosData.location);
    triggerSmsWhatsApp(
      currentCustomer.mobile,
      `🚨 RANA BIKE CARE SOS: Hello ${currentCustomer.name}, our rescue vehicle has been dispatched! Mechanic Karan Singh (+91 90001 22222) is on his way to ${sosData.location}.\n📍 Live Google Maps: ${mapsUrl}`,
      "WhatsApp"
    );

    triggerSmsWhatsApp(
      "+91 90001 55555", // Admin mobile
      `🚨 CRITICAL SOS: Rahul Sharma has an emergency breakdown at ${sosData.location}! Bike: ${sosData.bikeDetails}. Issue: ${sosData.issueType}. Dispatching Karan Singh.`,
      "SMS"
    );
  };

  const cancelBooking = (bookingId: string) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: "Cancelled" as BookingStatus } : b));
    
    // If there is an active repair for it, mark it cancelled as well or clear it
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      addNotification(
        "Booking Cancelled",
        `${booking.customerName} cancelled their booking for ${booking.serviceType}.`,
        "warning",
        "Admin"
      );
    }
  };

  const confirmBooking = (bookingId: string, assignedMechanicId?: string, acceptedDate?: string, acceptedTimeSlot?: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    const finalDate = acceptedDate || booking.date;
    const finalTimeSlot = acceptedTimeSlot || booking.timeSlot;

    setBookings(prev => prev.map(b => b.id === bookingId ? {
      ...b,
      status: "Confirmed" as BookingStatus,
      date: finalDate,
      timeSlot: finalTimeSlot,
      acceptedDate: finalDate,
      acceptedTimeSlot: finalTimeSlot
    } : b));

    // Create corresponding repair job
    const bike = bikes.find(bk => bk.id === booking.bikeId);
    const mech = employees.find(e => e.id === assignedMechanicId);

    // Get default costs
    const standardSvc = BIKE_SERVICES_LIST.find(s => s.name === booking.serviceType);
    const labourCost = standardSvc ? standardSvc.estimatedLabour : 400;
    const partsCost = standardSvc ? standardSvc.estimatedPartsCost : 0;

    const newRepair: RepairJob = {
      id: "rep_" + Math.random().toString(36).substr(2, 9),
      bookingId: bookingId,
      customerId: booking.customerId,
      customerName: booking.customerName,
      customerMobile: booking.customerMobile,
      bikeId: booking.bikeId,
      bikeDetails: {
        brand: bike ? bike.brand : (booking.bikeDetails.split(" ")[0] || "Unknown"),
        model: bike ? bike.model : (booking.bikeDetails.split(" ").slice(1).join(" ") || "Bike"),
        registrationNumber: bike ? bike.registrationNumber : "Pending",
        odometer: bike ? bike.odometer : 1000
      },
      serviceType: booking.serviceType,
      assignedMechanicId: assignedMechanicId,
      assignedMechanicName: mech ? mech.name : undefined,
      status: "Vehicle Received",
      timeline: [
        {
          status: "Vehicle Received",
          timestamp: new Date().toISOString(),
          updatedBy: "Rajesh Shinde",
          notes: `Booking ACCEPTED for ${finalDate} (${finalTimeSlot}). Vehicle check-in approved.`
        }
      ],
      estimatedCost: {
        labour: labourCost,
        parts: partsCost,
        total: labourCost + partsCost
      },
      partsUsed: partsCost > 0 ? [{ id: "part_default", name: "Standard Spare Parts & Consumables", cost: partsCost, quantity: 1 }] : [],
      images: [],
      isApprovedByCustomer: false,
      createdAt: new Date().toISOString()
    };

    setRepairs(prev => [newRepair, ...prev]);

    // Notify Customer on WhatsApp and SMS with ACCEPTED Date and Time!
    triggerSmsWhatsApp(
      booking.customerMobile,
      `*✅ RANA GARAGE - BOOKING ACCEPTED*\nHello ${booking.customerName}, your service booking for ${booking.bikeDetails} has been ACCEPTED!\n\n📅 Accepted Date: ${finalDate}\n⏰ Accepted Time Slot: ${finalTimeSlot}\n👨‍🔧 Assigned Mechanic: ${mech ? mech.name : "Karan Singh"}\n📞 Contact Garage: +91 97678 24216\n📍 Live Tracking ID: ${newRepair.id}`,
      "WhatsApp"
    );

    addNotification(
      "Service Request Accepted",
      `Your booking for ${booking.bikeDetails} was ACCEPTED for ${finalDate} at ${finalTimeSlot}!`,
      "success",
      "Customer"
    );

    if (assignedMechanicId) {
      addNotification(
        "New Job Assigned",
        `You have been assigned a new job: ${booking.serviceType} for ${booking.bikeDetails} on ${finalDate}.`,
        "info",
        "Mechanic"
      );
    }
  };

  const rejectBooking = (bookingId: string, rejectionReason: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    const reasonMsg = rejectionReason || "Garage schedule full for requested time slot.";

    setBookings(prev => prev.map(b => b.id === bookingId ? {
      ...b,
      status: "Rejected" as BookingStatus,
      rejectionReason: reasonMsg
    } : b));

    // Notify customer via SMS / WhatsApp with rejection reason
    triggerSmsWhatsApp(
      booking.customerMobile,
      `*❌ RANA GARAGE - BOOKING UPDATE*\nHello ${booking.customerName}, your service request for ${booking.bikeDetails} could not be accepted at this time.\n\n⚠️ Reason: "${reasonMsg}"\n\n📞 Please call Rana Singh at +91 97678 24216 to discuss an alternate date.`,
      "WhatsApp"
    );

    addNotification(
      "Booking Request Declined",
      `Your booking request for ${booking.bikeDetails} was declined: "${reasonMsg}". Please contact us to reschedule.`,
      "alert",
      "Customer"
    );
  };

  const startRepair = (repairId: string) => {
    updateRepairStatus(repairId, "Repair Started", "Mechanic began mechanical repair operations.");
  };

  const updateRepairStatus = (repairId: string, status: RepairStatus, notes?: string) => {
    setRepairs(prev => prev.map(r => {
      if (r.id !== repairId) return r;

      const updatedTimeline = [
        ...r.timeline,
        {
          status,
          timestamp: new Date().toISOString(),
          updatedBy: currentRole === "Mechanic" ? (r.assignedMechanicName || "Mechanic") : "Rajesh Shinde",
          notes
        }
      ];

      // Automatically sync estimate approval if status transitions beyond inspection without explicit customer blockage
      let approvedState = r.isApprovedByCustomer;
      if (status === "Approved") {
        approvedState = true;
      }

      return {
        ...r,
        status,
        timeline: updatedTimeline,
        isApprovedByCustomer: approvedState,
        completionDate: status === "Delivered" ? new Date().toISOString() : r.completionDate
      };
    }));

    // Find details for notification
    const repair = repairs.find(r => r.id === repairId);
    if (!repair) return;

    // Send customer notification for key steps
    if (status === "Inspection") {
      triggerSmsWhatsApp(
        repair.customerMobile,
        `Rana Garage: Your ${repair.bikeDetails.brand} is currently undergoing a 42-point inspection by mechanic ${repair.assignedMechanicName || "expert"}. Estimates will be sent shortly.`,
        "SMS"
      );
      addNotification(
        "Inspection In Progress",
        `Mechanic is conducting a multi-point inspection on your ${repair.bikeDetails.brand}.`,
        "info",
        "Customer"
      );
    } else if (status === "Estimate Generated") {
      triggerSmsWhatsApp(
        repair.customerMobile,
        `Rana Garage: Estimate generated for your ${repair.bikeDetails.brand} ${repair.bikeDetails.model}.\nLabour: Rs. ${repair.estimatedCost.labour}\nParts: Rs. ${repair.estimatedCost.parts}\nTotal: Rs. ${repair.estimatedCost.total}\n\nApprove now to start repair: https://rana.garage/approve/${repair.id}`,
        "WhatsApp"
      );
      addNotification(
        "Estimate Generated",
        `Your repair estimate of Rs. ${repair.estimatedCost.total} is ready. Tap to view and approve.`,
        "warning",
        "Customer"
      );
    } else if (status === "Repair Started") {
      triggerSmsWhatsApp(
        repair.customerMobile,
        `Rana Garage: Repair started on your ${repair.bikeDetails.brand}. Mechanic: ${repair.assignedMechanicName || "Karan"}. Tracking: https://rana.garage/track/${repair.id}`,
        "SMS"
      );
      addNotification(
        "Repair Operations Started",
        `Work has begun on your vehicle. It is being serviced carefully.`,
        "info",
        "Customer"
      );
    } else if (status === "Quality Check") {
      addNotification(
        "Quality Check in Progress",
        `Your bike's service is completed and is undergoing final road test & safety checks.`,
        "info",
        "Customer"
      );
    } else if (status === "Ready") {
      // Auto generate invoice
      generateInvoice(repairId);
      
      triggerSmsWhatsApp(
        repair.customerMobile,
        `*Rana Garage*\nHello ${repair.customerName}, your ${repair.bikeDetails.brand} is READY! 🎉\n\n💵 Total bill: Rs. ${repair.estimatedCost.total + Math.round(repair.estimatedCost.total * 0.18)}\n📍 Please visit the garage, make your payment (Cash/UPI), and collect your vehicle.\nDownload Invoice: https://rana.garage/invoice/${repair.id}`,
        "WhatsApp"
      );

      addNotification(
        "Vehicle Ready for Collection",
        `Your bike has passed the quality check and is washed, polished, and ready! Bring Cash or pay via UPI at the garage.`,
        "success",
        "Customer"
      );
    } else if (status === "Delivered") {
      triggerSmsWhatsApp(
        repair.customerMobile,
        `Rana Garage: Handover complete! Thank you for choosing Rana Garage. Ride safe! 🏍️ Share your feedback.`,
        "SMS"
      );
      addNotification(
        "Vehicle Delivered",
        `Thank you for trusting Rana Garage! Your service record has been stored.`,
        "success",
        "Customer"
      );
    }
  };

  const approveEstimate = (repairId: string) => {
    setRepairs(prev => prev.map(r => {
      if (r.id !== repairId) return r;
      
      const updatedTimeline = [
        ...r.timeline,
        {
          status: "Approved" as RepairStatus,
          timestamp: new Date().toISOString(),
          updatedBy: currentCustomer.name,
          notes: "Estimate approved by Customer."
        },
        {
          status: "Repair Started" as RepairStatus,
          timestamp: new Date().toISOString(),
          updatedBy: r.assignedMechanicName || "System",
          notes: "Repair automatically transitioned to Active state upon customer approval."
        }
      ];

      return {
        ...r,
        status: "Repair Started" as RepairStatus,
        isApprovedByCustomer: true,
        timeline: updatedTimeline
      };
    }));

    const repair = repairs.find(r => r.id === repairId);
    if (repair) {
      addNotification(
        "Estimate Approved",
        `Customer ${repair.customerName} approved the estimate of Rs. ${repair.estimatedCost.total}. Starting repairs.`,
        "success",
        "Admin"
      );
      if (repair.assignedMechanicId) {
        addNotification(
          "Work Authorized",
          `Customer authorized repairs for ${repair.bikeDetails.brand}. You can start work immediately.`,
          "success",
          "Mechanic"
        );
      }
    }
  };

  const assignMechanic = (repairId: string, mechanicId: string) => {
    const mech = employees.find(e => e.id === mechanicId);
    if (!mech) return;

    setRepairs(prev => prev.map(r => {
      if (r.id !== repairId) return r;
      return {
        ...r,
        assignedMechanicId: mechanicId,
        assignedMechanicName: mech.name
      };
    }));

    addNotification(
      "Job Assigned",
      `You have been assigned to repair job of ${repairs.find(r => r.id === repairId)?.customerName}.`,
      "info",
      "Mechanic"
    );
  };

  const addPartsToRepair = (repairId: string, partId: string, qty: number) => {
    const part = inventory.find(i => i.id === partId);
    if (!part || part.quantity < qty) return;

    // Deduct stock
    setInventory(prev => prev.map(i => {
      if (i.id !== partId) return i;
      const newQty = i.quantity - qty;
      
      // Stock warning notification if drops below threshold
      if (newQty <= i.minAlertQuantity) {
        addNotification(
          "Inventory Stock Alert",
          `${i.name} is running low (Remaining: ${newQty}).`,
          "alert",
          "Admin"
        );
      }
      return { ...i, quantity: newQty };
    }));

    // Add to repair
    setRepairs(prev => prev.map(r => {
      if (r.id !== repairId) return r;
      
      const existingPartIndex = r.partsUsed.findIndex(p => p.id === partId);
      let updatedPartsUsed = [...r.partsUsed];
      
      if (existingPartIndex >= 0) {
        updatedPartsUsed[existingPartIndex] = {
          ...updatedPartsUsed[existingPartIndex],
          quantity: updatedPartsUsed[existingPartIndex].quantity + qty
        };
      } else {
        updatedPartsUsed.push({
          id: partId,
          name: part.name,
          cost: part.cost,
          quantity: qty
        });
      }

      // Recompute estimates
      const partsSum = updatedPartsUsed.reduce((acc, p) => acc + (p.cost * p.quantity), 0);
      const total = r.estimatedCost.labour + partsSum;

      return {
        ...r,
        partsUsed: updatedPartsUsed,
        estimatedCost: {
          ...r.estimatedCost,
          parts: partsSum,
          total
        }
      };
    }));
  };

  const removePartFromRepair = (repairId: string, partId: string) => {
    const repair = repairs.find(r => r.id === repairId);
    if (!repair) return;

    const partInRepair = repair.partsUsed.find(p => p.id === partId);
    if (!partInRepair) return;

    // Return to inventory
    setInventory(prev => prev.map(i => {
      if (i.id !== partId) return i;
      return { ...i, quantity: i.quantity + partInRepair.quantity };
    }));

    // Remove from repair
    setRepairs(prev => prev.map(r => {
      if (r.id !== repairId) return r;
      const updatedPartsUsed = r.partsUsed.filter(p => p.id !== partId);
      
      const partsSum = updatedPartsUsed.reduce((acc, p) => acc + (p.cost * p.quantity), 0);
      const total = r.estimatedCost.labour + partsSum;

      return {
        ...r,
        partsUsed: updatedPartsUsed,
        estimatedCost: {
          ...r.estimatedCost,
          parts: partsSum,
          total
        }
      };
    }));
  };

  const completeRepairJob = (repairId: string, mechanicNotes?: string) => {
    setRepairs(prev => prev.map(r => {
      if (r.id !== repairId) return r;
      return {
        ...r,
        mechanicNotes: mechanicNotes || r.mechanicNotes,
        completionDate: new Date().toISOString()
      };
    }));

    updateRepairStatus(repairId, "Quality Check", "Repair finished. Performing secondary QC checks and tire alignment inspection.");
    
    // Auto transition to Ready in 2 seconds for a realistic interactive experience
    setTimeout(() => {
      updateRepairStatus(repairId, "Ready", "Vehicle passed QC check, pressure washed and polished. Ready for delivery.");
    }, 1500);
  };

  const generateInvoice = (repairId: string, discount: number = 0) => {
    const repair = repairs.find(r => r.id === repairId);
    if (!repair) throw new Error("Repair job not found");

    // Check if invoice already exists
    const existing = invoices.find(inv => inv.repairId === repairId);
    if (existing) return existing;

    const baseCost = repair.estimatedCost.labour + repair.estimatedCost.parts;
    const taxes = Math.round((baseCost - discount) * 0.18); // 18% GST
    const finalAmount = Math.max(0, baseCost - discount + taxes);

    const servicesPerformed = [
      { name: `${repair.serviceType} (Standard labor rate)`, cost: repair.estimatedCost.labour }
    ];

    const sparePartsUsed = repair.partsUsed.map(p => ({
      name: p.name,
      quantity: p.quantity,
      unitCost: p.cost,
      totalCost: p.cost * p.quantity
    }));

    const newInvoice: Invoice = {
      id: "inv_" + Math.random().toString(36).substr(2, 9),
      repairId,
      bookingId: repair.bookingId,
      garageName: "Rana Garage",
      customerName: repair.customerName,
      customerMobile: repair.customerMobile,
      bikeDetails: repair.bikeDetails,
      servicesPerformed,
      sparePartsUsed,
      labourCharges: repair.estimatedCost.labour,
      partsCost: repair.estimatedCost.parts,
      taxes,
      discount,
      finalAmount,
      paymentStatus: "Unpaid",
      mechanicName: repair.assignedMechanicName,
      createdAt: new Date().toISOString()
    };

    setInvoices(prev => [newInvoice, ...prev]);

    addNotification(
      "Invoice Generated",
      `Invoice ${newInvoice.id} generated for ${repair.customerName} - Total: Rs. ${newInvoice.finalAmount}.`,
      "info",
      "Admin"
    );

    return newInvoice;
  };

  const markInvoiceAsPaid = (invoiceId: string, method: "Cash" | "UPI at Garage" | "UPI Online (Simulated)") => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id !== invoiceId) return inv;
      return {
        ...inv,
        paymentStatus: "Paid",
        paymentMethod: method,
        paidDate: new Date().toISOString()
      };
    }));

    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (invoice) {
      // Find corresponding repair job and transition it to "Delivered"
      const description = method === "UPI Online (Simulated)"
        ? `Invoice paid online via Simulated UPI. Ready for pickup/handover.`
        : `Invoice paid physically via ${method} at garage. Bike keys handed over.`;
      updateRepairStatus(invoice.repairId, "Delivered", description);
      
      addNotification(
        "Payment Logged",
        `Payment of Rs. ${invoice.finalAmount} received via ${method} for invoice ${invoiceId}.`,
        "success",
        "Admin"
      );
    }
  };

  const updateInventoryQuantity = (partId: string, newQty: number) => {
    setInventory(prev => prev.map(i => {
      if (i.id !== partId) return i;
      return { ...i, quantity: newQty };
    }));
  };

  const addInventoryItem = (itemData: Omit<InventoryItem, "id">) => {
    const newItem: InventoryItem = {
      id: "part_" + Math.random().toString(36).substr(2, 9),
      ...itemData
    };
    setInventory(prev => [...prev, newItem]);
    
    addNotification(
      "Inventory Added",
      `New inventory item added: ${itemData.name}.`,
      "info",
      "Admin"
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        currentCustomer,
        updateCustomerProfile,
        bikes,
        bookings,
        repairs,
        invoices,
        inventory,
        employees,
        notifications,
        userRequests,
        customerReviews,
        mechanicProfile,
        updateMechanicProfile,
        addUserRequest,
        updateUserRequestStatus,
        deleteUserRequest,
        clearAllUserRequests,
        exportRequestsCSV,
        addCustomerReview,
        deleteCustomerReview,
        clearAllCustomerReviews,
        exportReviewsCSV,
        addBike,
        createBooking,
        cancelBooking,
        confirmBooking,
        rejectBooking,
        startRepair,
        updateRepairStatus,
        approveEstimate,
        assignMechanic,
        addPartsToRepair,
        removePartFromRepair,
        completeRepairJob,
        generateInvoice,
        markInvoiceAsPaid,
        updateInventoryQuantity,
        addInventoryItem,
        addNotification,
        markNotificationsAsRead,
        sentMessagesLog,
        triggerSmsWhatsApp,
        triggerSOS
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
