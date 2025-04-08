import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { animations } from '@/utils/animations';
import gsap from 'gsap';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [role, setRole] = useState('user');
  
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const formRef = useRef<HTMLDivElement>(null);
  
  // Get role from URL if provided
  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam && ['user', 'broker', 'admin'].includes(roleParam)) {
      setRole(roleParam);
    }
    
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate('/');
    }
    
    // Apply animation
    if (formRef.current) {
      animations.popIn(formRef.current, 0.2);
    }
    
    // Background animation
    const timeline = gsap.timeline();
    timeline.fromTo('.bg-circles .circle', 
      { scale: 0, opacity: 0 },
      { 
        scale: 1, 
        opacity: 0.7, 
        stagger: 0.2, 
        duration: 1.5, 
        ease: 'elastic.out(1, 0.5)' 
      }
    );
  }, [isAuthenticated, navigate, searchParams]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await login(email, password);
      if (success) {
        toast({
          title: "Login successful!",
          description: "You have been logged in.",
        });
        
        // Redirect based on role
        switch (role) {
          case 'broker':
            navigate('/broker');
            break;
          case 'admin':
            navigate('/admin');
            break;
          default:
            navigate('/');
        }
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Background animation */}
      <div className="bg-circles fixed inset-0 -z-10 overflow-hidden">
        <div className="circle absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-groww-soft-purple opacity-20"></div>
        <div className="circle absolute top-3/4 right-1/4 w-80 h-80 rounded-full bg-groww-light-purple opacity-20"></div>
        <div className="circle absolute bottom-1/4 left-1/3 w-48 h-48 rounded-full bg-groww-purple opacity-10"></div>
      </div>
      
      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <div ref={formRef} className="w-full max-w-md">
          <Card className="shadow-lg">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
              <CardDescription className="text-center">
                Log in to your AptMatchBuddy account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={role} onValueChange={setRole} className="mb-6">
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="user">User</TabsTrigger>
                  <TabsTrigger value="broker">Broker</TabsTrigger>
                  <TabsTrigger value="admin">Admin</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                    {error}
                  </div>
                )}
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="password" className="text-sm font-medium">
                      Password
                    </label>
                    <a href="#" className="text-xs text-groww-purple hover:underline">
                      Forgot password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-groww-purple hover:bg-groww-purple-dark"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Logging in...' : 'Login'}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-groww-purple hover:underline">
                  Create one
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Login;
