
// Simuler un appel à l'API Primer pour obtenir un clientToken
// Dans un environnement réel, cet appel devrait être fait à partir de votre backend

export interface PrimerClientSessionResponse {
  clientToken: string;
  clientExpirationDate: string;
  orderId: string;
  currencyCode: string;
  amount: number;
  order: {
    lineItems: {
      itemId: string;
      amount: number;
      quantity: number;
    }[];
    countryCode: string;
  };
}

export const createPrimerClientSession = async (
  amount: number,
  currencyCode: string = "USD",
  orderId: string,
  items: Array<{id: string, name: string, quantity: number, unitPrice: number}>
): Promise<PrimerClientSessionResponse> => {
  console.log("Creating Primer client session for:", { amount, currencyCode, orderId, items });
  
  // Simuler un délai réseau
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Dans un environnement réel, vous feriez un appel à votre API backend qui, à son tour, 
  // ferait une requête sécurisée à l'API Primer avec votre clé API
  // Le code suivant simule simplement la réponse

  const lineItems = items.map(item => ({
    itemId: item.id,
    amount: Math.round(item.unitPrice * 100), // Convertir en centimes
    quantity: item.quantity
  }));

  // Simuler un token client (dans un environnement réel, celui-ci viendrait de l'API Primer)
  const response: PrimerClientSessionResponse = {
    clientToken: `sim_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`,
    clientExpirationDate: new Date(Date.now() + 3600000).toISOString(), // Expire dans 1 heure
    orderId,
    currencyCode,
    amount: Math.round(amount * 100), // Convertir en centimes
    order: {
      lineItems,
      countryCode: "US"
    }
  };

  console.log("Generated client session:", response);
  return response;
};
