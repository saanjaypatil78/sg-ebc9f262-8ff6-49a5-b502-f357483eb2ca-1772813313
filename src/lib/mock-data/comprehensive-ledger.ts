// Comprehensive Public Ledger Mock Data
// Period: January 2024 to March 1, 2026
// Payouts: Days 1-5 of each month

export interface PayoutTransaction {
  id: string;
  date: string;
  type: "investor_return" | "vendor_return" | "referral_commission" | "royalty";
  amount: number;
  status: "completed" | "pending";
  utr: string;
  month: string;
}

export interface LedgerInvestor {
  id: string;
  name: string;
  investorId: string;
  location: string;
  city: string;
  state: string;
  investmentAmount: number;
  investmentDate: string;
  rank: "GREY" | "BRONZE" | "SILVER" | "GOLD" | "PLATINUM" | "DIAMOND" | "AMBASSADOR";
  userType: "investor" | "vendor" | "referral_partner";
  totalPayouts: number;
  totalSales?: number; // For vendors
  payoutHistory: PayoutTransaction[];
  downlineCount?: number;
  businessVolume?: number;
}

// Investment tiers from PRD
const INVESTMENT_TIERS = [
  { name: "A", amount: 51111, monthlyReturn: 7667 },
  { name: "L1", amount: 1060000, monthlyReturn: 159000 },
  { name: "L2", amount: 2700000, monthlyReturn: 405000 },
  { name: "L3", amount: 5300000, monthlyReturn: 795000 },
  { name: "L4", amount: 11000000, monthlyReturn: 1650000 },
  { name: "L5", amount: 25000000, monthlyReturn: 3750000 },
  { name: "L6", amount: 110000000, monthlyReturn: 16500000 },
];

// Rank criteria from PRD
const RANK_CRITERIA = [
  { rank: "GREY", minBusiness: 0, royalty: 0 },
  { rank: "BRONZE", minBusiness: 10000000, royalty: 0.01 },
  { rank: "SILVER", minBusiness: 50000000, royalty: 0.0175 },
  { rank: "GOLD", minBusiness: 100000000, royalty: 0.0225 },
  { rank: "PLATINUM", minBusiness: 250000000, royalty: 0.026 },
  { rank: "DIAMOND", minBusiness: 500000000, royalty: 0.0285 },
  { rank: "AMBASSADOR", minBusiness: 1000000000, royalty: 0.03 },
];

// Indian cities for realistic data
const CITIES = [
  { city: "Mumbai", state: "Maharashtra" },
  { city: "Delhi", state: "Delhi" },
  { city: "Bangalore", state: "Karnataka" },
  { city: "Hyderabad", state: "Telangana" },
  { city: "Ahmedabad", state: "Gujarat" },
  { city: "Chennai", state: "Tamil Nadu" },
  { city: "Kolkata", state: "West Bengal" },
  { city: "Pune", state: "Maharashtra" },
  { city: "Jaipur", state: "Rajasthan" },
  { city: "Surat", state: "Gujarat" },
  { city: "Lucknow", state: "Uttar Pradesh" },
  { city: "Kanpur", state: "Uttar Pradesh" },
  { city: "Nagpur", state: "Maharashtra" },
  { city: "Indore", state: "Madhya Pradesh" },
  { city: "Thane", state: "Maharashtra" },
  { city: "Bhopal", state: "Madhya Pradesh" },
  { city: "Visakhapatnam", state: "Andhra Pradesh" },
  { city: "Pimpri-Chinchwad", state: "Maharashtra" },
  { city: "Patna", state: "Bihar" },
  { city: "Vadodara", state: "Gujarat" },
];

const FIRST_NAMES = [
  "Raj", "Amit", "Priya", "Sanjay", "Neha", "Vikram", "Anjali", "Rahul",
  "Pooja", "Arjun", "Kavya", "Karan", "Sneha", "Rohan", "Divya", "Aditya",
  "Meera", "Varun", "Riya", "Nikhil", "Ananya", "Aryan", "Ishita", "Kunal",
  "Shreya", "Manish", "Nisha", "Prakash", "Deepika", "Suresh"
];

const LAST_NAMES = [
  "Sharma", "Patel", "Singh", "Kumar", "Gupta", "Reddy", "Verma", "Jain",
  "Agarwal", "Chopra", "Malhotra", "Mehta", "Shah", "Kapoor", "Nair",
  "Iyer", "Desai", "Rao", "Bhat", "Kulkarni"
];

// Generate payout history from Jan 2024 to Mar 1, 2026
function generatePayoutHistory(
  investmentAmount: number,
  investmentDate: string,
  userType: "investor" | "vendor" | "referral_partner"
): PayoutTransaction[] {
  const payouts: PayoutTransaction[] = [];
  const startDate = new Date(investmentDate);
  const endDate = new Date("2026-03-01");
  
  // Calculate monthly return based on user type
  let monthlyReturn: number;
  if (userType === "investor") {
    monthlyReturn = investmentAmount * 0.15; // 15% monthly
  } else if (userType === "vendor") {
    monthlyReturn = investmentAmount * 0.25; // 25% monthly (active)
  } else {
    // Referral partner - commission based on downline
    monthlyReturn = investmentAmount * 0.20; // 20% Level 1 commission
  }
  
  const currentDate = new Date(startDate);
  currentDate.setMonth(currentDate.getMonth() + 2); // First payout after 45 days
  
  let payoutNumber = 1;
  
  while (currentDate <= endDate) {
    // Payout on random day between 1-5 of the month
    const payoutDay = Math.floor(Math.random() * 5) + 1;
    const payoutDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), payoutDay);
    
    if (payoutDate <= endDate) {
      const type = userType === "investor" 
        ? "investor_return" 
        : userType === "vendor" 
        ? "vendor_return" 
        : "referral_commission";
      
      payouts.push({
        id: `TXN${Date.now()}${payoutNumber}`,
        date: payoutDate.toISOString().split('T')[0],
        type,
        amount: monthlyReturn,
        status: payoutDate < new Date() ? "completed" : "pending",
        utr: `UTR${Math.random().toString(36).substr(2, 12).toUpperCase()}`,
        month: payoutDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })
      });
    }
    
    // Move to next month
    currentDate.setMonth(currentDate.getMonth() + 1);
    payoutNumber++;
  }
  
  return payouts;
}

// Generate comprehensive mock investors
function generateMockInvestors(): LedgerInvestor[] {
  const investors: LedgerInvestor[] = [];
  const investorCount = 1248; // As per PRD
  
  for (let i = 0; i < investorCount; i++) {
    // Random investment tier
    const tier = INVESTMENT_TIERS[Math.floor(Math.random() * INVESTMENT_TIERS.length)];
    
    // Random location
    const location = CITIES[Math.floor(Math.random() * CITIES.length)];
    
    // Random name
    const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    
    // Random investment date between Jan 2024 and Dec 2025
    const startDate = new Date("2024-01-01");
    const endDate = new Date("2025-12-31");
    const randomTime = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime());
    const investmentDate = new Date(randomTime).toISOString().split('T')[0];
    
    // Random user type (70% investor, 20% vendor, 10% referral partner)
    const rand = Math.random();
    const userType: "investor" | "vendor" | "referral_partner" = 
      rand < 0.7 ? "investor" : rand < 0.9 ? "vendor" : "referral_partner";
    
    // Calculate business volume (for rank determination)
    const businessVolume = tier.amount * (1 + Math.random() * 10); // 1x to 11x multiplier
    
    // Determine rank based on business volume
    let rank: LedgerInvestor["rank"] = "GREY";
    for (const criteria of RANK_CRITERIA.reverse()) {
      if (businessVolume >= criteria.minBusiness) {
        rank = criteria.rank as LedgerInvestor["rank"];
        break;
      }
    }
    
    // Generate payout history
    const payoutHistory = generatePayoutHistory(tier.amount, investmentDate, userType);
    const totalPayouts = payoutHistory.reduce((sum, p) => sum + p.amount, 0);
    
    // For vendors, add sales data
    const totalSales = userType === "vendor" 
      ? tier.amount * (2 + Math.random() * 8) // 2x to 10x revenue multiplier
      : undefined;
    
    // For referral partners, add downline count
    const downlineCount = userType === "referral_partner"
      ? Math.floor(Math.random() * 50) + 1
      : undefined;
    
    investors.push({
      id: `INV${String(i + 1).padStart(4, '0')}`,
      name: `${firstName} ${lastName}`,
      investorId: `SUNRAY${String(i + 1001).padStart(4, '0')}`,
      location: `${location.city}, ${location.state}`,
      city: location.city,
      state: location.state,
      investmentAmount: tier.amount,
      investmentDate,
      rank,
      userType,
      totalPayouts,
      totalSales,
      payoutHistory,
      downlineCount,
      businessVolume,
    });
  }
  
  // Sort by total payouts (descending)
  return investors.sort((a, b) => b.totalPayouts - a.totalPayouts);
}

// Export comprehensive ledger data
export const COMPREHENSIVE_LEDGER_DATA = generateMockInvestors();

// Export aggregated statistics
export const LEDGER_STATS = {
  totalInvestors: COMPREHENSIVE_LEDGER_DATA.length,
  totalInvestment: COMPREHENSIVE_LEDGER_DATA.reduce((sum, inv) => sum + inv.investmentAmount, 0),
  totalPayoutsDistributed: COMPREHENSIVE_LEDGER_DATA.reduce((sum, inv) => sum + inv.totalPayouts, 0),
  totalVendorSales: COMPREHENSIVE_LEDGER_DATA
    .filter(inv => inv.userType === "vendor")
    .reduce((sum, inv) => sum + (inv.totalSales || 0), 0),
  totalReferralPartners: COMPREHENSIVE_LEDGER_DATA.filter(inv => inv.userType === "referral_partner").length,
  totalVendors: COMPREHENSIVE_LEDGER_DATA.filter(inv => inv.userType === "vendor").length,
  totalInvestorsOnly: COMPREHENSIVE_LEDGER_DATA.filter(inv => inv.userType === "investor").length,
  rankDistribution: {
    GREY: COMPREHENSIVE_LEDGER_DATA.filter(inv => inv.rank === "GREY").length,
    BRONZE: COMPREHENSIVE_LEDGER_DATA.filter(inv => inv.rank === "BRONZE").length,
    SILVER: COMPREHENSIVE_LEDGER_DATA.filter(inv => inv.rank === "SILVER").length,
    GOLD: COMPREHENSIVE_LEDGER_DATA.filter(inv => inv.rank === "GOLD").length,
    PLATINUM: COMPREHENSIVE_LEDGER_DATA.filter(inv => inv.rank === "PLATINUM").length,
    DIAMOND: COMPREHENSIVE_LEDGER_DATA.filter(inv => inv.rank === "DIAMOND").length,
    AMBASSADOR: COMPREHENSIVE_LEDGER_DATA.filter(inv => inv.rank === "AMBASSADOR").length,
  },
  averageROI: (COMPREHENSIVE_LEDGER_DATA.reduce((sum, inv) => 
    sum + ((inv.totalPayouts / inv.investmentAmount) * 100), 0
  ) / COMPREHENSIVE_LEDGER_DATA.length).toFixed(2),
};

// Export monthly payout summary (Jan 2024 - Mar 2026)
export function getMonthlyPayoutSummary() {
  const monthlySummary: Record<string, number> = {};
  
  COMPREHENSIVE_LEDGER_DATA.forEach(investor => {
    investor.payoutHistory.forEach(payout => {
      if (payout.status === "completed") {
        const month = payout.month;
        monthlySummary[month] = (monthlySummary[month] || 0) + payout.amount;
      }
    });
  });
  
  return Object.entries(monthlySummary)
    .map(([month, amount]) => ({ month, amount }))
    .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
}

// Export payout timeline for visualization
export const PAYOUT_TIMELINE = getMonthlyPayoutSummary();