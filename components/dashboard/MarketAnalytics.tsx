'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  LineChart, Line, BarChart, Bar, AreaChart, Area, ResponsiveContainer, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell
} from 'recharts';
import { 
  TrendingUp, TrendingDown, DollarSign, Home, MapPin, 
  Calculator, Target, AlertTriangle, CheckCircle, BarChart3
} from 'lucide-react';

const priceData = [
  { month: 'Jan', avgPrice: 650000, sales: 45, inventory: 120 },
  { month: 'Feb', avgPrice: 665000, sales: 52, inventory: 115 },
  { month: 'Mar', avgPrice: 680000, sales: 48, inventory: 108 },
  { month: 'Apr', avgPrice: 695000, sales: 55, inventory: 102 },
  { month: 'May', avgPrice: 710000, sales: 62, inventory: 95 },
  { month: 'Jun', avgPrice: 725000, sales: 58, inventory: 88 },
  { month: 'Jul', avgPrice: 740000, sales: 65, inventory: 82 },
  { month: 'Aug', avgPrice: 755000, sales: 70, inventory: 75 },
  { month: 'Sep', avgPrice: 770000, sales: 68, inventory: 70 },
  { month: 'Oct', avgPrice: 785000, sales: 72, inventory: 65 },
  { month: 'Nov', avgPrice: 800000, sales: 75, inventory: 60 },
  { month: 'Dec', avgPrice: 815000, sales: 78, inventory: 55 },
];

const marketSegments = [
  { name: 'Luxury ($1M+)', value: 25, growth: 8.5, color: '#8b5cf6' },
  { name: 'Mid-Range ($500K-$1M)', value: 45, growth: 5.2, color: '#06b6d4' },
  { name: 'Affordable (<$500K)', value: 30, growth: 3.1, color: '#10b981' },
];

const neighborhoodData = [
  { name: 'Downtown', avgPrice: 850000, change: 12.5, inventory: 25, daysOnMarket: 18 },
  { name: 'Beverly Hills', avgPrice: 1200000, change: 8.3, inventory: 15, daysOnMarket: 22 },
  { name: 'Santa Monica', avgPrice: 950000, change: 15.2, inventory: 20, daysOnMarket: 16 },
  { name: 'Hollywood', avgPrice: 720000, change: 6.8, inventory: 35, daysOnMarket: 25 },
  { name: 'Pasadena', avgPrice: 680000, change: 4.2, inventory: 40, daysOnMarket: 28 },
];

const investmentMetrics = [
  { metric: 'Cap Rate', value: '4.2%', trend: 'up', description: 'Average capitalization rate' },
  { metric: 'Cash-on-Cash Return', value: '6.8%', trend: 'up', description: 'Annual return on invested cash' },
  { metric: 'Rental Yield', value: '3.5%', trend: 'down', description: 'Annual rental income vs property value' },
  { metric: 'Appreciation Rate', value: '8.1%', trend: 'up', description: 'Annual property value increase' },
];

export default function MarketAnalytics() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('12m');
  const [selectedRegion, setSelectedRegion] = useState('los-angeles');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-primary/10 p-3 text-primary">
          <BarChart3 className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Market Analytics & Intelligence</h2>
          <p className="text-muted-foreground">
            Comprehensive market analysis and investment insights
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3m">Last 3 months</SelectItem>
            <SelectItem value="6m">Last 6 months</SelectItem>
            <SelectItem value="12m">Last 12 months</SelectItem>
            <SelectItem value="24m">Last 24 months</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedRegion} onValueChange={setSelectedRegion}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Select region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="los-angeles">Los Angeles</SelectItem>
            <SelectItem value="orange-county">Orange County</SelectItem>
            <SelectItem value="san-diego">San Diego</SelectItem>
            <SelectItem value="san-francisco">San Francisco</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Market Overview</TabsTrigger>
          <TabsTrigger value="trends">Price Trends</TabsTrigger>
          <TabsTrigger value="neighborhoods">Neighborhoods</TabsTrigger>
          <TabsTrigger value="investment">Investment Analysis</TabsTrigger>
          <TabsTrigger value="predictions">AI Predictions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-green-100 p-3 text-green-600">
                    <DollarSign className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Median Price</p>
                    <div className="flex items-center gap-2">
                      <h3 className="text-2xl font-bold">$815K</h3>
                      <Badge variant="secondary" className="text-green-600">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +8.2%
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-blue-100 p-3 text-blue-600">
                    <Home className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Properties Sold</p>
                    <div className="flex items-center gap-2">
                      <h3 className="text-2xl font-bold">1,247</h3>
                      <Badge variant="secondary" className="text-green-600">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +12%
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-orange-100 p-3 text-orange-600">
                    <Target className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Days on Market</p>
                    <div className="flex items-center gap-2">
                      <h3 className="text-2xl font-bold">22</h3>
                      <Badge variant="secondary" className="text-red-600">
                        <TrendingDown className="h-3 w-3 mr-1" />
                        -15%
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-purple-100 p-3 text-purple-600">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Inventory</p>
                    <div className="flex items-center gap-2">
                      <h3 className="text-2xl font-bold">2,156</h3>
                      <Badge variant="secondary" className="text-red-600">
                        <TrendingDown className="h-3 w-3 mr-1" />
                        -8%
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Market Segments</CardTitle>
                <CardDescription>Distribution by price range</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={marketSegments}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {marketSegments.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Market Health Indicators</CardTitle>
                <CardDescription>Key metrics for market assessment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="font-medium">Seller's Market</span>
                  </div>
                  <Badge variant="secondary" className="text-green-600">Strong</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    <span className="font-medium">Affordability Index</span>
                  </div>
                  <Badge variant="secondary" className="text-yellow-600">Moderate</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="font-medium">Price Stability</span>
                  </div>
                  <Badge variant="secondary" className="text-green-600">Stable</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                    <span className="font-medium">Investment Potential</span>
                  </div>
                  <Badge variant="secondary" className="text-blue-600">High</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Price Trends Analysis</CardTitle>
              <CardDescription>Historical price movements and market activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={priceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'avgPrice' ? `$${value.toLocaleString()}` : value,
                        name === 'avgPrice' ? 'Average Price' : name === 'sales' ? 'Sales' : 'Inventory'
                      ]}
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="avgPrice" 
                      stroke="#8b5cf6" 
                      fill="#8b5cf6" 
                      fillOpacity={0.3}
                      name="Average Price"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales Volume</CardTitle>
                <CardDescription>Monthly property sales</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={priceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="sales" fill="#06b6d4" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inventory Levels</CardTitle>
                <CardDescription>Available properties over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={priceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="inventory" 
                        stroke="#10b981" 
                        strokeWidth={3}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="neighborhoods" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Neighborhood Analysis</CardTitle>
              <CardDescription>Compare different areas in Los Angeles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {neighborhoodData.map((neighborhood, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-muted-foreground" />
                        <h3 className="font-semibold text-lg">{neighborhood.name}</h3>
                      </div>
                      <Badge 
                        variant={neighborhood.change > 10 ? 'default' : 'secondary'}
                        className={neighborhood.change > 10 ? 'text-green-600' : ''}
                      >
                        {neighborhood.change > 0 ? '+' : ''}{neighborhood.change}%
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Avg Price</p>
                        <p className="font-semibold">${neighborhood.avgPrice.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Inventory</p>
                        <p className="font-semibold">{neighborhood.inventory} homes</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Days on Market</p>
                        <p className="font-semibold">{neighborhood.daysOnMarket} days</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Market Status</p>
                        <p className="font-semibold">
                          {neighborhood.daysOnMarket < 20 ? 'Hot' : 
                           neighborhood.daysOnMarket < 30 ? 'Balanced' : 'Cool'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="investment" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {investmentMetrics.map((metric, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`rounded-full p-3 ${
                      metric.trend === 'up' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {metric.trend === 'up' ? 
                        <TrendingUp className="h-6 w-6" /> : 
                        <TrendingDown className="h-6 w-6" />
                      }
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{metric.metric}</p>
                      <h3 className="text-2xl font-bold">{metric.value}</h3>
                      <p className="text-xs text-muted-foreground">{metric.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Investment Calculator</CardTitle>
              <CardDescription>Calculate potential returns on investment properties</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Property Value</label>
                    <div className="mt-1 relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <input 
                        type="text" 
                        placeholder="750,000"
                        className="w-full pl-10 pr-3 py-2 border rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Down Payment (%)</label>
                    <input 
                      type="number" 
                      placeholder="20"
                      className="w-full mt-1 px-3 py-2 border rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Monthly Rent</label>
                    <div className="mt-1 relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <input 
                        type="text" 
                        placeholder="3,500"
                        className="w-full pl-10 pr-3 py-2 border rounded-md"
                      />
                    </div>
                  </div>
                  
                  <Button className="w-full">
                    <Calculator className="h-4 w-4 mr-2" />
                    Calculate Returns
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-3">Projected Returns</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Monthly Cash Flow:</span>
                        <span className="font-semibold text-green-600">+$1,250</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Annual Cash-on-Cash Return:</span>
                        <span className="font-semibold">8.5%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cap Rate:</span>
                        <span className="font-semibold">5.6%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total ROI (5 years):</span>
                        <span className="font-semibold text-green-600">142%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Market Predictions</CardTitle>
              <CardDescription>Machine learning-powered market forecasts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg text-center">
                  <h4 className="font-semibold text-lg">Next 6 Months</h4>
                  <p className="text-2xl font-bold text-green-600 mt-2">+3.2%</p>
                  <p className="text-sm text-muted-foreground">Price increase expected</p>
                </div>
                
                <div className="p-4 border rounded-lg text-center">
                  <h4 className="font-semibold text-lg">Next 12 Months</h4>
                  <p className="text-2xl font-bold text-blue-600 mt-2">+7.8%</p>
                  <p className="text-sm text-muted-foreground">Strong growth predicted</p>
                </div>
                
                <div className="p-4 border rounded-lg text-center">
                  <h4 className="font-semibold text-lg">Market Confidence</h4>
                  <p className="text-2xl font-bold text-purple-600 mt-2">87%</p>
                  <p className="text-sm text-muted-foreground">AI prediction accuracy</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Key Factors Influencing Predictions:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Low interest rates driving demand</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Limited housing inventory</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Population growth in tech sectors</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm">Economic uncertainty factors</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm">Potential policy changes</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm">Affordability concerns</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
