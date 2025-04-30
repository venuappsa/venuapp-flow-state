
import { faker } from "@faker-js/faker";

export type UserRole = "admin" | "host" | "merchant" | "fetchman" | "customer";
export type UserStatus = "active" | "inactive" | "pending";

export interface DummyUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastActive: string;
  createdAt: Date;
  avatar?: string;
}

// Function to generate random users with realistic data
export function generateDummyUsers(count: number = 20): DummyUser[] {
  const users: DummyUser[] = [];
  
  const roles: UserRole[] = ["admin", "host", "merchant", "fetchman", "customer"];
  const statuses: UserStatus[] = ["active", "inactive", "pending"];
  
  // Set role probabilities to ensure a good mix
  const roleProbability = {
    admin: 0.1,    // 10% chance for admin
    host: 0.2,     // 20% chance for host
    merchant: 0.2, // 20% chance for merchant
    fetchman: 0.2, // 20% chance for fetchman
    customer: 0.3  // 30% chance for customer
  };
  
  // Set status probabilities
  const statusProbability = {
    active: 0.7,   // 70% chance for active
    inactive: 0.2, // 20% chance for inactive
    pending: 0.1   // 10% chance for pending
  };
  
  for (let i = 0; i < count; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    
    // Determine role based on probabilities
    let role: UserRole;
    const roleRand = Math.random();
    if (roleRand < roleProbability.admin) {
      role = "admin";
    } else if (roleRand < roleProbability.admin + roleProbability.host) {
      role = "host";
    } else if (roleRand < roleProbability.admin + roleProbability.host + roleProbability.merchant) {
      role = "merchant";
    } else if (roleRand < roleProbability.admin + roleProbability.host + roleProbability.merchant + roleProbability.fetchman) {
      role = "fetchman";
    } else {
      role = "customer";
    }
    
    // Determine status based on probabilities
    let status: UserStatus;
    const statusRand = Math.random();
    if (statusRand < statusProbability.active) {
      status = "active";
    } else if (statusRand < statusProbability.active + statusProbability.inactive) {
      status = "inactive";
    } else {
      status = "pending";
    }
    
    // Generate created date within the last 2 years
    const createdAt = faker.date.past({ years: 2 });
    
    // Generate last active date after creation but before now
    const lastActive = faker.date.between({ 
      from: createdAt, 
      to: status === "active" ? new Date() : new Date(createdAt.getTime() + 30 * 24 * 60 * 60 * 1000)
    });
    
    const user: DummyUser = {
      id: faker.string.uuid(),
      name: `${firstName} ${lastName}`,
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
      role,
      status,
      lastActive: status === "active" 
        ? faker.date.recent({ days: 10 }).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }) 
        : lastActive.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
      createdAt
    };
    
    // Add avatar for some users
    if (Math.random() > 0.3) {
      user.avatar = faker.image.avatar();
    }
    
    users.push(user);
  }
  
  return users;
}

// Generate specific dummy users for testing
export function getTestUsers() {
  return [
    {
      id: "admin-user-id-123",
      name: "Admin User",
      email: "admin@example.com",
      role: "admin" as UserRole,
      status: "active" as UserStatus,
      lastActive: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      createdAt: new Date(new Date().setDate(new Date().getDate() - 90))
    },
    {
      id: "host-user-id-456",
      name: "Host User",
      email: "host@example.com",
      role: "host" as UserRole,
      status: "active" as UserStatus,
      lastActive: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      createdAt: new Date(new Date().setDate(new Date().getDate() - 60))
    },
    {
      id: "merchant-user-id-789",
      name: "Merchant User",
      email: "merchant@example.com",
      role: "merchant" as UserRole,
      status: "active" as UserStatus,
      lastActive: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      createdAt: new Date(new Date().setDate(new Date().getDate() - 45))
    },
    {
      id: "inactive-user-id-012",
      name: "Inactive User",
      email: "inactive@example.com",
      role: "customer" as UserRole,
      status: "inactive" as UserStatus,
      lastActive: new Date(new Date().setDate(new Date().getDate() - 30)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      createdAt: new Date(new Date().setDate(new Date().getDate() - 120))
    }
  ];
}
