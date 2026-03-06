"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Search, Filter, X } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface DashboardFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  showDateRange?: boolean;
  showStatus?: boolean;
  showRole?: boolean;
  showSearch?: boolean;
}

export interface FilterState {
  search: string;
  status: string;
  role: string;
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
}

export function DashboardFilters({
  onFilterChange,
  showDateRange = true,
  showStatus = true,
  showRole = false,
  showSearch = true,
}: DashboardFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    status: "all",
    role: "all",
    dateFrom: undefined,
    dateTo: undefined,
  });

  const [showFilters, setShowFilters] = useState(false);

  const updateFilter = (key: keyof FilterState, value: string | Date | undefined) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: FilterState = {
      search: "",
      status: "all",
      role: "all",
      dateFrom: undefined,
      dateTo: undefined,
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters =
    filters.search ||
    filters.status !== "all" ||
    filters.role !== "all" ||
    filters.dateFrom ||
    filters.dateTo;

  return (
    <div className="space-y-4">
      {/* Search Bar & Toggle */}
      <div className="flex items-center gap-3">
        {showSearch && (
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search..."
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
              className="pl-10 bg-slate-800/50 border-white/10 text-white placeholder:text-slate-500 focus:border-purple-500/50"
            />
          </div>
        )}
        
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="bg-slate-800/50 border-white/10 hover:bg-slate-800/70 text-white"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
          {hasActiveFilters && (
            <span className="ml-2 px-1.5 py-0.5 rounded-full bg-purple-500 text-xs">
              {[
                filters.status !== "all",
                filters.role !== "all",
                filters.dateFrom,
                filters.dateTo,
              ].filter(Boolean).length}
            </span>
          )}
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="icon"
            onClick={clearFilters}
            className="text-slate-400 hover:text-white hover:bg-slate-800/50"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Expandable Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 p-4 rounded-lg bg-slate-800/30 border border-white/10">
              {showStatus && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Status</label>
                  <Select
                    value={filters.status}
                    onValueChange={(value) => updateFilter("status", value)}
                  >
                    <SelectTrigger className="bg-slate-800/50 border-white/10 text-white">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-white/10">
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {showRole && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Role</label>
                  <Select
                    value={filters.role}
                    onValueChange={(value) => updateFilter("role", value)}
                  >
                    <SelectTrigger className="bg-slate-800/50 border-white/10 text-white">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-white/10">
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="investor">Investor</SelectItem>
                      <SelectItem value="vendor">Vendor</SelectItem>
                      <SelectItem value="client">Client</SelectItem>
                      <SelectItem value="franchise_partner">Franchise Partner</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {showDateRange && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">From Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal bg-slate-800/50 border-white/10 hover:bg-slate-800/70",
                            !filters.dateFrom && "text-slate-500"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {filters.dateFrom ? format(filters.dateFrom, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-slate-800 border-white/10" align="start">
                        <Calendar
                          mode="single"
                          selected={filters.dateFrom}
                          onSelect={(date) => updateFilter("dateFrom", date)}
                          initialFocus
                          className="text-white"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">To Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal bg-slate-800/50 border-white/10 hover:bg-slate-800/70",
                            !filters.dateTo && "text-slate-500"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {filters.dateTo ? format(filters.dateTo, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-slate-800 border-white/10" align="start">
                        <Calendar
                          mode="single"
                          selected={filters.dateTo}
                          onSelect={(date) => updateFilter("dateTo", date)}
                          initialFocus
                          className="text-white"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}