'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Users, Search, Filter, MoreHorizontal, UserPlus,
  Edit, Trash2, Shield, ShieldCheck, Ban, CheckCircle,
  Mail, Phone, MapPin, Calendar, Loader2, Building,
  Star, TrendingUp, Eye, Award, Clock
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Agent {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  isVerified: boolean;
  isActive: boolean;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'SUSPENDED';
  licenseNumber?: string;
  agencyName?: string;
  experienceYears?: number;
  specializations: string[];
  city?: string;
  state?: string;
  bio?: string;
  createdAt: string;
  lastLoginAt?: string;
  _count: {
    properties: number;
    inquiries: number;
  };
}

export default function AgentsPage() {
  const { user } = useAuth();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [verificationFilter, setVerificationFilter] = useState<string>('all');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await fetch('/api/agents', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAgents(data.agents);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch agents",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching agents:', error);
      toast({
        title: "Error",
        description: "Failed to fetch agents",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAgent = async (agentId: string, updates: Partial<Agent>) => {
    setActionLoading(true);
    try {
      const endpoint = user?.role === 'ADMIN'
        ? `/api/admin/users/${agentId}`
        : `/api/agents/${agentId}`;

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        await fetchAgents();
        setIsEditDialogOpen(false);
        setSelectedAgent(null);
        toast({
          title: "Success",
          description: "Agent updated successfully",
        });
      } else {
        throw new Error('Failed to update agent');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update agent",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.agencyName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' ||
                         (statusFilter === 'active' && agent.isActive) ||
                         (statusFilter === 'inactive' && !agent.isActive);

    const matchesVerification = verificationFilter === 'all' ||
                               agent.verificationStatus === verificationFilter;

    return matchesSearch && matchesStatus && matchesVerification;
  });

  const getVerificationBadgeColor = (status: string) => {
    switch (status) {
      case 'VERIFIED': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'REJECTED': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'SUSPENDED': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agents Management</h1>
          <p className="text-muted-foreground">Manage real estate agents and their verification status</p>
        </div>
        {user?.role === 'ADMIN' && (
          <div className="flex items-center space-x-2">
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Agent
            </Button>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-blue-100 p-3 text-blue-600 dark:bg-blue-900 dark:text-blue-200">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Agents</p>
                <h3 className="text-2xl font-bold">{agents.length}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-green-100 p-3 text-green-600 dark:bg-green-900 dark:text-green-200">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Verified</p>
                <h3 className="text-2xl font-bold">
                  {agents.filter(a => a.verificationStatus === 'VERIFIED').length}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-yellow-100 p-3 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-200">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <h3 className="text-2xl font-bold">
                  {agents.filter(a => a.verificationStatus === 'PENDING').length}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-purple-100 p-3 text-purple-600 dark:bg-purple-900 dark:text-purple-200">
                <Building className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Properties</p>
                <h3 className="text-2xl font-bold">
                  {agents.reduce((sum, agent) => sum + agent._count.properties, 0)}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search agents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select value={verificationFilter} onValueChange={setVerificationFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Verification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="VERIFIED">Verified</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
                <SelectItem value="SUSPENDED">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Agents Table */}
      <Card>
        <CardHeader>
          <CardTitle>Agents ({filteredAgents.length})</CardTitle>
          <CardDescription>
            A list of all real estate agents in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent</TableHead>
                <TableHead>Agency</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Properties</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Verification</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAgents.map((agent) => (
                <TableRow key={agent.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={agent.avatar} alt={agent.name} />
                        <AvatarFallback>{agent.name.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{agent.name}</div>
                        <div className="text-sm text-muted-foreground">{agent.email}</div>
                        {agent.phone && (
                          <div className="text-sm text-muted-foreground">{agent.phone}</div>
                        )}
                        {agent.licenseNumber && (
                          <div className="text-xs text-muted-foreground">
                            License: {agent.licenseNumber}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{agent.agencyName || 'Independent'}</div>
                      {agent.city && agent.state && (
                        <div className="text-sm text-muted-foreground">
                          {agent.city}, {agent.state}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Award className="h-4 w-4 text-muted-foreground" />
                      <span>{agent.experienceYears || 0} years</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{agent._count.properties}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={agent.isActive ? "default" : "secondary"}>
                      {agent.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getVerificationBadgeColor(agent.verificationStatus)}>
                      {agent.verificationStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedAgent(agent);
                            setIsViewDialogOpen(true);
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        {user?.role === 'ADMIN' && (
                          <>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedAgent(agent);
                                setIsEditDialogOpen(true);
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleUpdateAgent(agent.id, { isActive: !agent.isActive })}
                            >
                              {agent.isActive ? (
                                <>
                                  <Ban className="mr-2 h-4 w-4" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>
                            {agent.verificationStatus === 'PENDING' && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleUpdateAgent(agent.id, { verificationStatus: 'VERIFIED' })}
                                  className="text-green-600"
                                >
                                  <ShieldCheck className="mr-2 h-4 w-4" />
                                  Verify Agent
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleUpdateAgent(agent.id, { verificationStatus: 'REJECTED' })}
                                  className="text-red-600"
                                >
                                  <Shield className="mr-2 h-4 w-4" />
                                  Reject
                                </DropdownMenuItem>
                              </>
                            )}
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Agent Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Agent Details</DialogTitle>
            <DialogDescription>
              Detailed information about the agent
            </DialogDescription>
          </DialogHeader>
          {selectedAgent && (
            <AgentDetailsView agent={selectedAgent} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Agent Details View Component
function AgentDetailsView({ agent }: { agent: Agent }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={agent.avatar} alt={agent.name} />
          <AvatarFallback className="text-lg">{agent.name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-xl font-semibold">{agent.name}</h3>
          <p className="text-muted-foreground">{agent.email}</p>
          {agent.phone && <p className="text-muted-foreground">{agent.phone}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium">Agency</Label>
          <p className="text-sm">{agent.agencyName || 'Independent'}</p>
        </div>
        <div>
          <Label className="text-sm font-medium">License Number</Label>
          <p className="text-sm">{agent.licenseNumber || 'Not provided'}</p>
        </div>
        <div>
          <Label className="text-sm font-medium">Experience</Label>
          <p className="text-sm">{agent.experienceYears || 0} years</p>
        </div>
        <div>
          <Label className="text-sm font-medium">Location</Label>
          <p className="text-sm">
            {agent.city && agent.state ? `${agent.city}, ${agent.state}` : 'Not provided'}
          </p>
        </div>
      </div>

      {agent.specializations && agent.specializations.length > 0 && (
        <div>
          <Label className="text-sm font-medium">Specializations</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {agent.specializations.map((spec, index) => (
              <Badge key={index} variant="secondary">{spec}</Badge>
            ))}
          </div>
        </div>
      )}

      {agent.bio && (
        <div>
          <Label className="text-sm font-medium">Bio</Label>
          <p className="text-sm mt-1">{agent.bio}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium">Properties Listed</Label>
          <p className="text-sm font-semibold">{agent._count.properties}</p>
        </div>
        <div>
          <Label className="text-sm font-medium">Inquiries Received</Label>
          <p className="text-sm font-semibold">{agent._count.inquiries}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <div>
          <Badge className={
            agent.verificationStatus === 'VERIFIED'
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : agent.verificationStatus === 'PENDING'
              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }>
            {agent.verificationStatus}
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground">
          Joined {new Date(agent.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}
