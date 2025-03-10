
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OrderSummaryProps {
  subtotal: number;
  loading: boolean;
  showPrimerCheckout: boolean;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ 
  subtotal, 
  loading, 
  showPrimerCheckout 
}) => {
  const shipping = 4.99;
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + shipping + tax;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-medium">Récapitulatif de commande</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Sous-total</span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Livraison</span>
            <span className="font-medium">${shipping.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Taxe estimée</span>
            <span className="font-medium">${tax.toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-200 my-2 pt-2 flex justify-between">
            <span className="font-medium">Total</span>
            <span className="font-semibold">${total.toFixed(2)}</span>
          </div>
        </div>
        
        {!showPrimerCheckout && (
          <Button 
            type="submit" 
            className="w-full mt-4"
            disabled={loading}
          >
            {loading ? "Traitement en cours..." : "Passer à la validation du paiement"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
