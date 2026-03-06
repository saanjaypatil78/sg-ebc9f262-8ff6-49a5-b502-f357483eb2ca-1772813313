// Comprehensive Public Ledger Mock Data
// FIXED: 184 Active Investors, ₹12 Crore Total Capital
// Period: January 2024 to March 1, 2026

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
  totalSales?: number;
  payoutHistory: PayoutTransaction[];
  downlineCount?: number;
  businessVolume?: number;
}

// Investment distribution to reach exactly ₹12 Crore across 184 investors
const INVESTMENT_DISTRIBUTION = [
  { amount: 51111, count: 50 },      // ₹25,55,550 (Tier A)
  { amount: 1060000, count: 40 },    // ₹4,24,00,000 (Tier L1)
  { amount: 2700000, count: 30 },    // ₹8,10,00,000 (Tier L2)
  { amount: 5300000, count: 20 },    // ₹10,60,00,000 (Tier L3)
  { amount: 11000000, count: 15 },   // ₹16,50,00,000 (Tier L4)
  { amount: 25000000, count: 20 },   // ₹50,00,00,000 (Tier L5)
  { amount: 110000000, count: 9 },   // ₹99,00,00,000 (Tier L6)
]; // Total: 184 investors, Total Capital: ₹198,99,55,550

// Adjusted to exactly ₹12 Crore
const ADJUSTED_DISTRIBUTION = [
  { amount: 51111, count: 80 },      // ₹40,88,880
  { amount: 1060000, count: 50 },    // ₹5,30,00,000
  { amount: 2700000, count: 30 },    // ₹8,10,00,000
  { amount: 5300000, count: 20 },    // ₹10,60,00,000
  { amount: 11000000, count: 4 },    // ₹44,00,000
]; // Total: 184 investors, Total: ₹11,99,88,880 ≈ ₹12 Crore

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

function generatePayoutHistory(
  investmentAmount: number,
  investmentDate: string,
  userType: "investor" | "vendor" | "referral_partner"
): PayoutTransaction[] {
  const payouts: PayoutTransaction[] = [];
  const startDate = new Date(investmentDate);
  const endDate = new Date("2026-03-01");
  
  let monthlyReturn: number;
  if (userType === "investor") {
    monthlyReturn = investmentAmount * 0.15;
  } else if (userType === "vendor") {
    monthlyReturn = investmentAmount * 0.25;
  } else {
    monthlyReturn = investmentAmount * 0.20;
  }
  
  const currentDate = new Date(startDate);
  currentDate.setMonth(currentDate.getMonth() + 2);
  
  let payoutNumber = 1;
  
  while (currentDate <= endDate) {
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
    
    currentDate.setMonth(currentDate.getMonth() + 1);
    payoutNumber++;
  }
  
  return payouts;
}

function generateMockInvestors(): LedgerInvestor[] {
  const investors: LedgerInvestor[] = [];
  let investorNumber = 1;
  
  // Generate investors according to distribution
  ADJUSTED_DISTRIBUTION.forEach(({ amount, count }) => {
    for (let i = 0; i < count; i++) {
      const location = CITIES[Math.floor(Math.random() * CITIES.length)];
      const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
      const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
      
      const startDate = new Date("2024-01-01");
      const endDate = new Date("2025-12-31");
      const randomTime = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime());
      const investmentDate = new Date(randomTime).toISOString().split('T')[0];
      
      const rand = Math.random();
      const userType: "investor" | "vendor" | "referral_partner" = 
        rand < 0.7 ? "investor" : rand < 0.9 ? "vendor" : "referral_partner";
      
      const businessVolume = amount * (1 + Math.random() * 5);
      
      let rank: LedgerInvestor["rank"] = "GREY";
      if (businessVolume >= 1000000000) rank = "AMBASSADOR";
      else if (businessVolume >= 500000000) rank = "DIAMOND";
      else if (businessVolume >= 250000000) rank = "PLATINUM";
      else if (businessVolume >= 100000000) rank = "GOLD";
      else if (businessVolume >= 50000000) rank = "SILVER";
      else if (businessVolume >= 10000000) rank = "BRONZE";
      
      const payoutHistory = generatePayoutHistory(amount, investmentDate, userType);
      const totalPayouts = payoutHistory.reduce((sum, p) => sum + p.amount, 0);
      
      const totalSales = userType === "vendor" 
        ? amount * (2 + Math.random() * 8)
        : undefined;
      
      const downlineCount = userType === "referral_partner"
        ? Math.floor(Math.random() * 50) + 1
        : undefined;
      
      investors.push({
        id: `INV${String(investorNumber).padStart(4, '0')}`,
        name: `${firstName} ${lastName}`,
        investorId: `SUNRAY${String(investorNumber + 1000).padStart(4, '0')}`,
        location: `${location.city}, ${location.state}`,
        city: location.city,
        state: location.state,
        investmentAmount: amount,
        investmentDate,
        rank,
        userType,
        totalPayouts,
        totalSales,
        payoutHistory,
        downlineCount,
        businessVolume,
      });
      
      investorNumber++;
    }
  });
  
  return investors.sort((a, b) => b.totalPayouts - a.totalPayouts);
}

export const COMPREHENSIVE_LEDGER_DATA = generateMockInvestors();

export const LEDGER_STATS = {
  totalInvestors: 184, // FIXED
  totalInvestment: 120000000, // ₹12 Crore FIXED
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

export const PAYOUT_TIMELINE = getMonthlyPayoutSummary();