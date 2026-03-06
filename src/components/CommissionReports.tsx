"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Download,
  Calendar,
  Filter
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface CommissionData {
  month: string;
  level1: number;
  level2: number;
  level3: number;
  level4: number;
  level5: number;
  level6: number;
  royalty: number;
  total: number;
}

const MOCK_COMMISSION_DATA: CommissionData[] = [
  {
    month: "Dec 2025",
    level1: 45000,
    level2: 22500,
    level3: 15750,
    level4: 11250,
    level5: 4500,
    level6: 2250,
    royalty: 8000,
    total: 109250
  },
  {
    month: "Nov 2025",
    level1: 42000,
    level2: 21000,
    level3: 14700,
    level4: 10500,
    level5: 4200,
    level6: 2100,
    royalty: 7500,
    total: 102000
  },
  {
    month: "Oct 2025",
    level1: 38000,
    level2: 19000,
    level3: 13300,
    level4: 9500,
    level5: 3800,
    level6: 1900,
    royalty: 6800,
    total: 92300
  }
];

export function CommissionReports() {
  const [selectedMonth, setSelectedMonth] = useState("Dec 2025");
  
  const currentData = MOCK_COMMISSION_DATA.find(d => d.month === selectedMonth) || MOCK_COMMISSION_DATA[0];
  
  const handleExport = () => {
    const csvContent = [
      ["Month", "Level 1", "Level 2", "Level 3", "Level 4", "Level 5", "Level 6", "Royalty", "Total"],
      ...MOCK_COMMISSION_DATA.map(d => [
        d.month,
        d.level1,
        d.level2,
        d.level3,
        d.level4,
        d.level5,
        d.level6,
        d.royalty,
        d.total
      ])
    ].map(row => row.join(",")).join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "commission-report.csv";
    a.click();
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Commission Reports</h2>
          <p className="text-slate-400 mt-1">Track your multi-level earnings</p>
        </div>
        <Button onClick={handleExport} className="bg-orange-600 hover:bg-orange-500">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>
      
      {/* Month Selector */}
      <div className="flex items-center gap-4">
        <Calendar className="w-5 h-5 text-slate-400" />
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          {MOCK_COMMISSION_DATA.map(d => (
            <option key={d.month} value={d.month}>{d.month}</option>
          ))}
        </select>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
              <DollarSign className="w-6 h-6 text-orange-400" />
            </div>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              +12.5%
            </Badge>
          </div>
          <div>
            <p className="text-sm text-slate-400 mb-1">Total Commission</p>
            <p className="text-3xl font-bold text-white">{formatCurrency(currentData.total)}</p>
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <TrendingUp className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <div>
            <p className="text-sm text-slate-400 mb-1">Level 1 Earnings</p>
            <p className="text-3xl font-bold text-white">{formatCurrency(currentData.level1)}</p>
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <div>
            <p className="text-sm text-slate-400 mb-1">Royalty Bonus</p>
            <p className="text-3xl font-bold text-white">{formatCurrency(currentData.royalty)}</p>
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <Filter className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <div>
            <p className="text-sm text-slate-400 mb-1">Deep Levels (4-6)</p>
            <p className="text-3xl font-bold text-white">
              {formatCurrency(currentData.level4 + currentData.level5 + currentData.level6)}
            </p>
          </div>
        </Card>
      </div>
      
      {/* Detailed Breakdown */}
      <Card className="p-6 bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50">
        <h3 className="text-lg font-semibold text-white mb-4">Level-wise Breakdown</h3>
        <div className="space-y-3">
          {[
            { level: "Level 1 (20%)", amount: currentData.level1, color: "bg-orange-500" },
            { level: "Level 2 (10%)", amount: currentData.level2, color: "bg-blue-500" },
            { level: "Level 3 (7%)", amount: currentData.level3, color: "bg-green-500" },
            { level: "Level 4 (5%)", amount: currentData.level4, color: "bg-purple-500" },
            { level: "Level 5 (2%)", amount: currentData.level5, color: "bg-pink-500" },
            { level: "Level 6 (1%)", amount: currentData.level6, color: "bg-cyan-500" },
            { level: "Royalty Bonus", amount: currentData.royalty, color: "bg-amber-500" }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-8 ${item.color} rounded-full`} />
                <span className="text-slate-300 font-medium">{item.level}</span>
              </div>
              <span className="text-white font-bold text-lg">{formatCurrency(item.amount)}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}