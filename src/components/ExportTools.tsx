import { Button } from "@/components/ui/button";
import { FileDown, FileSpreadsheet } from "lucide-react";

interface ExportToolsProps {
  data: any[];
  filename: string;
  headers?: string[];
}

export function ExportTools({ data, filename, headers }: ExportToolsProps) {
  const exportToCSV = () => {
    if (!data || data.length === 0) {
      alert("No data to export");
      return;
    }

    // Get headers from first object keys if not provided
    const csvHeaders = headers || Object.keys(data[0]);
    
    // Create CSV content
    const csvContent = [
      csvHeaders.join(","), // Header row
      ...data.map(row => 
        csvHeaders.map(header => {
          const value = row[header];
          // Escape commas and quotes
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(",")
      )
    ].join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex gap-2">
      <Button
        onClick={exportToCSV}
        variant="outline"
        size="sm"
        className="gap-2"
      >
        <FileSpreadsheet className="h-4 w-4" />
        Export CSV
      </Button>
    </div>
  );
}