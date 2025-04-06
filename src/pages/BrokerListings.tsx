
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import BrokerLayout from '@/components/broker/BrokerLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit, PlusCircle, Search, Trash } from 'lucide-react';
import { mockApartments } from '@/utils/mockData';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

const BrokerListings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedListingId, setSelectedListingId] = useState<number | null>(null);
  const { toast } = useToast();
  
  const apartments = mockApartments.slice(0, 6); // Use mock data for now
  
  const filteredApartments = apartments.filter(apt => 
    apt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.neighborhood.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleDeleteClick = (id: number) => {
    setSelectedListingId(id);
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteConfirm = () => {
    // In a real app, this would call an API to delete the listing
    toast({
      title: "Listing Deleted",
      description: "The listing has been successfully deleted.",
    });
    setDeleteDialogOpen(false);
  };

  return (
    <BrokerLayout>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
        <h1 className="text-2xl font-bold text-groww-dark">My Listings</h1>
        <div className="flex space-x-4 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0 md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search listings..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Link to="/broker/listings/add">
            <Button className="bg-groww-purple hover:bg-groww-purple-dark">
              <PlusCircle size={18} className="mr-2" /> Add New
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredApartments.length > 0 ? (
          filteredApartments.map((apartment) => (
            <Card key={apartment.id} className="overflow-hidden">
              <div className="h-48 bg-gray-200 relative">
                <div className="absolute top-0 left-0 bg-groww-purple text-white m-2 px-2 py-1 text-xs rounded">
                  {apartment.available ? "Active" : "Inactive"}
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{apartment.name}</h3>
                    <p className="text-gray-500 text-sm">{apartment.neighborhood}</p>
                    <p className="font-medium text-groww-purple mt-1">${apartment.price}/mo</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="p-1 h-8 w-8">
                      <Edit size={16} />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="p-1 h-8 w-8 text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteClick(apartment.id)}
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                </div>
                <div className="mt-3 flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {apartment.bedrooms} bd • {apartment.bathrooms} ba • {apartment.sqft} sqft
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">No listings found. Try a different search term or add a new listing.</p>
          </div>
        )}
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Listing</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this listing? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteConfirm}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </BrokerLayout>
  );
};

export default BrokerListings;
