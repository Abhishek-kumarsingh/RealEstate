'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'; // Only for chart switching
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
// D3.js chart imports
import D3BarChart from '@/components/charts/D3BarChart';
import D3LineChart from '@/components/charts/D3LineChart';
import D3PieChart from '@/components/charts/D3PieChart';
import ResponsiveD3Chart from '@/components/charts/ResponsiveD3Chart';
import {
  Building, Users, DollarSign, TrendingUp, Home, BadgeCheck,
  ClipboardList, Calendar, ArrowUpRight, Eye, EyeOff, Loader2
} from 'lucide-react';
// Removed unused icons: MessageCircle, Calculator, Shield, BarChart3, Brain, faRobot

// Removed unused component imports since we're using sidebar navigation

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

// COLORS constant removed - now handled by D3.js charts

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
  const { user, login, loading } = useAuth();
  // Removed activeTab state since we're using sidebar navigation
  const [showLogin, setShowLogin] = useState(false);

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    if (!user && !loading) {
      setShowLogin(true);
    }
  }, [user, loading]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    const result = await login(email, password);

    if (result.success) {
      setShowLogin(false);
      setEmail('');
      setPassword('');
    } else {
      setLoginError(result.error || 'Login failed');
    }

    setLoginLoading(false);
  };

  // Show login overlay if not authenticated
  if (showLogin && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20 px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Welcome to RealEstate Pro</CardTitle>
            <CardDescription className="text-center">
              Sign in to access your comprehensive real estate dashboard
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              {loginError && (
                <Alert variant="destructive">
                  <AlertDescription>{loginError}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loginLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loginLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loginLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loginLoading}>
                {loginLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Access Dashboard'
                )}
              </Button>
            </CardContent>
          </form>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-none">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name}! Here's your real estate portfolio summary.</p>
        </div>
      </div>

      {/* Dashboard Overview Content */}
      <div className="space-y-4 w-full">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
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

          <div className="grid grid-cols-1 gap-4 lg:gap-6 2xl:grid-cols-2">
            <Card className="shadow-sm" data-aos="fade-up">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Property Performance</CardTitle>
                <CardDescription>Monthly sales and rentals for the past year</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs defaultValue="bar">
                  <div className="px-4 sm:px-6">
                    <TabsList className="mb-3">
                      <TabsTrigger value="bar" className="text-xs sm:text-sm">Bar Chart</TabsTrigger>
                      <TabsTrigger value="line" className="text-xs sm:text-sm">Line Chart</TabsTrigger>
                    </TabsList>
                  </div>
                  <TabsContent value="bar" className="px-2">
                    <ResponsiveD3Chart aspectRatio={2.2} minHeight={300} maxHeight={400}>
                      {({ width, height }) => (
                        <D3BarChart
                          data={propertyData}
                          width={width}
                          height={height}
                          className="w-full"
                        />
                      )}
                    </ResponsiveD3Chart>
                  </TabsContent>
                  <TabsContent value="line" className="px-2">
                    <ResponsiveD3Chart aspectRatio={2.2} minHeight={300} maxHeight={400}>
                      {({ width, height }) => (
                        <D3LineChart
                          data={propertyData}
                          width={width}
                          height={height}
                          className="w-full"
                        />
                      )}
                    </ResponsiveD3Chart>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card className="shadow-sm" data-aos="fade-up" data-aos-delay="100">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Property Categories</CardTitle>
                <CardDescription>Distribution of properties by type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveD3Chart aspectRatio={1} minHeight={300} maxHeight={400}>
                  {({ width, height }) => (
                    <D3PieChart
                      data={categoryData}
                      width={Math.min(width, height)}
                      height={height}
                      className="w-full"
                    />
                  )}
                </ResponsiveD3Chart>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:gap-6 2xl:grid-cols-2">
            <Card className="shadow-sm" data-aos="fade-up">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Recent Properties</CardTitle>
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
                      <div className="relative aspect-square h-12 w-12 sm:h-16 sm:w-16 flex-shrink-0 overflow-hidden rounded-md">
                        <img
                          src={property.image}
                          alt={property.title}
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <h4 className="truncate font-medium text-sm sm:text-base">{property.title}</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground">{property.location}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="font-medium text-sm sm:text-base">
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
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Recent Activity</CardTitle>
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
                      <div className="rounded-full bg-primary/10 p-2 text-primary flex-shrink-0">
                        <activity.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm sm:text-base">{activity.action}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">{activity.details}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
    </div>
  );
}