'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, CheckCircle, AlertTriangle, Upload, 
  FileText, CreditCard, User, Lock, Eye, Camera
} from 'lucide-react';

interface VerificationStatus {
  identity: 'pending' | 'verified' | 'rejected';
  background: 'pending' | 'verified' | 'rejected';
  financial: 'pending' | 'verified' | 'rejected';
  documents: 'pending' | 'verified' | 'rejected';
}

interface SecurityMetrics {
  overallScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  completedChecks: number;
  totalChecks: number;
}

const verificationSteps = [
  {
    id: 'identity',
    title: 'Identity Verification',
    description: 'Verify your identity with government-issued ID',
    icon: User,
    required: true,
    status: 'verified' as const
  },
  {
    id: 'background',
    title: 'Background Check',
    description: 'Criminal background and credit history check',
    icon: Shield,
    required: true,
    status: 'verified' as const
  },
  {
    id: 'financial',
    title: 'Financial Verification',
    description: 'Income and asset verification',
    icon: CreditCard,
    required: false,
    status: 'pending' as const
  },
  {
    id: 'documents',
    title: 'Document Verification',
    description: 'Property documents and contracts',
    icon: FileText,
    required: false,
    status: 'pending' as const
  }
];

const securityFeatures = [
  {
    title: 'Two-Factor Authentication',
    description: 'Add an extra layer of security to your account',
    enabled: true,
    icon: Lock
  },
  {
    title: 'Biometric Login',
    description: 'Use fingerprint or face recognition',
    enabled: false,
    icon: Eye
  },
  {
    title: 'Device Monitoring',
    description: 'Monitor and control device access',
    enabled: true,
    icon: Shield
  },
  {
    title: 'Transaction Alerts',
    description: 'Get notified of important account activities',
    enabled: true,
    icon: AlertTriangle
  }
];

const recentActivity = [
  {
    action: 'Login from new device',
    location: 'Los Angeles, CA',
    time: '2 hours ago',
    status: 'approved'
  },
  {
    action: 'Document uploaded',
    location: 'Los Angeles, CA',
    time: '1 day ago',
    status: 'verified'
  },
  {
    action: 'Password changed',
    location: 'Los Angeles, CA',
    time: '3 days ago',
    status: 'approved'
  },
  {
    action: 'Profile updated',
    location: 'Los Angeles, CA',
    time: '1 week ago',
    status: 'approved'
  }
];

export default function SecurityVerification() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const securityMetrics: SecurityMetrics = {
    overallScore: 85,
    riskLevel: 'low',
    completedChecks: 6,
    totalChecks: 8
  };

  const verificationStatus: VerificationStatus = {
    identity: 'verified',
    background: 'verified',
    financial: 'pending',
    documents: 'pending'
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setIsUploading(true);
      
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        
        if (progress >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadProgress(0);
        }
      }, 200);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <AlertTriangle className="h-4 w-4" />;
      case 'rejected':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-primary/10 p-3 text-primary">
          <Shield className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Security & Verification</h2>
          <p className="text-muted-foreground">
            Secure your account and verify your identity
          </p>
        </div>
      </div>

      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className={`rounded-full p-3 ${
                securityMetrics.riskLevel === 'low' ? 'bg-green-100 text-green-600' :
                securityMetrics.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                'bg-red-100 text-red-600'
              }`}>
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Security Score</p>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-bold">{securityMetrics.overallScore}</h3>
                  <Badge variant="secondary" className={getStatusColor('verified')}>
                    {securityMetrics.riskLevel.toUpperCase()}
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
                <CheckCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Verification Status</p>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-bold">
                    {securityMetrics.completedChecks}/{securityMetrics.totalChecks}
                  </h3>
                  <span className="text-sm text-muted-foreground">Complete</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-purple-100 p-3 text-purple-600">
                <Lock className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Account Security</p>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-bold">Strong</h3>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="verification" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="verification">Verification</TabsTrigger>
          <TabsTrigger value="security">Security Settings</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
        </TabsList>

        <TabsContent value="verification" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Verification Progress</CardTitle>
              <CardDescription>
                Complete these steps to fully verify your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm text-muted-foreground">
                    {Math.round((securityMetrics.completedChecks / securityMetrics.totalChecks) * 100)}%
                  </span>
                </div>
                <Progress 
                  value={(securityMetrics.completedChecks / securityMetrics.totalChecks) * 100} 
                  className="h-2"
                />
              </div>

              <div className="space-y-4 mt-6">
                {verificationSteps.map((step) => (
                  <div key={step.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className={`rounded-full p-3 ${getStatusColor(step.status)}`}>
                      <step.icon className="h-5 w-5" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{step.title}</h3>
                        {step.required && (
                          <Badge variant="outline" className="text-xs">Required</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className={getStatusColor(step.status)}>
                        {getStatusIcon(step.status)}
                        {step.status.charAt(0).toUpperCase() + step.status.slice(1)}
                      </Badge>
                      
                      {step.status === 'pending' && (
                        <Button size="sm">
                          Start
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>KYC (Know Your Customer)</CardTitle>
              <CardDescription>
                Enhanced verification for high-value transactions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  KYC verification is required for transactions over $100,000 and for agent accounts.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Government ID</Label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Upload driver's license or passport
                    </p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Choose File
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Proof of Address</Label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Upload utility bill or bank statement
                    </p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Choose File
                    </Button>
                  </div>
                </div>
              </div>

              <Button className="w-full">
                Submit for KYC Review
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Features</CardTitle>
              <CardDescription>
                Manage your account security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {securityFeatures.map((feature, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-2 text-primary">
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={feature.enabled ? 'default' : 'secondary'}
                      className={feature.enabled ? 'bg-green-100 text-green-800' : ''}
                    >
                      {feature.enabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                    <Button variant="outline" size="sm">
                      {feature.enabled ? 'Disable' : 'Enable'}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Password & Authentication</CardTitle>
              <CardDescription>
                Update your login credentials
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Current Password</Label>
                  <Input type="password" placeholder="Enter current password" />
                </div>
                
                <div className="space-y-2">
                  <Label>New Password</Label>
                  <Input type="password" placeholder="Enter new password" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Confirm New Password</Label>
                <Input type="password" placeholder="Confirm new password" />
              </div>

              <Button>Update Password</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Document Upload</CardTitle>
              <CardDescription>
                Upload and manage your verification documents
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-semibold mb-2">Upload Documents</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Drag and drop files here or click to browse
                </p>
                
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <label htmlFor="file-upload">
                  <Button variant="outline" className="cursor-pointer">
                    Choose Files
                  </Button>
                </label>
                
                {isUploading && (
                  <div className="mt-4">
                    <Progress value={uploadProgress} className="h-2" />
                    <p className="text-sm text-muted-foreground mt-2">
                      Uploading... {uploadProgress}%
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Uploaded Documents</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Driver's License</p>
                        <p className="text-sm text-muted-foreground">Uploaded 2 days ago</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Verified</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Bank Statement</p>
                        <p className="text-sm text-muted-foreground">Uploaded 1 day ago</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      Pending
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Monitor your account activity and security events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        activity.status === 'approved' ? 'bg-green-500' :
                        activity.status === 'verified' ? 'bg-blue-500' : 'bg-yellow-500'
                      }`}></div>
                      <div>
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">
                          {activity.location} • {activity.time}
                        </p>
                      </div>
                    </div>
                    
                    <Badge 
                      variant="secondary" 
                      className={
                        activity.status === 'approved' ? 'bg-green-100 text-green-800' :
                        activity.status === 'verified' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }
                    >
                      {activity.status}
                    </Badge>
                  </div>
                ))}
              </div>
              
              <Button variant="outline" className="w-full mt-4">
                View All Activity
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
