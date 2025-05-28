'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  TrendingUp, TrendingDown, BarChart3, PieChart, 
  Users, Building, DollarSign, Eye, Calendar,
  Download, Filter, RefreshCw, Loader2, ArrowUpRight,
  ArrowDownRight, Activity, Target, MapPin, Clock
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { formatDistanceToNow } from 'date-fns';

// Import chart components
import D3BarChart from '@/components/charts/D3BarChart';
import D3LineChart from '@/components/charts/D3LineChart';
import D3PieChart from '@/components/charts/D3PieChart';
import ResponsiveD3Chart from '@/components/charts/ResponsiveD3Chart';

interface AnalyticsData {
  overview: {
    totalProperties: number;
    totalViews: number;
    totalInquiries: number;
    totalRevenue: number;
    conversionRate: number;
    averagePrice: number;
    trends: {
      properties: number;
      views: number;
      inquiries: number;
      revenue: number;
    };
  };
  propertyPerformance: Array<{
    month: string;
    sales: number;
    rentals: number;
    views: number;
    inquiries: number;
  }>;
  topProperties: Array<{
    id: string;
    title: string;
    views: number;
    inquiries: number;
    price: number;
    type: string;
    image?: string;
  }>;
  locationAnalytics: Array<{
    city: string;
    state: string;
    properties: number;
    averagePrice: number;
    totalViews: number;
  }>;
  userEngagement: Array<{
    date: string;
    activeUsers: number;
    newUsers: number;
    pageViews: number;
  }>;
}

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/analytics?timeRange=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch analytics data",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: "Error",
        description: "Failed to fetch analytics data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAnalytics();
    setRefreshing(false);
    toast({
      title: "Success",
      description: "Analytics data refreshed",
    });
  };

  const exportData = () => {
    // Implement data export functionality
    toast({
      title: "Export Started",
      description: "Your analytics report is being generated",
    });
  };

  const formatTrend = (value: number) => {
    const isPositive = value >= 0;
    return {
      value: Math.abs(value),
      isPositive,
      icon: isPositive ? ArrowUpRight : ArrowDownRight,
      color: isPositive ? 'text-green-600' : 'text-red-600',
      bgColor: isPositive ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900',
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold">No Analytics Data</h3>
          <p className="text-muted-foreground">Analytics data will appear here once available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive insights into your real estate performance
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={exportData}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Properties</p>
                    <h3 className="text-2xl font-bold">{analytics.overview.totalProperties.toLocaleString()}</h3>
                  </div>
                  <div className="rounded-full bg-blue-100 p-3 text-blue-600 dark:bg-blue-900 dark:text-blue-200">
                    <Building className="h-6 w-6" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  {(() => {
                    const trend = formatTrend(analytics.overview.trends.properties);
                    return (
                      <div className={`flex items-center rounded-full px-2 py-1 text-xs ${trend.bgColor}`}>
                        <trend.icon className={`mr-1 h-3 w-3 ${trend.color}`} />
                        <span className={trend.color}>{trend.value}%</span>
                      </div>
                    );
                  })()}
                  <span className="ml-2 text-sm text-muted-foreground">vs last period</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Views</p>
                    <h3 className="text-2xl font-bold">{analytics.overview.totalViews.toLocaleString()}</h3>
                  </div>
                  <div className="rounded-full bg-green-100 p-3 text-green-600 dark:bg-green-900 dark:text-green-200">
                    <Eye className="h-6 w-6" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  {(() => {
                    const trend = formatTrend(analytics.overview.trends.views);
                    return (
                      <div className={`flex items-center rounded-full px-2 py-1 text-xs ${trend.bgColor}`}>
                        <trend.icon className={`mr-1 h-3 w-3 ${trend.color}`} />
                        <span className={trend.color}>{trend.value}%</span>
                      </div>
                    );
                  })()}
                  <span className="ml-2 text-sm text-muted-foreground">vs last period</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Inquiries</p>
                    <h3 className="text-2xl font-bold">{analytics.overview.totalInquiries.toLocaleString()}</h3>
                  </div>
                  <div className="rounded-full bg-purple-100 p-3 text-purple-600 dark:bg-purple-900 dark:text-purple-200">
                    <Activity className="h-6 w-6" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  {(() => {
                    const trend = formatTrend(analytics.overview.trends.inquiries);
                    return (
                      <div className={`flex items-center rounded-full px-2 py-1 text-xs ${trend.bgColor}`}>
                        <trend.icon className={`mr-1 h-3 w-3 ${trend.color}`} />
                        <span className={trend.color}>{trend.value}%</span>
                      </div>
                    );
                  })()}
                  <span className="ml-2 text-sm text-muted-foreground">vs last period</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Conversion Rate</p>
                    <h3 className="text-2xl font-bold">{analytics.overview.conversionRate.toFixed(1)}%</h3>
                  </div>
                  <div className="rounded-full bg-orange-100 p-3 text-orange-600 dark:bg-orange-900 dark:text-orange-200">
                    <Target className="h-6 w-6" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <div className="flex items-center rounded-full px-2 py-1 text-xs bg-green-100 dark:bg-green-900">
                    <ArrowUpRight className="mr-1 h-3 w-3 text-green-600" />
                    <span className="text-green-600">2.1%</span>
                  </div>
                  <span className="ml-2 text-sm text-muted-foreground">vs last period</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Charts */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Property Performance</CardTitle>
                <CardDescription>Monthly sales and rental trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveD3Chart aspectRatio={2} minHeight={300} maxHeight={400}>
                  {({ width, height }) => (
                    <D3BarChart
                      data={analytics.propertyPerformance}
                      width={width}
                      height={height}
                      className="w-full"
                    />
                  )}
                </ResponsiveD3Chart>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Engagement</CardTitle>
                <CardDescription>Daily active users and page views</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveD3Chart aspectRatio={2} minHeight={300} maxHeight={400}>
                  {({ width, height }) => (
                    <D3LineChart
                      data={analytics.userEngagement}
                      width={width}
                      height={height}
                      className="w-full"
                    />
                  )}
                </ResponsiveD3Chart>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Properties Tab */}
        <TabsContent value="properties" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Properties</CardTitle>
              <CardDescription>Properties with highest views and inquiries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.topProperties.map((property, index) => (
                  <div key={property.id} className="flex items-center space-x-4 rounded-lg border p-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                      {index + 1}
                    </div>
                    {property.image && (
                      <img
                        src={property.image}
                        alt={property.title}
                        className="h-16 w-16 rounded-md object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium">{property.title}</h4>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>{property.views} views</span>
                        <span>{property.inquiries} inquiries</span>
                        <Badge variant="outline">{property.type}</Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${property.price.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">
                        {((property.inquiries / property.views) * 100).toFixed(1)}% conversion
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Locations Tab */}
        <TabsContent value="locations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Location Analytics</CardTitle>
              <CardDescription>Performance by city and state</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.locationAnalytics.map((location, index) => (
                  <div key={`${location.city}-${location.state}`} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center space-x-4">
                      <div className="rounded-full bg-blue-100 p-2 text-blue-600 dark:bg-blue-900 dark:text-blue-200">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-medium">{location.city}, {location.state}</h4>
                        <p className="text-sm text-muted-foreground">{location.properties} properties</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${location.averagePrice.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">avg. price</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{location.totalViews.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">total views</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Engagement Tab */}
        <TabsContent value="engagement" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>User Activity</CardTitle>
                <CardDescription>Daily user engagement metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveD3Chart aspectRatio={2} minHeight={300} maxHeight={400}>
                  {({ width, height }) => (
                    <D3LineChart
                      data={analytics.userEngagement}
                      width={width}
                      height={height}
                      className="w-full"
                    />
                  )}
                </ResponsiveD3Chart>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Engagement Summary</CardTitle>
                <CardDescription>Key engagement metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Average Session Duration</span>
                  <span className="font-medium">4m 32s</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Bounce Rate</span>
                  <span className="font-medium">32.1%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Pages per Session</span>
                  <span className="font-medium">3.7</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Return Visitor Rate</span>
                  <span className="font-medium">68.4%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
