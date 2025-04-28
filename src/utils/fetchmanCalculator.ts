
export interface FetchmanAllocationResult {
  entranceFetchmen: number;
  internalFetchmen: number;
  vendorFetchmen: number;
  securityStaff: number;
  eventStaff: number;
  totalFetchmen: number;
  densityFactor: number;
  allocation: {
    entranceAndExit: number;
    vendorAreas: number;
    generalAreas: number;
    emergencyReserve: number;
  };
  recommendations: string[];
}

export interface FetchmanShiftPlan {
  isMultiShift: boolean;
  shiftsNeeded: number;
  fetchmenPerShift: number;
  totalFetchmen: number;
  shiftHours: number;
}

export const calculateFetchmanEstimate = (capacity: number, vendors: number): number => {
  // Base calculation for fetchmen needed
  const baseFetchmen = Math.ceil(capacity / 100); // 1 fetchman per 100 guests
  const vendorFetchmen = Math.ceil(vendors / 4); // 1 fetchman per 4 vendors
  
  // Total fetchmen needed (minimum of 2)
  return Math.max(2, baseFetchmen + vendorFetchmen);
};

export const calculateFetchmanCost = (fetchmenCount: number, hours: number): number => {
  const hourlyRate = 150; // R150 per hour per fetchman
  return fetchmenCount * hours * hourlyRate;
};

export const generateFetchmanStaffingPlan = (fetchmenCount: number, hours: number): FetchmanShiftPlan => {
  // Simple distribution of fetchmen across different areas
  const isMultiShift = hours > 8;
  const shiftsNeeded = isMultiShift ? Math.ceil(hours / 8) : 1;
  const shiftHours = isMultiShift ? Math.min(8, Math.ceil(hours / shiftsNeeded)) : hours;
  const fetchmenPerShift = fetchmenCount;
  const totalFetchmen = isMultiShift ? fetchmenCount * shiftsNeeded : fetchmenCount;
  
  return {
    isMultiShift,
    shiftsNeeded,
    fetchmenPerShift,
    totalFetchmen,
    shiftHours
  };
};

export const calculateFetchmanAllocation = (capacity: number, floorArea: number, multiLevel: boolean): FetchmanAllocationResult => {
  // Calculate basic fetchmen estimate
  const totalFetchmen = calculateFetchmanEstimate(capacity, Math.ceil(floorArea / 100));
  
  // Calculate density factor
  const densityFactor = capacity / floorArea;
  
  // Calculate distribution
  const entranceFetchmen = Math.max(1, Math.floor(totalFetchmen * 0.25));
  const vendorFetchmen = Math.max(1, Math.floor(totalFetchmen * 0.35));
  const internalFetchmen = totalFetchmen - entranceFetchmen - vendorFetchmen;
  
  // Calculate additional staff needed
  const securityStaff = Math.max(2, Math.ceil(capacity / 150) + (multiLevel ? 2 : 0));
  const eventStaff = Math.max(3, Math.ceil(capacity / 100));
  
  // Detailed allocation for chart
  const allocation = {
    entranceAndExit: entranceFetchmen,
    vendorAreas: vendorFetchmen,
    generalAreas: Math.floor(internalFetchmen * 0.7),
    emergencyReserve: Math.ceil(internalFetchmen * 0.3)
  };
  
  // Generate recommendations based on venue characteristics
  const recommendations = generateRecommendations(capacity, floorArea, multiLevel, densityFactor);
  
  return {
    entranceFetchmen,
    internalFetchmen,
    vendorFetchmen,
    securityStaff,
    eventStaff,
    totalFetchmen,
    densityFactor,
    allocation,
    recommendations
  };
};

export const calculateOvertimeCosts = (hours: number, overtimeHours: number, fetchmenCount: number, rate: number): number => {
  const regularHours = hours;
  const overtimeRate = rate * 1.5; // 50% more for overtime
  
  const regularCost = fetchmenCount * regularHours * rate;
  const overtimeCost = fetchmenCount * overtimeHours * overtimeRate;
  
  return regularCost + overtimeCost;
};

// Helper function to generate recommendations
const generateRecommendations = (capacity: number, floorArea: number, multiLevel: boolean, densityFactor: number): string[] => {
  const recommendations: string[] = [];
  
  // Basic recommendations
  recommendations.push(`Position ${Math.ceil(capacity / 300)} fetchmen at the main entrance for crowd control.`);
  
  // Based on venue characteristics
  if (multiLevel) {
    recommendations.push("Ensure fetchmen are stationed at all stairwells and elevators to manage vertical traffic flow.");
  }
  
  // Based on density
  if (densityFactor > 0.8) {
    recommendations.push("High crowd density expected. Increase spacing between vendor stalls and ensure clear pathways.");
  }
  
  // Based on capacity
  if (capacity > 1000) {
    recommendations.push("Consider dedicated communication channels for security teams to coordinate across the venue.");
  }
  
  return recommendations;
};
