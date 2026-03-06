"use client";

import { Button } from "@/components/ui/button";
import { Download, FileText, Table } from "lucide-react";

interface ExportToolsProps {
  data: any[];
  filename: string;
  headers?: string[];
}

export function ExportTools({ data, filename, headers }: ExportToolsProps) {
  const exportToCSV = () => {
    if (data.length === 0) return;
    
    const exportHeaders = headers || Object.keys(data[0]);
    const csvContent = [
      exportHeaders.join(","),
      ...data.map(row => exportHeaders.map(h => row[h]).join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
  };
  
  const exportToPDF = () => {
    // Simplified PDF export - In production, use jsPDF or similar
    const content = JSON.stringify(data, null, 2);
    const blob = new Blob([content], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.json`;
    a.click();
  };
  
  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={exportToCSV}
        variant="outline"
        size="sm"
        className="border-slate-700 hover:border-orange-500/50 text-slate-300"
      >
        <Table className="w-4 h-4 mr-2" />
        Export CSV
      </Button>
      <Button
        onClick={exportToPDF}
        variant="outline"
        size="sm"
        className="border-slate-700 hover:border-orange-500/50 text-slate-300"
      >
        <FileText className="w-4 h-4 mr-2" />
        Export PDF
      </Button>
    </div>
  );
}