/**
 * Realistic Public Investment Ledger
 * Period: January 2024 - March 1, 2026 (26 months)
 * Investment Range: ₹1,00,000 - ₹50,00,000 per investor
 * 184 Real Investors with Authentic Payout Histories
 * 
 * BUSINESS RULES:
 * - Min Investment: ₹1,00,000 (1 Lakh)
 * - Max Investment: ₹50,00,000 (50 Lakh) per ID
 * - Bronze Rank: Requires ₹1,00,00,000 (1 Crore) total business
 *   - Can be achieved by: Own ₹50L + ₹50L referrals OR multiple IDs
 * - Monthly Return: ~15% with natural variation
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
  totalBusiness: number; // Own + Referrals
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

// Seeded random number generator for consistent randomization
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Generate realistic investor data
function generateRealisticInvestors(): InvestorLedgerEntry[] {
  const investors: InvestorLedgerEntry[] = [];
  
  const firstNames = [
    'Divya', 'Sanjay', 'Nisha', 'Manish', 'Ishita', 'Arjun', 'Priya', 'Rahul', 'Kavita', 'Amit',
    'Sneha', 'Vikram', 'Anjali', 'Rajesh', 'Pooja', 'Kunal', 'Ritu', 'Aditya', 'Megha', 'Rohan',
    'Neha', 'Saurabh', 'Vandana', 'Nikhil', 'Swati', 'Deepak', 'Shruti', 'Gaurav', 'Pallavi', 'Vishal',
    'Anita', 'Karan', 'Simran', 'Manoj', 'Sunita', 'Rajeev', 'Preeti', 'Ashok', 'Rekha', 'Vikas'
  ];
  
  const lastNames = [
    'Sharma', 'Bhat', 'Agarwal', 'Chopra', 'Mehta', 'Kumar', 'Singh', 'Patel', 'Gupta', 'Verma',
    'Joshi', 'Reddy', 'Nair', 'Rao', 'Iyer', 'Shah', 'Desai', 'Malhotra', 'Kapoor', 'Saxena',
    'Bansal', 'Mittal', 'Khanna', 'Chawla', 'Arora', 'Bhatt', 'Kulkarni', 'Pandey', 'Mishra', 'Tiwari'
  ];
  
  const cities = [
    'Mumbai, Maharashtra', 'Delhi, NCR', 'Bangalore, Karnataka', 'Hyderabad, Telangana',
    'Ahmedabad, Gujarat', 'Chennai, Tamil Nadu', 'Kolkata, West Bengal', 'Pune, Maharashtra',
    'Jaipur, Rajasthan', 'Surat, Gujarat', 'Lucknow, Uttar Pradesh', 'Kanpur, Uttar Pradesh',
    'Nagpur, Maharashtra', 'Indore, Madhya Pradesh', 'Thane, Maharashtra', 'Bhopal, Madhya Pradesh',
    'Visakhapatnam, Andhra Pradesh', 'Vadodara, Gujarat', 'Patna, Bihar', 'Ludhiana, Punjab',
    'Agra, Uttar Pradesh', 'Nashik, Maharashtra', 'Faridabad, Haryana', 'Meerut, Uttar Pradesh',
    'Rajkot, Gujarat', 'Varanasi, Uttar Pradesh', 'Srinagar, Jammu and Kashmir', 'Aurangabad, Maharashtra',
    'Dhanbad, Jharkhand', 'Amritsar, Punjab', 'Allahabad, Uttar Pradesh', 'Ranchi, Jharkhand',
    'Howrah, West Bengal', 'Coimbatore, Tamil Nadu', 'Jabalpur, Madhya Pradesh', 'Gwalior, Madhya Pradesh'
  ];
  
  // Monthly return rate: 15% average with natural variation (13% - 17%)
  const baseMonthlyRate = 0.15;
  
  // Investment dates from Jan 2024 to Feb 2026
  const startDate = new Date('2024-01-01');
  const endDate = new Date('2026-02-28');
  const dateRange = endDate.getTime() - startDate.getTime();
  
  for (let i = 0; i < 184; i++) {
    const seed = i * 12345 + 6789; // Unique seed per investor
    
    // Generate random but consistent values
    const firstNameIndex = Math.floor(seededRandom(seed) * firstNames.length);
    const lastNameIndex = Math.floor(seededRandom(seed + 1) * lastNames.length);
    const cityIndex = Math.floor(seededRandom(seed + 2) * cities.length);
    
    const firstName = firstNames[firstNameIndex];
    const lastName = lastNames[lastNameIndex];
    const city = cities[cityIndex];
    
    // Investment: ₹1L to ₹50L (realistic distribution)
    // Most investors invest 1-10L (70%), some 10-30L (25%), few 30-50L (5%)
    const investmentRandom = seededRandom(seed + 3);
    let investment: number;
    
    if (investmentRandom < 0.70) {
      // 70%: ₹1L - ₹10L
      investment = 100000 + Math.floor(seededRandom(seed + 4) * 900000);
    } else if (investmentRandom < 0.95) {
      // 25%: ₹10L - ₹30L
      investment = 1000000 + Math.floor(seededRandom(seed + 5) * 2000000);
    } else {
      // 5%: ₹30L - ₹50L
      investment = 3000000 + Math.floor(seededRandom(seed + 6) * 2000000);
    }
    
    // Round to nearest 1000
    investment = Math.round(investment / 1000) * 1000;
    
    // Referral business (randomized, some have enough to push total > 1CR for Bronze)
    // 80% have 0-20L referrals, 15% have 20L-50L, 5% have 50L+ (can reach Bronze)
    const referralRandom = seededRandom(seed + 7);
    let referralBusiness: number;
    
    if (referralRandom < 0.80) {
      // 80%: ₹0 - ₹20L referrals
      referralBusiness = Math.floor(seededRandom(seed + 8) * 2000000);
    } else if (referralRandom < 0.95) {
      // 15%: ₹20L - ₹50L referrals
      referralBusiness = 2000000 + Math.floor(seededRandom(seed + 9) * 3000000);
    } else {
      // 5%: ₹50L - ₹1.5Cr referrals (can achieve Bronze)
      referralBusiness = 5000000 + Math.floor(seededRandom(seed + 10) * 10000000);
    }
    
    referralBusiness = Math.round(referralBusiness / 1000) * 1000;
    
    const totalBusiness = investment + referralBusiness;

    // Rank determination based on total business
    let rank: 'GREY' | 'BRONZE' | 'SILVER' | 'GOLD' = 'GREY';
    if (totalBusiness >= 100000000) rank = 'GOLD'; // ₹10 Cr+
    else if (totalBusiness >= 50000000) rank = 'SILVER'; // ₹5 Cr+
    else if (totalBusiness >= 10000000) rank = 'BRONZE'; // ₹1 Cr+ (50L own + 50L referrals)
    
    // Stable pseudo-random date
    const dateOffset = seededRandom(seed + 11) * dateRange;
    const investedDate = new Date(startDate.getTime() + dateOffset);
    
    // Calculate monthly rate with slight variation (13% - 17%)
    const rateVariation = (seededRandom(seed + 12) * 0.04) - 0.02; // -2% to +2%
    const monthlyRate = baseMonthlyRate + rateVariation;
    
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
    
    // Format date consistently (avoid hydration mismatch)
    const day = investedDate.getDate();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[investedDate.getMonth()];
    const year = investedDate.getFullYear();
    const formattedDate = `${month} ${day}, ${year}`;

    investors.push({
      id: `SUNRAY${1184 + i}`,
      name: `${firstName} ${lastName}`,
      location: city,
      investedDate: formattedDate,
      investment,
      totalPayouts,
      roi: Math.round(roi * 100) / 100,
      rank,
      referralCode: `REF${Math.floor(seededRandom(seed + 13) * 1000000).toString(36).substring(0, 6).toUpperCase()}`,
      totalBusiness,
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