
import React, { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PaymentSectionProps {
  showPrimerCheckout: boolean;
}

const PaymentSection: React.FC<PaymentSectionProps> = ({ showPrimerCheckout }) => {
  const primerContainerRef = useRef<HTMLDivElement>(null);

  return (
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
  );
};

export default PaymentSection;
