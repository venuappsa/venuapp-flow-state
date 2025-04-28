
export interface FetchmanAllocationResult {
  entranceFetchmen: number;
  internalFetchmen: number;
  vendorFetchmen: number;
  securityStaff: number;
  eventStaff: number;
  totalFetchmen: number;
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

export const generateFetchmanStaffingPlan = (fetchmenCount: number) => {
  // Simple distribution of fetchmen across different areas
  const entranceFetchmen = Math.max(1, Math.floor(fetchmenCount * 0.3)); // 30% at entrance
  const vendorFetchmen = Math.max(1, Math.floor(fetchmenCount * 0.3)); // 30% for vendors
  const internalFetchmen = fetchmenCount - entranceFetchmen - vendorFetchmen; // Rest for internal areas
  
  return {
    entranceFetchmen,
    vendorFetchmen,
    internalFetchmen,
    totalFetchmen: fetchmenCount
  };
};

export const calculateFetchmanAllocation = (capacity: number, floorArea: number, multiLevel: boolean): FetchmanAllocationResult => {
  // Calculate basic fetchmen estimate
  const totalFetchmen = calculateFetchmanEstimate(capacity, Math.ceil(floorArea / 100));
  
  // Calculate distribution
  const entranceFetchmen = Math.max(1, Math.floor(totalFetchmen * 0.25));
  const vendorFetchmen = Math.max(1, Math.floor(totalFetchmen * 0.35));
  const internalFetchmen = totalFetchmen - entranceFetchmen - vendorFetchmen;
  
  // Calculate additional staff needed
  const securityStaff = Math.max(2, Math.ceil(capacity / 150) + (multiLevel ? 2 : 0));
  const eventStaff = Math.max(3, Math.ceil(capacity / 100));
  
  return {
    entranceFetchmen,
    internalFetchmen,
    vendorFetchmen,
    securityStaff,
    eventStaff,
    totalFetchmen
  };
};
