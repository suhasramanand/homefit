import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from '@/components/admin/AdminLayout';
import { useToast } from '@/components/ui/use-toast';
import { api } from '@/utils/api';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  CheckCircle,
  XCircle,
  ShieldCheck,
  ShieldX,
  Search,
  FileText,
  Users
} from 'lucide-react';

const BrokerManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedBroker, setSelectedBroker] = useState<any>(null);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isRevokeDialogOpen, setIsRevokeDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  
  const {
    data: brokers = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['brokers', activeTab],
    queryFn: () => api.admin.getAllBrokers(activeTab),
    staleTime: 60000,
    retry: 1,
    onError: (err: Error) => {
      toast({
        title: "Error",
        description: "Failed to load broker data: " + err.message,
        variant: "destructive",
      });
    }
  });
  
  const filteredBrokers = Array.isArray(brokers) 
    ? brokers.filter((broker: any) =>
        broker.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        broker.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (broker.brokerVerification?.companyName || '').toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];
  
  const handleViewDetails = (broker: any) => {
    setSelectedBroker(broker);
    setIsViewDetailsOpen(true);
  };
  
  const handleApprove = async () => {
    try {
      await api.admin.approveBroker(selectedBroker.id);
      toast({
        title: "Broker approved",
        description: "The broker can now list properties on the platform.",
      });
      refetch();
      setIsApproveDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve broker. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleReject = async () => {
    try {
      await api.admin.rejectBroker(selectedBroker.id, rejectionReason);
      toast({
        title: "Broker application rejected",
        description: "The broker has been notified about the rejection.",
      });
      refetch();
      setIsRejectDialogOpen(false);
      setRejectionReason('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject broker. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleRevoke = async () => {
    try {
      await api.admin.revokeBroker(selectedBroker.id, rejectionReason);
      toast({
        title: "Broker privileges revoked",
        description: "The broker no longer has permission to list properties.",
      });
      refetch();
      setIsRevokeDialogOpen(false);
      setRejectionReason('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to revoke broker privileges. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const pendingCount = Array.isArray(brokers) ? brokers.filter((b: any) => b.brokerVerification?.status === 'pending').length : 0;
  const approvedCount = Array.isArray(brokers) ? brokers.filter((b: any) => b.brokerVerification?.status === 'approved').length : 0;
  const rejectedCount = Array.isArray(brokers) ? brokers.filter((b: any) => b.brokerVerification?.status === 'rejected').length : 0;
  
  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-groww-dark">Broker Management</h1>
        <Button onClick={() => refetch()}>Refresh</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4 flex items-center">
            <div className="w-12 h-12 rounded-full bg-amber-500 text-white flex items-center justify-center mr-4">
              <Users size={24} />
            </div>
            <div>
              <p className="text-xl font-bold">{pendingCount}</p>
              <p className="text-gray-600">Pending Verification</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 flex items-center">
            <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center mr-4">
              <ShieldCheck size={24} />
            </div>
            <div>
              <p className="text-xl font-bold">{approvedCount}</p>
              <p className="text-gray-600">Approved Brokers</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4 flex items-center">
            <div className="w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center mr-4">
              <ShieldX size={24} />
            </div>
            <div>
              <p className="text-xl font-bold">{rejectedCount}</p>
              <p className="text-gray-600">Rejected Applications</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="relative w-full md:w-96 mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search brokers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="mt-0">
          <BrokersList
            brokers={filteredBrokers.filter((b: any) => b.brokerVerification?.status === 'pending')}
            isLoading={isLoading}
            onViewDetails={handleViewDetails}
            onApprove={(broker: any) => {
              setSelectedBroker(broker);
              setIsApproveDialogOpen(true);
            }}
            onReject={(broker: any) => {
              setSelectedBroker(broker);
              setIsRejectDialogOpen(true);
            }}
          />
        </TabsContent>
        
        <TabsContent value="approved" className="mt-0">
          <BrokersList
            brokers={filteredBrokers.filter((b: any) => b.brokerVerification?.status === 'approved')}
            isLoading={isLoading}
            onViewDetails={handleViewDetails}
            onRevoke={(broker: any) => {
              setSelectedBroker(broker);
              setIsRevokeDialogOpen(true);
            }}
          />
        </TabsContent>
        
        <TabsContent value="rejected" className="mt-0">
          <BrokersList
            brokers={filteredBrokers.filter((b: any) => b.brokerVerification?.status === 'rejected')}
            isLoading={isLoading}
            onViewDetails={handleViewDetails}
          />
        </TabsContent>
        
        <TabsContent value="all" className="mt-0">
          <BrokersList
            brokers={filteredBrokers}
            isLoading={isLoading}
            onViewDetails={handleViewDetails}
            onApprove={(broker: any) => {
              setSelectedBroker(broker);
              setIsApproveDialogOpen(true);
            }}
            onReject={(broker: any) => {
              setSelectedBroker(broker);
              setIsRejectDialogOpen(true);
            }}
            onRevoke={(broker: any) => {
              setSelectedBroker(broker);
              setIsRevokeDialogOpen(true);
            }}
          />
        </TabsContent>
      </Tabs>
      
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Broker Details</DialogTitle>
          </DialogHeader>
          
          {selectedBroker && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Name:</span> {selectedBroker.name}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span> {selectedBroker.email}
                    </div>
                    <div>
                      <span className="font-medium">Status:</span>{' '}
                      <Badge className={
                        selectedBroker.brokerVerification?.status === 'approved' ? 'bg-green-100 text-green-800' :
                        selectedBroker.brokerVerification?.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-amber-100 text-amber-800'
                      }>
                        {(selectedBroker.brokerVerification?.status || 'pending').charAt(0).toUpperCase() + 
                        (selectedBroker.brokerVerification?.status || 'pending').slice(1)}
                      </Badge>
                    </div>
                    <div>
                      <span className="font-medium">Registered:</span>{' '}
                      {new Date(selectedBroker.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Business Information</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Company Name:</span>{' '}
                      {selectedBroker.brokerVerification?.companyName || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">License Number:</span>{' '}
                      {selectedBroker.brokerVerification?.licenseNumber || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">Years of Experience:</span>{' '}
                      {selectedBroker.brokerVerification?.yearsOfExperience || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">Specializations:</span>{' '}
                      {selectedBroker.brokerVerification?.specializations?.join(', ') || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">Business Address:</span>{' '}
                      {selectedBroker.brokerVerification?.businessAddress || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">License Document</h3>
                {selectedBroker.brokerVerification?.licenseDocument ? (
                  <div className="border rounded-md p-4 h-64 flex items-center justify-center">
                    {selectedBroker.brokerVerification.licenseDocument.endsWith('.pdf') ? (
                      <div className="text-center">
                        <FileText size={64} className="mx-auto mb-2 text-gray-500" />
                        <p className="text-sm">PDF Document</p>
                        <a 
                          href={`http://localhost:5000${selectedBroker.brokerVerification.licenseDocument}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-groww-purple hover:underline text-sm"
                        >
                          View Document
                        </a>
                      </div>
                    ) : (
                      <a 
                        href={`http://localhost:5000${selectedBroker.brokerVerification.licenseDocument}`} 
                        target="_blank" 
                        rel="noreferrer"
                      >
                        <img 
                          src={`http://localhost:5000${selectedBroker.brokerVerification.licenseDocument}`} 
                          alt="License Document" 
                          className="max-h-full object-contain"
                        />
                      </a>
                    )}
                  </div>
                ) : (
                  <div className="border rounded-md p-4 h-64 flex items-center justify-center text-gray-500">
                    No license document provided
                  </div>
                )}
                
                {selectedBroker.brokerVerification?.status === 'rejected' && (
                  <div className="mt-4">
                    <h3 className="text-md font-semibold mb-2">Rejection Reason</h3>
                    <div className="p-3 bg-red-50 border border-red-200 rounded text-sm">
                      {selectedBroker.brokerVerification.rejectionReason || 'No reason provided'}
                    </div>
                  </div>
                )}
                
                <div className="mt-6 flex justify-end space-x-2">
                  {selectedBroker.brokerVerification?.status === 'pending' && (
                    <>
                      <Button 
                        variant="outline" 
                        className="border-red-200 text-red-600 hover:bg-red-50"
                        onClick={() => {
                          setIsViewDetailsOpen(false);
                          setIsRejectDialogOpen(true);
                        }}
                      >
                        <XCircle size={16} className="mr-1" /> Reject
                      </Button>
                      <Button 
                        className="bg-groww-purple hover:bg-groww-purple-dark"
                        onClick={() => {
                          setIsViewDetailsOpen(false);
                          setIsApproveDialogOpen(true);
                        }}
                      >
                        <CheckCircle size={16} className="mr-1" /> Approve
                      </Button>
                    </>
                  )}
                  
                  {selectedBroker.brokerVerification?.status === 'approved' && (
                    <Button 
                      variant="outline" 
                      className="border-red-200 text-red-600 hover:bg-red-50"
                      onClick={() => {
                        setIsViewDetailsOpen(false);
                        setIsRevokeDialogOpen(true);
                      }}
                    >
                      <ShieldX size={16} className="mr-1" /> Revoke Privileges
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline" 
                    onClick={() => setIsViewDetailsOpen(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Broker</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve {selectedBroker?.name} as a broker? 
              They will be able to list properties on the platform.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApproveDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleApprove}
              className="bg-groww-purple hover:bg-groww-purple-dark"
            >
              <CheckCircle size={16} className="mr-1" /> Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Broker Application</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting {selectedBroker?.name}'s broker application.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="reason">Rejection Reason</Label>
              <Textarea
                id="reason"
                placeholder="Enter the reason for rejection"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleReject}
            >
              <XCircle size={16} className="mr-1" /> Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isRevokeDialogOpen} onOpenChange={setIsRevokeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revoke Broker Privileges</DialogTitle>
            <DialogDescription>
              Please provide a reason for revoking {selectedBroker?.name}'s broker privileges.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="reason">Revocation Reason</Label>
              <Textarea
                id="reason"
                placeholder="Enter the reason for revoking privileges"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRevokeDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleRevoke}
            >
              <ShieldX size={16} className="mr-1" /> Revoke Privileges
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

const BrokersList = ({ 
  brokers, 
  isLoading, 
  onViewDetails,
  onApprove,
  onReject,
  onRevoke
}: {
  brokers: any[];
  isLoading: boolean;
  onViewDetails: (broker: any) => void;
  onApprove?: (broker: any) => void;
  onReject?: (broker: any) => void;
  onRevoke?: (broker: any) => void;
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-groww-purple"></div>
        </CardContent>
      </Card>
    );
  }
  
  if (brokers.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-gray-500">
          <Users size={48} className="mx-auto mb-3 text-gray-300" />
          <p>No brokers found matching your criteria.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      {brokers.map((broker: any) => (
        <Card key={broker.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-0">
            <div className="p-6 sm:flex justify-between items-start">
              <div>
                <h3 className="font-medium text-lg">{broker.name}</h3>
                <p className="text-gray-600 text-sm">{broker.email}</p>
                
                <div className="mt-3 space-y-1 text-sm">
                  <div>
                    <span className="text-gray-500">Company:</span>{' '}
                    {broker.brokerVerification?.companyName || 'N/A'}
                  </div>
                  <div>
                    <span className="text-gray-500">License:</span>{' '}
                    {broker.brokerVerification?.licenseNumber || 'N/A'}
                  </div>
                  <div>
                    <span className="text-gray-500">Applied:</span>{' '}
                    {broker.brokerVerification?.submittedAt 
                      ? new Date(broker.brokerVerification.submittedAt).toLocaleDateString() 
                      : new Date(broker.createdAt).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="mt-4">
                  <Badge className={
                    broker.brokerVerification?.status === 'approved' ? 'bg-green-100 text-green-800' :
                    broker.brokerVerification?.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-amber-100 text-amber-800'
                  }>
                    {(broker.brokerVerification?.status || 'pending').charAt(0).toUpperCase() + 
                    (broker.brokerVerification?.status || 'pending').slice(1)}
                  </Badge>
                </div>
              </div>
              
              <div className="mt-4 sm:mt-0 flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onViewDetails(broker)}
                >
                  <FileText size={16} className="mr-1" /> View Details
                </Button>
                
                {broker.brokerVerification?.status === 'pending' && (
                  <>
                    {onReject && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-red-200 text-red-600 hover:bg-red-50"
                        onClick={() => onReject(broker)}
                      >
                        <XCircle size={16} className="mr-1" /> Reject
                      </Button>
                    )}
                    
                    {onApprove && (
                      <Button 
                        size="sm"
                        className="bg-groww-purple hover:bg-groww-purple-dark"
                        onClick={() => onApprove(broker)}
                      >
                        <CheckCircle size={16} className="mr-1" /> Approve
                      </Button>
                    )}
                  </>
                )}
                
                {broker.brokerVerification?.status === 'approved' && onRevoke && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => onRevoke(broker)}
                  >
                    <ShieldX size={16} className="mr-1" /> Revoke
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BrokerManagement;
