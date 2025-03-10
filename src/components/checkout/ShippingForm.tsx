
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
        <CardTitle className="text-xl font-medium">Informations d'expédition</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Prénom</Label>
            <Input 
              id="firstName" 
              placeholder="Entrez votre prénom" 
              required 
              value={formData.firstName}
              onChange={handleInputChange}
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Nom</Label>
            <Input 
              id="lastName" 
              placeholder="Entrez votre nom" 
              required 
              value={formData.lastName}
              onChange={handleInputChange}
              disabled={loading}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Adresse email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="Entrez votre email" 
            required 
            value={formData.email}
            onChange={handleInputChange}
            disabled={loading}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="address">Adresse</Label>
          <Input 
            id="address" 
            placeholder="Entrez votre adresse" 
            required 
            value={formData.address}
            onChange={handleInputChange}
            disabled={loading}
          />
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2 col-span-1">
            <Label htmlFor="zipCode">Code postal</Label>
            <Input 
              id="zipCode" 
              placeholder="Code postal" 
              required 
              value={formData.zipCode}
              onChange={handleInputChange}
              disabled={loading}
            />
          </div>
          <div className="space-y-2 col-span-1">
            <Label htmlFor="city">Ville</Label>
            <Input 
              id="city" 
              placeholder="Ville" 
              required 
              value={formData.city}
              onChange={handleInputChange}
              disabled={loading}
            />
          </div>
          <div className="space-y-2 col-span-1">
            <Label htmlFor="country">Pays</Label>
            <Input 
              id="country" 
              placeholder="Pays" 
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
