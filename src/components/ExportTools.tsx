import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ExportToolsProps {
  data?: any[];
  filename?: string;
}

export function ExportTools({ data = [], filename = "export" }: ExportToolsProps) {
  const { toast } = useToast();

  const handleExportCSV = () => {
    if (data.length === 0) {
      toast({
        title: "No Data",
        description: "There is no data to export",
        variant: "destructive"
      });
      return;
    }

    try {
      const headers = Object.keys(data[0]).join(",");
      const rows = data.map(row => Object.values(row).join(",")).join("\n");
      const csv = `${headers}\n${rows}`;
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: `${filename}.csv has been downloaded`
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export Failed",
        description: "Could not export data",
        variant: "destructive"
      });
    }
  };

  const handleExportPDF = () => {
    toast({
      title: "PDF Export",
      description: "PDF export will be available soon"
    });
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={handleExportCSV}>
        <FileSpreadsheet className="h-4 w-4 mr-2" />
        Export CSV
      </Button>
      <Button variant="outline" size="sm" onClick={handleExportPDF}>
        <FileText className="h-4 w-4 mr-2" />
        Export PDF
      </Button>
    </div>
  );
}