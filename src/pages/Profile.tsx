
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CheckCircle, Edit, Key, User } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import gsap from 'gsap';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Initialize animation timeline
    const tl = gsap.timeline();
    
    // Animate the container
    tl.fromTo(
      containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
    );
    
    // Animate cards with stagger
    tl.fromTo(
      '.animate-card',
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.8, 
        stagger: 0.15, 
        ease: "back.out(1.7)" 
      },
      "-=0.2"
    );
  }, []);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully.",
      });
      setIsEditing(false);
      setIsLoading(false);
    }, 1000);
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your new passwords match.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully.",
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIsLoading(false);
    }, 1000);
  };

  const userInitials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-12">
        <div ref={containerRef} className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
            <div className="flex items-center">
              <Avatar className="h-20 w-20 mr-4 border-2 border-groww-soft-purple">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="bg-groww-purple text-white text-lg">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-groww-dark">{user?.name}</h1>
                <p className="text-gray-600">{user?.email}</p>
                {user?.role === 'broker' && (
                  <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    <CheckCircle className="mr-1 h-3 w-3" /> Verified Broker
                  </span>
                )}
              </div>
            </div>
            <Button 
              onClick={() => setIsEditing(!isEditing)}
              className="mt-4 md:mt-0 bg-groww-purple hover:bg-groww-purple-dark"
            >
              <Edit className="mr-2 h-4 w-4" /> {isEditing ? 'Cancel Edit' : 'Edit Profile'}
            </Button>
          </div>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="profile" className="flex items-center">
                <User className="mr-2 h-4 w-4" /> Profile
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center">
                <Key className="mr-2 h-4 w-4" /> Security
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card className="animate-card">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    {isEditing ? 'Edit your personal information below' : 'Your personal information'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your full name"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Your email"
                            disabled
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Your phone number"
                          />
                        </div>
                        
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea
                            id="bio"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Tell us about yourself"
                            className="h-24"
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button 
                          type="submit" 
                          className="bg-groww-purple hover:bg-groww-purple-dark"
                          disabled={isLoading}
                        >
                          {isLoading ? 'Saving...' : 'Save Changes'}
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                        <p className="mt-1">{name || 'Not provided'}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
                        <p className="mt-1">{email}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
                        <p className="mt-1">{phone || 'Not provided'}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Bio</h3>
                        <p className="mt-1">{bio || 'No bio provided'}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {user?.role === 'user' && (
                <Card className="mt-6 animate-card">
                  <CardHeader>
                    <CardTitle>Apartment Preferences</CardTitle>
                    <CardDescription>
                      Your saved preferences for apartment hunting
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Budget Range</h3>
                        <p className="mt-1">$1,200 - $2,500 / month</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Preferred Neighborhoods</h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <span className="px-2 py-1 bg-groww-soft-purple text-groww-purple text-xs rounded">Downtown</span>
                          <span className="px-2 py-1 bg-groww-soft-purple text-groww-purple text-xs rounded">Midtown</span>
                          <span className="px-2 py-1 bg-groww-soft-purple text-groww-purple text-xs rounded">West End</span>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Must-Have Amenities</h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <span className="px-2 py-1 bg-groww-soft-purple text-groww-purple text-xs rounded">In-unit Washer/Dryer</span>
                          <span className="px-2 py-1 bg-groww-soft-purple text-groww-purple text-xs rounded">Gym</span>
                          <span className="px-2 py-1 bg-groww-soft-purple text-groww-purple text-xs rounded">Parking</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <Button variant="outline" className="mt-2">
                        Update Preferences
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="security">
              <Card className="animate-card">
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Update your password to keep your account secure
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordUpdate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input
                        id="current-password"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input
                        id="new-password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        type="submit" 
                        className="bg-groww-purple hover:bg-groww-purple-dark"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Updating...' : 'Update Password'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
              
              <Card className="mt-6 animate-card">
                <CardHeader>
                  <CardTitle>Account Security</CardTitle>
                  <CardDescription>
                    Manage your account security settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Two-Factor Authentication</h3>
                        <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                      </div>
                      <Button variant="outline">Enable</Button>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Login History</h3>
                        <p className="text-sm text-gray-500">View your recent login activity</p>
                      </div>
                      <Button variant="outline">View History</Button>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Delete Account</h3>
                        <p className="text-sm text-gray-500">Permanently delete your account and all data</p>
                      </div>
                      <Button variant="destructive">Delete Account</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
