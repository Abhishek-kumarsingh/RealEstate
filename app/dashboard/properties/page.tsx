"use client"

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { properties } from '@/lib/data/properties';
import Link from 'next/link';
import { 
  PlusCircle, Search, Filter, Check, AlertTriangle, 
  Clock, Building, X, MoreHorizontal, ArrowUpDown
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function PropertiesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTab, setCurrentTab] = useState('all');
  
  // Filter properties based on search query and current tab
  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         property.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         property.location.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (currentTab === 'all') return matchesSearch;
    if (currentTab === 'sale') return matchesSearch && property.type === 'sale';
    if (currentTab === 'rent') return matchesSearch && property.type === 'rent';
    if (currentTab === 'commercial') return matchesSearch && property.type === 'commercial';
    if (currentTab === 'pending') return matchesSearch && property.status === 'pending';
    
    return matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Available</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Pending</Badge>;
      case 'sold':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Sold</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'sale':
        return <Badge variant="outline" className="border-blue-500 text-blue-700 dark:text-blue-400">For Sale</Badge>;
      case 'rent':
        return <Badge variant="outline" className="border-purple-500 text-purple-700 dark:text-purple-400">For Rent</Badge>;
      case 'commercial':
        return <Badge variant="outline" className="border-amber-500 text-amber-700 dark:text-amber-400">Commercial</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Properties</h1>
          <p className="text-muted-foreground">Manage your property listings</p>
        </div>
        <Link href="/dashboard/properties/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Property
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="space-y-0 pb-2">
          <CardTitle>Property Listings</CardTitle>
          <CardDescription>
            View and manage all your properties
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search properties..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="gap-1">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>

          <Tabs defaultValue="all" value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="mb-4 w-full sm:w-auto">
              <TabsTrigger value="all" className="flex gap-2">
                <Building className="h-4 w-4" />
                <span>All</span>
                <Badge variant="secondary" className="ml-1 rounded-full">
                  {properties.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="sale" className="flex gap-2">
                <Check className="h-4 w-4" />
                <span>For Sale</span>
              </TabsTrigger>
              <TabsTrigger value="rent" className="flex gap-2">
                <Clock className="h-4 w-4" />
                <span>For Rent</span>
              </TabsTrigger>
              <TabsTrigger value="commercial" className="flex gap-2">
                <Building className="h-4 w-4" />
                <span>Commercial</span>
              </TabsTrigger>
              <TabsTrigger value="pending" className="flex gap-2">
                <AlertTriangle className="h-4 w-4" />
                <span>Pending</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value={currentTab} className="m-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">
                        <div className="flex items-center gap-1">
                          Property
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center gap-1">
                          Type
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center gap-1">
                          Price
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center gap-1">
                          Status
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead>Agent</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProperties.map((property) => (
                      <TableRow key={property.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-md bg-muted relative overflow-hidden">
                              <img 
                                src={property.images[0]} 
                                alt={property.title}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="truncate max-w-[220px]">
                              {property.title}
                              <div className="text-xs text-muted-foreground truncate">
                                {property.location.city}, {property.location.state}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getTypeBadge(property.type)}</TableCell>
                        <TableCell>
                          {property.type === 'rent'
                            ? `$${property.price}/mo`
                            : `$${property.price.toLocaleString()}`}
                        </TableCell>
                        <TableCell>{getStatusBadge(property.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="relative h-8 w-8 rounded-full overflow-hidden">
                              <img 
                                src={property.agent.avatar} 
                                alt={property.agent.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <span className="text-sm">{property.agent.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>View details</DropdownMenuItem>
                              <DropdownMenuItem>Edit property</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                Delete property
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredProperties.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <X className="h-8 w-8 mb-2" />
                            <p>No properties found</p>
                            <p className="text-sm">Try adjusting your search or filters</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between py-4">
                <div className="text-sm text-muted-foreground">
                  Showing <strong>{filteredProperties.length}</strong> of{" "}
                  <strong>{properties.length}</strong> properties
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}