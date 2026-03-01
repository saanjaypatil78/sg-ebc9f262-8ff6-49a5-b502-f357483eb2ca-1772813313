import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus, Eye, FileText, CheckCircle, Clock, AlertCircle } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

const vendorPipeline = [
  {
    id: "VEN-P-001",
    name: "TechHub Solutions",
    contact: "Rajesh Kumar",
    email: "rajesh@techhub.com",
    phone: "+91 98765 43210",
    category: "Electronics",
    stage: "Documentation",
    progress: 60,
    dateAdded: "2026-02-25",
    assignedTo: "BDM-001"
  },
  {
    id: "VEN-P-002",
    name: "Fashion Factory",
    contact: "Priya Sharma",
    email: "priya@fashionfactory.com",
    phone: "+91 87654 32109",
    category: "Apparel",
    stage: "Pilot Run",
    progress: 85,
    dateAdded: "2026-02-20",
    assignedTo: "BDM-001"
  },
  {
    id: "VEN-P-003",
    name: "HomeGoods Plus",
    contact: "Amit Patel",
    email: "amit@homegoods.com",
    phone: "+91 76543 21098",
    category: "Home & Living",
    stage: "Qualification",
    progress: 25,
    dateAdded: "2026-02-28",
    assignedTo: "BDM-001"
  },
  {
    id: "VEN-P-004",
    name: "BookWorld Distributors",
    contact: "Sneha Verma",
    email: "sneha@bookworld.com",
    phone: "+91 65432 10987",
    category: "Books & Media",
    stage: "Training",
    progress: 70,
    dateAdded: "2026-02-22",
    assignedTo: "BDM-001"
  }
];

const onboardingStages = [
  { name: "Qualification", weight: 20 },
  { name: "Documentation", weight: 40 },
  { name: "SLA Agreement", weight: 60 },
  { name: "Training", weight: 80 },
  { name: "Pilot Run", weight: 90 },
  { name: "Approved", weight: 100 }
];

export default function BDMVendors() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVendor, setSelectedVendor] = useState<typeof vendorPipeline[0] | null>(null);
  const [newVendorName, setNewVendorName] = useState("");
  const [newVendorContact, setNewVendorContact] = useState("");
  const [newVendorEmail, setNewVendorEmail] = useState("");
  const [newVendorCategory, setNewVendorCategory] = useState("");

  const filteredVendors = vendorPipeline.filter(
    (vendor) =>
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.contact.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "Approved":
        return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400";
      case "Pilot Run":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400";
      case "Training":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400";
      case "Documentation":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400";
      case "Qualification":
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400";
    }
  };

  const handleAddVendor = () => {
    if (newVendorName && newVendorContact && newVendorEmail && newVendorCategory) {
      alert(`New vendor added to pipeline:\n${newVendorName}\n${newVendorEmail}`);
      setNewVendorName("");
      setNewVendorContact("");
      setNewVendorEmail("");
      setNewVendorCategory("");
    }
  };

  return (
    <>
      <SEO title="Vendor Pipeline - DropSync BDM" />
      <DashboardLayout role="bdm">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                Vendor Onboarding Pipeline
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Manage vendor acquisition and onboarding process
              </p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-cyan-500 hover:bg-cyan-600">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add New Vendor
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Vendor to Pipeline</DialogTitle>
                  <DialogDescription>
                    Enter vendor details to start onboarding process
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Business Name</Label>
                    <Input
                      placeholder="Enter company name"
                      value={newVendorName}
                      onChange={(e) => setNewVendorName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Contact Person</Label>
                    <Input
                      placeholder="Full name"
                      value={newVendorContact}
                      onChange={(e) => setNewVendorContact(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <Input
                      type="email"
                      placeholder="contact@vendor.com"
                      value={newVendorEmail}
                      onChange={(e) => setNewVendorEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Product Category</Label>
                    <Select value={newVendorCategory} onValueChange={setNewVendorCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Electronics">Electronics</SelectItem>
                        <SelectItem value="Apparel">Apparel</SelectItem>
                        <SelectItem value="Home & Living">Home & Living</SelectItem>
                        <SelectItem value="Books & Media">Books & Media</SelectItem>
                        <SelectItem value="Beauty">Beauty & Personal Care</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddVendor} className="bg-cyan-500 hover:bg-cyan-600">
                    Add to Pipeline
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Pipeline Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Total in Pipeline</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                      {vendorPipeline.length}
                    </p>
                  </div>
                  <Clock className="w-12 h-12 text-slate-600 opacity-20" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">In Pilot</p>
                    <p className="text-3xl font-bold text-blue-600 mt-1">
                      {vendorPipeline.filter((v) => v.stage === "Pilot Run").length}
                    </p>
                  </div>
                  <FileText className="w-12 h-12 text-blue-600 opacity-20" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Avg Progress</p>
                    <p className="text-3xl font-bold text-purple-600 mt-1">
                      {Math.round(
                        vendorPipeline.reduce((acc, v) => acc + v.progress, 0) /
                          vendorPipeline.length
                      )}
                      %
                    </p>
                  </div>
                  <CheckCircle className="w-12 h-12 text-purple-600 opacity-20" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">This Month</p>
                    <p className="text-3xl font-bold text-green-600 mt-1">
                      {
                        vendorPipeline.filter((v) =>
                          v.dateAdded.startsWith("2026-02")
                        ).length
                      }
                    </p>
                  </div>
                  <UserPlus className="w-12 h-12 text-green-600 opacity-20" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Onboarding Process Guide */}
          <Card>
            <CardHeader>
              <CardTitle>6-Step Onboarding Process</CardTitle>
              <CardDescription>Standard vendor qualification workflow</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {onboardingStages.map((stage, i) => (
                  <div
                    key={i}
                    className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-slate-900 dark:text-white">
                        {i + 1}. {stage.name}
                      </p>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {stage.weight}%
                      </span>
                    </div>
                    <Progress value={stage.weight} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Vendor Pipeline Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search vendors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendor ID</TableHead>
                    <TableHead>Business Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Date Added</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVendors.map((vendor) => (
                    <TableRow key={vendor.id}>
                      <TableCell className="font-medium">{vendor.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {vendor.name}
                          </p>
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            {vendor.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-600 dark:text-slate-400">
                        {vendor.contact}
                      </TableCell>
                      <TableCell>{vendor.category}</TableCell>
                      <TableCell>
                        <Badge className={getStageColor(vendor.stage)}>
                          {vendor.stage}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={vendor.progress} className="h-2 w-24" />
                          <span className="text-sm font-medium">{vendor.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{vendor.dateAdded}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedVendor(vendor)}
                        >
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