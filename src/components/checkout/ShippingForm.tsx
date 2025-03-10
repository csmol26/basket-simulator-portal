
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ShippingFormProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    zipCode: string;
    city: string;
    country: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  loading: boolean;
}

const ShippingForm: React.FC<ShippingFormProps> = ({
  formData,
  handleInputChange,
  loading,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-medium">Shipping Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input 
              id="firstName" 
              placeholder="Enter your first name" 
              required 
              value={formData.firstName}
              onChange={handleInputChange}
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input 
              id="lastName" 
              placeholder="Enter your last name" 
              required 
              value={formData.lastName}
              onChange={handleInputChange}
              disabled={loading}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="Enter your email" 
            required 
            value={formData.email}
            onChange={handleInputChange}
            disabled={loading}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input 
            id="address" 
            placeholder="Enter your address" 
            required 
            value={formData.address}
            onChange={handleInputChange}
            disabled={loading}
          />
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2 col-span-1">
            <Label htmlFor="zipCode">Zip Code</Label>
            <Input 
              id="zipCode" 
              placeholder="Zip code" 
              required 
              value={formData.zipCode}
              onChange={handleInputChange}
              disabled={loading}
            />
          </div>
          <div className="space-y-2 col-span-1">
            <Label htmlFor="city">City</Label>
            <Input 
              id="city" 
              placeholder="City" 
              required 
              value={formData.city}
              onChange={handleInputChange}
              disabled={loading}
            />
          </div>
          <div className="space-y-2 col-span-1">
            <Label htmlFor="country">Country</Label>
            <Input 
              id="country" 
              placeholder="Country" 
              required 
              value={formData.country}
              onChange={handleInputChange}
              disabled={loading}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShippingForm;
