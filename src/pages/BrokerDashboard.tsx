
import React from 'react';
import { Link } from 'react-router-dom';
import BrokerLayout from '@/components/broker/BrokerLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, ListFilter, PlusCircle, Users } from 'lucide-react';

const BrokerDashboard = () => {
  const stats = [
    { title: "Total Listings", value: "24", icon: Building, color: "bg-groww-purple" },
    { title: "Active Listings", value: "18", icon: ListFilter, color: "bg-green-600" },
    { title: "New Inquiries", value: "12", icon: Users, color: "bg-blue-500" },
    { title: "Pending Approvals", value: "3", icon: PlusCircle, color: "bg-amber-500" },
  ];

  return (
    <BrokerLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-groww-dark">Broker Dashboard</h1>
        <Link to="/broker/listings/add">
          <button className="inline-flex items-center justify-center px-4 py-2 bg-groww-purple text-white rounded-lg hover:bg-groww-purple-dark transition-colors">
            <PlusCircle size={18} className="mr-2" />
            Add New Listing
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4 flex flex-col items-center text-center">
              <div className={`w-12 h-12 rounded-full ${stat.color} text-white flex items-center justify-center mb-3`}>
                <stat.icon size={24} />
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-gray-500">{stat.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Inquiries</CardTitle>
            <CardDescription>Latest inquiries from potential tenants</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex justify-between p-3 border-b last:border-0">
                  <div>
                    <p className="font-medium">User{item}@example.com</p>
                    <p className="text-sm text-gray-500">Inquiry for Apartment {item + 100}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date().toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Listing Performance</CardTitle>
            <CardDescription>Views and inquiries for your listings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex justify-between p-3 border-b last:border-0">
                  <div>
                    <p className="font-medium">Apartment {item + 100}</p>
                    <p className="text-sm text-gray-500">{item * 45} views, {item * 5} inquiries</p>
                  </div>
                  <div>
                    <Link to={`/broker/listings/${item}`} className="text-groww-purple">
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </BrokerLayout>
  );
};

export default BrokerDashboard;
