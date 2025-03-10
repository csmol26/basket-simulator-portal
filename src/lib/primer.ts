
import { Primer } from '@primer-io/checkout-web';
import { createPrimerClientSession } from './api';

interface PrimerCheckoutConfig {
  amount: number;
  currency: string;
  orderId: string;
  items: {
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
  }[];
  containerId: string;
  onComplete?: (payment: any) => void;
  onError?: (error: any, paymentData: any) => void;
}

export const initPrimer = async (config: PrimerCheckoutConfig): Promise<void> => {
  console.log("Initializing Primer checkout with config:", config);
  
  try {
    // 1. Demander un token client à notre API
    const clientSession = await createPrimerClientSession(
      config.amount,
      config.currency,
      config.orderId,
      config.items
    );
    
    // 2. Initialiser le checkout Primer avec le token obtenu
    const universalCheckout = await Primer.showUniversalCheckout(clientSession.clientToken, {
      // Spécifier le sélecteur du conteneur où le checkout sera affiché
      container: config.containerId,
      
      // Callback lorsque le paiement est complété avec succès
      onCheckoutComplete({ payment }) {
        console.log('Checkout completed successfully!', payment);
        if (config.onComplete) {
          config.onComplete(payment);
        }
      },
      
      // Callback en cas d'échec du paiement
      onCheckoutFail(error, { payment }, handler) {
        console.log('Checkout failed:', error, payment);
        if (config.onError) {
          config.onError(error, payment);
        }
        
        // Afficher un message d'erreur par défaut si un handler est fourni
        if (handler) {
          handler.showErrorMessage();
        }
      },
    });
    
    console.log("Primer checkout initialized successfully", universalCheckout);
    
  } catch (error) {
    console.error("Error initializing Primer checkout:", error);
    throw error;
  }
};
