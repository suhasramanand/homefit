
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Search, Trash2, X } from 'lucide-react';
import { mockApartments } from '@/utils/mockData';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import gsap from 'gsap';

const Favorites = () => {
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  
  // Simulated favorites - in a real app, this would come from an API
  const favorites = mockApartments.slice(0, 5);
  const savedSearches = [
    { id: 1, name: "Downtown 2BR under $2000", criteria: "Downtown, 2 beds, max $2000" },
    { id: 2, name: "Midtown with Parking", criteria: "Midtown, Parking, In-unit W/D" },
    { id: 3, name: "Pet-friendly Studios", criteria: "Any location, Studio, Pet Friendly" }
  ];

  useEffect(() => {
    // GSAP animations
    const tl = gsap.timeline();
    
    // Header animation
    tl.fromTo(
      containerRef.current,
      { opacity: 0, y: -30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    );
    
    // Animate tab content
    tl.fromTo(
      '.tab-content',
      { opacity: 0 },
      { opacity: 1, duration: 0.6, ease: "power2.out" },
      "-=0.4"
    );
    
    // Staggered animation for cards
    tl.fromTo(
      '.favorite-card',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: "back.out(1.7)" },
      "-=0.2"
    );
  }, []);

  const handleRemoveFavorite = (id: string) => {
    toast({
      title: "Removed from Favorites",
      description: "This apartment has been removed from your favorites."
    });
  };

  const handleRemoveSavedSearch = (id: number) => {
    toast({
      title: "Search Removed",
      description: "Your saved search has been removed."
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={containerRef} className="mb-8">
            <h1 className="text-3xl font-bold text-groww-dark flex items-center">
              <Heart className="mr-3 text-groww-purple" /> My Favorites
            </h1>
            <p className="text-gray-600 mt-2">
              Keep track of apartments you're interested in and your saved searches
            </p>
          </div>

          <Tabs defaultValue="apartments" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="apartments">Favorite Apartments</TabsTrigger>
              <TabsTrigger value="searches">Saved Searches</TabsTrigger>
            </TabsList>
            
            <TabsContent value="apartments" className="tab-content">
              <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.length > 0 ? (
                  favorites.map((apartment) => (
                    <Card key={apartment.id} className="overflow-hidden favorite-card">
                      <div className="relative h-48 bg-gray-200">
                        <img 
                          src={`https://source.unsplash.com/random/400x300/?apartment&${apartment.id}`} 
                          alt={apartment.name} 
                          className="w-full h-full object-cover"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full"
                          onClick={() => handleRemoveFavorite(apartment.id)}
                        >
                          <X className="h-4 w-4 text-gray-800" />
                        </Button>
                      </div>
                      <CardContent className="p-4">
                        <Link to={`/apartments/${apartment.id}`} className="block">
                          <h3 className="font-semibold text-lg hover:text-groww-purple transition-colors">
                            {apartment.name}
                          </h3>
                        </Link>
                        <p className="text-gray-500 text-sm">{apartment.neighborhood}</p>
                        <p className="font-medium text-groww-purple mt-1">${apartment.price}/mo</p>
                        <div className="mt-3 flex justify-between items-center">
                          <span className="text-sm text-gray-500">
                            {apartment.bedrooms} bd • {apartment.bathrooms} ba • {apartment.sqft} sqft
                          </span>
                        </div>
                        <div className="mt-3">
                          <Button 
                            variant="secondary" 
                            size="sm" 
                            className="w-full"
                            asChild
                          >
                            <Link to={`/apartments/${apartment.id}`}>View Details</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12 bg-white rounded-lg shadow-sm">
                    <Heart className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                    <h3 className="text-xl font-medium text-gray-700 mb-1">No Favorites Yet</h3>
                    <p className="text-gray-500 mb-4">
                      You haven't added any apartments to your favorites
                    </p>
                    <Button asChild className="bg-groww-purple hover:bg-groww-purple-dark">
                      <Link to="/results">Browse Apartments</Link>
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="searches" className="tab-content">
              <div className="bg-white rounded-lg shadow-sm p-6">
                {savedSearches.length > 0 ? (
                  <div className="divide-y">
                    {savedSearches.map((search) => (
                      <div key={search.id} className="py-4 first:pt-0 last:pb-0 favorite-card">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center">
                              <Search className="h-4 w-4 text-groww-purple mr-2" />
                              <h3 className="font-medium">{search.name}</h3>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">{search.criteria}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              asChild
                            >
                              <Link to="/results">View Results</Link>
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleRemoveSavedSearch(search.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <Search className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                    <h3 className="text-xl font-medium text-gray-700 mb-1">No Saved Searches</h3>
                    <p className="text-gray-500 mb-4">
                      Save your search criteria to get notified about new listings
                    </p>
                    <Button asChild className="bg-groww-purple hover:bg-groww-purple-dark">
                      <Link to="/questionnaire">Create New Search</Link>
                    </Button>
                  </div>
                )}
                
                {savedSearches.length > 0 && (
                  <div className="mt-6 pt-6 border-t">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Email Notifications</h4>
                        <p className="text-sm text-gray-500">Get notified when new apartments match your searches</p>
                      </div>
                      <div className="flex items-center">
                        <Input 
                          type="email" 
                          placeholder="Your email address" 
                          className="mr-2"
                          defaultValue="user@example.com"
                        />
                        <Button className="bg-groww-purple hover:bg-groww-purple-dark">
                          Save
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Favorites;
