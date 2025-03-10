
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";

const Confirmation: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-subtle mx-4">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
            
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Commande confirmée
            </h1>
            
            <p className="text-gray-600 mb-6">
              Merci pour votre achat! Votre paiement a été traité avec succès.
            </p>
            
            <Button onClick={() => navigate("/")} className="w-full">
              Continuer vos achats
            </Button>
          </div>
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
              <p>Sécurisé par Primer.io</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Confirmation;
