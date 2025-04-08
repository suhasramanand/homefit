
import React, { useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Building, Heart, MessageCircle, Shield, Star, Users, Zap } from 'lucide-react';
import gsap from 'gsap';
import { Link } from 'react-router-dom';

const About = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Animation
    const tl = gsap.timeline();
    
    if (headerRef.current) {
      tl.fromTo(headerRef.current, 
        { opacity: 0, y: -30 }, 
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );
    }
    
    if (contentRef.current) {
      tl.fromTo(contentRef.current, 
        { opacity: 0 }, 
        { opacity: 1, duration: 0.8, ease: "power3.out" },
        "-=0.4"
      );
    }
    
    if (teamRef.current) {
      tl.fromTo(teamRef.current.children, 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.7)", stagger: 0.1 },
        "-=0.4"
      );
    }
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero section */}
        <div className="bg-groww-purple py-20 px-4">
          <div ref={headerRef} className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Our Mission is to Find Your Perfect Home
            </h1>
            <p className="text-xl text-white/90 mb-8">
              AptMatchBuddy brings together technology and personalization to make apartment hunting simple, efficient, and actually enjoyable
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-white text-groww-purple hover:bg-white/90">
                <Link to="/questionnaire">Find Your Match</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Link to="/register?role=broker">Join as Broker</Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Our story section */}
        <div className="py-20 px-4 bg-white" id="our-story">
          <div ref={contentRef} className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Our Story</h2>
            <div className="space-y-8 text-lg text-gray-700">
              <p>
                AptMatchBuddy was born out of frustration with the traditional apartment hunting process. Our founders spent countless hours scrolling through listings, visiting units that didn't match their needs, and dealing with unresponsive brokers.
              </p>
              <p>
                We started in 2023 with a simple idea: what if finding an apartment could be as intuitive as matching with a new friend? What if we could understand your lifestyle, preferences, and needs, and match you with properties that truly fit?
              </p>
              <p>
                Today, we're proud to offer a platform that connects apartment hunters with their ideal homes through our advanced matching algorithm. But we're more than just technology – we're a community of renters, brokers, and property managers working together to make housing more accessible for everyone.
              </p>
              <p>
                Our AI-powered recommendation engine analyzes over 50 different factors to find your perfect match, while our verified broker network ensures quality listings and responsive communication throughout your journey.
              </p>
            </div>
          </div>
        </div>
        
        {/* Values section */}
        <div className="py-20 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <div className="bg-groww-soft-purple p-3 rounded-full mb-4">
                    <Heart className="h-6 w-6 text-groww-purple" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Community First</h3>
                  <p className="text-gray-600">
                    We believe housing is fundamentally about community. We make decisions that benefit our entire ecosystem of renters and property professionals.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <div className="bg-groww-soft-purple p-3 rounded-full mb-4">
                    <Shield className="h-6 w-6 text-groww-purple" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Trust & Transparency</h3>
                  <p className="text-gray-600">
                    We verify every listing and broker on our platform. No bait-and-switch tactics or hidden fees - what you see is what you get.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <div className="bg-groww-soft-purple p-3 rounded-full mb-4">
                    <Zap className="h-6 w-6 text-groww-purple" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Innovation</h3>
                  <p className="text-gray-600">
                    We're constantly improving our technology to make the apartment hunting process faster, more personalized, and more delightful.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        {/* Team section */}
        <div className="py-20 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
            <div ref={teamRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {[
                { name: 'Sarah Johnson', role: 'Co-Founder & CEO', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
                { name: 'Michael Chen', role: 'Co-Founder & CTO', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
                { name: 'Aisha Patel', role: 'Head of Product', avatar: 'https://randomuser.me/api/portraits/women/65.jpg' },
                { name: 'James Wilson', role: 'Head of Partnerships', avatar: 'https://randomuser.me/api/portraits/men/67.jpg' },
                { name: 'Elena Rodriguez', role: 'Senior Software Engineer', avatar: 'https://randomuser.me/api/portraits/women/33.jpg' },
                { name: 'David Kim', role: 'UX Designer', avatar: 'https://randomuser.me/api/portraits/men/9.jpg' },
                { name: 'Zoe Washington', role: 'Customer Success Manager', avatar: 'https://randomuser.me/api/portraits/women/12.jpg' },
                { name: 'Omar Hassan', role: 'Marketing Director', avatar: 'https://randomuser.me/api/portraits/men/54.jpg' },
              ].map((member, index) => (
                <div key={index} className="flex flex-col items-center text-center">
                  <div className="mb-4 rounded-full overflow-hidden w-24 h-24">
                    <img 
                      src={member.avatar} 
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-lg">{member.name}</h3>
                  <p className="text-gray-600">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* CTA section */}
        <div className="bg-groww-purple py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Find Your Match?</h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of happy renters who found their perfect apartment with us
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-white text-groww-purple hover:bg-white/90">
                <Link to="/register">Create Account</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Link to="/results">Browse Apartments</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
