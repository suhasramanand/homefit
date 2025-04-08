import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, MapPin, Save, Upload } from 'lucide-react';
import gsap from 'gsap';

const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const { toast } = useToast();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.title = 'Profile - AptMatchBuddy';
    
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
    
    // Animate profile page entry
    gsap.fromTo(
      '.profile-content',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
    );
    
    gsap.fromTo(
      '.profile-header',
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', delay: 0.2 }
    );
    
    gsap.fromTo(
      '.profile-card',
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out', delay: 0.3 }
    );
  }, [user]);
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setAvatarPreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('name', name);
      
      if (location) {
        formData.append('location', location);
      }
      
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }
      
      await updateUserProfile(formData);
      
      toast({
        title: 'Profile updated',
        description: 'Your profile information has been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Update failed',
        description: 'There was an error updating your profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          <div className="profile-header mb-8">
            <h1 className="text-3xl font-bold text-center text-groww-dark">Your Profile</h1>
            <p className="text-center text-gray-600 mt-2">
              Update your personal information and preferences
            </p>
          </div>
          
          <div className="profile-content max-w-4xl mx-auto">
            <Tabs defaultValue="account" className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto mb-8 grid-cols-2">
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
              </TabsList>
              
              <TabsContent value="account">
                <Card className="profile-card">
                  <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>
                      Update your account details and how others see you on the site
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit}>
                      <div className="space-y-6">
                        {/* Avatar Upload Section */}
                        <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
                          <Avatar className="w-24 h-24 border-2 border-gray-200">
                            <AvatarImage 
                              src={avatarPreview || (user?.avatar ? `http://localhost:5000${user.avatar}` : undefined)} 
                              alt={user?.name} 
                            />
                            <AvatarFallback className="bg-groww-purple text-white text-2xl">
                              {user?.name?.charAt(0) || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex flex-col space-y-2">
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleAvatarChange}
                            />
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={triggerFileInput}
                            >
                              <Upload size={16} className="mr-2" />
                              Change Photo
                            </Button>
                            <p className="text-xs text-gray-500">
                              JPG, PNG or GIF. 2MB max.
                            </p>
                          </div>
                        </div>
                        
                        <div className="grid gap-6 pt-4">
                          <div className="grid gap-3">
                            <Label htmlFor="name" className="flex items-center gap-2">
                              <User size={16} /> Full Name
                            </Label>
                            <Input
                              id="name"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="Your full name"
                            />
                          </div>
                          
                          <div className="grid gap-3">
                            <Label htmlFor="email" className="flex items-center gap-2">
                              <Mail size={16} /> Email
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              value={email}
                              disabled
                              className="bg-gray-50"
                            />
                            <p className="text-xs text-gray-500">
                              Your email address cannot be changed
                            </p>
                          </div>
                          
                          <div className="grid gap-3">
                            <Label htmlFor="location" className="flex items-center gap-2">
                              <MapPin size={16} /> Location
                            </Label>
                            <Input
                              id="location"
                              value={location}
                              onChange={(e) => setLocation(e.target.value)}
                              placeholder="City, State"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-8">
                        <Button type="submit" className="w-full" disabled={isLoading}>
                          {isLoading ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save size={16} className="mr-2" />
                              Save Changes
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="preferences">
                <Card className="profile-card">
                  <CardHeader>
                    <CardTitle>Apartment Preferences</CardTitle>
                    <CardDescription>
                      Set your apartment preferences to get better matches
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center py-8 text-gray-500">
                      Your apartment preferences can be updated through the questionnaire.
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-center">
                    <Button
                      variant="outline"
                      onClick={() => window.location.href = '/questionnaire'}
                    >
                      Update Preferences
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
