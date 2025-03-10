
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

  // Référence aux informations du formulaire
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
    
    // Vérification de base du formulaire
    if (Object.values(formData).some(value => !value)) {
      toast.error("Veuillez remplir tous les champs du formulaire");
      return;
    }
    
    setLoading(true);
    setShowPrimerCheckout(true);
    
    try {
      // Initialiser Primer seulement après avoir validé les informations d'expédition
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
              // Gérer le succès du paiement
              toast.success("Paiement réussi!");
              clearBasket();
              navigate("/");
            },
            onError: (error) => {
              // Gérer l'échec du paiement
              toast.error("Le paiement a échoué. Veuillez réessayer.");
              setLoading(false);
            }
          });
        } catch (error) {
          console.error("Error initializing Primer:", error);
          toast.error("Une erreur s'est produite lors de l'initialisation du paiement.");
          setLoading(false);
        }
      }, 500);
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Une erreur s'est produite. Veuillez réessayer.");
      setLoading(false);
    }
  };

  // Ajouter le CSS de Primer au chargement du composant
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
      
      <PaymentSection 
        showPrimerCheckout={showPrimerCheckout}
      />
      
      <OrderSummary 
        subtotal={subtotal}
        loading={loading}
        showPrimerCheckout={showPrimerCheckout}
      />
    </form>
  );
};

export default CheckoutForm;
