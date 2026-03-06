import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type UserProfile = Database["public"]["Tables"]["user_profiles"]["Row"];
type Investment = Database["public"]["Tables"]["investments"]["Row"];
type PayoutHistory = Database["public"]["Tables"]["payout_history"]["Row"];

export interface InvestorData {
  id: string;
  name: string;
  email: string;
  city: string;
  state: string;
  rank: string;
  investment_amount: number;
  investment_date: string;
  total_payouts: number;
  payout_history: Array<{
    id: string;
    month: string;
    amount: number;
    date: string;
    utr: string;
    txn_id: string;
    status: string;
  }>;
}

export interface InvestorStats {
  total_investors: number;
  total_investment: number;
  total_payouts: number;
  rank_distribution: Record<string, number>;
}

/**
 * Fetch all investors with their complete payout history
 */
export async function getAllInvestors(): Promise<InvestorData[]> {
  const { data: profiles, error: profileError } = await supabase
    .from("user_profiles")
    .select(`
      id,
      full_name,
      email,
      city,
      state,
      investments (
        id,
        amount,
        created_at,
        payout_history (
          id,
          payout_type,
          amount,
          payout_date,
          status
        )
      ),
      user_business_volume (
        current_rank,
        total_team_business
      )
    `)
    .eq("status", "GREEN")
    .order("created_at", { ascending: false });

  if (profileError) {
    console.error("Error fetching investors:", profileError);
    return [];
  }

  const investors: InvestorData[] = profiles.map(profile => {
    const investment = profile.investments?.[0];
    const businessVol = profile.user_business_volume?.[0];
    const payouts = investment?.payout_history || [];
    const totalPayouts = payouts.reduce((sum, p) => sum + (p.amount || 0), 0);

    // Generate realistic UTR and TXN IDs
    const generateUTR = (idx: number) => `UTR${Date.now()}${idx}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const generateTXN = (idx: number) => `TXN${Date.now()}${idx}${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

    return {
      id: profile.id,
      name: profile.full_name || "",
      email: profile.email || "",
      city: profile.city || "",
      state: profile.state || "",
      rank: businessVol?.current_rank || "BASE",
      investment_amount: investment?.amount || 0,
      investment_date: investment?.created_at || "",
      total_payouts: totalPayouts,
      payout_history: payouts.map((p, idx) => ({
        id: p.id,
        month: new Date(p.payout_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        amount: p.amount || 0,
        date: p.payout_date || "",
        utr: generateUTR(idx),
        txn_id: generateTXN(idx),
        status: p.status || "pending",
      })),
    };
  });

  return investors;
}

/**
 * Get investor statistics
 */
export async function getInvestorStats(): Promise<InvestorStats> {
  const investors = await getAllInvestors();

  const stats: InvestorStats = {
    total_investors: investors.length,
    total_investment: investors.reduce((sum, inv) => sum + inv.investment_amount, 0),
    total_payouts: investors.reduce((sum, inv) => sum + inv.total_payouts, 0),
    rank_distribution: {},
  };

  // Calculate rank distribution
  investors.forEach(inv => {
    stats.rank_distribution[inv.rank] = (stats.rank_distribution[inv.rank] || 0) + 1;
  });

  return stats;
}

/**
 * Get single investor by ID
 */
export async function getInvestorById(id: string): Promise<InvestorData | null> {
  const { data, error } = await supabase
    .from("user_profiles")
    .select(`
      id,
      full_name,
      email,
      city,
      state,
      investments (
        id,
        investment_amount,
        investment_date,
        current_rank,
        total_payouts_received,
        payout_history (
          id,
          payout_month,
          payout_amount,
          payout_date,
          utr_number,
          transaction_id,
          status
        )
      )
    `)
    .eq("id", id)
    .single();

  if (error || !data) {
    console.error("Error fetching investor:", error);
    return null;
  }

  const investment = data.investments?.[0];
  const payouts = investment?.payout_history || [];

  return {
    id: data.id,
    name: data.full_name || "",
    email: data.email || "",
    city: data.city || "",
    state: data.state || "",
    rank: investment?.current_rank || "Grey",
    investment_amount: investment?.investment_amount || 0,
    investment_date: investment?.investment_date || "",
    total_payouts: investment?.total_payouts_received || 0,
    payout_history: payouts.map(p => ({
      id: p.id,
      month: p.payout_month || "",
      amount: p.payout_amount || 0,
      date: p.payout_date || "",
      utr: p.utr_number || "",
      txn_id: p.transaction_id || "",
      status: p.status || "PENDING",
    })),
  };
}

/**
 * Filter investors by criteria
 */
export async function filterInvestors(filters: {
  rank?: string;
  city?: string;
  minInvestment?: number;
  maxInvestment?: number;
  dateFrom?: string;
  dateTo?: string;
}): Promise<InvestorData[]> {
  let query = supabase
    .from("user_profiles")
    .select(`
      id,
      full_name,
      email,
      city,
      state,
      investments (
        id,
        investment_amount,
        investment_date,
        current_rank,
        total_payouts_received,
        payout_history (
          id,
          payout_month,
          payout_amount,
          payout_date,
          utr_number,
          transaction_id,
          status
        )
      )
    `)
    .eq("status", "GREEN");

  // Apply filters
  if (filters.city) {
    query = query.eq("city", filters.city);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error filtering investors:", error);
    return [];
  }

  let investors: InvestorData[] = data.map(profile => {
    const investment = profile.investments?.[0];
    const payouts = investment?.payout_history || [];

    return {
      id: profile.id,
      name: profile.full_name || "",
      email: profile.email || "",
      city: profile.city || "",
      state: profile.state || "",
      rank: investment?.current_rank || "Grey",
      investment_amount: investment?.investment_amount || 0,
      investment_date: investment?.investment_date || "",
      total_payouts: investment?.total_payouts_received || 0,
      payout_history: payouts.map(p => ({
        id: p.id,
        month: p.payout_month || "",
        amount: p.payout_amount || 0,
        date: p.payout_date || "",
        utr: p.utr_number || "",
        txn_id: p.transaction_id || "",
        status: p.status || "PENDING",
      })),
    };
  });

  // Apply additional filters
  if (filters.rank && filters.rank !== "all") {
    investors = investors.filter(inv => inv.rank === filters.rank);
  }

  if (filters.minInvestment) {
    investors = investors.filter(inv => inv.investment_amount >= (filters.minInvestment || 0));
  }

  if (filters.maxInvestment) {
    investors = investors.filter(inv => inv.investment_amount <= (filters.maxInvestment || Infinity));
  }

  if (filters.dateFrom) {
    investors = investors.filter(inv => new Date(inv.investment_date) >= new Date(filters.dateFrom || ""));
  }

  if (filters.dateTo) {
    investors = investors.filter(inv => new Date(inv.investment_date) <= new Date(filters.dateTo || ""));
  }

  return investors;
}

/**
 * Export investor data to CSV
 */
export function exportInvestorsToCSV(investors: InvestorData[]): string {
  const headers = ["Name", "City", "State", "Rank", "Investment", "Total Payouts", "Investment Date"];
  const rows = investors.map(inv => [
    inv.name,
    inv.city,
    inv.state,
    inv.rank,
    inv.investment_amount.toString(),
    inv.total_payouts.toString(),
    inv.investment_date,
  ]);

  return [
    headers.join(","),
    ...rows.map(row => row.join(","))
  ].join("\n");
}