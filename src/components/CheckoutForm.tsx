
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBasket } from "@/context/BasketContext";
import { initPrimer } from "@/lib/primer";

const CheckoutForm: React.FC = () => {
  const { subtotal, items } = useBasket();
  const [loading, setLoading] = useState(false);
  const shipping = 4.99;
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + shipping + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // This is a simulated Primer checkout initiation
      await initPrimer({
        amount: total,
        currency: 'USD',
        orderId: `order-${Date.now()}`,
        items: items.map(item => ({
          id: item.product.id,
          name: item.product.name,
          quantity: item.quantity,
          unitPrice: item.product.price
        }))
      });
    } catch (error) {
      console.error("Primer checkout error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-medium">Shipping information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input id="firstName" placeholder="Enter your first name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input id="lastName" placeholder="Enter your last name" required />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input id="email" type="email" placeholder="Enter your email" required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" placeholder="Enter your address" required />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2 col-span-1">
              <Label htmlFor="zipCode">Zip code</Label>
              <Input id="zipCode" placeholder="Zip code" required />
            </div>
            <div className="space-y-2 col-span-1">
              <Label htmlFor="city">City</Label>
              <Input id="city" placeholder="City" required />
            </div>
            <div className="space-y-2 col-span-1">
              <Label htmlFor="country">Country</Label>
              <Input id="country" placeholder="Country" required />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-medium">Payment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">
              Payment information will be collected securely via Primer's payment interface.
            </p>
            
            {/* This is where Primer's payment UI would be integrated */}
            <div id="primer-payment-container" className="min-h-24 bg-gray-50 rounded-md border border-gray-200 p-4 mb-4">
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground text-sm">Primer payment form will appear here</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-medium">Order summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Shipping</span>
              <span className="font-medium">${shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Estimated tax</span>
              <span className="font-medium">${tax.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 my-2 pt-2 flex justify-between">
              <span className="font-medium">Total</span>
              <span className="font-semibold">${total.toFixed(2)}</span>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full mt-4"
            disabled={loading}
          >
            {loading ? "Processing..." : "Complete order"}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
};

export default CheckoutForm;
