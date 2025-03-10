
import React from "react";
import { Product } from "@/context/BasketContext";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

// Sample product data
const products: Product[] = [
  {
    id: "p1",
    name: "Premium Wireless Headphones",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D",
    description: "Experience premium sound quality with these noise-cancelling wireless headphones."
  },
  {
    id: "p2",
    name: "Smart Watch Series 7",
    price: 399.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHByb2R1Y3R8ZW58MHx8MHx8fDA%3D",
    description: "Track your fitness goals and stay connected with our latest smart watch."
  },
  {
    id: "p3",
    name: "Ultra-Thin Laptop Pro",
    price: 1299.99,
    image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGxhcHRvcHxlbnwwfHwwfHx8MA%3D%3D",
    description: "Powerful performance in a sleek, lightweight design. Perfect for professionals."
  },
  {
    id: "p4",
    name: "Ergonomic Office Chair",
    price: 249.99,
    image: "https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGNoYWlyfGVufDB8fDB8fHww",
    description: "Designed for maximum comfort during long work hours. Adjustable height and lumbar support."
  },
  {
    id: "p5",
    name: "Wireless Charging Dock",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1608042314453-ae338d80c427?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hhcmdlcnxlbnwwfHwwfHx8MA%3D%3D",
    description: "Charge multiple devices at once with this elegant wireless charging station."
  },
  {
    id: "p6",
    name: "Premium Coffee Maker",
    price: 159.99,
    image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGNvZmZlZSUyMG1ha2VyfGVufDB8fDB8fHww",
    description: "Brew barista-quality coffee at home with precision temperature control."
  }
];

const Index: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-white py-16 sm:py-24">
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto">
              <span className="inline-block px-3 py-1 text-xs font-medium bg-accent/10 text-accent rounded-full mb-4 animate-fade-in">
                Premium Shopping Experience
              </span>
              <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-6 animate-slide-up">
                Elegant Shopping with Primer Integration
              </h1>
              <p className="text-lg text-gray-600 mb-8 animate-slide-up" style={{ animationDelay: "0.1s" }}>
                Experience our premium products with a seamless checkout process powered by Primer's payment platform.
              </p>
              <Button asChild className="rounded-full px-8 py-6 text-base animate-slide-up" style={{ animationDelay: "0.2s" }}>
                <Link to="/basket">
                  View Basket
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Products Section */}
        <section className="py-16 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold">Featured Products</h2>
              <p className="text-gray-600 mt-2">Discover our premium selection</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product, index) => (
                <div 
                  key={product.id} 
                  style={{ animationDelay: `${index * 0.1}s` }}
                  className="animate-slide-up"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </section>
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

export default Index;
