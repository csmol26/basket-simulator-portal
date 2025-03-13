
import React from "react";
import { Navbar } from "@/components/Navbar";

const PerfectCheckout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 md:px-6">
        <h1 className="text-3xl font-bold mb-6">Let's build the perfect Checkout</h1>
        <div className="p-6 border border-gray-200 rounded-lg bg-white shadow-sm">
          <p className="text-gray-500">This page is under construction. Come back soon!</p>
        </div>
      </div>
    </div>
  );
};

export default PerfectCheckout;
