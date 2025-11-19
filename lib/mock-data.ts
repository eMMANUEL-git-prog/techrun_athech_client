export interface MockUser {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: "admin" | "athlete" | "coach" | "medic" | "nutritionist";
  subscription: "free" | "pro" | "premium";
}

export const mockUsers: MockUser[] = [
  {
    id: "1",
    email: "admin@athletetrack.com",
    password: "admin123",
    firstName: "Admin",
    lastName: "User",
    role: "admin",
    subscription: "premium",
  },
  {
    id: "2",
    email: "athlete@athletetrack.com",
    password: "athlete123",
    firstName: "John",
    lastName: "Athlete",
    role: "athlete",
    subscription: "free",
  },
  {
    id: "3",
    email: "athlete-pro@athletetrack.com",
    password: "athlete123",
    firstName: "Jane",
    lastName: "Pro",
    role: "athlete",
    subscription: "pro",
  },
  {
    id: "4",
    email: "coach@athletetrack.com",
    password: "coach123",
    firstName: "Mike",
    lastName: "Coach",
    role: "coach",
    subscription: "pro",
  },
  {
    id: "5",
    email: "medic@athletetrack.com",
    password: "medic123",
    firstName: "Sarah",
    lastName: "Medic",
    role: "medic",
    subscription: "pro",
  },
  {
    id: "6",
    email: "nutritionist@athletetrack.com",
    password: "nutrition123",
    firstName: "Emma",
    lastName: "Nutritionist",
    role: "nutritionist",
    subscription: "free",
  },
  {
    id: "7",
    email: "coach-free@athletetrack.com",
    password: "coach123",
    firstName: "Tom",
    lastName: "Coach",
    role: "coach",
    subscription: "free",
  },
  {
    id: "8",
    email: "medic-premium@athletetrack.com",
    password: "medic123",
    firstName: "David",
    lastName: "Medic",
    role: "medic",
    subscription: "premium",
  },
];

export const mockAthletes = [
  {
    id: "1",
    firstName: "John",
    lastName: "Athlete",
    sport: "Running",
    level: "Professional",
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Pro",
    sport: "Swimming",
    level: "Olympic",
  },
  {
    id: "3",
    firstName: "Alex",
    lastName: "Runner",
    sport: "Marathon",
    level: "Elite",
  },
  {
    id: "4",
    firstName: "Lisa",
    lastName: "Swimmer",
    sport: "Freestyle",
    level: "Professional",
  },
];

export const mockAlerts = [
  {
    id: "1",
    type: "location",
    message: "Whereabouts update required",
    severity: "high",
  },
  {
    id: "2",
    type: "medical",
    message: "Medical clearance pending",
    severity: "medium",
  },
  {
    id: "3",
    type: "notification",
    message: "Training session scheduled",
    severity: "low",
  },
];
