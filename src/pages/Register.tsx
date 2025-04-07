
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { ArrowLeft, Upload } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import gsap from 'gsap';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user');
  const [isLoading, setIsLoading] = useState(false);
  
  // Broker specific fields
  const [showBrokerFields, setShowBrokerFields] = useState(false);
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [companyName, setCompanyName] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [specializations, setSpecializations] = useState('');
  
  const cardRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Animation for the registration card
    gsap.fromTo(
      cardRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    );
    
    // Staggered animation for form fields
    gsap.fromTo(
      formRef.current?.querySelectorAll('.form-field'),
      { y: 20, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.5, 
        stagger: 0.1, 
        ease: "back.out(1.7)",
        delay: 0.3
      }
    );
  }, []);

  useEffect(() => {
    // Toggle broker fields visibility
    setShowBrokerFields(role === 'broker');
  }, [role]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLicenseFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const userData: any = { name, email, password, role };
      
      // Add broker verification data if role is broker
      if (role === 'broker') {
        if (!licenseNumber || !licenseFile || !companyName) {
          throw new Error("License number, license document, and company name are required for broker registration.");
        }

        // Create form data for file upload
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('role', role);
        formData.append('licenseNumber', licenseNumber);
        formData.append('licenseDocument', licenseFile);
        formData.append('companyName', companyName);
        formData.append('businessAddress', businessAddress);
        formData.append('yearsOfExperience', yearsOfExperience);
        formData.append('specializations', specializations);
        
        await register(formData);
      } else {
        await register(userData);
      }
      
      toast({
        title: "Registration successful",
        description: role === 'broker' 
          ? "Your broker account has been created. Please wait for admin approval."
          : "Your account has been created. You can now log in."
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "An error occurred during registration.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center bg-gray-50 py-12 px-4">
        <Card ref={cardRef} className="w-full max-w-md">
          <CardHeader>
            <Button 
              variant="ghost" 
              size="sm" 
              className="mb-2 p-0 text-groww-purple hover:text-groww-purple-dark"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={16} className="mr-2" /> Back
            </Button>
            <CardTitle className="text-2xl font-bold text-groww-dark">Create an Account</CardTitle>
            <CardDescription>
              Enter your information to create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
              <div className="form-field space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-field space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-field space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </div>
              
              <div className="form-field space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-field space-y-2">
                <Label htmlFor="role">I am a</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Apartment Seeker</SelectItem>
                    <SelectItem value="broker">Property Broker</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {showBrokerFields && (
                <div className="form-field space-y-4 border rounded-md p-4 bg-gray-50 animate-fade-in">
                  <h3 className="font-medium text-gray-800">Broker Verification</h3>
                  <p className="text-sm text-gray-500 mb-3">
                    Please provide your broker details for verification. Your account will need admin approval before listing properties.
                  </p>
                  
                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber">License Number</Label>
                    <Input
                      id="licenseNumber"
                      placeholder="Enter your license number"
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                      required={role === 'broker'}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      placeholder="Enter your company name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required={role === 'broker'}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="businessAddress">Business Address</Label>
                    <Textarea
                      id="businessAddress"
                      placeholder="Enter your business address"
                      value={businessAddress}
                      onChange={(e) => setBusinessAddress(e.target.value)}
                      rows={2}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                    <Input
                      id="yearsOfExperience"
                      type="number"
                      min="0"
                      placeholder="Years of experience"
                      value={yearsOfExperience}
                      onChange={(e) => setYearsOfExperience(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="specializations">Specializations</Label>
                    <Input
                      id="specializations"
                      placeholder="e.g., Luxury, Commercial, Residential"
                      value={specializations}
                      onChange={(e) => setSpecializations(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="licenseDocument">License Document</Label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="licenseDocument"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      required={role === 'broker'}
                    />
                    <div
                      onClick={triggerFileInput}
                      className="cursor-pointer border-2 border-dashed border-gray-300 rounded-md p-4 flex flex-col items-center justify-center text-gray-500 hover:border-groww-purple transition-colors"
                    >
                      <Upload size={24} className="mb-2" />
                      <p className="text-sm font-medium">
                        {licenseFile ? licenseFile.name : "Click to upload license document"}
                      </p>
                      <p className="text-xs mt-1">
                        PDF, JPG, JPEG or PNG (max 5MB)
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full bg-groww-purple hover:bg-groww-purple-dark mt-6" 
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-center text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-groww-purple hover:underline">
                Log In
              </Link>
            </p>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Register;
