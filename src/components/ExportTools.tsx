import { Button } from "@/components/ui/button";
import { Download, FileText, FileSpreadsheet } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ExportToolsProps {
  data: any[];
  filename: string;
  type?: "orders" | "vendors" | "settlements" | "performance";
}

export function ExportTools({ data, filename, type = "orders" }: ExportToolsProps) {
  const exportToCSV = () => {
    if (data.length === 0) {
      alert("No data to export");
      return;
    }

    const headers = Object.keys(data[0]).join(",");
    const rows = data.map(row => 
      Object.values(row).map(val => 
        typeof val === "string" && val.includes(",") ? `"${val}"` : val
      ).join(",")
    );
    
    const csv = [headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    alert(`PDF export for ${filename} would be generated here.\n\nIn production, this would create a formatted PDF report with:\n- Company branding\n- Date range\n- Filtered data\n- Summary statistics\n- Charts and graphs`);
  };

  const exportToExcel = () => {
    alert(`Excel export for ${filename} would be generated here.\n\nIn production, this would create an XLSX file with:\n- Multiple sheets\n- Formatted tables\n- Formulas\n- Charts\n- Pivot tables`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportToCSV}>
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToExcel}>
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          Export as Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToPDF}>
          <FileText className="w-4 h-4 mr-2" />
          Export as PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}