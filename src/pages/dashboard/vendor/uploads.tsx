import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Download, Eye } from "lucide-react";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const uploadHistory = [
  {
    id: "UP-001",
    type: "Order Report",
    fileName: "orders_feb_week4.csv",
    uploadDate: "2026-02-28 14:35",
    status: "Processed",
    records: 156,
    errors: 0
  },
  {
    id: "UP-002",
    type: "Tracking Updates",
    fileName: "tracking_feb28.csv",
    uploadDate: "2026-02-28 09:20",
    status: "Processed",
    records: 89,
    errors: 0
  },
  {
    id: "UP-003",
    type: "Delivery Confirmations",
    fileName: "deliveries_feb27.csv",
    uploadDate: "2026-02-27 18:45",
    status: "Processed",
    records: 142,
    errors: 0
  },
  {
    id: "UP-004",
    type: "Return Report",
    fileName: "returns_feb.csv",
    uploadDate: "2026-02-26 11:15",
    status: "Failed",
    records: 0,
    errors: 3
  }
];

const fileTemplates = [
  {
    name: "Order Report Template",
    description: "Daily order fulfillment data",
    columns: "OrderID, ProductSKU, Quantity, Status, PackageWeight"
  },
  {
    name: "Tracking Updates Template",
    description: "Shipment tracking information",
    columns: "OrderID, TrackingNumber, Courier, PickupDate, QRCode"
  },
  {
    name: "Delivery Confirmation Template",
    description: "Delivered order confirmations",
    columns: "OrderID, DeliveryDate, ReceivedBy, POD, OnTime"
  },
  {
    name: "Return Report Template",
    description: "Product return details",
    columns: "ReturnID, OrderID, ReturnReason, ReturnDate, Condition"
  },
  {
    name: "Replacement Report Template",
    description: "Replacement shipment data",
    columns: "ReplacementID, OriginalOrderID, NewTrackingNumber, ShipDate"
  }
];

export default function VendorUploads() {
  const [uploadType, setUploadType] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Processed":
        return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400";
      case "Processing":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400";
      case "Failed":
        return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400";
    }
  };

  const handleFileUpload = () => {
    if (uploadType && selectedFile) {
      alert(`File uploaded:\nType: ${uploadType}\nFile: ${selectedFile.name}`);
      setUploadType("");
      setSelectedFile(null);
    }
  };

  return (
    <>
      <SEO title="File Uploads - DropSync Vendor" />
      <DashboardLayout role="vendor">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                File Upload System
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Automate reconciliation with CSV uploads
              </p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-cyan-500 hover:bg-cyan-600">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload File
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload Operational File</DialogTitle>
                  <DialogDescription>
                    Select file type and upload CSV for automated processing
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>File Type</Label>
                    <Select value={uploadType} onValueChange={setUploadType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select file type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="orders">Order Report</SelectItem>
                        <SelectItem value="tracking">Tracking Updates</SelectItem>
                        <SelectItem value="delivery">Delivery Confirmations</SelectItem>
                        <SelectItem value="returns">Return Report</SelectItem>
                        <SelectItem value="replacements">Replacement Report</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Upload CSV File</Label>
                    <Input
                      type="file"
                      accept=".csv"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    />
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Only CSV files are accepted. Download template below for correct format.
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleFileUpload} className="bg-cyan-500 hover:bg-cyan-600">
                    Upload & Process
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Upload Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Files Processed
                    </p>
                    <p className="text-3xl font-bold text-green-600 mt-1">
                      {uploadHistory.filter((u) => u.status === "Processed").length}
                    </p>
                  </div>
                  <CheckCircle className="w-12 h-12 text-green-600 opacity-20" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Total Records</p>
                    <p className="text-3xl font-bold text-blue-600 mt-1">
                      {uploadHistory.reduce((acc, u) => acc + u.records, 0)}
                    </p>
                  </div>
                  <FileSpreadsheet className="w-12 h-12 text-blue-600 opacity-20" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Failed Uploads</p>
                    <p className="text-3xl font-bold text-red-600 mt-1">
                      {uploadHistory.filter((u) => u.status === "Failed").length}
                    </p>
                  </div>
                  <AlertCircle className="w-12 h-12 text-red-600 opacity-20" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* File Templates */}
          <Card>
            <CardHeader>
              <CardTitle>Download CSV Templates</CardTitle>
              <CardDescription>
                Use these templates to ensure correct file formatting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fileTemplates.map((template, i) => (
                  <div
                    key={i}
                    className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-slate-900 dark:text-white">
                          {template.name}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          {template.description}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-500 mt-2 font-mono">
                          {template.columns}
                        </p>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upload History */}
          <Card>
            <CardHeader>
              <CardTitle>Upload History</CardTitle>
              <CardDescription>Recent file submissions and processing status</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Upload ID</TableHead>
                    <TableHead>File Type</TableHead>
                    <TableHead>File Name</TableHead>
                    <TableHead>Upload Date</TableHead>
                    <TableHead>Records</TableHead>
                    <TableHead>Errors</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {uploadHistory.map((upload) => (
                    <TableRow key={upload.id}>
                      <TableCell className="font-medium">{upload.id}</TableCell>
                      <TableCell>{upload.type}</TableCell>
                      <TableCell className="font-mono text-sm">
                        {upload.fileName}
                      </TableCell>
                      <TableCell className="text-slate-600 dark:text-slate-400">
                        {upload.uploadDate}
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{upload.records}</span>
                      </TableCell>
                      <TableCell>
                        {upload.errors > 0 ? (
                          <span className="text-red-600 font-medium">{upload.errors}</span>
                        ) : (
                          <span className="text-green-600">0</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(upload.status)}>
                          {upload.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </>
  );
}