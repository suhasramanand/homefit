
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import BrokerLayout from '@/components/broker/BrokerLayout';
import { api } from '@/utils/api';
import { useToast } from '@/components/ui/use-toast';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  MessageSquare,
  User,
  Clock,
  Building,
  CheckCircle,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

const BrokerInquiries = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [responseText, setResponseText] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { data: inquiries = [], isLoading, refetch } = useQuery({
    queryKey: ['broker-inquiries', selectedTab],
    queryFn: () => api.broker.getInquiries(selectedTab),
  });
  
  const handleSubmitResponse = async () => {
    try {
      await api.broker.respondToInquiry(selectedInquiry.id, responseText);
      toast({
        title: "Response Sent",
        description: "Your response has been sent to the client.",
      });
      setIsDialogOpen(false);
      setResponseText('');
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send response. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleOpenDialog = (inquiry: any) => {
    setSelectedInquiry(inquiry);
    setIsDialogOpen(true);
    // Pre-fill response with template if it's a new inquiry
    if (inquiry.status === 'new') {
      setResponseText(`Hi ${inquiry.user?.name || 'there'},\n\nThank you for your interest in ${inquiry.apartment?.title}. I'd be happy to provide more information or arrange a viewing.\n\nBest regards,\n[Your Name]`);
    } else {
      setResponseText('');
    }
  };
  
  const filteredInquiries = inquiries.filter((inquiry: any) => {
    return (
      searchTerm === '' ||
      inquiry.apartment?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.message?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  
  return (
    <BrokerLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-groww-dark">Inquiries</h1>
      </div>
      
      {/* Search and filters */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search inquiries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
          <TabsTrigger value="responded">Responded</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
        </TabsList>
        
        {['all', 'new', 'responded', 'resolved'].map((tab) => (
          <TabsContent key={tab} value={tab} className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-groww-purple"></div>
              </div>
            ) : filteredInquiries.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <MessageSquare size={48} className="text-gray-300 mb-4" />
                  <p className="text-gray-500">No inquiries found</p>
                </CardContent>
              </Card>
            ) : (
              filteredInquiries.map((inquiry: any) => (
                <Card key={inquiry.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <div className="mr-4">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <User size={20} className="text-gray-500" />
                            </div>
                          </div>
                          <div>
                            <h3 className="font-medium">{inquiry.user?.name || 'Anonymous User'}</h3>
                            <p className="text-sm text-gray-500 flex items-center">
                              <Clock size={12} className="mr-1" /> 
                              {new Date(inquiry.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Badge className={
                          inquiry.status === 'new' ? 'bg-blue-100 text-blue-800' :
                          inquiry.status === 'responded' ? 'bg-amber-100 text-amber-800' :
                          'bg-green-100 text-green-800'
                        }>
                          {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                        </Badge>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm text-gray-500 flex items-center mb-1">
                          <Building size={12} className="mr-1" /> Property
                        </p>
                        <p className="font-medium">{inquiry.apartment?.title || 'Unknown Property'}</p>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm text-gray-500 flex items-center mb-1">
                          <MessageSquare size={12} className="mr-1" /> Message
                        </p>
                        <p className="text-gray-700">{inquiry.message}</p>
                      </div>
                      
                      {inquiry.response && (
                        <div className="mb-4 bg-gray-50 p-3 rounded-md">
                          <p className="text-sm text-gray-500 flex items-center mb-1">
                            <CheckCircle size={12} className="mr-1" /> Your Response
                          </p>
                          <p className="text-gray-700">{inquiry.response}</p>
                        </div>
                      )}
                      
                      <div className="flex justify-end mt-4">
                        <Button 
                          variant={inquiry.status === 'new' ? "default" : "outline"}
                          onClick={() => handleOpenDialog(inquiry)}
                        >
                          {inquiry.status === 'new' ? 'Respond' : 'View Details'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        ))}
      </Tabs>
      
      {/* Response Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selectedInquiry?.status === 'new' ? 'Respond to Inquiry' : 'Inquiry Details'}
            </DialogTitle>
            {selectedInquiry && (
              <DialogDescription>
                {selectedInquiry.apartment?.title || 'Property Inquiry'} - {new Date(selectedInquiry.createdAt).toLocaleDateString()}
              </DialogDescription>
            )}
          </DialogHeader>
          
          {selectedInquiry && (
            <>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-1">From:</p>
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                      <User size={16} className="text-gray-500" />
                    </div>
                    <div>
                      <p>{selectedInquiry.user?.name || 'Anonymous User'}</p>
                      <p className="text-xs text-gray-500">{selectedInquiry.user?.email || 'No email provided'}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-1">Message:</p>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-gray-700">{selectedInquiry.message}</p>
                  </div>
                </div>
                
                {selectedInquiry.status !== 'new' && selectedInquiry.response && (
                  <div>
                    <p className="text-sm font-medium mb-1">Your Response:</p>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-gray-700">{selectedInquiry.response}</p>
                    </div>
                  </div>
                )}
                
                {selectedInquiry.status === 'new' && (
                  <div>
                    <p className="text-sm font-medium mb-1">Your Response:</p>
                    <Textarea
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      placeholder="Type your response here..."
                      rows={6}
                    />
                  </div>
                )}
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Close
                </Button>
                {selectedInquiry.status === 'new' && (
                  <Button onClick={handleSubmitResponse} disabled={!responseText.trim()}>
                    Send Response
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </BrokerLayout>
  );
};

export default BrokerInquiries;
