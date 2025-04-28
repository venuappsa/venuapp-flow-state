
/**
 * Utility to calculate Fetchman requirements for events
 */

/**
 * Calculate estimated number of fetchmen needed for an event
 * using the formula: ((Capacity ÷ 60) + (Vendors ÷ 6)) × 1.1
 * 
 * @param capacity - The event capacity (number of attendees)
 * @param vendors - The number of vendors at the event
 * @returns The estimated number of fetchmen needed
 */
export const calculateFetchmanEstimate = (capacity: number, vendors: number): number => {
  const estimate = ((capacity / 60) + (vendors / 6)) * 1.1;
  return Math.ceil(estimate); // Round up to the nearest whole number
};

/**
 * Calculate the cost estimate for fetchman services
 * 
 * @param fetchmenCount - Number of fetchmen needed
 * @param hours - Duration of the event in hours
 * @param rate - Hourly rate per fetchman (default: 150)
 * @returns The estimated cost of fetchman services
 */
export const calculateFetchmanCost = (fetchmenCount: number, hours: number, rate: number = 150): number => {
  return fetchmenCount * hours * rate;
};

/**
 * Generate a fetchman staffing plan based on the estimation
 * 
 * @param fetchmenCount - Number of fetchmen needed
 * @param eventDuration - Duration of the event in hours
 * @returns Staffing plan with shift information
 */
export const generateFetchmanStaffingPlan = (fetchmenCount: number, eventDuration: number) => {
  // For events longer than 8 hours, we need to split into shifts
  const needsShifts = eventDuration > 8;
  
  if (needsShifts) {
    const shiftsNeeded = Math.ceil(eventDuration / 8);
    const fetchmenPerShift = Math.ceil(fetchmenCount / shiftsNeeded);
    
    return {
      shiftsNeeded,
      fetchmenPerShift,
      totalFetchmen: fetchmenPerShift * shiftsNeeded,
      shiftHours: Math.min(8, eventDuration),
      isMultiShift: true,
    };
  }
  
  return {
    shiftsNeeded: 1,
    fetchmenPerShift: fetchmenCount,
    totalFetchmen: fetchmenCount,
    shiftHours: eventDuration,
    isMultiShift: false,
  };
};

/**
 * Calculate the optimal allocation of fetchmen based on venue size and layout
 * 
 * @param capacity - The event capacity (number of attendees)
 * @param floorArea - Square meters of the venue floor space
 * @param multiLevel - Whether the venue has multiple levels
 * @returns Object with allocation breakdown and recommendations
 */
export const calculateFetchmanAllocation = (capacity: number, floorArea: number, multiLevel: boolean = false): FetchmanAllocationResult => {
  // Base calculation from normal formula
  const baseFetchmen = calculateFetchmanEstimate(capacity, Math.ceil(capacity / 50)); // Assume 1 vendor per 50 attendees if not provided
  
  // Calculate density factor (higher density requires more fetchmen)
  const densityFactor = capacity / floorArea;
  const densityAdjustment = densityFactor > 1.5 ? 1.2 : 1.0;
  
  // Multi-level venues need more fetchmen for coordination
  const levelFactor = multiLevel ? 1.25 : 1.0;
  
  // Calculate area-specific allocations
  const totalFetchmen = Math.ceil(baseFetchmen * densityAdjustment * levelFactor);
  
  // Allocate fetchmen to different areas
  const entranceAllocation = Math.ceil(totalFetchmen * 0.2);
  const vendorAreaAllocation = Math.ceil(totalFetchmen * 0.3);
  const generalAreaAllocation = Math.ceil(totalFetchmen * 0.4);
  const emergencyReserve = Math.max(1, Math.ceil(totalFetchmen * 0.1));
  
  return {
    total: totalFetchmen,
    allocation: {
      entranceAndExit: entranceAllocation,
      vendorAreas: vendorAreaAllocation,
      generalAreas: generalAreaAllocation,
      emergencyReserve: emergencyReserve,
    },
    densityFactor,
    recommendations: generateFetchmanRecommendations(totalFetchmen, densityFactor, multiLevel),
  };
};

/**
 * Generate specific recommendations based on fetchman calculations
 */
const generateFetchmanRecommendations = (totalFetchmen: number, densityFactor: number, multiLevel: boolean): string[] => {
  const recommendations: string[] = [];
  
  if (totalFetchmen > 20) {
    recommendations.push("Consider assigning a Fetchman team leader for every 10 fetchmen.");
  }
  
  if (densityFactor > 1.5) {
    recommendations.push("High attendee density detected. Consider additional crowd control measures.");
  }
  
  if (multiLevel) {
    recommendations.push("For multi-level venues, ensure fetchmen have clear communication channels between levels.");
  }
  
  if (totalFetchmen > 50) {
    recommendations.push("For large-scale events, consider setting up dedicated fetchman rest areas for shift rotation.");
  }
  
  return recommendations;
};

/**
 * Generate a QR code for fetchman assignments
 * 
 * @param eventId - The ID of the event
 * @returns A URL that can be used to generate a QR code
 */
export const generateFetchmanQRCode = (eventId: string): string => {
  return `https://venuapp.co.za/fetchman/assignments/${eventId}`;
};

/**
 * Calculate overtime costs for fetchman services
 * 
 * @param standardHours - Regular hours worked
 * @param overtimeHours - Overtime hours worked
 * @param fetchmenCount - Number of fetchmen
 * @param standardRate - Standard hourly rate
 * @returns The total cost including overtime
 */
export const calculateOvertimeCosts = (
  standardHours: number, 
  overtimeHours: number, 
  fetchmenCount: number,
  standardRate: number = 150
): number => {
  const overtimeRate = standardRate * 1.5; // 50% premium for overtime
  
  const standardCost = standardHours * fetchmenCount * standardRate;
  const overtimeCost = overtimeHours * fetchmenCount * overtimeRate;
  
  return standardCost + overtimeCost;
};

// Types for the enhanced fetchman functionality

export interface FetchmanAllocationResult {
  total: number;
  allocation: {
    entranceAndExit: number;
    vendorAreas: number;
    generalAreas: number;
    emergencyReserve: number;
  };
  densityFactor: number;
  recommendations: string[];
}

export interface FetchmanShiftPlan {
  shiftsNeeded: number;
  fetchmenPerShift: number;
  totalFetchmen: number;
  shiftHours: number;
  isMultiShift: boolean;
}

export interface FetchmanCostBreakdown {
  baseCost: number;
  overtimeCost: number;
  equipmentCost: number;
  transportationCost: number;
  totalCost: number;
}
