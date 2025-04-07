
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { api } from '@/utils/api';
import { useToast } from '@/components/ui/use-toast';
import { animations } from '@/utils/animations';
import gsap from 'gsap';

interface Apartment {
  _id: string;
  title: string;
  price: number;
  location: {
    address: string;
    city: string;
    state: string;
  };
  features: {
    bedrooms: number;
    bathrooms: number;
    squareFeet: number;
  };
  images: string[];
  amenities: string[];
}

const Favorites = () => {
  const [favorites, setFavorites] = useState<Apartment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    fetchFavorites();
    
    // Apply animation
    if (containerRef.current) {
      animations.fadeIn(containerRef.current, 0.3);
    }
  }, []);
  
  const fetchFavorites = async () => {
    try {
      setIsLoading(true);
      const data = await api.user.getFavorites();
      if (data) {
        setFavorites(data);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast({
        title: "Error",
        description: "Failed to load your favorite apartments",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRemoveFavorite = async (id: string) => {
    try {
      // Animate removal
      const card = document.querySelector(`[data-apartment-id="${id}"]`);
      if (card) {
        await gsap.to(card, {
          opacity: 0,
          x: 20,
          duration: 0.3
        });
      }
      
      await api.user.removeFavorite(id);
      
      setFavorites(favorites.filter(apt => apt._id !== id));
      
      toast({
        title: "Removed from favorites",
        description: "The apartment has been removed from your favorites",
      });
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast({
        title: "Error",
        description: "Failed to remove from favorites",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto" ref={containerRef}>
          <h1 className="text-3xl font-bold text-groww-dark mb-8">Your Favorite Apartments</h1>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-groww-purple"></div>
            </div>
          ) : favorites.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-border">
              <h2 className="text-xl font-semibold mb-4">No Favorites Yet</h2>
              <p className="text-gray-600 mb-6">
                You haven't saved any apartments to your favorites list yet.
              </p>
              <Link to="/results">
                <Button className="bg-groww-purple hover:bg-groww-purple-dark">
                  Browse Apartments
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map(apartment => (
                <div 
                  key={apartment._id} 
                  data-apartment-id={apartment._id}
                  className="bg-white rounded-lg overflow-hidden shadow-md border border-border transition-all hover:shadow-lg"
                >
                  <div className="h-48 bg-gray-200 relative overflow-hidden">
                    {apartment.images && apartment.images.length > 0 ? (
                      <img 
                        src={apartment.images[0].startsWith('http') ? apartment.images[0] : `/uploads/${apartment.images[0]}`} 
                        alt={apartment.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        No Image Available
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-semibold text-lg text-groww-dark">{apartment.title}</h3>
                      <span className="font-bold text-groww-purple">${apartment.price}/mo</span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-2">
                      {apartment.location.city}, {apartment.location.state}
                    </p>
                    
                    <div className="text-sm text-gray-600 mb-3">
                      {apartment.features.bedrooms} bd • {apartment.features.bathrooms} ba • {apartment.features.squareFeet} sqft
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {apartment.amenities.slice(0, 3).map((amenity, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-groww-soft-purple text-groww-purple-dark rounded-full text-xs">
                          {amenity}
                        </span>
                      ))}
                      {apartment.amenities.length > 3 && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                          +{apartment.amenities.length - 3} more
                        </span>
                      )}
                    </div>
                    
                    <div className="flex justify-between mt-2">
                      <Link to={`/apartments/${apartment._id}`}>
                        <Button variant="outline">View Details</Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        onClick={() => handleRemoveFavorite(apartment._id)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Favorites;
