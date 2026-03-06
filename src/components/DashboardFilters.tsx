"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Filter, X } from "lucide-react";
import { format } from "date-fns";

interface DashboardFiltersProps {
  onFilterChange?: (filters: FilterState) => void;
  showDateRange?: boolean;
  showStatus?: boolean;
  showRole?: boolean;
  showSearch?: boolean;
}

export interface FilterState {
  rank: string;
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
  status: string;
  search?: string;
  role?: string;
}

export function DashboardFilters({ 
  onFilterChange,
  showDateRange = true,
  showStatus = true,
  showRole = false,
  showSearch = false
}: DashboardFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    rank: "all",
    dateFrom: undefined,
    dateTo: undefined,
    status: "all",
    search: "",
    role: "all"
  });

  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      rank: "all",
      dateFrom: undefined,
      dateTo: undefined,
      status: "all"
    };
    setFilters(clearedFilters);
    onFilterChange?.(clearedFilters);
  };

  const hasActiveFilters = filters.rank !== "all" || filters.status !== "all" || filters.dateFrom || filters.dateTo;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <Button
          onClick={() => setShowFilters(!showFilters)}
          variant="outline"
          className="bg-slate-900/50 border-slate-700 hover:border-orange-500/50 text-white"
        >
          <Filter className="w-4 h-4 mr-2" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </Button>
        {hasActiveFilters && (
          <Button
            onClick={clearFilters}
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4 mr-2" />
            Clear Filters
          </Button>
        )}
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-slate-900/30 border border-slate-800 rounded-lg">
          {/* Rank Filter */}
          <div>
            <label className="text-sm text-slate-400 mb-2 block">Rank</label>
            <Select value={filters.rank} onValueChange={(value) => handleFilterChange('rank', value)}>
              <SelectTrigger className="bg-slate-900 border-slate-700">
                <SelectValue placeholder="All Ranks" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ranks</SelectItem>
                <SelectItem value="Grey">Grey</SelectItem>
                <SelectItem value="Bronze">Bronze</SelectItem>
                <SelectItem value="Silver">Silver</SelectItem>
                <SelectItem value="Gold">Gold</SelectItem>
                <SelectItem value="Platinum">Platinum</SelectItem>
                <SelectItem value="Diamond">Diamond</SelectItem>
                <SelectItem value="Ambassador">Ambassador</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="text-sm text-slate-400 mb-2 block">Status</label>
            <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
              <SelectTrigger className="bg-slate-900 border-slate-700">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date From */}
          <div>
            <label className="text-sm text-slate-400 mb-2 block">From Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal bg-slate-900 border-slate-700"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateFrom ? format(filters.dateFrom, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-slate-900 border-slate-700">
                <Calendar
                  mode="single"
                  selected={filters.dateFrom}
                  onSelect={(date) => handleFilterChange('dateFrom', date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Date To */}
          <div>
            <label className="text-sm text-slate-400 mb-2 block">To Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal bg-slate-900 border-slate-700"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateTo ? format(filters.dateTo, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-slate-900 border-slate-700">
                <Calendar
                  mode="single"
                  selected={filters.dateTo}
                  onSelect={(date) => handleFilterChange('dateTo', date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}
    </div>
  );
}