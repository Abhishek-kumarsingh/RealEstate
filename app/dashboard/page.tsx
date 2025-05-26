'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, ResponsiveContainer, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell
} from 'recharts';
import { 
  Building, Users, DollarSign, TrendingUp, Home, BadgeCheck,
  ClipboardList, Calendar, ArrowUpRight
} from 'lucide-react';

// Mock data for charts
const propertyData = [
  { name: 'Jan', sales: 4, rentals: 2 },
  { name: 'Feb', sales: 3, rentals: 4 },
  { name: 'Mar', sales: 5, rentals: 3 },
  { name: 'Apr', sales: 7, rentals: 5 },
  { name: 'May', sales: 4, rentals: 6 },
  { name: 'Jun', sales: 8, rentals: 4 },
  { name: 'Jul', sales: 10, rentals: 8 },
  { name: 'Aug', sales: 8, rentals: 7 },
  { name: 'Sep', sales: 12, rentals: 9 },
  { name: 'Oct', sales: 9, rentals: 11 },
  { name: 'Nov', sales: 11, rentals: 13 },
  { name: 'Dec', sales: 15, rentals: 10 },
];

const categoryData = [
  { name: 'Houses', value: 45 },
  { name: 'Apartments', value: 30 },
  { name: 'Commercial', value: 15 },
  { name: 'Land', value: 10 },
];

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

// Mock data for recent properties
const recentProperties = [
  {
    id: '1',
    title: 'Modern Luxury Villa with Ocean View',
    price: 1250000,
    location: 'Malibu, CA',
    status: 'Available',
    date: '2 days ago',
    image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg',
  },
  {
    id: '2',
    title: 'Downtown Luxury Apartment',
    price: 4500,
    location: 'Los Angeles, CA',
    status: 'Pending',
    date: '3 days ago',
    image: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
  },
  {
    id: '3',
    title: 'Waterfront Commercial Building',
    price: 3500000,
    location: 'San Francisco, CA',
    status: 'Available',
    date: '1 week ago',
    image: 'https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg',
  },
];

// Mock data for recent activity
const recentActivity = [
  {
    id: '1',
    action: 'New property listed',
    details: 'Modern Luxury Villa with Ocean View',
    time: '2 hours ago',
    icon: Home,
  },
  {
    id: '2',
    action: 'Property approved',
    details: 'Downtown Luxury Apartment',
    time: '5 hours ago',
    icon: BadgeCheck,
  },
  {
    id: '3',
    action: 'New inquiry received',
    details: 'From David Miller about Waterfront Commercial Building',
    time: '1 day ago',
    icon: ClipboardList,
  },
  {
    id: '4',
    action: 'Property viewing scheduled',
    details: 'Suburban Family Home on May 15, 2023',
    time: '2 days ago',
    icon: Calendar,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back to your dashboard</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm" data-aos="fade-up" data-aos-delay="0">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-primary/10 p-3 text-primary">
                <Building className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Properties</p>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-bold">248</h3>
                  <span className="flex items-center text-xs text-green-500">
                    <ArrowUpRight className="mr-1 h-3 w-3" />
                    12%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm" data-aos="fade-up" data-aos-delay="100">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-primary/10 p-3 text-primary">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Agents</p>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-bold">36</h3>
                  <span className="flex items-center text-xs text-green-500">
                    <ArrowUpRight className="mr-1 h-3 w-3" />
                    8%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm" data-aos="fade-up" data-aos-delay="200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-primary/10 p-3 text-primary">
                <DollarSign className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-bold">$1.2M</h3>
                  <span className="flex items-center text-xs text-green-500">
                    <ArrowUpRight className="mr-1 h-3 w-3" />
                    18%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm" data-aos="fade-up" data-aos-delay="300">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-primary/10 p-3 text-primary">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Site Visits</p>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-bold">12,486</h3>
                  <span className="flex items-center text-xs text-green-500">
                    <ArrowUpRight className="mr-1 h-3 w-3" />
                    24%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card className="shadow-sm" data-aos="fade-up">
          <CardHeader>
            <CardTitle>Property Performance</CardTitle>
            <CardDescription>Monthly sales and rentals for the past year</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="bar">
              <div className="px-6">
                <TabsList className="mb-4">
                  <TabsTrigger value="bar">Bar Chart</TabsTrigger>
                  <TabsTrigger value="line">Line Chart</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="bar" className="px-2">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={propertyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sales" name="Sales" fill="hsl(var(--chart-1))" />
                    <Bar dataKey="rentals" name="Rentals" fill="hsl(var(--chart-2))" />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
              <TabsContent value="line" className="px-2">
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={propertyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="sales" name="Sales" stroke="hsl(var(--chart-1))" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="rentals" name="Rentals" stroke="hsl(var(--chart-2))" />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="shadow-sm" data-aos="fade-up" data-aos-delay="100">
          <CardHeader>
            <CardTitle>Property Categories</CardTitle>
            <CardDescription>Distribution of properties by type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card className="shadow-sm" data-aos="fade-up">
          <CardHeader>
            <CardTitle>Recent Properties</CardTitle>
            <CardDescription>Latest property listings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProperties.map((property, index) => (
                <div 
                  key={property.id} 
                  className="flex items-center gap-4 rounded-lg border p-3"
                  data-aos="fade-right"
                  data-aos-delay={index * 100}
                >
                  <div className="relative aspect-square h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <h4 className="truncate font-medium">{property.title}</h4>
                    <p className="text-sm text-muted-foreground">{property.location}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {typeof property.price === 'number' && property.price >= 10000
                          ? `$${(property.price).toLocaleString()}`
                          : `$${property.price}/mo`}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        property.status === 'Available' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {property.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm" data-aos="fade-up" data-aos-delay="100">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div 
                  key={activity.id} 
                  className="flex items-start gap-4"
                  data-aos="fade-left"
                  data-aos-delay={index * 100}
                >
                  <div className="rounded-full bg-primary/10 p-2 text-primary">
                    <activity.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.details}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}