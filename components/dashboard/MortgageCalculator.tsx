'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Calculator, DollarSign, Percent, Calendar, 
  TrendingUp, Home, CreditCard, FileText, CheckCircle
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface MortgageCalculation {
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
  principalAndInterest: number;
  propertyTax: number;
  insurance: number;
  pmi: number;
}

interface AffordabilityData {
  maxLoanAmount: number;
  maxHomePrice: number;
  monthlyIncome: number;
  debtToIncomeRatio: number;
  frontEndRatio: number;
  backEndRatio: number;
}

const lenderPrograms = [
  {
    name: 'Conventional 30-Year Fixed',
    rate: 6.75,
    downPayment: 20,
    minCredit: 620,
    features: ['No PMI with 20% down', 'Competitive rates', 'Flexible terms']
  },
  {
    name: 'FHA 30-Year Fixed',
    rate: 6.25,
    downPayment: 3.5,
    minCredit: 580,
    features: ['Low down payment', 'Flexible credit requirements', 'Government backed']
  },
  {
    name: 'VA Loan',
    rate: 6.0,
    downPayment: 0,
    minCredit: 580,
    features: ['No down payment', 'No PMI', 'For veterans only']
  },
  {
    name: 'USDA Rural',
    rate: 5.75,
    downPayment: 0,
    minCredit: 640,
    features: ['No down payment', 'Rural areas only', 'Income limits apply']
  }
];

export default function MortgageCalculator() {
  const [homePrice, setHomePrice] = useState(750000);
  const [downPayment, setDownPayment] = useState(150000);
  const [interestRate, setInterestRate] = useState(6.75);
  const [loanTerm, setLoanTerm] = useState(30);
  const [propertyTax, setPropertyTax] = useState(9000);
  const [insurance, setInsurance] = useState(1200);
  const [hoaFees, setHoaFees] = useState(200);
  
  // Affordability calculator
  const [monthlyIncome, setMonthlyIncome] = useState(8000);
  const [monthlyDebts, setMonthlyDebts] = useState(1500);
  const [creditScore, setCreditScore] = useState(750);
  
  const [calculation, setCalculation] = useState<MortgageCalculation | null>(null);
  const [affordability, setAffordability] = useState<AffordabilityData | null>(null);

  const calculateMortgage = () => {
    const principal = homePrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    
    const monthlyPI = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                     (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    const monthlyPropertyTax = propertyTax / 12;
    const monthlyInsurance = insurance / 12;
    const monthlyPMI = (downPayment / homePrice < 0.2) ? (principal * 0.005 / 12) : 0;
    
    const totalMonthlyPayment = monthlyPI + monthlyPropertyTax + monthlyInsurance + monthlyPMI + hoaFees;
    const totalInterest = (monthlyPI * numberOfPayments) - principal;
    const totalPayment = principal + totalInterest;

    setCalculation({
      monthlyPayment: totalMonthlyPayment,
      totalInterest,
      totalPayment,
      principalAndInterest: monthlyPI,
      propertyTax: monthlyPropertyTax,
      insurance: monthlyInsurance,
      pmi: monthlyPMI
    });
  };

  const calculateAffordability = () => {
    const frontEndRatio = 0.28; // 28% of gross monthly income
    const backEndRatio = 0.36; // 36% of gross monthly income
    
    const maxHousingPayment = monthlyIncome * frontEndRatio;
    const maxTotalDebtPayment = monthlyIncome * backEndRatio;
    const maxMortgagePayment = Math.min(maxHousingPayment, maxTotalDebtPayment - monthlyDebts);
    
    // Estimate other costs (taxes, insurance, etc.) as 25% of total payment
    const maxPrincipalAndInterest = maxMortgagePayment * 0.75;
    
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    
    const maxLoanAmount = maxPrincipalAndInterest * 
                         (Math.pow(1 + monthlyRate, numberOfPayments) - 1) / 
                         (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments));
    
    const maxHomePrice = maxLoanAmount / (1 - (downPayment / homePrice));
    
    setAffordability({
      maxLoanAmount,
      maxHomePrice,
      monthlyIncome,
      debtToIncomeRatio: (monthlyDebts / monthlyIncome) * 100,
      frontEndRatio: frontEndRatio * 100,
      backEndRatio: backEndRatio * 100
    });
  };

  useEffect(() => {
    calculateMortgage();
    calculateAffordability();
  }, [homePrice, downPayment, interestRate, loanTerm, propertyTax, insurance, hoaFees, monthlyIncome, monthlyDebts]);

  const downPaymentPercentage = (downPayment / homePrice) * 100;

  const paymentBreakdown = calculation ? [
    { name: 'Principal & Interest', value: calculation.principalAndInterest, color: '#8b5cf6' },
    { name: 'Property Tax', value: calculation.propertyTax, color: '#06b6d4' },
    { name: 'Insurance', value: calculation.insurance, color: '#10b981' },
    { name: 'PMI', value: calculation.pmi, color: '#f59e0b' },
    { name: 'HOA Fees', value: hoaFees, color: '#ef4444' }
  ].filter(item => item.value > 0) : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-primary/10 p-3 text-primary">
          <Calculator className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Mortgage Calculator & Pre-approval</h2>
          <p className="text-muted-foreground">
            Calculate payments, affordability, and get pre-approved
          </p>
        </div>
      </div>

      <Tabs defaultValue="calculator" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="affordability">Affordability</TabsTrigger>
          <TabsTrigger value="programs">Loan Programs</TabsTrigger>
          <TabsTrigger value="preapproval">Pre-approval</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Loan Details</CardTitle>
                <CardDescription>Enter your loan information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Home Price</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      value={homePrice}
                      onChange={(e) => setHomePrice(Number(e.target.value))}
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
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Down Payment Percentage</span>
                      <span>{downPaymentPercentage.toFixed(1)}%</span>
                    </div>
                    <Slider
                      value={[downPaymentPercentage]}
                      onValueChange={(value) => setDownPayment((value[0] / 100) * homePrice)}
                      max={50}
                      min={0}
                      step={0.5}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Interest Rate (%)</Label>
                    <div className="relative">
                      <Percent className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        step="0.01"
                        value={interestRate}
                        onChange={(e) => setInterestRate(Number(e.target.value))}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Loan Term (years)</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        value={loanTerm}
                        onChange={(e) => setLoanTerm(Number(e.target.value))}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Annual Property Tax</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        value={propertyTax}
                        onChange={(e) => setPropertyTax(Number(e.target.value))}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Annual Insurance</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        value={insurance}
                        onChange={(e) => setInsurance(Number(e.target.value))}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Monthly HOA Fees</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      value={hoaFees}
                      onChange={(e) => setHoaFees(Number(e.target.value))}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              {calculation && (
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Payment Breakdown</CardTitle>
                    <CardDescription>Your estimated monthly costs</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Total Monthly Payment</p>
                        <p className="text-3xl font-bold text-primary">
                          ${calculation.monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </p>
                      </div>

                      <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={paymentBreakdown}
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, value }) => `${name}: $${value.toFixed(0)}`}
                            >
                              {paymentBreakdown.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => `$${Number(value).toFixed(0)}`} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="space-y-2">
                        {paymentBreakdown.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: item.color }}
                              ></div>
                              {item.name}
                            </span>
                            <span className="font-medium">
                              ${item.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {calculation && (
                <Card>
                  <CardHeader>
                    <CardTitle>Loan Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span>Loan Amount:</span>
                      <span className="font-semibold">
                        ${(homePrice - downPayment).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Interest:</span>
                      <span className="font-semibold">
                        ${calculation.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Payment:</span>
                      <span className="font-semibold">
                        ${calculation.totalPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                    {calculation.pmi > 0 && (
                      <div className="flex justify-between text-orange-600">
                        <span>PMI Required:</span>
                        <span className="font-semibold">
                          ${calculation.pmi.toLocaleString(undefined, { maximumFractionDigits: 0 })}/month
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="affordability" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Income & Debt Information</CardTitle>
                <CardDescription>Enter your financial details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Monthly Gross Income</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      value={monthlyIncome}
                      onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Monthly Debt Payments</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      value={monthlyDebts}
                      onChange={(e) => setMonthlyDebts(Number(e.target.value))}
                      className="pl-10"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Include credit cards, auto loans, student loans, etc.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Credit Score</Label>
                  <div className="space-y-2">
                    <Input
                      type="number"
                      value={creditScore}
                      onChange={(e) => setCreditScore(Number(e.target.value))}
                      min="300"
                      max="850"
                    />
                    <div className="flex justify-between text-sm">
                      <span>Poor (300)</span>
                      <span>Excellent (850)</span>
                    </div>
                    <Progress value={(creditScore - 300) / 5.5} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {affordability && (
              <Card>
                <CardHeader>
                  <CardTitle>Affordability Analysis</CardTitle>
                  <CardDescription>Based on your financial profile</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-primary/10 rounded-lg">
                    <p className="text-sm text-muted-foreground">Maximum Home Price</p>
                    <p className="text-2xl font-bold text-primary">
                      ${affordability.maxHomePrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Maximum Loan Amount:</span>
                      <span className="font-semibold">
                        ${affordability.maxLoanAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Debt-to-Income Ratio:</span>
                      <span className={`font-semibold ${
                        affordability.debtToIncomeRatio > 36 ? 'text-red-600' : 
                        affordability.debtToIncomeRatio > 28 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {affordability.debtToIncomeRatio.toFixed(1)}%
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Front-end Ratio (Housing):</span>
                        <span>≤ {affordability.frontEndRatio}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Back-end Ratio (Total Debt):</span>
                        <span>≤ {affordability.backEndRatio}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold">Recommendations:</h4>
                    <div className="space-y-1 text-sm">
                      {affordability.debtToIncomeRatio <= 28 && (
                        <p className="text-green-600">✓ Excellent debt-to-income ratio</p>
                      )}
                      {affordability.debtToIncomeRatio > 36 && (
                        <p className="text-red-600">⚠ Consider reducing debt before applying</p>
                      )}
                      {creditScore >= 740 && (
                        <p className="text-green-600">✓ Excellent credit score for best rates</p>
                      )}
                      {creditScore < 620 && (
                        <p className="text-yellow-600">⚠ Consider improving credit score</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="programs" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {lenderPrograms.map((program, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {program.name}
                    <Badge variant="secondary">{program.rate}% APR</Badge>
                  </CardTitle>
                  <CardDescription>
                    {program.downPayment}% down payment • {program.minCredit}+ credit score
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Key Features:</h4>
                    <ul className="space-y-1">
                      {program.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Button className="w-full">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="preapproval" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Get Pre-approved</CardTitle>
              <CardDescription>
                Start your pre-approval process with our partner lenders
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <FileText className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-semibold">Submit Application</h3>
                  <p className="text-sm text-muted-foreground">Complete our secure online form</p>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <CreditCard className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-semibold">Credit Check</h3>
                  <p className="text-sm text-muted-foreground">Soft pull won't affect your score</p>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-semibold">Get Approved</h3>
                  <p className="text-sm text-muted-foreground">Receive your pre-approval letter</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Required Documents:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <h5 className="font-medium">Income Verification:</h5>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Recent pay stubs (2 months)</li>
                      <li>• Tax returns (2 years)</li>
                      <li>• W-2 forms (2 years)</li>
                      <li>• Bank statements (2 months)</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h5 className="font-medium">Additional Documents:</h5>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Government-issued ID</li>
                      <li>• Social Security card</li>
                      <li>• Proof of assets</li>
                      <li>• Employment verification</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Button className="w-full" size="lg">
                Start Pre-approval Process
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
