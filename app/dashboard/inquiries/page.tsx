'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { inquiriesApi } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, Loader2, Send, Clock, CheckCircle, XCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function InquiriesPage() {
  const { user, token } = useAuth();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const [response, setResponse] = useState('');

  useEffect(() => {
    if (user && token) {
      fetchInquiries();
    }
  }, [user, token]);

  const fetchInquiries = async () => {
    // Skip API call during build or if window is not available (SSR)
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      const data = await inquiriesApi.getAll(token!);
      setInquiries(data.inquiries || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch inquiries');
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (inquiryId: string) => {
    if (!response.trim()) return;

    try {
      await inquiriesApi.update(inquiryId, { response }, token!);
      setResponse('');
      setRespondingTo(null);
      fetchInquiries(); // Refresh the list
    } catch (err: any) {
      console.error('Error responding to inquiry:', err);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'responded':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'closed':
        return <XCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'responded':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'closed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {user.role === 'agent' ? 'Property Inquiries' : 'My Inquiries'}
        </h1>
        <p className="text-muted-foreground">
          {user.role === 'agent'
            ? 'Manage inquiries for your properties'
            : 'Track your property inquiries and responses'
          }
        </p>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : error ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={fetchInquiries}>Try Again</Button>
          </CardContent>
        </Card>
      ) : inquiries.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No inquiries yet</h3>
            <p className="text-muted-foreground text-center">
              {user.role === 'agent'
                ? 'When users inquire about your properties, they will appear here.'
                : 'Your property inquiries will appear here when you contact agents.'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inquiry: any) => (
            <Card key={inquiry._id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">
                      {inquiry.property?.title || 'Property Inquiry'}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <span>
                        {user.role === 'agent'
                          ? `From: ${inquiry.contactInfo?.name || inquiry.user?.name}`
                          : `To: ${inquiry.agent?.name}`
                        }
                      </span>
                      <span>•</span>
                      <span>
                        {formatDistanceToNow(new Date(inquiry.createdAt), { addSuffix: true })}
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(inquiry.status)}
                    <Badge className={getStatusColor(inquiry.status)}>
                      {inquiry.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Property Info */}
                {inquiry.property && (
                  <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                    {inquiry.property.images?.[0] && (
                      <img
                        src={inquiry.property.images[0]}
                        alt={inquiry.property.title}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    )}
                    <div>
                      <h4 className="font-medium">{inquiry.property.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {inquiry.property.location?.city}, {inquiry.property.location?.state}
                      </p>
                      <p className="text-sm font-medium">
                        ${inquiry.property.price?.toLocaleString()}
                        {inquiry.property.type === 'rent' ? '/mo' : ''}
                      </p>
                    </div>
                  </div>
                )}

                {/* Original Message */}
                <div>
                  <h5 className="font-medium mb-2">Message:</h5>
                  <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                    {inquiry.message}
                  </p>
                </div>

                {/* Contact Info */}
                <div className="text-sm text-muted-foreground">
                  <strong>Contact:</strong> {inquiry.contactInfo?.email}
                  {inquiry.contactInfo?.phone && (
                    <span> • {inquiry.contactInfo.phone}</span>
                  )}
                </div>

                {/* Response */}
                {inquiry.response && (
                  <div>
                    <h5 className="font-medium mb-2">Response:</h5>
                    <p className="text-sm bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                      {inquiry.response}
                    </p>
                    {inquiry.respondedAt && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Responded {formatDistanceToNow(new Date(inquiry.respondedAt), { addSuffix: true })}
                      </p>
                    )}
                  </div>
                )}

                {/* Response Form for Agents */}
                {user.role === 'agent' && inquiry.status === 'pending' && (
                  <div className="border-t pt-4">
                    {respondingTo === inquiry._id ? (
                      <div className="space-y-3">
                        <Textarea
                          placeholder="Type your response..."
                          value={response}
                          onChange={(e) => setResponse(e.target.value)}
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleRespond(inquiry._id)}
                            disabled={!response.trim()}
                          >
                            <Send className="mr-2 h-4 w-4" />
                            Send Response
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setRespondingTo(null);
                              setResponse('');
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => setRespondingTo(inquiry._id)}
                      >
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Respond
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
