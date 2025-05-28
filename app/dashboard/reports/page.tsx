'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  Download, 
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Building,
  Users,
  Eye,
  FileText,
  PieChart,
  LineChart
} from 'lucide-react';

interface Report {
  id: string;
  title: string;
  description: string;
  type: 'financial' | 'property' | 'market' | 'user';
  generatedDate: string;
  status: 'ready' | 'generating' | 'scheduled';
  size: string;
}

const mockReports: Report[] = [
  {
    id: '1',
    title: 'Monthly Property Performance',
    description: 'Detailed analysis of property sales and rentals for January 2024',
    type: 'property',
    generatedDate: '2024-01-31',
    status: 'ready',
    size: '2.4 MB'
  },
  {
    id: '2',
    title: 'Financial Summary Q1 2024',
    description: 'Quarterly financial report including revenue, expenses, and profit margins',
    type: 'financial',
    generatedDate: '2024-01-30',
    status: 'ready',
    size: '1.8 MB'
  },
  {
    id: '3',
    title: 'Market Trends Analysis',
    description: 'Current market trends and price predictions for the next quarter',
    type: 'market',
    generatedDate: '2024-01-29',
    status: 'ready',
    size: '3.2 MB'
  },
  {
    id: '4',
    title: 'User Engagement Report',
    description: 'User activity, engagement metrics, and platform usage statistics',
    type: 'user',
    generatedDate: '2024-01-28',
    status: 'generating',
    size: 'Pending'
  },
  {
    id: '5',
    title: 'Weekly Sales Report',
    description: 'Weekly breakdown of property sales and lead generation',
    type: 'property',
    generatedDate: '2024-01-27',
    status: 'ready',
    size: '1.1 MB'
  }
];

const reportStats = [
  {
    title: 'Total Reports',
    value: '24',
    change: '+12%',
    trend: 'up',
    icon: FileText
  },
  {
    title: 'This Month',
    value: '8',
    change: '+25%',
    trend: 'up',
    icon: Calendar
  },
  {
    title: 'Downloads',
    value: '156',
    change: '+8%',
    trend: 'up',
    icon: Download
  },
  {
    title: 'Scheduled',
    value: '5',
    change: '0%',
    trend: 'neutral',
    icon: BarChart3
  }
];

export default function ReportsPage() {
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredReports = mockReports.filter(report => 
    selectedType === 'all' || report.type === selectedType
  );

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'financial': return 'bg-green-100 text-green-800';
      case 'property': return 'bg-blue-100 text-blue-800';
      case 'market': return 'bg-purple-100 text-purple-800';
      case 'user': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-100 text-green-800';
      case 'generating': return 'bg-yellow-100 text-yellow-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'financial': return DollarSign;
      case 'property': return Building;
      case 'market': return TrendingUp;
      case 'user': return Users;
      default: return FileText;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-primary/10 p-3 text-primary">
          <BarChart3 className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Reports & Analytics</h2>
          <p className="text-muted-foreground">
            Generate and download comprehensive business reports
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-primary/10 p-3 text-primary">
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-bold">{stat.value}</h3>
                    <span className={`flex items-center text-xs ${
                      stat.trend === 'up' ? 'text-green-500' : 
                      stat.trend === 'down' ? 'text-red-500' : 'text-gray-500'
                    }`}>
                      {stat.trend === 'up' && <TrendingUp className="mr-1 h-3 w-3" />}
                      {stat.trend === 'down' && <TrendingDown className="mr-1 h-3 w-3" />}
                      {stat.change}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Reports</TabsTrigger>
          <TabsTrigger value="generate">Generate New</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedType === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType('all')}
            >
              All Types
            </Button>
            <Button
              variant={selectedType === 'financial' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType('financial')}
            >
              Financial
            </Button>
            <Button
              variant={selectedType === 'property' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType('property')}
            >
              Property
            </Button>
            <Button
              variant={selectedType === 'market' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType('market')}
            >
              Market
            </Button>
            <Button
              variant={selectedType === 'user' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType('user')}
            >
              User Analytics
            </Button>
          </div>

          {/* Reports List */}
          <Card>
            <CardHeader>
              <CardTitle>Available Reports ({filteredReports.length})</CardTitle>
              <CardDescription>
                Download or view your generated reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-4">
                  {filteredReports.map((report) => {
                    const TypeIcon = getTypeIcon(report.type);
                    return (
                      <div
                        key={report.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="rounded-full bg-primary/10 p-2 text-primary">
                            <TypeIcon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{report.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {report.description}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {report.generatedDate}
                              </span>
                              <span>{report.size}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={getTypeColor(report.type)}>
                            {report.type}
                          </Badge>
                          <Badge className={getStatusColor(report.status)}>
                            {report.status}
                          </Badge>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" disabled={report.status !== 'ready'}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" disabled={report.status !== 'ready'}>
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="generate">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-green-100 p-2 text-green-600">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">Financial Report</CardTitle>
                </div>
                <CardDescription>
                  Generate comprehensive financial analysis and revenue reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Generate Report</Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-blue-100 p-2 text-blue-600">
                    <Building className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">Property Report</CardTitle>
                </div>
                <CardDescription>
                  Analyze property performance, sales, and rental statistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Generate Report</Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-purple-100 p-2 text-purple-600">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">Market Analysis</CardTitle>
                </div>
                <CardDescription>
                  Market trends, price analysis, and future predictions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Generate Report</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="scheduled">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>Manage your automated report generation</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">
                No scheduled reports configured. Set up automated reports to receive regular updates.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Report Templates</CardTitle>
              <CardDescription>Customize and save report templates for quick generation</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">
                Create custom report templates to streamline your reporting process.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
