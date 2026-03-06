// Realistic mock data for 1,248 investors with authentic payout history

export interface InvestorData {
  id: string;
  name: string;
  city: string;
  state: string;
  investment_amount: number;
  investment_date: string;
  rank: string;
  total_payouts: number;
  payout_history: PayoutRecord[];
}

export interface PayoutRecord {
  id: string;
  month: string;
  amount: number;
  utr: string; // Realistic UTR (12-22 digits)
  txn_id: string; // Realistic TXN ID
  date: string;
  status: 'completed' | 'pending';
}

// Authentic Indian city/state combinations
const indianLocations = [
  { city: "Mumbai", state: "Maharashtra" },
  { city: "Pune", state: "Maharashtra" },
  { city: "Nagpur", state: "Maharashtra" },
  { city: "Delhi", state: "Delhi" },
  { city: "Bangalore", state: "Karnataka" },
  { city: "Hyderabad", state: "Telangana" },
  { city: "Chennai", state: "Tamil Nadu" },
  { city: "Kolkata", state: "West Bengal" },
  { city: "Ahmedabad", state: "Gujarat" },
  { city: "Surat", state: "Gujarat" },
  { city: "Jaipur", state: "Rajasthan" },
  { city: "Lucknow", state: "Uttar Pradesh" },
  { city: "Kanpur", state: "Uttar Pradesh" },
  { city: "Indore", state: "Madhya Pradesh" },
  { city: "Bhopal", state: "Madhya Pradesh" },
  { city: "Patna", state: "Bihar" },
  { city: "Vadodara", state: "Gujarat" },
  { city: "Ghaziabad", state: "Uttar Pradesh" },
  { city: "Ludhiana", state: "Punjab" },
  { city: "Agra", state: "Uttar Pradesh" },
  { city: "Nashik", state: "Maharashtra" },
  { city: "Faridabad", state: "Haryana" },
  { city: "Meerut", state: "Uttar Pradesh" },
  { city: "Rajkot", state: "Gujarat" },
  { city: "Varanasi", state: "Uttar Pradesh" },
  { city: "Srinagar", state: "Jammu & Kashmir" },
  { city: "Aurangabad", state: "Maharashtra" },
  { city: "Dhanbad", state: "Jharkhand" },
  { city: "Amritsar", state: "Punjab" },
  { city: "Allahabad", state: "Uttar Pradesh" },
  { city: "Ranchi", state: "Jharkhand" },
  { city: "Howrah", state: "West Bengal" },
  { city: "Coimbatore", state: "Tamil Nadu" },
  { city: "Jabalpur", state: "Madhya Pradesh" },
  { city: "Gwalior", state: "Madhya Pradesh" },
  { city: "Vijayawada", state: "Andhra Pradesh" },
  { city: "Jodhpur", state: "Rajasthan" },
  { city: "Madurai", state: "Tamil Nadu" },
  { city: "Raipur", state: "Chhattisgarh" },
  { city: "Kota", state: "Rajasthan" },
];

// Common Indian names
const indianNames = [
  "Rajesh Kumar", "Priya Singh", "Amit Patel", "Sneha Sharma", "Vikram Reddy",
  "Anjali Gupta", "Rahul Verma", "Kavita Joshi", "Suresh Nair", "Pooja Desai",
  "Manoj Iyer", "Deepika Rao", "Arun Kumar", "Neha Agarwal", "Sanjay Mishra",
  "Divya Pillai", "Rohan Shah", "Swati Malhotra", "Karthik Menon", "Ritu Kapoor",
  "Arjun Shetty", "Meera Kulkarni", "Nikhil Pandey", "Shreya Bose", "Varun Chopra",
  "Anita Reddy", "Prakash Jain", "Sunita Das", "Vishal Mehta", "Priyanka Khanna",
  "Ashok Kumar", "Lakshmi Nair", "Gaurav Singh", "Asha Patil", "Ramesh Sharma",
  "Karishma Verma", "Harish Gupta", "Shilpa Rao", "Akash Joshi", "Nisha Desai",
  "Ravi Kumar", "Bhavana Iyer", "Sachin Patel", "Tanvi Malhotra", "Yogesh Shah",
  "Simran Kapoor", "Naveen Reddy", "Pallavi Menon", "Vivek Shetty", "Aditi Pillai",
];

// Rank distribution (realistic progression)
const rankDistribution = [
  { rank: "Grey", percentage: 0.45 }, // 45% - Entry level
  { rank: "Bronze", percentage: 0.28 }, // 28%
  { rank: "Silver", percentage: 0.15 }, // 15%
  { rank: "Gold", percentage: 0.07 }, // 7%
  { rank: "Platinum", percentage: 0.03 }, // 3%
  { rank: "Diamond", percentage: 0.015 }, // 1.5%
  { rank: "Ambassador", percentage: 0.005 }, // 0.5%
];

// Investment tiers (from PRD)
const investmentTiers = [
  51111, 1060000, 2700000, 5300000, 11000000, 25000000, 110000000
];

// Generate realistic UTR (Unique Transaction Reference) - 12-22 digits
function generateUTR(): string {
  const prefix = Math.random() > 0.5 ? 'HDFC' : Math.random() > 0.5 ? 'ICIC' : 'SBIN';
  const timestamp = Date.now().toString().slice(-10);
  const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `${prefix}${timestamp}${random}`;
}

// Generate realistic TXN ID - Format: TXN<YYYYMMDD><6-digit-random>
function generateTXN(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `TXN${year}${month}${day}${random}`;
}

// Generate payout history for an investor
function generatePayoutHistory(
  investmentAmount: number,
  investmentDate: Date,
  monthsActive: number
): PayoutRecord[] {
  const payouts: PayoutRecord[] = [];
  const monthlyReturn = investmentAmount * 0.15; // 15% monthly
  
  // First payout after 45 days
  const firstPayoutDate = new Date(investmentDate);
  firstPayoutDate.setDate(firstPayoutDate.getDate() + 45);
  
  payouts.push({
    id: `payout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    month: firstPayoutDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
    amount: monthlyReturn,
    utr: generateUTR(),
    txn_id: generateTXN(firstPayoutDate),
    date: firstPayoutDate.toISOString().split('T')[0],
    status: 'completed'
  });
  
  // Subsequent payouts every 30 days
  for (let i = 1; i < monthsActive; i++) {
    const payoutDate = new Date(firstPayoutDate);
    payoutDate.setDate(payoutDate.getDate() + (i * 30));
    
    // Only generate payouts up to current date
    if (payoutDate > new Date()) break;
    
    payouts.push({
      id: `payout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      month: payoutDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
      amount: monthlyReturn,
      utr: generateUTR(),
      txn_id: generateTXN(payoutDate),
      date: payoutDate.toISOString().split('T')[0],
      status: 'completed'
    });
  }
  
  return payouts;
}

// Assign rank based on total business volume (simplified logic)
function assignRank(investmentAmount: number, totalPayouts: number): string {
  const totalBusiness = investmentAmount + totalPayouts;
  
  if (totalBusiness >= 100000000) return "Ambassador"; // ₹10 Cr+
  if (totalBusiness >= 50000000) return "Diamond"; // ₹5 Cr+
  if (totalBusiness >= 25000000) return "Platinum"; // ₹2.5 Cr+
  if (totalBusiness >= 10000000) return "Gold"; // ₹1 Cr+
  if (totalBusiness >= 5000000) return "Silver"; // ₹50 Lakh+
  if (totalBusiness >= 1000000) return "Bronze"; // ₹10 Lakh+
  return "Grey"; // Entry level
}

// Generate all 1,248 investors
export function generateInvestorsData(): InvestorData[] {
  const investors: InvestorData[] = [];
  const startDate = new Date('2024-01-01');
  const endDate = new Date('2026-02-28'); // Up to Feb 2026
  
  for (let i = 0; i < 1248; i++) {
    // Random investment date within range
    const investmentDate = new Date(
      startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime())
    );
    
    // Calculate months active (used for payout count)
    const monthsActive = Math.floor(
      (new Date().getTime() - investmentDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
    );
    
    // Random investment tier
    const investmentAmount = investmentTiers[Math.floor(Math.random() * investmentTiers.length)];
    
    // Generate payout history
    const payoutHistory = generatePayoutHistory(investmentAmount, investmentDate, monthsActive);
    const totalPayouts = payoutHistory.reduce((sum, p) => sum + p.amount, 0);
    
    // Assign rank
    const rank = assignRank(investmentAmount, totalPayouts);
    
    // Random location
    const location = indianLocations[Math.floor(Math.random() * indianLocations.length)];
    
    // Random or composite name
    const baseName = indianNames[Math.floor(Math.random() * indianNames.length)];
    const name = Math.random() > 0.8 
      ? `${baseName} (ID: ${(i + 1).toString().padStart(4, '0')})`
      : baseName;
    
    investors.push({
      id: `inv_${(i + 1).toString().padStart(4, '0')}`,
      name,
      city: location.city,
      state: location.state,
      investment_amount: investmentAmount,
      investment_date: investmentDate.toISOString().split('T')[0],
      rank,
      total_payouts: totalPayouts,
      payout_history: payoutHistory
    });
  }
  
  // Sort by investment date (oldest first)
  return investors.sort((a, b) => 
    new Date(a.investment_date).getTime() - new Date(b.investment_date).getTime()
  );
}

// Get summary statistics
export function getInvestorStats(investors: InvestorData[]) {
  const totalInvestment = investors.reduce((sum, inv) => sum + inv.investment_amount, 0);
  const totalPayouts = investors.reduce((sum, inv) => sum + inv.total_payouts, 0);
  
  const rankCounts = investors.reduce((acc, inv) => {
    acc[inv.rank] = (acc[inv.rank] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return {
    totalInvestors: investors.length,
    totalInvestment,
    totalPayouts,
    averageInvestment: totalInvestment / investors.length,
    averagePayout: totalPayouts / investors.length,
    rankDistribution: rankCounts
  };
}

// Pre-generate data (call once on module load for consistency)
export const MOCK_INVESTORS = generateInvestorsData();
export const INVESTOR_STATS = getInvestorStats(MOCK_INVESTORS);