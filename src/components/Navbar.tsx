
import React from "react";
import { Link } from "react-router-dom";
import { ShoppingBasket, Settings, Wand2 } from "lucide-react";
import { useBasket } from "@/context/BasketContext";

const Navbar: React.FC = () => {
  const { totalItems } = useBasket();

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 animate-fade-in">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center h-16">
          <Link 
            to="/" 
            className="text-xl font-semibold text-gray-900 flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <span className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
              <span className="text-white font-medium text-sm">PB</span>
            </span>
            PrimerBasket
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-accent transition-colors duration-200"
            >
              Products
            </Link>
            
            <Link 
              to="/checkout-builder" 
              className="text-gray-700 hover:text-accent transition-colors duration-200 flex items-center gap-1"
            >
              <Settings className="h-4 w-4" />
              Checkout Builder
            </Link>
            
            <Link 
              to="/perfect-checkout" 
              className="text-gray-700 hover:text-accent transition-colors duration-200 flex items-center gap-1"
            >
              <Wand2 className="h-4 w-4" />
              Perfect Checkout
            </Link>
            
            <Link 
              to="/basket" 
              className="relative p-2 text-gray-700 hover:text-accent transition-colors duration-200"
            >
              <ShoppingBasket className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center rounded-full text-[10px] bg-accent text-white font-medium">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
