
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from '@/components/admin/AdminLayout';
import { useToast } from '@/components/ui/use-toast';
import { api } from '@/utils/api';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Building, Eye, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminListings = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  const { data: listings = [], isLoading, error, refetch } = useQuery({
    queryKey: ['admin-listings'],
    queryFn: api.admin.getAllListings,
  });
  
  useEffect(() => {
    document.title = 'Apartment Listings - Admin Dashboard';
  }, []);
  
  if (error) {
    toast({
      title: "Error",
      description: "Failed to load listings. Please try again.",
      variant: "destructive",
    });
  }
  
  // Filter listings based on search term and status filter
  const filteredListings = listings.filter((listing: any) => {
    const matchesSearch = 
      searchTerm === '' || 
      listing.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.location?.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === '' || listing.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  const handleViewDetails = (listing: any) => {
    setSelectedListing(listing);
    setIsDetailsOpen(true);
  };
  
  const handleApproveListing = async (id: string) => {
    try {
      await api.admin.approveListing(id);
      toast({
        title: "Listing Approved",
        description: "The apartment listing has been approved and is now visible to users",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve listing. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleRejectListing = async (id: string) => {
    try {
      await api.admin.rejectListing(id);
      toast({
        title: "Listing Rejected",
        description: "The apartment listing has been rejected",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject listing. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-groww-dark">All Apartment Listings</h1>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex-1 w-full sm:max-w-xs relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search listings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={() => refetch()}>
            Refresh
          </Button>
        </div>
      </div>
      
      {/* Listings Table */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/20 py-4">
          <CardTitle className="text-lg">Apartment Listings</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Broker</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-groww-purple"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredListings.length > 0 ? (
                filteredListings.map((listing: any) => (
                  <TableRow key={listing.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{listing.title}</TableCell>
                    <TableCell>{listing.location}</TableCell>
                    <TableCell>${listing.price}/month</TableCell>
                    <TableCell>{listing.broker?.name || 'Unknown'}</TableCell>
                    <TableCell>
                      <Badge className={
                        listing.status === 'active' ? 'bg-green-100 text-green-800' : 
                        listing.status === 'pending' ? 'bg-amber-100 text-amber-800' : 
                        'bg-red-100 text-red-800'
                      }>
                        {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewDetails(listing)}
                        >
                          <Eye size={16} className="mr-1" /> View
                        </Button>
                        
                        {listing.status === 'pending' && (
                          <>
                            <Button 
                              size="sm" 
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleApproveListing(listing.id)}
                            >
                              <CheckCircle size={16} className="mr-1" /> Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleRejectListing(listing.id)}
                            >
                              <XCircle size={16} className="mr-1" /> Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No listings match your search criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Listing Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Listing Details</DialogTitle>
          </DialogHeader>
          
          {selectedListing && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 mb-4">
                  {selectedListing.images && selectedListing.images.length > 0 ? (
                    <img 
                      src={selectedListing.images[0]} 
                      alt={selectedListing.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building size={48} className="text-gray-300" />
                    </div>
                  )}
                </div>
                
                <h2 className="text-xl font-bold mb-2">{selectedListing.title}</h2>
                <p className="text-gray-500 mb-4">{selectedListing.location}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="text-sm text-gray-500">Price</span>
                    <p className="font-semibold">${selectedListing.price}/month</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="text-sm text-gray-500">Size</span>
                    <p className="font-semibold">{selectedListing.squareFeet} sq ft</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="text-sm text-gray-500">Bedrooms</span>
                    <p className="font-semibold">{selectedListing.bedrooms}</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="text-sm text-gray-500">Bathrooms</span>
                    <p className="font-semibold">{selectedListing.bathrooms}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-gray-600">{selectedListing.description}</p>
                </div>
              </div>
              
              <div>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h3 className="font-semibold mb-2">Broker Information</h3>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Name:</span> {selectedListing.broker?.name || 'Unknown'}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span> {selectedListing.broker?.email || 'Unknown'}
                    </p>
                    <p>
                      <span className="font-medium">Company:</span> {selectedListing.broker?.brokerVerification?.companyName || 'Unknown'}
                    </p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Amenities</h3>
                  {selectedListing.amenities && selectedListing.amenities.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedListing.amenities.map((amenity: string, index: number) => (
                        <Badge key={index} variant="outline" className="bg-gray-50">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No amenities listed</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Additional Details</h3>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Pet Friendly:</span> {selectedListing.petFriendly ? 'Yes' : 'No'}
                    </p>
                    <p>
                      <span className="font-medium">Available From:</span> {selectedListing.availableFrom ? new Date(selectedListing.availableFrom).toLocaleDateString() : 'Immediately'}
                    </p>
                    <p>
                      <span className="font-medium">Listed On:</span> {new Date(selectedListing.createdAt).toLocaleDateString()}
                    </p>
                    <p>
                      <span className="font-medium">Last Updated:</span> {new Date(selectedListing.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Status</h3>
                  <div className="flex items-center space-x-4">
                    <Badge className={
                      selectedListing.status === 'active' ? 'bg-green-100 text-green-800' : 
                      selectedListing.status === 'pending' ? 'bg-amber-100 text-amber-800' : 
                      'bg-red-100 text-red-800'
                    }>
                      {selectedListing.status.charAt(0).toUpperCase() + selectedListing.status.slice(1)}
                    </Badge>
                    
                    {selectedListing.status === 'pending' && (
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleApproveListing(selectedListing.id)}
                        >
                          <CheckCircle size={16} className="mr-1" /> Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleRejectListing(selectedListing.id)}
                        >
                          <XCircle size={16} className="mr-1" /> Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminListings;
