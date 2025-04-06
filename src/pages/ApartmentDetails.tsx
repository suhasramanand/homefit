
import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { mockApartments } from '@/utils/mockData';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Check, Heart, MapPin, Share } from 'lucide-react';
import { Tabs, TabsContent, TabsIndicator, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

const ApartmentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [tourDate, setTourDate] = useState('');

  // Find apartment data using the id from URL
  const apartment = mockApartments.find(apt => apt.id === Number(id)) || mockApartments[0];

  const handleContactSubmit = () => {
    if (!name || !email || !message) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Message Sent",
      description: "We've received your inquiry and will get back to you soon.",
    });
    
    setContactDialogOpen(false);
    // Reset form
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
  };

  const handleScheduleTour = () => {
    if (!name || !email || !tourDate) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Tour Scheduled",
      description: `Your tour has been scheduled for ${new Date(tourDate).toLocaleDateString()}.`,
    });
    
    setScheduleDialogOpen(false);
    // Reset form
    setName('');
    setEmail('');
    setPhone('');
    setTourDate('');
  };

  const formatBedrooms = (bedrooms: number) => {
    return bedrooms === 0 ? 'Studio' : `${bedrooms} Bedroom${bedrooms > 1 ? 's' : ''}`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link 
              to="/results" 
              className="inline-flex items-center text-groww-purple hover:text-groww-purple-dark mb-4"
            >
              <ArrowLeft size={16} className="mr-1" /> Back to Results
            </Link>
            
            <div className="flex flex-col md:flex-row justify-between md:items-center">
              <h1 className="text-3xl font-bold text-groww-dark">{apartment.name}</h1>
              <div className="mt-2 md:mt-0 flex items-center space-x-3">
                <Button variant="outline" className="flex items-center">
                  <Heart size={16} className="mr-1" /> Save
                </Button>
                <Button variant="outline" className="flex items-center">
                  <Share size={16} className="mr-1" /> Share
                </Button>
              </div>
            </div>
            
            <div className="flex items-center mt-2 text-gray-500">
              <MapPin size={16} className="mr-1" /> 
              {apartment.neighborhood}, NYC
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              {/* Main Image Gallery - In a real app, would be multiple images */}
              <div className="w-full aspect-video bg-gray-200 rounded-lg mb-4"></div>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div 
                    key={i} 
                    className="aspect-square bg-gray-300 rounded cursor-pointer hover:opacity-90 transition-opacity"
                  ></div>
                ))}
              </div>

              <Tabs defaultValue="details" className="mt-8">
                <TabsList>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="amenities">Amenities</TabsTrigger>
                  <TabsTrigger value="location">Location</TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="pt-4">
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-4">Apartment Details</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4">
                        <div>
                          <p className="text-gray-500">Apartment Type</p>
                          <p className="font-medium">{formatBedrooms(apartment.bedrooms)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Bathrooms</p>
                          <p className="font-medium">{apartment.bathrooms}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Square Footage</p>
                          <p className="font-medium">{apartment.sqft} sqft</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Price</p>
                          <p className="font-medium text-groww-purple">${apartment.price}/month</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Available From</p>
                          <p className="font-medium">{new Date(apartment.available).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Lease Term</p>
                          <p className="font-medium">12 Months</p>
                        </div>
                      </div>

                      <h3 className="font-semibold text-lg mt-6 mb-3">Description</h3>
                      <p className="text-gray-700">
                        Welcome to {apartment.name}, a beautiful {formatBedrooms(apartment.bedrooms).toLowerCase()} 
                        apartment in the heart of {apartment.neighborhood}. This {apartment.sqft} square foot apartment
                        features modern appliances, ample natural light, and a prime location close to public transportation,
                        restaurants, and shopping.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="amenities" className="pt-4">
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-4">Property Amenities</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3">
                        {apartment.amenities.map((amenity) => (
                          <div key={amenity} className="flex items-center">
                            <Check size={16} className="mr-2 text-groww-purple" />
                            <span>{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="location" className="pt-4">
                  <Card>
                    <CardContent className="p-4 min-h-[300px] flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-gray-500">Map will be displayed here.</p>
                        <p className="text-gray-500">{apartment.neighborhood}, NYC</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            <div>
              <Card className="sticky top-24">
                <CardContent className="p-4">
                  <div className="mb-4">
                    <div className="flex justify-between items-baseline">
                      <span className="text-2xl font-bold text-groww-purple">${apartment.price}</span>
                      <span className="text-gray-500">/month</span>
                    </div>
                    <div className="flex items-center mt-1">
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                        {apartment.matchScore}% Match
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Button 
                      onClick={() => setContactDialogOpen(true)}
                      className="w-full bg-groww-purple hover:bg-groww-purple-dark"
                    >
                      Contact Broker
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setScheduleDialogOpen(true)}
                      className="w-full"
                    >
                      <Calendar size={16} className="mr-2" />
                      Schedule Tour
                    </Button>
                  </div>

                  <div className="border-t mt-4 pt-4">
                    <h4 className="font-medium mb-2">Broker Details</h4>
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                      <div className="ml-3">
                        <p className="font-medium">Jane Smith</p>
                        <p className="text-sm text-gray-500">ABC Realty</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Contact Dialog */}
      <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Contact about {apartment.name}</DialogTitle>
            <DialogDescription>
              Fill out this form to contact the broker about this apartment.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">Name *</label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">Email *</label>
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Your email"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone</label>
              <Input 
                id="phone" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                placeholder="Your phone number (optional)"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-1">Message *</label>
              <Textarea 
                id="message" 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                placeholder="I'm interested in this apartment..."
                rows={4}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setContactDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleContactSubmit}
              className="bg-groww-purple hover:bg-groww-purple-dark"
            >
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Tour Dialog */}
      <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule a Tour</DialogTitle>
            <DialogDescription>
              Pick a date to tour {apartment.name} in person.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div>
              <label htmlFor="tour-name" className="block text-sm font-medium mb-1">Name *</label>
              <Input 
                id="tour-name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="tour-email" className="block text-sm font-medium mb-1">Email *</label>
              <Input 
                id="tour-email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Your email"
              />
            </div>
            <div>
              <label htmlFor="tour-phone" className="block text-sm font-medium mb-1">Phone</label>
              <Input 
                id="tour-phone" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                placeholder="Your phone number (optional)"
              />
            </div>
            <div>
              <label htmlFor="tour-date" className="block text-sm font-medium mb-1">Preferred Date *</label>
              <Input 
                id="tour-date" 
                type="date" 
                value={tourDate} 
                onChange={(e) => setTourDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setScheduleDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleScheduleTour}
              className="bg-groww-purple hover:bg-groww-purple-dark"
            >
              Schedule Tour
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApartmentDetails;
