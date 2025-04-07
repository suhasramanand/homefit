
import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { api } from '@/utils/api';
import { animations } from '@/utils/animations';
import gsap from 'gsap';

interface UserPreferences {
  budget: {
    min: number;
    max: number;
  };
  location: string[];
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
}

interface UserProfile {
  name: string;
  email: string;
  preferences: UserPreferences;
}

const Profile = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  
  const profileRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Apply entrance animation
    if (profileRef.current) {
      animations.fadeIn(profileRef.current, 0.3);
    }
    
    fetchUserProfile();
  }, []);
  
  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const data = await api.user.getProfile();
      if (data) {
        setProfile(data);
        setName(data.name);
        setEmail(data.email);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load your profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      const updatedProfile = await api.user.updateProfile({ name, email });
      
      if (updatedProfile) {
        // Animate the card to indicate success
        const card = document.querySelector('.profile-card');
        gsap.fromTo(
          card,
          { borderColor: '#4ade80' },
          { borderColor: 'rgb(226, 232, 240)', duration: 1.5 }
        );
        
        setProfile(updatedProfile);
        toast({
          title: "Profile Updated",
          description: "Your profile has been successfully updated.",
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update your profile",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleLogout = () => {
    // Animate before logout
    const content = document.querySelector('.profile-content');
    gsap.to(content, {
      opacity: 0,
      y: -20,
      duration: 0.3,
      onComplete: logout
    });
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex justify-center items-center h-[calc(100vh-200px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-groww-purple"></div>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div ref={profileRef} className="flex-grow container mx-auto py-8 px-4 sm:px-6 lg:px-8 profile-content">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-groww-dark mb-8">Your Profile</h1>
          
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid grid-cols-2 mb-8">
              <TabsTrigger value="info">Personal Information</TabsTrigger>
              <TabsTrigger value="preferences">Apartment Preferences</TabsTrigger>
            </TabsList>
            
            <TabsContent value="info">
              <Card className="profile-card">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">Email</label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="flex justify-between items-center pt-4">
                      <Button
                        type="submit"
                        disabled={isUpdating}
                        className="bg-groww-purple hover:bg-groww-purple-dark"
                      >
                        {isUpdating ? 'Saving...' : 'Save Changes'}
                      </Button>
                      
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleLogout}
                      >
                        Logout
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle>Apartment Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                  {profile && profile.preferences ? (
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium mb-2">Budget Range</h3>
                        <p>
                          ${profile.preferences.budget?.min || 0} - ${profile.preferences.budget?.max || 0}
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2">Preferred Locations</h3>
                        <div className="flex flex-wrap gap-2">
                          {profile.preferences.location?.map((loc, index) => (
                            <span key={index} className="px-2 py-1 bg-groww-soft-purple text-groww-purple rounded-full text-sm">
                              {loc}
                            </span>
                          )) || <p>No preferred locations set</p>}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2">Layout</h3>
                        <p>{profile.preferences.bedrooms || 0} Bedrooms, {profile.preferences.bathrooms || 0} Bathrooms</p>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2">Desired Amenities</h3>
                        <div className="flex flex-wrap gap-2">
                          {profile.preferences.amenities?.map((amenity, index) => (
                            <span key={index} className="px-2 py-1 bg-groww-soft-purple text-groww-purple rounded-full text-sm">
                              {amenity}
                            </span>
                          )) || <p>No amenities set</p>}
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => {
                          toast({
                            title: "Update your preferences",
                            description: "Complete the questionnaire again to update your preferences",
                          });
                        }}
                        className="mt-4 bg-groww-purple hover:bg-groww-purple-dark"
                      >
                        Update Preferences
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="mb-4">You haven't set your apartment preferences yet.</p>
                      <Button 
                        onClick={() => {
                          window.location.href = '/questionnaire';
                        }}
                        className="bg-groww-purple hover:bg-groww-purple-dark"
                      >
                        Complete Questionnaire
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Profile;
