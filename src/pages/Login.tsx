
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = (role: string) => {
    // In a real app, this would authenticate with a backend
    if (email && password) {
      console.log(`Logging in as ${role}:`, { email, password });
      
      toast({
        title: "Login Successful",
        description: `You've logged in as a ${role}.`,
      });

      // Redirect based on role
      if (role === 'broker') {
        navigate('/broker');
      } else if (role === 'admin') {
        navigate('/admin');
      }
    } else {
      toast({
        title: "Login Failed",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center bg-gray-50 py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-groww-dark">Sign In</CardTitle>
            <CardDescription className="text-center">Sign in to your AptMatchBuddy account</CardDescription>
          </CardHeader>
          <Tabs defaultValue="broker" className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="broker">Broker</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
            </TabsList>
            
            <TabsContent value="broker">
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="broker-email">Email</Label>
                  <Input 
                    id="broker-email" 
                    type="email" 
                    placeholder="broker@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="broker-password">Password</Label>
                  <Input 
                    id="broker-password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-groww-purple hover:bg-groww-purple-dark"
                  onClick={() => handleLogin('broker')}
                >
                  Sign In as Broker
                </Button>
              </CardFooter>
            </TabsContent>
            
            <TabsContent value="admin">
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Email</Label>
                  <Input 
                    id="admin-email" 
                    type="email" 
                    placeholder="admin@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Password</Label>
                  <Input 
                    id="admin-password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-groww-purple hover:bg-groww-purple-dark"
                  onClick={() => handleLogin('admin')}
                >
                  Sign In as Admin
                </Button>
              </CardFooter>
            </TabsContent>
          </Tabs>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
