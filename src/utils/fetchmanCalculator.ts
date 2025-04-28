
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
