
// Mock data generator for analytics based on subscription tier
export function generateMockAnalyticsData(subscriptionTier: string = "Free") {
  const today = new Date();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  const tierLevels = {
    "Free": 0,
    "Starter": 1,
    "Growth": 2,
    "Pro": 3,
    "Enterprise": 4,
    "Custom": 4
  };
  
  const currentTierLevel = tierLevels[subscriptionTier as keyof typeof tierLevels] || 0;
  
  // Generate revenue data based on subscription tier
  const generateRevenueData = () => {
    let dataPoints: any[] = [];
    
    if (currentTierLevel === 0) {
      // Free tier - 7 days of data
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        const dayName = date.toLocaleDateString('en-ZA', { weekday: 'short' });
        
        dataPoints.push({
          name: dayName,
          revenue: Math.floor(Math.random() * 10000) + 5000,
        });
      }
    } else if (currentTierLevel === 1) {
      // Starter - 30 days of data
      for (let i = 0; i < 4; i++) {
        dataPoints.push({
          name: `Week ${i + 1}`,
          revenue: Math.floor(Math.random() * 20000) + 10000,
          target: Math.floor(Math.random() * 10000) + 15000,
        });
      }
    } else if (currentTierLevel === 2) {
      // Growth - 90 days of data (3 months)
      for (let i = 2; i >= 0; i--) {
        const monthIndex = (today.getMonth() - i + 12) % 12;
        
        dataPoints.push({
          name: months[monthIndex],
          revenue: Math.floor(Math.random() * 50000) + 30000,
          target: Math.floor(Math.random() * 20000) + 40000,
        });
      }
    } else {
      // Pro/Enterprise - 12 months of data
      for (let i = 11; i >= 0; i--) {
        const monthIndex = (today.getMonth() - i + 12) % 12;
        
        dataPoints.push({
          name: months[monthIndex],
          revenue: Math.floor(Math.random() * 100000) + 50000,
          target: Math.floor(Math.random() * 30000) + 80000,
        });
      }
    }
    
    return dataPoints;
  };
  
  // Generate revenue by source data
  const generateRevenueBySourceData = () => {
    const dataPoints = [];
    const months = ['Last Month', 'This Month'];
    
    for (const month of months) {
      dataPoints.push({
        name: month,
        tickets: Math.floor(Math.random() * 30000) + 20000,
        vendors: Math.floor(Math.random() * 10000) + 5000,
        food: Math.floor(Math.random() * 15000) + 10000,
        other: Math.floor(Math.random() * 5000) + 2000,
      });
    }
    
    return dataPoints;
  };
  
  // Generate guest attendance data
  const generateGuestAttendanceData = () => {
    const dataPoints = [];
    const eventNames = ['Summer Festival', 'Corp Summit', 'Wedding Expo', 'New Year'];
    
    for (const event of eventNames) {
      const capacity = Math.floor(Math.random() * 300) + 200;
      dataPoints.push({
        name: event,
        attendance: Math.floor(Math.random() * capacity) + 100,
        capacity: capacity,
      });
    }
    
    return dataPoints;
  };
  
  // Generate demographics data
  const generateDemographicsData = () => {
    return [
      {
        name: "Event 1",
        "18-24": Math.floor(Math.random() * 100) + 50,
        "25-34": Math.floor(Math.random() * 150) + 100,
        "35-44": Math.floor(Math.random() * 100) + 75,
        "45-54": Math.floor(Math.random() * 50) + 25,
        "55+": Math.floor(Math.random() * 30) + 10,
      },
      {
        name: "Event 2",
        "18-24": Math.floor(Math.random() * 80) + 40,
        "25-34": Math.floor(Math.random() * 130) + 90,
        "35-44": Math.floor(Math.random() * 110) + 65,
        "45-54": Math.floor(Math.random() * 60) + 30,
        "55+": Math.floor(Math.random() * 25) + 15,
      },
    ];
  };
  
  // Generate vendor performance data
  const generateVendorPerformanceData = () => {
    return [
      { name: 'Gourmet Delights', sales: Math.floor(Math.random() * 20000) + 15000 },
      { name: 'Craft Brewery Co.', sales: Math.floor(Math.random() * 15000) + 10000 },
      { name: 'Artisanal Crafts', sales: Math.floor(Math.random() * 8000) + 5000 },
      { name: 'Sound & Lights Pro', sales: Math.floor(Math.random() * 12000) + 8000 },
      { name: 'Event Photographers', sales: Math.floor(Math.random() * 7000) + 3000 },
    ];
  };
  
  // Generate vendor category data
  const generateVendorCategoryData = () => {
    return [
      { name: 'Food', value: Math.floor(Math.random() * 15) + 10 },
      { name: 'Drinks', value: Math.floor(Math.random() * 10) + 5 },
      { name: 'Merchandise', value: Math.floor(Math.random() * 8) + 3 },
      { name: 'Services', value: Math.floor(Math.random() * 6) + 2 },
      { name: 'Other', value: Math.floor(Math.random() * 4) + 1 },
    ];
  };
  
  // Generate forecast data
  const generateForecastData = () => {
    const dataPoints = [];
    const currentMonth = today.getMonth();
    
    // Past 3 months (actual data)
    for (let i = 2; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      dataPoints.push({
        name: months[monthIndex],
        actual: Math.floor(Math.random() * 80000) + 40000,
        forecast: null,
      });
    }
    
    // Next 6 months (forecast data)
    for (let i = 1; i <= 6; i++) {
      const monthIndex = (currentMonth + i) % 12;
      const baseValue = dataPoints[dataPoints.length - 1].actual;
      const growthFactor = 1 + (Math.random() * 0.2 - 0.05); // -5% to +15% growth
      const forecastValue = Math.floor(baseValue * growthFactor);
      
      dataPoints.push({
        name: months[monthIndex],
        actual: null,
        forecast: forecastValue,
      });
    }
    
    return dataPoints;
  };
  
  // Generate mock opportunities
  const generateOpportunities = () => {
    return [
      {
        title: "Increase Vendor Participation",
        description: "Adding 5 more vendors could increase revenue by 15% based on your venue capacity.",
        potential: Math.floor(Math.random() * 20000) + 15000,
      },
      {
        title: "Premium Ticket Tier",
        description: "Adding a VIP ticket option could increase ticket revenue by up to 25%.",
        potential: Math.floor(Math.random() * 30000) + 20000,
      },
      {
        title: "Food & Beverage Optimization",
        description: "Adding craft beer options could increase beverage sales by 20%.",
        potential: Math.floor(Math.random() * 15000) + 10000,
      }
    ];
  };
  
  // Generate recent transactions
  const generateRecentTransactions = () => {
    const transactionTypes = ["income", "payout", "subscription"];
    const descriptions = [
      "Event ticket sales",
      "Vendor application fees",
      "Booking fees",
      "Venue rental",
      "Service provider payment",
      "Monthly subscription",
      "Vendor payout",
      "Commission revenue"
    ];
    
    const transactions = [];
    for (let i = 0; i < 10; i++) {
      const type = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
      const description = descriptions[Math.floor(Math.random() * descriptions.length)];
      const amount = type === "income" ? 
        Math.floor(Math.random() * 20000) + 5000 : 
        Math.floor(Math.random() * 5000) + 1000;
      
      const daysAgo = Math.floor(Math.random() * 14);
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      
      transactions.push({
        id: `trans-${i}`,
        type,
        description,
        amount,
        date: date.toLocaleDateString('en-ZA', { day: '2-digit', month: 'short' }),
      });
    }
    
    return transactions.sort((a, b) => a.date.localeCompare(b.date));
  };
  
  // Calculate the growth percentage for forecasts
  const calculateForecastGrowth = (forecastData: any[]) => {
    if (!forecastData || forecastData.length < 2) return 0;
    
    // Find last actual value
    let lastActualIndex = 0;
    for (let i = 0; i < forecastData.length; i++) {
      if (forecastData[i].actual !== null) {
        lastActualIndex = i;
      }
    }
    
    if (lastActualIndex >= forecastData.length - 1) return 0;
    
    const lastActual = forecastData[lastActualIndex].actual;
    const lastForecast = forecastData[forecastData.length - 1].forecast;
    
    if (!lastActual || !lastForecast) return 0;
    
    return Math.round(((lastForecast - lastActual) / lastActual) * 100);
  };
  
  // Generate all data sets
  const revenueData = generateRevenueData();
  const revenueBySourceData = generateRevenueBySourceData();
  const guestAttendanceData = generateGuestAttendanceData();
  const demographicsData = generateDemographicsData();
  const vendorPerformanceData = generateVendorPerformanceData();
  const vendorCategoryData = generateVendorCategoryData();
  const forecastData = generateForecastData();
  const opportunities = generateOpportunities();
  const recentTransactions = generateRecentTransactions();
  const forecastGrowth = calculateForecastGrowth(forecastData);
  
  return {
    revenueData,
    revenueBySourceData,
    guestAttendanceData, 
    demographicsData,
    vendorPerformanceData,
    vendorCategoryData,
    forecastData,
    opportunities,
    recentTransactions,
    forecastGrowth
  };
}
