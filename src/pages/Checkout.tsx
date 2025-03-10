
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useBasket } from "@/context/BasketContext";
import Navbar from "@/components/Navbar";
import CheckoutForm from "@/components/CheckoutForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Checkout: React.FC = () => {
  const { items, totalItems } = useBasket();
  const navigate = useNavigate();
  const isBasketEmpty = items.length === 0;

  // Redirect to basket if it's empty
  useEffect(() => {
    if (isBasketEmpty) {
      navigate("/basket");
    }
  }, [isBasketEmpty, navigate]);

  if (isBasketEmpty) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between mb-8">
            <Button 
              variant="ghost" 
              asChild
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <Link to="/basket">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Basket
              </Link>
            </Button>
            
            <h1 className="text-2xl font-semibold text-gray-900">Checkout</h1>
            
            <span className="text-sm text-gray-500">
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </span>
          </div>
          
          <div className="bg-transparent">
            <CheckoutForm />
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-100 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">
                © 2023 PrimerBasket. All rights reserved.
              </p>
            </div>
            <div className="text-sm text-gray-500">
              <p>Secured by Primer.io</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Checkout;
