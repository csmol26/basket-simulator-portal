
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBasket } from "@/context/BasketContext";
import { initPrimer } from "@/lib/primer";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const CheckoutForm: React.FC = () => {
  const { subtotal, items, clearBasket } = useBasket();
  const [loading, setLoading] = useState(false);
  const shipping = 4.99;
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + shipping + tax;
  const primerContainerRef = useRef<HTMLDivElement>(null);
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
            amount: total,
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
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-medium">Paiement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {!showPrimerCheckout ? (
              <p className="text-sm text-gray-500">
                Les informations de paiement seront collectées de manière sécurisée via l'interface de paiement Primer après avoir validé vos informations d'expédition.
              </p>
            ) : (
              <p className="text-sm text-gray-500 mb-4">
                Veuillez compléter votre paiement ci-dessous:
              </p>
            )}
            
            {/* Container pour l'UI de paiement Primer */}
            <div 
              id="primer-payment-container" 
              ref={primerContainerRef}
              className="min-h-48 bg-gray-50 rounded-md border border-gray-200 p-4"
            >
              {!showPrimerCheckout && (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground text-sm">Le formulaire de paiement Primer apparaîtra ici</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
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
    </form>
  );
};

export default CheckoutForm;
