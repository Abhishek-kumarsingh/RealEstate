'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign, TrendingUp, Calculator, PieChart, 
  BarChart3, Target, AlertTriangle, CheckCircle
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, ResponsiveContainer, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart as RechartsPieChart, Pie, Cell
} from 'recharts';

interface InvestmentMetrics {
  capRate: number;
  cashOnCashReturn: number;
  totalROI: number;
  monthlyRent: number;
  monthlyCashFlow: number;
  annualCashFlow: number;
  breakEvenRatio: number;
  onePercentRule: boolean;
  twoPercentRule: boolean;
}

interface TaxCalculation {
  depreciation: number;
  taxSavings: number;
  netOperatingIncome: number;
  taxableIncome: number;
}

const investmentProperties = [
  {
    id: '1',
    address: '123 Investment Ave',
    price: 450000,
    rent: 3200,
    expenses: 1800,
    capRate: 3.7,
    cashFlow: 1400,
    roi: 8.2,
    status: 'analyzing'
  },
  {
    id: '2',
    address: '456 Rental St',
    price: 320000,
    rent: 2800,
    expenses: 1200,
    capRate: 6.0,
    cashFlow: 1600,
    roi: 12.5,
    status: 'profitable'
  },
  {
    id: '3',
    address: '789 Cash Flow Blvd',
    price: 280000,
    rent: 2400,
    expenses: 1100,
    capRate: 5.6,
    cashFlow: 1300,
    roi: 11.8,
    status: 'profitable'
  }
];

const marketComparison = [
  { area: 'Downtown', avgCapRate: 4.2, avgRent: 3500, appreciation: 8.5 },
  { area: 'Suburbs', avgCapRate: 5.8, avgRent: 2800, appreciation: 6.2 },
  { area: 'Beachside', avgCapRate: 3.5, avgRent: 4200, appreciation: 12.1 },
  { area: 'University', avgCapRate: 6.5, avgRent: 2200, appreciation: 4.8 }
];

const cashFlowProjection = [
  { year: 1, cashFlow: 15600, appreciation: 36000, totalReturn: 51600 },
  { year: 2, cashFlow: 16224, appreciation: 38880, totalReturn: 55104 },
  { year: 3, cashFlow: 16873, appreciation: 41971, totalReturn: 58844 },
  { year: 4, cashFlow: 17556, appreciation: 45289, totalReturn: 62845 },
  { year: 5, cashFlow: 18278, appreciation: 48853, totalReturn: 67131 }
];

export default function InvestmentAnalysis() {
  const [propertyPrice, setPropertyPrice] = useState(450000);
  const [downPayment, setDownPayment] = useState(90000);
  const [monthlyRent, setMonthlyRent] = useState(3200);
  const [monthlyExpenses, setMonthlyExpenses] = useState(1800);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [appreciationRate, setAppreciationRate] = useState(4);
  const [taxRate, setTaxRate] = useState(25);
  
  const [metrics, setMetrics] = useState<InvestmentMetrics | null>(null);
  const [taxCalculation, setTaxCalculation] = useState<TaxCalculation | null>(null);

  const calculateInvestmentMetrics = () => {
    const loanAmount = propertyPrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    
    const monthlyMortgage = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                           (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    const totalMonthlyExpenses = monthlyExpenses + monthlyMortgage;
    const monthlyCashFlow = monthlyRent - totalMonthlyExpenses;
    const annualCashFlow = monthlyCashFlow * 12;
    const annualRent = monthlyRent * 12;
    
    const capRate = ((annualRent - (monthlyExpenses * 12)) / propertyPrice) * 100;
    const cashOnCashReturn = (annualCashFlow / downPayment) * 100;
    
    const annualAppreciation = propertyPrice * (appreciationRate / 100);
    const totalROI = ((annualCashFlow + annualAppreciation) / downPayment) * 100;
    
    const breakEvenRatio = (totalMonthlyExpenses / monthlyRent) * 100;
    const onePercentRule = monthlyRent >= (propertyPrice * 0.01);
    const twoPercentRule = monthlyRent >= (propertyPrice * 0.02);

    setMetrics({
      capRate,
      cashOnCashReturn,
      totalROI,
      monthlyRent,
      monthlyCashFlow,
      annualCashFlow,
      breakEvenRatio,
      onePercentRule,
      twoPercentRule
    });

    // Tax calculations
    const annualDepreciation = propertyPrice * 0.8 / 27.5; // Residential depreciation
    const netOperatingIncome = annualRent - (monthlyExpenses * 12);
    const taxableIncome = netOperatingIncome - annualDepreciation - (monthlyMortgage * 12);
    const taxSavings = Math.max(0, -taxableIncome * (taxRate / 100));

    setTaxCalculation({
      depreciation: annualDepreciation,
      taxSavings,
      netOperatingIncome,
      taxableIncome
    });
  };

  useEffect(() => {
    calculateInvestmentMetrics();
  }, [propertyPrice, downPayment, monthlyRent, monthlyExpenses, interestRate, loanTerm, appreciationRate, taxRate]);

  const expenseBreakdown = [
    { name: 'Mortgage Payment', value: (propertyPrice - downPayment) * (interestRate / 100 / 12), color: '#8b5cf6' },
    { name: 'Property Tax', value: monthlyExpenses * 0.4, color: '#06b6d4' },
    { name: 'Insurance', value: monthlyExpenses * 0.2, color: '#10b981' },
    { name: 'Maintenance', value: monthlyExpenses * 0.25, color: '#f59e0b' },
    { name: 'Management', value: monthlyExpenses * 0.15, color: '#ef4444' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-primary/10 p-3 text-primary">
          <BarChart3 className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Investment Analysis Tools</h2>
          <p className="text-muted-foreground">
            Analyze cash flow, ROI, and investment potential
          </p>
        </div>
      </div>

      <Tabs defaultValue="calculator" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="comparison">Market Compare</TabsTrigger>
          <TabsTrigger value="projections">Projections</TabsTrigger>
          <TabsTrigger value="tax">Tax Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Investment Property Details</CardTitle>
                <CardDescription>Enter property and financing information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Property Price</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        value={propertyPrice}
                        onChange={(e) => setPropertyPrice(Number(e.target.value))}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Down Payment</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        value={downPayment}
                        onChange={(e) => setDownPayment(Number(e.target.value))}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Monthly Rent</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        value={monthlyRent}
                        onChange={(e) => setMonthlyRent(Number(e.target.value))}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Monthly Expenses</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        value={monthlyExpenses}
                        onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Interest Rate (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Loan Term (years)</Label>
                    <Input
                      type="number"
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Appreciation Rate (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={appreciationRate}
                      onChange={(e) => setAppreciationRate(Number(e.target.value))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Tax Rate (%)</Label>
                    <Input
                      type="number"
                      value={taxRate}
                      onChange={(e) => setTaxRate(Number(e.target.value))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              {metrics && (
                <Card>
                  <CardHeader>
                    <CardTitle>Investment Metrics</CardTitle>
                    <CardDescription>Key performance indicators</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-primary/10 rounded-lg">
                        <p className="text-sm text-muted-foreground">Cap Rate</p>
                        <p className="text-xl font-bold text-primary">{metrics.capRate.toFixed(1)}%</p>
                      </div>
                      
                      <div className="text-center p-3 bg-green-100 rounded-lg">
                        <p className="text-sm text-muted-foreground">Cash-on-Cash</p>
                        <p className="text-xl font-bold text-green-600">{metrics.cashOnCashReturn.toFixed(1)}%</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Monthly Cash Flow:</span>
                        <span className={`font-semibold ${
                          metrics.monthlyCashFlow > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          ${metrics.monthlyCashFlow.toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Annual Cash Flow:</span>
                        <span className={`font-semibold ${
                          metrics.annualCashFlow > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          ${metrics.annualCashFlow.toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Total ROI:</span>
                        <span className="font-semibold text-blue-600">
                          {metrics.totalROI.toFixed(1)}%
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Break-even Ratio:</span>
                        <span className={`font-semibold ${
                          metrics.breakEvenRatio < 100 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {metrics.breakEvenRatio.toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold">Investment Rules:</h4>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {metrics.onePercentRule ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          )}
                          <span className="text-sm">1% Rule</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {metrics.twoPercentRule ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          )}
                          <span className="text-sm">2% Rule</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Expense Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={expenseBreakdown}
                          cx="50%"
                          cy="50%"
                          outerRadius={60}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, value }) => `${name}: $${value.toFixed(0)}`}
                        >
                          {expenseBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `$${Number(value).toFixed(0)}`} />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-blue-100 p-2 text-blue-600">
                    <Target className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Properties</p>
                    <p className="text-2xl font-bold">3</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-green-100 p-2 text-green-600">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Monthly Cash Flow</p>
                    <p className="text-2xl font-bold text-green-600">$4,300</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-purple-100 p-2 text-purple-600">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Cap Rate</p>
                    <p className="text-2xl font-bold">5.1%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Investment Portfolio</CardTitle>
              <CardDescription>Your current investment properties</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {investmentProperties.map((property) => (
                  <div key={property.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">{property.address}</h3>
                      <Badge 
                        variant={property.status === 'profitable' ? 'default' : 'secondary'}
                        className={property.status === 'profitable' ? 'bg-green-100 text-green-800' : ''}
                      >
                        {property.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Price</p>
                        <p className="font-semibold">${property.price.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Monthly Rent</p>
                        <p className="font-semibold">${property.rent.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Cash Flow</p>
                        <p className={`font-semibold ${
                          property.cashFlow > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          ${property.cashFlow.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Cap Rate</p>
                        <p className="font-semibold">{property.capRate}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">ROI</p>
                        <p className="font-semibold text-blue-600">{property.roi}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Market Comparison</CardTitle>
              <CardDescription>Compare investment metrics across different areas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {marketComparison.map((area, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">{area.area}</h3>
                      <Badge variant="outline">
                        {area.avgCapRate}% Cap Rate
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Avg Rent</p>
                        <p className="font-semibold">${area.avgRent.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Cap Rate</p>
                        <p className="font-semibold">{area.avgCapRate}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Appreciation</p>
                        <p className="font-semibold text-green-600">{area.appreciation}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projections" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>5-Year Cash Flow Projection</CardTitle>
              <CardDescription>Projected returns including appreciation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cashFlowProjection}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                    <Legend />
                    <Bar dataKey="cashFlow" name="Cash Flow" fill="#10b981" />
                    <Bar dataKey="appreciation" name="Appreciation" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tax" className="space-y-6">
          {taxCalculation && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tax Benefits</CardTitle>
                  <CardDescription>Annual tax implications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Net Operating Income:</span>
                      <span className="font-semibold">
                        ${taxCalculation.netOperatingIncome.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Annual Depreciation:</span>
                      <span className="font-semibold text-green-600">
                        -${taxCalculation.depreciation.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Taxable Income:</span>
                      <span className={`font-semibold ${
                        taxCalculation.taxableIncome < 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        ${taxCalculation.taxableIncome.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex justify-between border-t pt-3">
                      <span>Annual Tax Savings:</span>
                      <span className="font-semibold text-green-600">
                        ${taxCalculation.taxSavings.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tax Strategy Tips</CardTitle>
                  <CardDescription>Maximize your tax benefits</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <span className="text-sm">Depreciate property over 27.5 years</span>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <span className="text-sm">Deduct all operating expenses</span>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <span className="text-sm">Consider 1031 exchanges for growth</span>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <span className="text-sm">Track all property-related expenses</span>
                    </div>
                  </div>
                  
                  <Button className="w-full mt-4">
                    Consult Tax Professional
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
