import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, Calendar, Download } from "lucide-react";
import { motion } from "framer-motion";

interface DashboardFiltersProps {
  onSearch?: (query: string) => void;
  onFilterChange?: (filters: FilterState) => void;
  onExport?: () => void;
  showSearch?: boolean;
  showDateRange?: boolean;
  showRankFilter?: boolean;
  showStatusFilter?: boolean;
  showStatus?: boolean;
  showRole?: boolean;
}

export interface FilterState {
  search?: string;
  dateRange?: string;
  rank?: string;
  status?: string;
  role?: string;
}

export function DashboardFilters({
  onSearch,
  onFilterChange,
  onExport,
  showSearch = true,
  showDateRange = true,
  showRankFilter = false,
  showStatusFilter = false,
  showStatus = false,
  showRole = false,
}: DashboardFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({});

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearch?.(value);
  };

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 space-y-4"
    >
      {/* Search Bar */}
      {showSearch && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            type="text"
            placeholder="Search by name, email, or ID..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 bg-slate-900/50 border-slate-600 text-white"
          />
        </div>
      )}

      {/* Filter Options */}
      <div className="flex flex-wrap gap-4">
        {showDateRange && (
          <Select onValueChange={(value) => handleFilterChange("dateRange", value)}>
            <SelectTrigger className="w-[180px] bg-slate-900/50 border-slate-600 text-white">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        )}

        {showRankFilter && (
          <Select onValueChange={(value) => handleFilterChange("rank", value)}>
            <SelectTrigger className="w-[180px] bg-slate-900/50 border-slate-600 text-white">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Rank" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="all">All Ranks</SelectItem>
              <SelectItem value="BASE">BASE</SelectItem>
              <SelectItem value="BRONZE">BRONZE</SelectItem>
              <SelectItem value="SILVER">SILVER</SelectItem>
              <SelectItem value="GOLD">GOLD</SelectItem>
              <SelectItem value="PLATINUM">PLATINUM</SelectItem>
              <SelectItem value="DIAMOND">DIAMOND</SelectItem>
              <SelectItem value="AMBASSADOR">AMBASSADOR</SelectItem>
            </SelectContent>
          </Select>
        )}

        {(showStatusFilter || showStatus) && (
          <Select onValueChange={(value) => handleFilterChange("status", value)}>
            <SelectTrigger className="w-[180px] bg-slate-900/50 border-slate-600 text-white">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        )}

        {showRole && (
          <Select onValueChange={(value) => handleFilterChange("role", value)}>
            <SelectTrigger className="w-[180px] bg-slate-900/50 border-slate-600 text-white">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="investor">Investor</SelectItem>
              <SelectItem value="vendor">Vendor</SelectItem>
              <SelectItem value="client">Client</SelectItem>
            </SelectContent>
          </Select>
        )}

        {onExport && (
          <Button
            onClick={onExport}
            variant="outline"
            className="bg-cyan-500/10 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        )}
      </div>

      {/* Active Filters Summary */}
      {Object.keys(filters).length > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(filters).map(([key, value]) => (
            value && (
              <motion.div
                key={key}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/20 border border-cyan-500/50 rounded-full text-sm text-cyan-400"
              >
                <span className="capitalize">{key}: {value}</span>
                <button
                  onClick={() => handleFilterChange(key as keyof FilterState, "")}
                  className="hover:text-cyan-300"
                >
                  ×
                </button>
              </motion.div>
            )
          ))}
        </div>
      )}
    </motion.div>
  );
}