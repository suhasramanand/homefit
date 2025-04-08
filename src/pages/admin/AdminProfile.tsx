
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from '@/components/admin/AdminLayout';
import { api } from '@/utils/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserCircle, Mail, Phone, CalendarDays, Shield } from 'lucide-react';

const AdminProfile = () => {
  const { user, updateUserProfile } = useAuth();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { data: adminStats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: api.admin.getAdminStats,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      if (phone) formData.append('phone', phone);
      if (avatar) formData.append('avatar', avatar);

      await updateUserProfile(formData);
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated',
      });
      setEditing(false);
    } catch (error) {
      toast({
        title: 'Update failed',
        description: 'There was an error updating your profile',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(e.target.files[0]);
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-groww-dark">Admin Profile</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Manage your account details</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {!editing ? (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={user?.avatar || ''} />
                        <AvatarFallback className="bg-groww-purple text-white text-xl">
                          {user?.name?.charAt(0).toUpperCase() || 'A'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="text-2xl font-bold">{user?.name}</h2>
                        <p className="text-gray-500 flex items-center">
                          <Shield size={16} className="mr-1 text-groww-purple" /> 
                          Administrator
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500 flex items-center">
                          <Mail size={14} className="mr-1" /> Email Address
                        </p>
                        <p className="font-medium">{user?.email}</p>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500 flex items-center">
                          <Phone size={14} className="mr-1" /> Phone Number
                        </p>
                        <p className="font-medium">{user?.phone || 'Not provided'}</p>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500 flex items-center">
                          <UserCircle size={14} className="mr-1" /> Account ID
                        </p>
                        <p className="font-medium">{user?.id}</p>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500 flex items-center">
                          <CalendarDays size={14} className="mr-1" /> Account Created
                        </p>
                        <p className="font-medium">
                          {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="relative h-20 w-20">
                        <Avatar className="h-20 w-20">
                          {avatar ? (
                            <AvatarImage src={URL.createObjectURL(avatar)} />
                          ) : (
                            <>
                              <AvatarImage src={user?.avatar || ''} />
                              <AvatarFallback className="bg-groww-purple text-white text-xl">
                                {user?.name?.charAt(0).toUpperCase() || 'A'}
                              </AvatarFallback>
                            </>
                          )}
                        </Avatar>
                        <label 
                          htmlFor="avatar-upload" 
                          className="absolute bottom-0 right-0 bg-gray-800 bg-opacity-70 text-white p-1 rounded-full cursor-pointer"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </label>
                        <input 
                          id="avatar-upload" 
                          type="file" 
                          accept="image/*" 
                          className="sr-only" 
                          onChange={handleFileChange} 
                        />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Upload a new profile picture</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input 
                        id="name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        type="tel" 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)} 
                      />
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                {editing ? (
                  <>
                    <Button type="button" variant="outline" onClick={() => setEditing(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </>
                      ) : "Save Changes"}
                    </Button>
                  </>
                ) : (
                  <Button type="button" onClick={() => setEditing(true)}>
                    Edit Profile
                  </Button>
                )}
              </CardFooter>
            </form>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Account Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="font-medium">Administrator</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Status</p>
                  <div className="flex items-center">
                    <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                    <p className="font-medium">Active</p>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Last Login</p>
                  <p className="font-medium">
                    {user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Unknown'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Platform Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Total Users</p>
                  <p className="font-medium">{adminStats?.userCount || '-'}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Active Brokers</p>
                  <p className="font-medium">{adminStats?.brokerCount || '-'}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Listed Apartments</p>
                  <p className="font-medium">{adminStats?.apartmentCount || '-'}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Pending Approvals</p>
                  <p className="font-medium">{adminStats?.pendingBrokers || '-'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProfile;
