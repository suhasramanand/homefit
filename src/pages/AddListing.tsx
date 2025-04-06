
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BrokerLayout from '@/components/broker/BrokerLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Upload, X } from 'lucide-react';
import gsap from 'gsap';

const AddListing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  
  const [images, setImages] = useState<string[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Header animation
    gsap.fromTo(headerRef.current, 
      { opacity: 0, y: -30 }, 
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    );
    
    // Form animation with staggered fields
    gsap.fromTo(formRef.current?.querySelectorAll('.form-field'), 
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.7)", stagger: 0.05, delay: 0.2 }
    );
  }, []);

  const handleAddImage = () => {
    // This would typically upload an image to storage
    // For now, we'll just add a placeholder
    setImages([...images, `https://source.unsplash.com/random/300x300?apartment&${Date.now()}`]);
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    if (checked) {
      setAmenities([...amenities, amenity]);
    } else {
      setAmenities(amenities.filter(a => a !== amenity));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Listing Added",
        description: "The new property has been successfully added to your listings.",
      });
      navigate('/broker/listings');
    }, 1500);
  };

  const availableAmenities = [
    'In-unit Washer/Dryer', 
    'Gym', 
    'Pool', 
    'Parking',
    'Balcony',
    'Doorman',
    'Elevator',
    'Air Conditioning',
    'Furnished',
    'Pet Friendly'
  ];

  return (
    <BrokerLayout>
      <div ref={headerRef} className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
        <div>
          <Button 
            variant="ghost" 
            className="p-0 mb-2 text-groww-purple hover:text-groww-purple-dark"
            onClick={() => navigate('/broker/listings')}
          >
            <ArrowLeft size={16} className="mr-2" /> Back to Listings
          </Button>
          <h1 className="text-2xl font-bold text-groww-dark">Add New Listing</h1>
        </div>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-field">
              <Label htmlFor="name" className="mb-1.5 block">Listing Title</Label>
              <Input id="name" placeholder="e.g. Luxury Downtown Loft" required />
            </div>
            
            <div className="form-field">
              <Label htmlFor="price" className="mb-1.5 block">Monthly Price ($)</Label>
              <Input id="price" type="number" placeholder="e.g. 1950" required />
            </div>
            
            <div className="form-field">
              <Label htmlFor="bedrooms" className="mb-1.5 block">Bedrooms</Label>
              <Select defaultValue="1">
                <SelectTrigger id="bedrooms">
                  <SelectValue placeholder="Select bedrooms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Studio</SelectItem>
                  <SelectItem value="1">1 Bedroom</SelectItem>
                  <SelectItem value="2">2 Bedrooms</SelectItem>
                  <SelectItem value="3">3 Bedrooms</SelectItem>
                  <SelectItem value="4">4+ Bedrooms</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="form-field">
              <Label htmlFor="bathrooms" className="mb-1.5 block">Bathrooms</Label>
              <Select defaultValue="1">
                <SelectTrigger id="bathrooms">
                  <SelectValue placeholder="Select bathrooms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Bathroom</SelectItem>
                  <SelectItem value="1.5">1.5 Bathrooms</SelectItem>
                  <SelectItem value="2">2 Bathrooms</SelectItem>
                  <SelectItem value="2.5">2.5 Bathrooms</SelectItem>
                  <SelectItem value="3">3+ Bathrooms</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="form-field">
              <Label htmlFor="sqft" className="mb-1.5 block">Square Footage</Label>
              <Input id="sqft" type="number" placeholder="e.g. 750" required />
            </div>
            
            <div className="form-field">
              <Label htmlFor="neighborhood" className="mb-1.5 block">Neighborhood</Label>
              <Select>
                <SelectTrigger id="neighborhood">
                  <SelectValue placeholder="Select neighborhood" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Downtown">Downtown</SelectItem>
                  <SelectItem value="Midtown">Midtown</SelectItem>
                  <SelectItem value="East Side">East Side</SelectItem>
                  <SelectItem value="West End">West End</SelectItem>
                  <SelectItem value="North Hills">North Hills</SelectItem>
                  <SelectItem value="Riverside">Riverside</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="form-field md:col-span-2">
              <Label htmlFor="address" className="mb-1.5 block">Full Address</Label>
              <Input id="address" placeholder="e.g. 123 Main St, Seattle, WA 98101" required />
            </div>
            
            <div className="form-field md:col-span-2">
              <Label htmlFor="description" className="mb-1.5 block">Description</Label>
              <Textarea 
                id="description" 
                placeholder="Tell potential tenants about this property..." 
                className="min-h-[120px]"
                required
              />
            </div>
          </div>
        </div>
        
        {/* Images */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold mb-4">Images</h2>
          <div className="form-field">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img src={image} alt="Listing" className="w-full h-32 object-cover rounded-lg" />
                  <button
                    type="button"
                    className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1 hover:bg-opacity-70 transition-all"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <X size={14} className="text-white" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="border-2 border-dashed border-gray-300 rounded-lg h-32 flex flex-col items-center justify-center hover:border-groww-purple transition-colors"
                onClick={handleAddImage}
              >
                <Upload size={24} className="text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Add Image</span>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              You can upload up to 10 images. First image will be used as the cover.
            </p>
          </div>
        </div>
        
        {/* Additional Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold mb-4">Additional Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-field">
              <Label htmlFor="available" className="mb-1.5 block">Available From</Label>
              <Input id="available" type="date" required />
            </div>
            
            <div className="form-field">
              <Label htmlFor="lease-length" className="mb-1.5 block">Lease Length</Label>
              <Select defaultValue="12">
                <SelectTrigger id="lease-length">
                  <SelectValue placeholder="Select lease length" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Month-to-Month</SelectItem>
                  <SelectItem value="3">3 Months</SelectItem>
                  <SelectItem value="6">6 Months</SelectItem>
                  <SelectItem value="12">12 Months</SelectItem>
                  <SelectItem value="24">24 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mt-6">
            <Label className="mb-3 block">Amenities</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableAmenities.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`amenity-${amenity}`} 
                    checked={amenities.includes(amenity)}
                    onCheckedChange={(checked) => handleAmenityChange(amenity, checked === true)}
                  />
                  <Label htmlFor={`amenity-${amenity}`} className="cursor-pointer">
                    {amenity}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-4">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => navigate('/broker/listings')}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="bg-groww-purple hover:bg-groww-purple-dark"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Listing...' : 'Create Listing'}
          </Button>
        </div>
      </form>
    </BrokerLayout>
  );
};

export default AddListing;
