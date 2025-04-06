
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Search, UserCheck, Users, XCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedBrokerId, setSelectedBrokerId] = useState<number | null>(null);
  const { toast } = useToast();

  // Mock broker data
  const brokers = [
    { id: 1, name: "John Smith", email: "john@realestate.com", company: "ABC Realty", status: "pending", date: "2023-03-20" },
    { id: 2, name: "Emily Wilson", email: "emily@properties.com", company: "Wilson Properties", status: "approved", date: "2023-02-15" },
    { id: 3, name: "Michael Brown", email: "michael@homefinders.com", company: "Home Finders", status: "pending", date: "2023-04-01" },
    { id: 4, name: "Sarah Johnson", email: "sarah@luxuryestates.com", company: "Luxury Estates", status: "approved", date: "2023-01-10" },
    { id: 5, name: "James Davis", email: "james@cityliving.com", company: "City Living", status: "rejected", date: "2023-03-05" }
  ];

  const filteredBrokers = brokers.filter(broker => 
    broker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    broker.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    broker.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApproveClick = (id: number) => {
    setSelectedBrokerId(id);
    setApproveDialogOpen(true);
  };

  const handleRejectClick = (id: number) => {
    setSelectedBrokerId(id);
    setRejectDialogOpen(true);
  };

  const handleApproveConfirm = () => {
    // In a real app, this would call an API to approve the broker
    toast({
      title: "Broker Approved",
      description: "The broker has been successfully approved.",
    });
    setApproveDialogOpen(false);
  };

  const handleRejectConfirm = () => {
    // In a real app, this would call an API to reject the broker
    toast({
      title: "Broker Rejected",
      description: "The broker application has been rejected.",
    });
    setRejectDialogOpen(false);
  };

  const pendingCount = brokers.filter(b => b.status === 'pending').length;
  const approvedCount = brokers.filter(b => b.status === 'approved').length;
  const rejectedCount = brokers.filter(b => b.status === 'rejected').length;

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-groww-dark">Admin Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 flex items-center">
            <div className="w-12 h-12 rounded-full bg-amber-500 text-white flex items-center justify-center mr-4">
              <Users size={24} />
            </div>
            <div>
              <p className="text-xl font-bold">{pendingCount}</p>
              <p className="text-gray-500">Pending Brokers</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center">
            <div className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center mr-4">
              <UserCheck size={24} />
            </div>
            <div>
              <p className="text-xl font-bold">{approvedCount}</p>
              <p className="text-gray-500">Approved Brokers</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center">
            <div className="w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center mr-4">
              <XCircle size={24} />
            </div>
            <div>
              <p className="text-xl font-bold">{rejectedCount}</p>
              <p className="text-gray-500">Rejected Applications</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Broker Verification</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search brokers..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Name</th>
                  <th className="text-left py-3 px-4 font-medium">Email</th>
                  <th className="text-left py-3 px-4 font-medium">Company</th>
                  <th className="text-left py-3 px-4 font-medium">Application Date</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-right py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBrokers.map(broker => (
                  <tr key={broker.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-3 px-4">{broker.name}</td>
                    <td className="py-3 px-4">{broker.email}</td>
                    <td className="py-3 px-4">{broker.company}</td>
                    <td className="py-3 px-4">{new Date(broker.date).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <Badge className={
                        broker.status === 'approved' ? 'bg-green-100 text-green-800 hover:bg-green-200' :
                        broker.status === 'rejected' ? 'bg-red-100 text-red-800 hover:bg-red-200' :
                        'bg-amber-100 text-amber-800 hover:bg-amber-200'
                      }>
                        {broker.status.charAt(0).toUpperCase() + broker.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {broker.status === 'pending' && (
                        <div className="flex justify-end space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="bg-green-50 text-green-600 hover:bg-green-100 border-green-200"
                            onClick={() => handleApproveClick(broker.id)}
                          >
                            <CheckCircle size={16} className="mr-1" /> Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
                            onClick={() => handleRejectClick(broker.id)}
                          >
                            <XCircle size={16} className="mr-1" /> Reject
                          </Button>
                        </div>
                      )}
                      {broker.status !== 'pending' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                        >
                          View Details
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredBrokers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500">
                      No brokers found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Approve Dialog */}
      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Broker</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this broker? They will be able to list properties on the platform.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleApproveConfirm}
              className="bg-groww-purple hover:bg-groww-purple-dark"
            >
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Broker</DialogTitle>
            <DialogDescription>
              Are you sure you want to reject this broker? They will not be able to list properties.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleRejectConfirm}
            >
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminDashboard;
