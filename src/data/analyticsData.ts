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

// New function for generating detailed analytics data
export function generateDetailedAnalyticsData(subscriptionTier: string = "Free") {
  // Hourly sales and traffic data
  const generateHourlyData = () => {
    const data = [];
    for (let i = 8; i <= 23; i++) {
      const hour = i < 10 ? `0${i}:00` : `${i}:00`;
      
      // Create a sales curve that peaks at lunch and dinner times
      let salesFactor = 1;
      if (i >= 12 && i <= 14) salesFactor = 2.2; // Lunch peak
      if (i >= 18 && i <= 21) salesFactor = 2.5; // Dinner peak
      
      // Create a traffic curve that roughly follows sales but with some variation
      let trafficFactor = salesFactor * (0.8 + Math.random() * 0.4);
      
      data.push({
        hour,
        sales: Math.floor((Math.random() * 1000 + 500) * salesFactor),
        traffic: Math.floor((Math.random() * 10 + 5) * trafficFactor)
      });
    }
    return data;
  };
  
  // Weekday sales data
  const generateWeekdayData = () => {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const data = days.map(day => {
      // Weekend sales are higher
      const isWeekend = day === "Saturday" || day === "Sunday";
      const revenueFactor = isWeekend ? 2.2 : 1;
      
      return {
        day,
        revenue: Math.floor((Math.random() * 15000 + 10000) * revenueFactor)
      };
    });
    return data;
  };
  
  // Monthly trends data for current and previous year
  const generateMonthlyTrendsData = () => {
    const currentMonth = new Date().getMonth();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const data = [];
    
    for (let i = 0; i < months.length; i++) {
      // Only include data up to current month
      if (i <= currentMonth) {
        // Generate higher values for summer months
        const isSummer = i >= 10 || i <= 2; // Southern hemisphere summer (Nov-Mar)
        const thisYearFactor = isSummer ? 1.5 : 1;
        const lastYearFactor = isSummer ? 1.3 : 0.9;
        
        data.push({
          month: months[i],
          thisYear: Math.floor((Math.random() * 30000 + 40000) * thisYearFactor),
          lastYear: Math.floor((Math.random() * 25000 + 35000) * lastYearFactor)
        });
      }
    }
    return data;
  };
  
  // Top selling products
  const generateTopProductsData = () => {
    const products = [
      "Premium Craft Beer",
      "Gourmet Burger",
      "Festival T-Shirt",
      "Wine by Glass",
      "Loaded Fries",
      "Cocktail Special",
      "BBQ Plate"
    ];
    
    return products.map(name => ({
      name,
      revenue: Math.floor(Math.random() * 15000 + 5000)
    })).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  };
  
  // Product category distribution
  const generateCategoryDistributionData = () => {
    return [
      { name: "Food", value: Math.floor(Math.random() * 30000 + 50000), color: "#22c55e" },
      { name: "Beverages", value: Math.floor(Math.random() * 40000 + 60000), color: "#60a5fa" },
      { name: "Merchandise", value: Math.floor(Math.random() * 15000 + 20000), color: "#8b5cf6" },
      { name: "Tickets", value: Math.floor(Math.random() * 50000 + 70000), color: "#f59e0b" },
      { name: "Other", value: Math.floor(Math.random() * 10000 + 5000), color: "#64748b" }
    ];
  };
  
  // Product trends over time
  const generateProductTrendsData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    return months.map(month => ({
      month,
      food: Math.floor(Math.random() * 20000 + 20000),
      drinks: Math.floor(Math.random() * 30000 + 30000),
      merchandise: Math.floor(Math.random() * 10000 + 10000)
    }));
  };
  
  // Vendor commission structure
  const generateVendorCommissionData = () => {
    const vendorTypes = ["Food", "Beverages", "Merchandise", "Services", "Entertainment"];
    return vendorTypes.map(name => {
      const total = Math.floor(Math.random() * 30000 + 20000);
      const hostPercentage = name === "Food" ? 0.25 : name === "Beverages" ? 0.30 : name === "Merchandise" ? 0.20 : 0.15;
      const hostRevenue = Math.floor(total * hostPercentage);
      
      return {
        name,
        hostRevenue,
        vendorRevenue: total - hostRevenue
      };
    });
  };
  
  // Vendor performance comparison
  const generateVendorPerformanceComparisonData = () => {
    const vendors = ["Craft Beer Bar", "Burger Stand", "T-Shirt Shop", "Coffee Cart", "Cocktail Bar", "Pizza Place"];
    return vendors.map(name => ({
      name,
      revenue: Math.floor(Math.random() * 20000 + 10000),
      satisfaction: parseFloat((Math.random() * 2 + 3).toFixed(1)) // 3.0 - 5.0 rating
    }));
  };
  
  // Vendor activity throughout the day
  const generateVendorActivityData = () => {
    const data = [];
    for (let i = 10; i <= 23; i++) {
      const hour = i < 10 ? `0${i}:00` : `${i}:00`;
      
      // Different peak times for different vendor types
      let foodFactor = 1;
      let drinksFactor = 1;
      let merchandiseFactor = 1;
      
      if (i >= 12 && i <= 14) foodFactor = 2.2; // Lunch time food peak
      if (i >= 18 && i <= 21) foodFactor = 2.5; // Dinner time food peak
      
      if (i >= 17 && i <= 23) drinksFactor = 2.2; // Evening drinks peak
      
      if (i >= 14 && i <= 18) merchandiseFactor = 1.8; // Afternoon shopping peak
      
      data.push({
        hour,
        food: Math.floor((Math.random() * 50 + 30) * foodFactor),
        drinks: Math.floor((Math.random() * 60 + 20) * drinksFactor),
        merchandise: Math.floor((Math.random() * 30 + 10) * merchandiseFactor)
      });
    }
    return data;
  };
  
  // Customer satisfaction scores
  const generateSatisfactionScoresData = () => {
    const categories = ["Overall Experience", "Venue Facilities", "Food Quality", "Beverage Selection", "Staff Service", "Value for Money"];
    return categories.map(category => ({
      category,
      rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)) // 3.5 - 5.0 rating
    }));
  };
  
  // Feedback trends over time
  const generateFeedbackTrendsData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    return months.map(month => ({
      month,
      overall: parseFloat((Math.random() * 1 + 3.8).toFixed(1)),
      venue: parseFloat((Math.random() * 1 + 3.7).toFixed(1)),
      vendor: parseFloat((Math.random() * 1 + 3.6).toFixed(1))
    }));
  };
  
  // Feedback analysis (themes from comments)
  const generateFeedbackAnalysisData = () => {
    const themes = [
      "Food Quality", 
      "Waiting Time", 
      "Venue Layout", 
      "Staff Friendliness", 
      "Value for Money", 
      "Product Selection"
    ];
    
    return themes.map(theme => ({
      theme,
      positive: Math.floor(Math.random() * 50 + 30),
      negative: Math.floor(Math.random() * 30 + 5)
    })).sort((a, b) => (b.positive + b.negative) - (a.positive + a.negative));
  };
  
  return {
    hourlyData: generateHourlyData(),
    weekdayData: generateWeekdayData(),
    monthlyTrendsData: generateMonthlyTrendsData(),
    topProductsData: generateTopProductsData(),
    categoryDistributionData: generateCategoryDistributionData(),
    productTrendsData: generateProductTrendsData(),
    vendorCommissionData: generateVendorCommissionData(),
    vendorPerformanceComparisonData: generateVendorPerformanceComparisonData(),
    vendorActivityData: generateVendorActivityData(),
    satisfactionScoresData: generateSatisfactionScoresData(),
    feedbackTrendsData: generateFeedbackTrendsData(),
    feedbackAnalysisData: generateFeedbackAnalysisData()
  };
}

// New function to generate detailed food delivery analytics
export function generateDetailedFoodDeliveryData() {
  // Hourly sales by food type
  const generateHourlySalesByType = () => {
    const data = [];
    for (let i = 0; i < 24; i++) {
      const hour = i < 10 ? `0${i}:00` : `${i}:00`;
      
      // Create pattern with lunch and dinner peaks
      let multiplier = 1;
      if (i >= 11 && i <= 13) multiplier = 2.5; // lunch peak
      if (i >= 18 && i <= 20) multiplier = 3; // dinner peak
      
      data.push({
        hour,
        burgers: Math.floor((Math.random() * 15 + 5) * multiplier),
        pizza: Math.floor((Math.random() * 12 + 4) * multiplier),
        salads: Math.floor((Math.random() * 8 + 3) * multiplier),
        desserts: Math.floor((Math.random() * 5 + 2) * multiplier),
        drinks: Math.floor((Math.random() * 20 + 10) * multiplier),
      });
    }
    return data;
  };
  
  // Delivery time breakdown
  const generateDeliveryTimeBreakdown = () => {
    return [
      { stage: "Order Received", time: 0 },
      { stage: "Order Accepted", time: Math.floor(Math.random() * 2) + 1 },
      { stage: "Preparation Started", time: Math.floor(Math.random() * 2) + 2 },
      { stage: "Preparation Completed", time: Math.floor(Math.random() * 5) + 10 },
      { stage: "Pickup by Driver", time: Math.floor(Math.random() * 3) + 15 },
      { stage: "Delivery Completed", time: Math.floor(Math.random() * 10) + 25 }
    ];
  };
  
  // Driver performance comparison
  const generateDriverPerformance = () => {
    const drivers = ["Driver A", "Driver B", "Driver C", "Driver D", "Driver E"];
    return drivers.map(name => ({
      name,
      deliveries: Math.floor(Math.random() * 20) + 30,
      avgTime: Math.floor(Math.random() * 10) + 15,
      rating: parseFloat((Math.random() * 1 + 4).toFixed(1)),
      onTimeRate: Math.floor(Math.random() * 15) + 80
    }));
  };
  
  // Item preparation time by time of day
  const generatePreparationTimeByHour = () => {
    const data = [];
    for (let i = 0; i < 24; i++) {
      const hour = i < 10 ? `0${i}:00` : `${i}:00`;
      
      // Preparation times might be longer during peak hours
      let rushFactor = 1;
      if (i >= 11 && i <= 13) rushFactor = 1.3; // lunch rush
      if (i >= 18 && i <= 20) rushFactor = 1.4; // dinner rush
      
      data.push({
        hour,
        burgers: Math.floor((Math.random() * 3 + 8) * rushFactor),
        pizza: Math.floor((Math.random() * 4 + 10) * rushFactor),
        salads: Math.floor((Math.random() * 2 + 5) * rushFactor),
        desserts: Math.floor((Math.random() * 1 + 3) * rushFactor),
      });
    }
    return data;
  };
  
  // Customer preferences heat map data (time of day x food category)
  const generatePreferenceHeatMap = () => {
    const timeSlots = ["Morning", "Lunch", "Afternoon", "Dinner", "Late Night"];
    const categories = ["Burgers", "Pizza", "Asian", "Salads", "Desserts", "Drinks"];
    
    const heatMapData = [];
    for (const slot of timeSlots) {
      const row: Record<string, any> = { timeSlot: slot };
      
      for (const category of categories) {
        // Different food categories are more popular at different times
        let baseValue = 0;
        
        switch (slot) {
          case "Morning":
            baseValue = category === "Drinks" ? 80 : category === "Desserts" ? 60 : 30;
            break;
          case "Lunch":
            baseValue = category === "Burgers" || category === "Salads" ? 90 : 60;
            break;
          case "Afternoon":
            baseValue = category === "Desserts" || category === "Drinks" ? 75 : 40;
            break;
          case "Dinner":
            baseValue = category === "Pizza" || category === "Asian" ? 95 : 70;
            break;
          case "Late Night":
            baseValue = category === "Pizza" || category === "Burgers" ? 85 : 50;
            break;
        }
        
        row[category] = Math.floor(Math.random() * 20) + baseValue;
      }
      
      heatMapData.push(row);
    }
    
    return heatMapData;
  };
  
  // Sales by location
  const generateSalesByLocation = () => {
    return [
      { city: "Johannesburg", sales: Math.floor(Math.random() * 5000) + 8000 },
      { city: "Cape Town", sales: Math.floor(Math.random() * 4000) + 7000 },
      { city: "Durban", sales: Math.floor(Math.random() * 3000) + 5000 },
      { city: "Pretoria", sales: Math.floor(Math.random() * 2500) + 4000 },
      { city: "Port Elizabeth", sales: Math.floor(Math.random() * 2000) + 3000 },
      { city: "Bloemfontein", sales: Math.floor(Math.random() * 1500) + 2000 },
    ];
  };
  
  // Order value distribution
  const generateOrderValueDistribution = () => {
    return [
      { range: "R0-R50", count: Math.floor(Math.random() * 100) + 200 },
      { range: "R50-R100", count: Math.floor(Math.random() * 150) + 350 },
      { range: "R100-R150", count: Math.floor(Math.random() * 200) + 450 },
      { range: "R150-R200", count: Math.floor(Math.random() * 150) + 300 },
      { range: "R200-R250", count: Math.floor(Math.random() * 100) + 200 },
      { range: "R250+", count: Math.floor(Math.random() * 80) + 150 },
    ];
  };
  
  // Weekly sales trends 
  const generateWeeklySalesTrends = () => {
    const data = [];
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    
    for (const day of days) {
      const isWeekend = day === "Saturday" || day === "Sunday";
      
      data.push({
        day,
        sales: Math.floor((Math.random() * 5000) + (isWeekend ? 15000 : 10000)),
        orders: Math.floor((Math.random() * 50) + (isWeekend ? 150 : 100)),
        averageOrderValue: Math.floor((Math.random() * 50) + 100)
      });
    }
    
    return data;
  };
  
  return {
    hourlySalesByType: generateHourlySalesByType(),
    deliveryTimeBreakdown: generateDeliveryTimeBreakdown(),
    driverPerformance: generateDriverPerformance(),
    preparationTimeByHour: generatePreparationTimeByHour(),
    preferenceHeatMap: generatePreferenceHeatMap(),
    salesByLocation: generateSalesByLocation(),
    orderValueDistribution: generateOrderValueDistribution(),
    weeklySalesTrends: generateWeeklySalesTrends()
  };
}
