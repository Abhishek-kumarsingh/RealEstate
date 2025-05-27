'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Home, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  Shield,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

// Mock data for pending submissions
const pendingProperties = [
  {
    id: 1,
    title: 'Modern Apartment in Bandra',
    submittedBy: 'John Doe',
    submittedAt: '2024-01-15',
    type: 'user',
    price: 8500000,
    location: 'Bandra West, Mumbai',
    status: 'pending'
  },
  {
    id: 2,
    title: 'Luxury Villa with Pool',
    submittedBy: 'Sarah Wilson',
    submittedAt: '2024-01-14',
    type: 'agent',
    agentTrust: 'non-trusted',
    price: 15000000,
    location: 'Whitefield, Bangalore',
    status: 'pending'
  },
  {
    id: 3,
    title: 'Commercial Office Space',
    submittedBy: 'Rajesh Kumar',
    submittedAt: '2024-01-13',
    type: 'agent',
    agentTrust: 'trusted',
    price: 25000000,
    location: 'Cyber City, Gurgaon',
    status: 'auto-approved'
  }
];

const pendingAgents = [
  {
    id: 1,
    name: 'Amit Sharma',
    email: 'amit.sharma@email.com',
    phone: '+91 98765 43210',
    experience: 5,
    submittedAt: '2024-01-15',
    documents: ['License', 'ID Proof', 'Experience Certificate'],
    status: 'pending'
  },
  {
    id: 2,
    name: 'Priya Patel',
    email: 'priya.patel@email.com',
    phone: '+91 98765 43211',
    experience: 8,
    submittedAt: '2024-01-14',
    documents: ['License', 'ID Proof', 'Experience Certificate'],
    status: 'pending'
  }
];

export default function AdminDashboard() {
  const [properties, setProperties] = useState(pendingProperties);
  const [agents, setAgents] = useState(pendingAgents);

  const handlePropertyAction = (id: number, action: 'approve' | 'reject') => {
    setProperties(prev => prev.map(prop => 
      prop.id === id ? { ...prop, status: action === 'approve' ? 'approved' : 'rejected' } : prop
    ));
  };

  const handleAgentAction = (id: number, action: 'approve' | 'reject', trustLevel?: 'trusted' | 'non-trusted') => {
    setAgents(prev => prev.map(agent => 
      agent.id === id ? { 
        ...agent, 
        status: action === 'approve' ? 'approved' : 'rejected',
        trustLevel: trustLevel 
      } : agent
    ));
  };

  const stats = [
    {
      title: 'Pending Properties',
      value: properties.filter(p => p.status === 'pending').length,
      icon: Home,
      color: 'text-orange-600'
    },
    {
      title: 'Pending Agents',
      value: agents.filter(a => a.status === 'pending').length,
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Approved Today',
      value: 12,
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      title: 'Rejected Today',
      value: 3,
      icon: XCircle,
      color: 'text-red-600'
    }
  ];

  return (
    <div className="min-h-screen pt-20 bg-muted/30">
      <div className="container mx-auto px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage property listings and agent applications</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="properties" className="space-y-6">
          <TabsList>
            <TabsTrigger value="properties">Property Submissions</TabsTrigger>
            <TabsTrigger value="agents">Agent Applications</TabsTrigger>
          </TabsList>

          <TabsContent value="properties">
            <Card>
              <CardHeader>
                <CardTitle>Property Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {properties.map((property) => (
                    <div key={property.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{property.title}</h3>
                          <p className="text-muted-foreground">{property.location}</p>
                          <p className="text-lg font-bold text-primary">₹{(property.price / 10000000).toFixed(1)} Cr</p>
                          
                          <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              <span className="text-sm">Submitted by: {property.submittedBy}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span className="text-sm">{property.submittedAt}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant={property.type === 'user' ? 'secondary' : 'outline'}>
                              {property.type === 'user' ? 'User Submission' : 'Agent Submission'}
                            </Badge>
                            
                            {property.type === 'agent' && (
                              <Badge variant={property.agentTrust === 'trusted' ? 'default' : 'destructive'}>
                                <Shield className="h-3 w-3 mr-1" />
                                {property.agentTrust === 'trusted' ? 'Trusted Agent' : 'Non-Trusted Agent'}
                              </Badge>
                            )}

                            <Badge 
                              variant={
                                property.status === 'approved' ? 'default' : 
                                property.status === 'rejected' ? 'destructive' : 
                                property.status === 'auto-approved' ? 'secondary' : 'outline'
                              }
                            >
                              {property.status === 'auto-approved' ? 'Auto-Approved' : property.status}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex gap-2 ml-4">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          
                          {property.status === 'pending' && (
                            <>
                              <Button 
                                size="sm" 
                                onClick={() => handlePropertyAction(property.id, 'approve')}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handlePropertyAction(property.id, 'reject')}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </div>

                      {property.type === 'agent' && property.agentTrust === 'trusted' && property.status === 'auto-approved' && (
                        <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                          <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-sm font-medium">Auto-approved from trusted agent</span>
                          </div>
                        </div>
                      )}

                      {(property.type === 'user' || property.agentTrust === 'non-trusted') && property.status === 'pending' && (
                        <div className="mt-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                          <div className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
                            <AlertTriangle className="h-4 w-4" />
                            <span className="text-sm font-medium">Requires manual approval</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="agents">
            <Card>
              <CardHeader>
                <CardTitle>Agent Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {agents.map((agent) => (
                    <div key={agent.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{agent.name}</h3>
                          <p className="text-muted-foreground">{agent.email}</p>
                          <p className="text-muted-foreground">{agent.phone}</p>
                          <p className="text-sm">Experience: {agent.experience} years</p>
                          
                          <div className="flex items-center gap-2 mt-2">
                            <Clock className="h-4 w-4" />
                            <span className="text-sm">Applied on: {agent.submittedAt}</span>
                          </div>

                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-sm font-medium">Documents:</span>
                            {agent.documents.map((doc, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {doc}
                              </Badge>
                            ))}
                          </div>

                          <Badge 
                            variant={
                              agent.status === 'approved' ? 'default' : 
                              agent.status === 'rejected' ? 'destructive' : 'outline'
                            }
                            className="mt-2"
                          >
                            {agent.status}
                          </Badge>
                        </div>

                        <div className="flex flex-col gap-2 ml-4">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                          
                          {agent.status === 'pending' && (
                            <>
                              <Button 
                                size="sm" 
                                onClick={() => handleAgentAction(agent.id, 'approve', 'trusted')}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Shield className="h-4 w-4 mr-1" />
                                Approve as Trusted
                              </Button>
                              <Button 
                                size="sm" 
                                onClick={() => handleAgentAction(agent.id, 'approve', 'non-trusted')}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve as Non-Trusted
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleAgentAction(agent.id, 'reject')}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
