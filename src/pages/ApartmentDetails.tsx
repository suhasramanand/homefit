
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { mockApartments } from '@/utils/mockData';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Check, Heart, MapPin, Share } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import gsap from 'gsap';

const ApartmentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [showTourDialog, setShowTourDialog] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [tourDate, setTourDate] = useState('');
  
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // Find apartment data using the id from URL
  const apartment = mockApartments.find(apt => apt.id === id) || mockApartments[0];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    // GSAP animations
    if (!isLoading) {
      // Header animation
      gsap.fromTo(headerRef.current, 
        { opacity: 0, y: -50 }, 
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );
      
      // Image animation
      gsap.fromTo(imageRef.current, 
        { opacity: 0, scale: 0.9 }, 
        { opacity: 1, scale: 1, duration: 0.8, delay: 0.2, ease: "back.out(1.7)" }
      );
      
      // Content animation
      gsap.fromTo(contentRef.current, 
        { opacity: 0, y: 50 }, 
        { opacity: 1, y: 0, duration: 0.8, delay: 0.4, ease: "power3.out" }
      );
    }

    return () => clearTimeout(timer);
  }, [isLoading]);

  const handleContactSubmit = () => {
    if (!name || !email || !message) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Message Sent!",
      description: "The broker will respond to you soon.",
    });
    setShowContactDialog(false);
  };

  const handleTourSubmit = () => {
    if (!name || !email || !tourDate) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Tour Scheduled!",
      description: `Your tour is scheduled for ${tourDate}.`,
    });
    setShowTourDialog(false);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Removed from Favorites" : "Added to Favorites",
      description: isFavorite 
        ? "This property has been removed from your favorites." 
        : "This property has been added to your favorites.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-pulse">
            <p className="text-groww-purple text-lg">Loading apartment details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back navigation */}
          <div ref={headerRef} className="mb-6">
            <Link 
              to="/results" 
              className="inline-flex items-center text-groww-purple hover:text-groww-purple-dark transition-colors"
            >
              <ArrowLeft size={18} className="mr-2" /> Back to Results
            </Link>
          </div>

          {/* Header information */}
          <div ref={headerRef} className="mb-8 flex flex-col md:flex-row justify-between md:items-center">
            <div>
              <h1 className="text-3xl font-bold text-groww-dark">{apartment.name}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-2 text-gray-600">
                <MapPin size={16} className="text-groww-purple" />
                <span>{apartment.address}</span>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-4">
              <div className="text-right">
                <p className="text-2xl font-bold text-groww-purple">${apartment.price}<span className="text-sm font-normal">/mo</span></p>
                <div className="inline-flex items-center bg-groww-soft-purple text-groww-purple px-3 py-1 rounded-full text-sm font-medium mt-1">
                  {apartment.matchScore}% Match
                </div>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column: Images and details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image gallery */}
              <div ref={imageRef} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="bg-gray-200 h-[400px] rounded-lg flex items-center justify-center relative">
                  <div className="text-gray-500">Apartment Images</div>
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-white hover:bg-white/90 rounded-full h-10 w-10 p-0"
                      onClick={() => toggleFavorite()}
                    >
                      <Heart size={18} className={isFavorite ? "fill-red-500 text-red-500" : ""} />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-white hover:bg-white/90 rounded-full h-10 w-10 p-0"
                      onClick={() => {
                        toast({
                          title: "Share Link Copied",
                          description: "The link to this apartment was copied to your clipboard.",
                        });
                      }}
                    >
                      <Share size={18} />
                    </Button>
                  </div>
                </div>
                <div className="flex mt-4 space-x-2 overflow-x-auto pb-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-gray-200 h-16 w-24 flex-shrink-0 rounded-md"></div>
                  ))}
                </div>
              </div>

              {/* Tabs for details, amenities, etc */}
              <div ref={contentRef} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <Tabs defaultValue="details">
                  <TabsList className="w-full border-b grid grid-cols-3">
                    <TabsTrigger value="details" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-groww-purple">Details</TabsTrigger>
                    <TabsTrigger value="amenities" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-groww-purple">Amenities</TabsTrigger>
                    <TabsTrigger value="location" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-groww-purple">Location</TabsTrigger>
                  </TabsList>
                  <TabsContent value="details" className="p-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm text-gray-500">Bedrooms</h3>
                        <p className="text-lg font-medium">{apartment.bedrooms}</p>
                      </div>
                      <div>
                        <h3 className="text-sm text-gray-500">Bathrooms</h3>
                        <p className="text-lg font-medium">{apartment.bathrooms}</p>
                      </div>
                      <div>
                        <h3 className="text-sm text-gray-500">Square Feet</h3>
                        <p className="text-lg font-medium">{apartment.sqft}</p>
                      </div>
                      <div>
                        <h3 className="text-sm text-gray-500">Available From</h3>
                        <p className="text-lg font-medium">{new Date(apartment.available).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="mt-6">
                      <h3 className="text-sm text-gray-500 mb-2">Description</h3>
                      <p className="text-gray-700">
                        This stunning {apartment.bedrooms}-bedroom apartment in {apartment.neighborhood} offers modern living 
                        with exceptional amenities. Featuring {apartment.bathrooms} beautiful bathrooms and {apartment.sqft} 
                        square feet of thoughtfully designed space, this residence provides both comfort and style.
                      </p>
                    </div>
                  </TabsContent>
                  <TabsContent value="amenities" className="p-6">
                    <div className="grid grid-cols-2 gap-4">
                      {apartment.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Check size={16} className="text-groww-purple" />
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="location" className="p-6">
                    <div className="bg-gray-200 h-[300px] rounded-lg flex items-center justify-center">
                      <p className="text-gray-500">Map view of {apartment.address}</p>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-sm font-medium mb-2">Nearby</h3>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">• 5 minutes to public transportation</p>
                        <p className="text-sm text-gray-600">• 10 minutes to grocery store</p>
                        <p className="text-sm text-gray-600">• 15 minutes to downtown</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            {/* Right column: Contact and schedule tour */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Interested in this property?</h3>
                    <Button 
                      className="w-full bg-groww-purple hover:bg-groww-purple-dark mb-3"
                      onClick={() => setShowContactDialog(true)}
                    >
                      Contact Broker
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full border-groww-purple text-groww-purple hover:bg-groww-soft-purple"
                      onClick={() => setShowTourDialog(true)}
                    >
                      <Calendar size={18} className="mr-2" /> Schedule Tour
                    </Button>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Match Highlights</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Check size={16} className="text-green-500" />
                        <span className="text-sm">Within your budget range</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Check size={16} className="text-green-500" />
                        <span className="text-sm">Has your required bedrooms</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Check size={16} className="text-green-500" />
                        <span className="text-sm">In your preferred neighborhood</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Check size={16} className="text-green-500" />
                        <span className="text-sm">Available within your timeframe</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Similar Properties</h3>
                  <div className="space-y-4">
                    {mockApartments.slice(0, 2).filter(apt => apt.id !== apartment.id).map(apt => (
                      <div key={apt.id} className="border rounded-lg p-3 hover:border-groww-purple transition-colors">
                        <Link to={`/apartments/${apt.id}`} className="flex space-x-3">
                          <div className="bg-gray-200 w-16 h-16 rounded"></div>
                          <div>
                            <h4 className="font-medium text-groww-dark line-clamp-1">{apt.name}</h4>
                            <p className="text-sm text-gray-600">{apt.neighborhood}</p>
                            <p className="text-sm font-medium text-groww-purple">${apt.price}/mo</p>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Contact dialog */}
      <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Broker</DialogTitle>
            <DialogDescription>
              Send a message to the listing broker about this property.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Your Name</label>
              <Input placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium">Your Email</label>
              <Input placeholder="Enter your email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium">Message</label>
              <Textarea placeholder="I'm interested in this property..." value={message} onChange={(e) => setMessage(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowContactDialog(false)}>Cancel</Button>
            <Button onClick={handleContactSubmit} className="bg-groww-purple hover:bg-groww-purple-dark">
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Tour dialog */}
      <Dialog open={showTourDialog} onOpenChange={setShowTourDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule a Tour</DialogTitle>
            <DialogDescription>
              Select a date and time to visit this property.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Your Name</label>
              <Input placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium">Your Email</label>
              <Input placeholder="Enter your email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium">Preferred Date & Time</label>
              <Input type="datetime-local" value={tourDate} onChange={(e) => setTourDate(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTourDialog(false)}>Cancel</Button>
            <Button onClick={handleTourSubmit} className="bg-groww-purple hover:bg-groww-purple-dark">
              Schedule Tour
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApartmentDetails;
