
import React from "react";
import { useBasket } from "@/context/BasketContext";
import BasketItem from "@/components/BasketItem";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart, ArrowRight } from "lucide-react";

const Basket: React.FC = () => {
  const { items, subtotal, totalItems, clearBasket } = useBasket();
  const isBasketEmpty = items.length === 0;

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
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Link>
            </Button>
            
            <h1 className="text-2xl font-semibold text-gray-900">Your Basket</h1>
            
            <span className="text-sm text-gray-500">
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </span>
          </div>
          
          {isBasketEmpty ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-subtle animate-fade-in">
              <ShoppingCart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h2 className="text-xl font-medium text-gray-900 mb-2">Your basket is empty</h2>
              <p className="text-gray-500 mb-6">
                Looks like you haven't added any products to your basket yet.
              </p>
              <Button asChild>
                <Link to="/">Start Shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-subtle animate-fade-in overflow-hidden">
              <div className="p-6">
                <div className="flow-root">
                  <div className="divide-y divide-gray-100">
                    {items.map((item) => (
                      <BasketItem key={item.product.id} item={item} />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-100 px-6 py-4 sm:px-6">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Subtotal</p>
                  <p>${subtotal.toFixed(2)}</p>
                </div>
                <p className="mt-0.5 text-sm text-gray-500">
                  Shipping and taxes calculated at checkout.
                </p>
                
                <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={clearBasket}
                  >
                    Clear Basket
                  </Button>
                  
                  <Button asChild className="flex-1">
                    <Link to="/checkout">
                      Checkout
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">
                © 2023 PrimerBasket. All rights reserved.
              </p>
            </div>
            <div className="text-sm text-gray-500">
              <p>Powered by Primer.io</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Basket;
