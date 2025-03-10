
import React, { useState, useEffect } from "react";
import { useBasket } from "@/context/BasketContext";
import { initPrimer } from "@/lib/primer";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Import refactored components
import ShippingForm from "./checkout/ShippingForm";
import PaymentSection from "./checkout/PaymentSection";
import OrderSummary from "./checkout/OrderSummary";

const CheckoutForm: React.FC = () => {
  const { subtotal, items, clearBasket } = useBasket();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showPrimerCheckout, setShowPrimerCheckout] = useState(false);

  // Form information reference
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    zipCode: "",
    city: "",
    country: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic form validation
    if (Object.values(formData).some(value => !value)) {
      toast.error("Please fill in all form fields");
      return;
    }
    
    setLoading(true);
    setShowPrimerCheckout(true);
    
    try {
      // Initialize Primer only after validating shipping information
      setTimeout(async () => {
        try {
          await initPrimer({
            amount: subtotal + 4.99 + (subtotal * 0.1), // total = subtotal + shipping + tax
            currency: 'USD',
            orderId: `order-${Date.now()}`,
            items: items.map(item => ({
              id: item.product.id,
              name: item.product.name,
              quantity: item.quantity,
              unitPrice: item.product.price
            })),
            containerId: '#primer-payment-container',
            onComplete: (payment) => {
              // Handle payment success
              toast.success("Payment successful!");
              clearBasket();
              navigate("/");
            },
            onError: (error) => {
              // Handle payment failure
              toast.error("Payment failed. Please try again.");
              setLoading(false);
            }
          });
        } catch (error) {
          console.error("Error initializing Primer:", error);
          toast.error("An error occurred while initializing payment.");
          setLoading(false);
        }
      }, 500);
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  // Add Primer CSS on component load
  useEffect(() => {
    const linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.href = 'https://sdk.primer.io/web/v2.50.3/Checkout.css';
    document.head.appendChild(linkElement);

    return () => {
      document.head.removeChild(linkElement);
    };
  }, []);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      <ShippingForm 
        formData={formData}
        handleInputChange={handleInputChange}
        loading={loading}
      />
      
      <OrderSummary 
        subtotal={subtotal}
        loading={loading}
        showPrimerCheckout={showPrimerCheckout}
      />
      
      <PaymentSection 
        showPrimerCheckout={showPrimerCheckout}
      />
    </form>
  );
};

export default CheckoutForm;
