import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Sample data - Replace with real API data
const revenueData = [
  { month: 'Jan', revenue: 4000000, orders: 240 },
  { month: 'Feb', revenue: 5200000, orders: 310 },
  { month: 'Mar', revenue: 7800000, orders: 450 },
  { month: 'Apr', revenue: 9100000, orders: 520 },
  { month: 'May', revenue: 11500000, orders: 680 },
  { month: 'Jun', revenue: 12000000, orders: 750 }
];

const userGrowthData = [
  { month: 'Jan', investors: 15, franchises: 3, vendors: 8 },
  { month: 'Feb', investors: 28, franchises: 5, vendors: 12 },
  { month: 'Mar', investors: 42, franchises: 8, vendors: 18 },
  { month: 'Apr', investors: 65, franchises: 12, vendors: 25 },
  { month: 'May', investors: 88, franchises: 15, vendors: 32 },
  { month: 'Jun', investors: 120, franchises: 20, vendors: 45 }
];

const orderStatusData = [
  { name: 'Delivered', value: 650, color: '#10b981' },
  { name: 'In Transit', value: 120, color: '#f59e0b' },
  { name: 'Processing', value: 80, color: '#3b82f6' },
  { name: 'Cancelled', value: 25, color: '#ef4444' }
];

const vendorPerformanceData = [
  { name: 'Vendor A', sales: 2400000, orders: 145, rating: 4.8 },
  { name: 'Vendor B', sales: 1800000, orders: 98, rating: 4.6 },
  { name: 'Vendor C', sales: 3200000, orders: 210, rating: 4.9 },
  { name: 'Vendor D', sales: 1500000, orders: 75, rating: 4.5 },
  { name: 'Vendor E', sales: 2900000, orders: 165, rating: 4.7 }
];

const COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#ef4444'];

interface RevenueChartProps {
  title?: string;
  description?: string;
}

export function RevenueChart({ title = "Revenue Overview", description = "Monthly revenue and order trends" }: RevenueChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
              labelStyle={{ color: '#f3f4f6' }}
            />
            <Area type="monotone" dataKey="revenue" stroke="#f97316" fillOpacity={1} fill="url(#colorRevenue)" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function UserGrowthChart({ title = "User Growth", description = "Platform user acquisition by role" }: RevenueChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={userGrowthData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
              labelStyle={{ color: '#f3f4f6' }}
            />
            <Legend />
            <Line type="monotone" dataKey="investors" stroke="#f97316" strokeWidth={2} />
            <Line type="monotone" dataKey="franchises" stroke="#10b981" strokeWidth={2} />
            <Line type="monotone" dataKey="vendors" stroke="#3b82f6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function OrderStatusChart({ title = "Order Status Distribution", description = "Current order status breakdown" }: RevenueChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={orderStatusData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {orderStatusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
              labelStyle={{ color: '#f3f4f6' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function VendorPerformanceChart({ title = "Top Vendors", description = "Vendor sales performance" }: RevenueChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={vendorPerformanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
              labelStyle={{ color: '#f3f4f6' }}
            />
            <Bar dataKey="sales" fill="#f97316" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down';
  icon?: React.ReactNode;
}

export function StatsCard({ title, value, change, trend, icon }: StatsCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {change && (
              <p className={`text-xs ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {trend === 'up' ? '↑' : '↓'} {change}
              </p>
            )}
          </div>
          {icon && (
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}