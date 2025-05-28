'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Upload, 
  Download, 
  Search, 
  Filter,
  Eye,
  Trash2,
  Share2,
  FolderOpen,
  Calendar,
  User
} from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  category: 'contract' | 'legal' | 'financial' | 'property' | 'personal';
  status: 'active' | 'archived' | 'pending';
  uploadedBy: string;
}

const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Property Purchase Agreement.pdf',
    type: 'PDF',
    size: '2.4 MB',
    uploadDate: '2024-01-15',
    category: 'contract',
    status: 'active',
    uploadedBy: 'John Doe'
  },
  {
    id: '2',
    name: 'Property Inspection Report.pdf',
    type: 'PDF',
    size: '5.1 MB',
    uploadDate: '2024-01-10',
    category: 'property',
    status: 'active',
    uploadedBy: 'Jane Smith'
  },
  {
    id: '3',
    name: 'Mortgage Pre-approval Letter.pdf',
    type: 'PDF',
    size: '1.2 MB',
    uploadDate: '2024-01-08',
    category: 'financial',
    status: 'active',
    uploadedBy: 'Bank Officer'
  },
  {
    id: '4',
    name: 'Property Tax Records.xlsx',
    type: 'Excel',
    size: '890 KB',
    uploadDate: '2024-01-05',
    category: 'financial',
    status: 'active',
    uploadedBy: 'Tax Assessor'
  },
  {
    id: '5',
    name: 'Insurance Policy.pdf',
    type: 'PDF',
    size: '3.2 MB',
    uploadDate: '2024-01-03',
    category: 'legal',
    status: 'active',
    uploadedBy: 'Insurance Agent'
  }
];

export default function DocumentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredDocuments = mockDocuments.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'contract': return 'bg-blue-100 text-blue-800';
      case 'legal': return 'bg-purple-100 text-purple-800';
      case 'financial': return 'bg-green-100 text-green-800';
      case 'property': return 'bg-orange-100 text-orange-800';
      case 'personal': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-primary/10 p-3 text-primary">
          <FileText className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Document Management</h2>
          <p className="text-muted-foreground">
            Upload, organize, and manage your property documents
          </p>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Documents</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="shared">Shared</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {/* Upload and Search Section */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
            >
              All Categories
            </Button>
            <Button
              variant={selectedCategory === 'contract' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('contract')}
            >
              Contracts
            </Button>
            <Button
              variant={selectedCategory === 'legal' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('legal')}
            >
              Legal
            </Button>
            <Button
              variant={selectedCategory === 'financial' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('financial')}
            >
              Financial
            </Button>
            <Button
              variant={selectedCategory === 'property' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('property')}
            >
              Property
            </Button>
          </div>

          {/* Documents List */}
          <Card>
            <CardHeader>
              <CardTitle>Documents ({filteredDocuments.length})</CardTitle>
              <CardDescription>
                Manage your property-related documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-4">
                  {filteredDocuments.map((document) => (
                    <div
                      key={document.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="rounded-full bg-primary/10 p-2 text-primary">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{document.name}</h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {document.uploadDate}
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {document.uploadedBy}
                            </span>
                            <span>{document.size}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getCategoryColor(document.category)}>
                          {document.category}
                        </Badge>
                        <Badge className={getStatusColor(document.status)}>
                          {document.status}
                        </Badge>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Share2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Recent Documents</CardTitle>
              <CardDescription>Documents uploaded in the last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">
                Recent documents will appear here
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shared">
          <Card>
            <CardHeader>
              <CardTitle>Shared Documents</CardTitle>
              <CardDescription>Documents shared with you or by you</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">
                Shared documents will appear here
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="archived">
          <Card>
            <CardHeader>
              <CardTitle>Archived Documents</CardTitle>
              <CardDescription>Documents that have been archived</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">
                Archived documents will appear here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
