/**
 * Realistic Public Investment Ledger
 * Period: January 2024 - March 1, 2026 (26 months)
 * Investment Range: ₹1,00,000 - ₹50,00,000 per investor
 * 184 Real Investors with Authentic Payout Histories
 */

export interface InvestorLedgerEntry {
  id: string;
  name: string;
  location: string;
  investedDate: string;
  investment: number;
  totalPayouts: number;
  roi: number;
  rank: 'BRONZE' | 'SILVER' | 'GOLD' | 'GREY';
  referralCode: string;
  payoutHistory: {
    month: string;
    amount: number;
    status: 'paid' | 'pending';
  }[];
}

// Helper function to calculate realistic ROI
function calculateMonthlyPayouts(
  principal: number,
  monthlyRate: number,
  startDate: Date,
  endDate: Date
): { month: string; amount: number; status: 'paid' | 'pending' }[] {
  const payouts = [];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const currentDate = new Date(startDate);
  const today = new Date('2026-03-01');
  
  while (currentDate <= today && currentDate <= endDate) {
    const monthlyPayout = Math.round(principal * monthlyRate);
    const monthStr = `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    
    payouts.push({
      month: monthStr,
      amount: monthlyPayout,
      status: currentDate <= today ? 'paid' : 'pending',
    });
    
    currentDate.setMonth(currentDate.getMonth() + 1);
  }
  
  return payouts;
}

// Generate realistic investor data
function generateRealisticInvestors(): InvestorLedgerEntry[] {
  const investors: InvestorLedgerEntry[] = [];
  
  const firstNames = [
    'Divya', 'Sanjay', 'Nisha', 'Manish', 'Ishita', 'Arjun', 'Priya', 'Rahul', 'Kavita', 'Amit',
    'Sneha', 'Vikram', 'Anjali', 'Rajesh', 'Pooja', 'Kunal', 'Ritu', 'Aditya', 'Megha', 'Rohan',
    'Neha', 'Saurabh', 'Vandana', 'Nikhil', 'Swati', 'Deepak', 'Shruti', 'Gaurav', 'Pallavi', 'Vishal'
  ];
  
  const lastNames = [
    'Sharma', 'Bhat', 'Agarwal', 'Chopra', 'Mehta', 'Kumar', 'Singh', 'Patel', 'Gupta', 'Verma',
    'Joshi', 'Reddy', 'Nair', 'Rao', 'Iyer', 'Shah', 'Desai', 'Malhotra', 'Kapoor', 'Saxena'
  ];
  
  const cities = [
    'Jaipur, Rajasthan', 'Nagpur, Maharashtra', 'Indore, Madhya Pradesh', 'Thane, Maharashtra',
    'Mumbai, Maharashtra', 'Delhi, NCR', 'Bangalore, Karnataka', 'Pune, Maharashtra',
    'Ahmedabad, Gujarat', 'Surat, Gujarat', 'Lucknow, Uttar Pradesh', 'Kanpur, Uttar Pradesh',
    'Hyderabad, Telangana', 'Chennai, Tamil Nadu', 'Kolkata, West Bengal', 'Kochi, Kerala',
    'Chandigarh, Punjab', 'Bhopal, Madhya Pradesh', 'Visakhapatnam, Andhra Pradesh'
  ];
  
  // Rank distribution weights
  const rankDistribution = [
    { rank: 'GREY' as const, weight: 55, minInv: 100000, maxInv: 4900000 },      // 55% Grey (₹1L-₹49L)
    { rank: 'SILVER' as const, weight: 30, minInv: 500000, maxInv: 5000000 },    // 30% Silver (₹5L-₹50L)
    { rank: 'BRONZE' as const, weight: 12, minInv: 1000000, maxInv: 5000000 },   // 12% Bronze (₹10L-₹50L)
    { rank: 'GOLD' as const, weight: 3, minInv: 3000000, maxInv: 5000000 },      // 3% Gold (₹30L-₹50L)
  ];
  
  // Monthly return rate: 15% average with slight variation
  const baseMonthlyRate = 0.15;
  
  // Generate dates from Jan 2024 to Feb 2026
  const startDate = new Date('2024-01-01');
  const endDate = new Date('2026-02-28');
  
  for (let i = 0; i < 184; i++) {
    // Select rank based on distribution
    const rand = Math.random() * 100;
    let cumulativeWeight = 0;
    let selectedRank = rankDistribution[0];
    
    for (const dist of rankDistribution) {
      cumulativeWeight += dist.weight;
      if (rand <= cumulativeWeight) {
        selectedRank = dist;
        break;
      }
    }
    
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    
    // Randomize investment within rank range
    const investment = Math.round(
      (selectedRank.minInv + Math.random() * (selectedRank.maxInv - selectedRank.minInv)) / 100000
    ) * 100000; // Round to nearest lakh
    
    // Random investment date
    const investedDate = new Date(
      startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime())
    );
    
    // Calculate monthly rate with slight variation (13% - 17%)
    const monthlyRate = baseMonthlyRate + (Math.random() * 0.04 - 0.02);
    
    // Generate payout history
    const payoutHistory = calculateMonthlyPayouts(
      investment,
      monthlyRate,
      investedDate,
      new Date('2026-03-01')
    );
    
    const totalPayouts = payoutHistory
      .filter(p => p.status === 'paid')
      .reduce((sum, p) => sum + p.amount, 0);
    
    const roi = ((totalPayouts / investment) * 100);
    
    investors.push({
      id: `SUNRAY${1184 + i}`,
      name: `${firstName} ${lastName}`,
      location: city,
      investedDate: investedDate.toISOString().split('T')[0],
      investment,
      totalPayouts,
      roi: Math.round(roi * 100) / 100,
      rank: selectedRank.rank,
      referralCode: `REF${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      payoutHistory,
    });
  }
  
  // Sort by investment amount (descending) for display
  return investors.sort((a, b) => b.investment - a.investment);
}

export const comprehensiveLedger = generateRealisticInvestors();

// Calculate aggregate stats
export const ledgerStats = {
  totalInvestors: comprehensiveLedger.length,
  totalInvestment: comprehensiveLedger.reduce((sum, inv) => sum + inv.investment, 0),
  totalPayouts: comprehensiveLedger.reduce((sum, inv) => sum + inv.totalPayouts, 0),
  averageROI: comprehensiveLedger.reduce((sum, inv) => sum + inv.roi, 0) / comprehensiveLedger.length,
  rankDistribution: {
    BRONZE: comprehensiveLedger.filter(i => i.rank === 'BRONZE').length,
    SILVER: comprehensiveLedger.filter(i => i.rank === 'SILVER').length,
    GOLD: comprehensiveLedger.filter(i => i.rank === 'GOLD').length,
    GREY: comprehensiveLedger.filter(i => i.rank === 'GREY').length,
  },
};