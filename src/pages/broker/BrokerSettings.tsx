
import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import BrokerLayout from '@/components/broker/BrokerLayout';
import { useToast } from '@/components/ui/use-toast';
import { api } from '@/utils/api';
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
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Settings,
  BellRing,
  Lock,
  Mail,
  FileEdit,
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const BrokerSettings = () => {
  const { toast } = useToast();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Get broker settings
  const { data: settings, isLoading } = useQuery({
    queryKey: ['broker-settings'],
    queryFn: api.broker.getBrokerSettings,
  });

  // Update password mutation
  const updatePasswordMutation = useMutation({
    mutationFn: api.auth.updatePassword,
    onSuccess: () => {
      toast({
        title: "Password Updated",
        description: "Your password has been successfully changed.",
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update password. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Update broker settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: api.broker.updateBrokerSettings,
    onSuccess: () => {
      toast({
        title: "Settings Updated",
        description: "Your settings have been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirmation do not match.",
        variant: "destructive",
      });
      return;
    }
    
    updatePasswordMutation.mutate({
      currentPassword,
      newPassword,
    });
  };
  
  const handleToggleSetting = (key: string, value: boolean | string) => {
    updateSettingsMutation.mutate({
      [key]: value,
    });
  };
  
  return (
    <BrokerLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-groww-dark">Settings</h1>
      </div>
      
      <Tabs defaultValue="account">
        <TabsList className="mb-6">
          <TabsTrigger value="account" className="flex items-center">
            <Settings size={16} className="mr-2" /> Account
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center">
            <BellRing size={16} className="mr-2" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="listing" className="flex items-center">
            <FileEdit size={16} className="mr-2" /> Listing Preferences
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="account">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>Change your account password</CardDescription>
              </CardHeader>
              <form onSubmit={handlePasswordSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    disabled={updatePasswordMutation.isPending}
                  >
                    {updatePasswordMutation.isPending ? "Updating..." : "Update Password"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>How clients can reach you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="preferredContact">Preferred Contact Method</Label>
                  <Select 
                    value={settings?.preferredContact || 'email'}
                    onValueChange={(value) => handleToggleSetting('preferredContact', value)}
                  >
                    <SelectTrigger id="preferredContact">
                      <SelectValue placeholder="Select preferred contact method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Phone</SelectItem>
                      <SelectItem value="both">Both Email and Phone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="displayPhone">Display Phone Number Publicly</Label>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="displayPhone"
                      checked={settings?.displayPhone || false}
                      onCheckedChange={(checked) => handleToggleSetting('displayPhone', checked)}
                    />
                    <Label htmlFor="displayPhone">
                      {settings?.displayPhone ? 'Yes' : 'No'}
                    </Label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="displayEmail">Display Email Publicly</Label>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="displayEmail"
                      checked={settings?.displayEmail || false}
                      onCheckedChange={(checked) => handleToggleSetting('displayEmail', checked)}
                    />
                    <Label htmlFor="displayEmail">
                      {settings?.displayEmail ? 'Yes' : 'No'}
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>Manage your notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-groww-purple"></div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <h3 className="font-medium">New Inquiries</h3>
                      <p className="text-sm text-gray-500">Receive notifications when someone inquires about your listing</p>
                    </div>
                    <Switch 
                      checked={settings?.notifications?.newInquiries || false} 
                      onCheckedChange={(checked) => handleToggleSetting('notifications.newInquiries', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <h3 className="font-medium">Listing Status Updates</h3>
                      <p className="text-sm text-gray-500">Receive notifications when your listing status changes</p>
                    </div>
                    <Switch 
                      checked={settings?.notifications?.listingUpdates || false} 
                      onCheckedChange={(checked) => handleToggleSetting('notifications.listingUpdates', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <h3 className="font-medium">Client Messages</h3>
                      <p className="text-sm text-gray-500">Receive notifications when clients message you</p>
                    </div>
                    <Switch 
                      checked={settings?.notifications?.clientMessages || false} 
                      onCheckedChange={(checked) => handleToggleSetting('notifications.clientMessages', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <h3 className="font-medium">Platform Updates</h3>
                      <p className="text-sm text-gray-500">Receive notifications about platform updates and news</p>
                    </div>
                    <Switch 
                      checked={settings?.notifications?.platformUpdates || false} 
                      onCheckedChange={(checked) => handleToggleSetting('notifications.platformUpdates', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <h3 className="font-medium">Weekly Activity Report</h3>
                      <p className="text-sm text-gray-500">Receive a weekly report of your account activity</p>
                    </div>
                    <Switch 
                      checked={settings?.notifications?.weeklyReport || false} 
                      onCheckedChange={(checked) => handleToggleSetting('notifications.weeklyReport', checked)}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="listing">
          <Card>
            <CardHeader>
              <CardTitle>Default Listing Settings</CardTitle>
              <CardDescription>Configure default settings for your listings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <h3 className="font-medium">Show Exact Address</h3>
                  <p className="text-sm text-gray-500">Display the exact address of your listings to users</p>
                </div>
                <Switch 
                  checked={settings?.listing?.showExactAddress || false} 
                  onCheckedChange={(checked) => handleToggleSetting('listing.showExactAddress', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div>
                  <h3 className="font-medium">Allow Contact Outside Platform</h3>
                  <p className="text-sm text-gray-500">Allow users to contact you directly outside the platform</p>
                </div>
                <Switch 
                  checked={settings?.listing?.allowDirectContact || false} 
                  onCheckedChange={(checked) => handleToggleSetting('listing.allowDirectContact', checked)}
                />
              </div>
              
              <div className="space-y-2 py-2">
                <Label htmlFor="defaultAvailability">Default Availability Window</Label>
                <Select 
                  value={settings?.listing?.defaultAvailability || 'immediate'}
                  onValueChange={(value) => handleToggleSetting('listing.defaultAvailability', value)}
                >
                  <SelectTrigger id="defaultAvailability">
                    <SelectValue placeholder="Select default availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate</SelectItem>
                    <SelectItem value="1month">Within 1 Month</SelectItem>
                    <SelectItem value="3months">Within 3 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2 py-2">
                <Label htmlFor="defaultLeaseTerms">Default Lease Terms</Label>
                <Select 
                  value={settings?.listing?.defaultLeaseTerms || '12months'}
                  onValueChange={(value) => handleToggleSetting('listing.defaultLeaseTerms', value)}
                >
                  <SelectTrigger id="defaultLeaseTerms">
                    <SelectValue placeholder="Select default lease terms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6months">6 Months</SelectItem>
                    <SelectItem value="12months">12 Months</SelectItem>
                    <SelectItem value="flexible">Flexible</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>Control how your information is shared</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <h3 className="font-medium">Show Company Information</h3>
                  <p className="text-sm text-gray-500">Display your company information on your listings</p>
                </div>
                <Switch 
                  checked={settings?.privacy?.showCompanyInfo || false} 
                  onCheckedChange={(checked) => handleToggleSetting('privacy.showCompanyInfo', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div>
                  <h3 className="font-medium">Display Profile Photo</h3>
                  <p className="text-sm text-gray-500">Show your profile photo to users</p>
                </div>
                <Switch 
                  checked={settings?.privacy?.showProfilePhoto || false} 
                  onCheckedChange={(checked) => handleToggleSetting('privacy.showProfilePhoto', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </BrokerLayout>
  );
};

export default BrokerSettings;
