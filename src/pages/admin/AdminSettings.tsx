
import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import AdminLayout from '@/components/admin/AdminLayout';
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
  AlertTriangle,
  Settings,
  BellRing,
  ShieldAlert,
  Lock,
  Mail,
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const AdminSettings = () => {
  const { toast } = useToast();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Get system settings
  const { data: settings, isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: api.admin.getSystemSettings,
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

  // Update system settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: api.admin.updateSystemSettings,
    onSuccess: () => {
      toast({
        title: "Settings Updated",
        description: "System settings have been updated successfully.",
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
  
  const handleToggleSetting = (key: string, value: boolean) => {
    updateSettingsMutation.mutate({
      [key]: value,
    });
  };
  
  return (
    <AdminLayout>
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
          <TabsTrigger value="security" className="flex items-center">
            <ShieldAlert size={16} className="mr-2" /> Security
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center">
            <Lock size={16} className="mr-2" /> System
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="account">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>Change your admin account password</CardDescription>
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
          </div>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>Manage your email notification preferences</CardDescription>
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
                      <h3 className="font-medium">New Broker Applications</h3>
                      <p className="text-sm text-gray-500">Receive notifications when a new broker applies</p>
                    </div>
                    <Switch 
                      checked={settings?.notifications?.newBrokerApplications || false} 
                      onCheckedChange={(checked) => handleToggleSetting('notifications.newBrokerApplications', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <h3 className="font-medium">Listing Approvals</h3>
                      <p className="text-sm text-gray-500">Receive notifications when listings need approval</p>
                    </div>
                    <Switch 
                      checked={settings?.notifications?.listingApprovals || false} 
                      onCheckedChange={(checked) => handleToggleSetting('notifications.listingApprovals', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <h3 className="font-medium">User Reports</h3>
                      <p className="text-sm text-gray-500">Receive notifications about user reports</p>
                    </div>
                    <Switch 
                      checked={settings?.notifications?.userReports || false} 
                      onCheckedChange={(checked) => handleToggleSetting('notifications.userReports', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <h3 className="font-medium">Weekly Statistics</h3>
                      <p className="text-sm text-gray-500">Receive weekly statistics about the platform</p>
                    </div>
                    <Switch 
                      checked={settings?.notifications?.weeklyStats || false} 
                      onCheckedChange={(checked) => handleToggleSetting('notifications.weeklyStats', checked)}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>Add an extra layer of security to your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Enable Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-500">Require a verification code when you sign in</p>
                  </div>
                  <Switch 
                    checked={settings?.security?.twoFactorEnabled || false} 
                    onCheckedChange={(checked) => handleToggleSetting('security.twoFactorEnabled', checked)}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Session Management</CardTitle>
                <CardDescription>Manage your active sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Auto Logout</h3>
                      <p className="text-sm text-gray-500">Automatically log out after a period of inactivity</p>
                    </div>
                    <Switch 
                      checked={settings?.security?.autoLogout || false}
                      onCheckedChange={(checked) => handleToggleSetting('security.autoLogout', checked)}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline">Sign Out of All Devices</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Login History</CardTitle>
                <CardDescription>Review your recent login activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isLoading ? (
                    <div className="flex justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-groww-purple"></div>
                    </div>
                  ) : (
                    settings?.security?.loginHistory?.map((login: any, index: number) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                        <div>
                          <p className="font-medium">{login.device}</p>
                          <p className="text-sm text-gray-500">{login.location}</p>
                        </div>
                        <p className="text-sm text-gray-500">{new Date(login.time).toLocaleString()}</p>
                      </div>
                    )) || (
                      <p className="text-gray-500 text-center py-4">No login history available</p>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="system">
          <div className="grid gap-6">
            <Alert variant="warning">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>
                These settings affect the entire platform. Make changes with caution.
              </AlertDescription>
            </Alert>
            
            <Card>
              <CardHeader>
                <CardTitle>Registration Settings</CardTitle>
                <CardDescription>Control user registration options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Enable User Registration</h3>
                    <p className="text-sm text-gray-500">Allow new users to register on the platform</p>
                  </div>
                  <Switch 
                    checked={settings?.system?.enableUserRegistration || false}
                    onCheckedChange={(checked) => handleToggleSetting('system.enableUserRegistration', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Enable Broker Registration</h3>
                    <p className="text-sm text-gray-500">Allow new brokers to apply for registration</p>
                  </div>
                  <Switch 
                    checked={settings?.system?.enableBrokerRegistration || false}
                    onCheckedChange={(checked) => handleToggleSetting('system.enableBrokerRegistration', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Email Verification Required</h3>
                    <p className="text-sm text-gray-500">Require email verification for new accounts</p>
                  </div>
                  <Switch 
                    checked={settings?.system?.requireEmailVerification || false}
                    onCheckedChange={(checked) => handleToggleSetting('system.requireEmailVerification', checked)}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Email Settings</CardTitle>
                <CardDescription>Configure system email settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="senderEmail">Sender Email</Label>
                  <div className="flex items-center">
                    <Mail className="mr-2 h-4 w-4 text-gray-500" />
                    <Input 
                      id="senderEmail" 
                      value={settings?.system?.senderEmail || "noreply@aptmatchbuddy.com"} 
                      readOnly 
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline">Configure Email Templates</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default AdminSettings;
