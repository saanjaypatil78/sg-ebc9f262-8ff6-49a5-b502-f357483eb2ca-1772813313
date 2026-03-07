import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Shield, TrendingUp, Building, Award, Star, Activity } from "lucide-react";
import { SEO } from "@/components/SEO";

export default function ProfilePage() {
  const { user } = useAuth();

  const renderRoleSpecificContent = () => {
    switch(user?.role) {
      case 'INVESTOR':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-full bg-cyan-500/20 text-cyan-400">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Investment Tier</p>
                    <p className="text-2xl font-bold text-white">STANDARD</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-full bg-orange-500/20 text-orange-400">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Current Rank</p>
                    <p className="text-2xl font-bold text-white">BRONZE</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-full bg-purple-500/20 text-purple-400">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Avg Monthly ROI</p>
                    <p className="text-2xl font-bold text-white">15%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'VENDOR':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-full bg-blue-500/20 text-blue-400">
                    <Building className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Active Listings</p>
                    <p className="text-2xl font-bold text-white">24</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-full bg-green-500/20 text-green-400">
                    <Star className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Vendor Rating</p>
                    <p className="text-2xl font-bold text-white">4.8 / 5.0</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <SEO title="Strategic Profile - Brave Ecom" />
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Strategic Profile</h1>
          <p className="text-slate-400 mt-2">Manage your identity, roles, and security settings.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Identity Card */}
          <Card className="lg:col-span-2 bg-slate-900/80 border-slate-800 backdrop-blur-xl overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-80" />
            <CardContent className="relative pt-0 px-8 pb-8">
              <div className="absolute -top-16 left-8 p-1 bg-slate-900 rounded-full">
                <div className="w-24 h-24 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full flex items-center justify-center border-4 border-slate-900">
                  <User className="w-12 h-12 text-slate-400" />
                </div>
              </div>
              
              <div className="mt-12 flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {(user as Record<string, any>)?.first_name || (user as Record<string, any>)?.user_metadata?.first_name || 'Strategic'} {(user as Record<string, any>)?.last_name || (user as Record<string, any>)?.user_metadata?.last_name || 'User'}
                  </h2>
                  <div className="flex items-center space-x-3 mt-2">
                    <Badge variant="outline" className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20">
                      {user?.role || 'REGISTERED'}
                    </Badge>
                    <span className="text-slate-400 text-sm flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      India
                    </span>
                  </div>
                </div>
                <Button variant="outline" className="border-slate-700 text-slate-300">
                  Edit Profile
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8 pt-8 border-t border-slate-800">
                <div className="space-y-1">
                  <span className="text-sm text-slate-500 flex items-center"><Mail className="w-4 h-4 mr-2" />Email Address</span>
                  <p className="text-slate-200">{user?.email || 'user@example.com'}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm text-slate-500 flex items-center"><Phone className="w-4 h-4 mr-2" />Phone Number</span>
                  <p className="text-slate-200">+91 ***** *****</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Status */}
          <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Shield className="w-5 h-5 mr-2 text-green-400" />
                Security Status
              </CardTitle>
              <CardDescription>Your account protection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                <div>
                  <p className="font-medium text-slate-200">Email Verified</p>
                  <p className="text-xs text-slate-400">Required for operations</p>
                </div>
                <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/20">Verified</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                <div>
                  <p className="font-medium text-slate-200">2FA / TOTP</p>
                  <p className="text-xs text-slate-400">Authenticator app</p>
                </div>
                <Badge variant="outline" className="text-slate-400">Inactive</Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                <div>
                  <p className="font-medium text-slate-200">Device Binding</p>
                  <p className="text-xs text-slate-400">High-value limits</p>
                </div>
                <Badge variant="outline" className="bg-orange-500/10 text-orange-400 border-orange-500/20">Required</Badge>
              </div>
              
              <Button className="w-full mt-4 bg-slate-800 hover:bg-slate-700 text-white" variant="secondary">
                Manage Security
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Role Specific Analytics / Strategic Information */}
        {renderRoleSpecificContent()}
      </div>
    </DashboardLayout>
  );
}