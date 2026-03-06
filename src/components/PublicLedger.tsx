"use client";

import { useState } from "react";
import { GlassmorphicCard } from "./GlassmorphicCard";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import { Search, CheckCircle2, TrendingUp, Calendar } from "lucide-react";

// Generate mock payout data from Jan 2024 to Mar 2026
function generateMockPayouts() {
  const payouts = [];
  const startDate = new Date('2024-01-01');
  const endDate = new Date('2026-03-01');
  
  const currentDate = new Date(endDate);
  let txnCounter = 10001;
  
  while (currentDate >= startDate) {
    // Generate 3-8 payouts per day
    const dailyPayouts = Math.floor(Math.random() * 6) + 3;
    
    for (let i = 0; i < dailyPayouts; i++) {
      const amount = Math.floor(Math.random() * 500000) + 50000; // ₹50k - ₹5.5L
      const hour = Math.floor(Math.random() * 24);
      const minute = Math.floor(Math.random() * 60);
      
      payouts.push({
        id: `PAY-${txnCounter}`,
        date: new Date(currentDate),
        time: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
        recipient: `INV${Math.floor(Math.random() * 9000) + 1000}`,
        amount,
        utr: `UTR${txnCounter}${Math.floor(Math.random() * 10000)}`,
        txnId: `TXN${Date.now() - txnCounter * 1000}`,
        type: Math.random() > 0.7 ? 'Commission' : 'Investment Payout',
        status: 'completed'
      });
      
      txnCounter++;
    }
    
    // Move to previous day
    currentDate.setDate(currentDate.getDate() - 1);
  }
  
  return payouts;
}

export function PublicLedger() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  
  const allPayouts = generateMockPayouts();
  
  // Group by month
  const payoutsByMonth = allPayouts.reduce((acc, payout) => {
    const monthKey = payout.date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    if (!acc[monthKey]) acc[monthKey] = [];
    acc[monthKey].push(payout);
    return acc;
  }, {} as Record<string, typeof allPayouts>);

  const months = Object.keys(payoutsByMonth).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  const filteredPayouts = selectedMonth 
    ? payoutsByMonth[selectedMonth] 
    : allPayouts.slice(0, 50); // Show latest 50 by default

  const displayPayouts = filteredPayouts.filter(p => 
    p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.utr.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.txnId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section id="transparency" className="py-24 bg-gradient-to-br from-slate-950 via-purple-950/50 to-slate-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-purple-500/20 text-purple-300 border-purple-500/30">
            Public Transparency
          </Badge>
          <h2 className="text-5xl font-bold text-white mb-4">
            Every Transaction. <span className="text-purple-400">Verified.</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Complete payout history from January 2024. All UTR IDs and transaction details publicly visible.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Payouts', value: allPayouts.length.toLocaleString(), icon: CheckCircle2 },
            { label: 'Total Disbursed', value: formatCurrency(allPayouts.reduce((sum, p) => sum + p.amount, 0)), icon: TrendingUp },
            { label: 'Months Active', value: months.length, icon: Calendar },
            { label: 'Success Rate', value: '100%', icon: CheckCircle2 }
          ].map((stat, i) => (
            <GlassmorphicCard key={i} glow className="p-6 text-center">
              <stat.icon className="w-8 h-8 mx-auto mb-3 text-purple-400" />
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-slate-400">{stat.label}</div>
            </GlassmorphicCard>
          ))}
        </div>

        {/* Filters */}
        <GlassmorphicCard className="p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search by ID, UTR, or TXN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              <button
                onClick={() => setSelectedMonth(null)}
                className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all ${
                  !selectedMonth 
                    ? 'bg-purple-500 text-white' 
                    : 'bg-white/5 text-slate-400 hover:bg-white/10'
                }`}
              >
                All Time
              </button>
              {months.slice(0, 6).map(month => (
                <button
                  key={month}
                  onClick={() => setSelectedMonth(month)}
                  className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all ${
                    selectedMonth === month 
                      ? 'bg-purple-500 text-white' 
                      : 'bg-white/5 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  {month}
                </button>
              ))}
            </div>
          </div>
        </GlassmorphicCard>

        {/* Payouts Table */}
        <GlassmorphicCard className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Date & Time</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Payout ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Recipient</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Type</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">UTR ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">TXN ID</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-slate-400 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {displayPayouts.map((payout, i) => (
                  <tr key={payout.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-300">
                      {payout.date.toLocaleDateString('en-IN')}
                      <br />
                      <span className="text-xs text-slate-500">{payout.time}</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-purple-400">{payout.id}</td>
                    <td className="px-6 py-4 text-sm font-mono text-slate-300">{payout.recipient}</td>
                    <td className="px-6 py-4 text-sm">
                      <Badge variant={payout.type === 'Commission' ? 'default' : 'secondary'} className="text-xs">
                        {payout.type}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-right text-green-400">
                      {formatCurrency(payout.amount)}
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-slate-400">{payout.utr}</td>
                    <td className="px-6 py-4 text-xs font-mono text-slate-400">{payout.txnId}</td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle2 className="w-4 h-4 text-green-400 mx-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {displayPayouts.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              No transactions found matching your search.
            </div>
          )}
        </GlassmorphicCard>
      </div>
    </section>
  );
}