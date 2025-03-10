
// Appel réel à l'API Primer pour obtenir un clientToken

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
  
  // Clé API Primer sandbox 
  const API_KEY = "cf693b2b-47a7-4477-81a9-2eb004c60c79";
  
  // Créer la charge utile de la requête
  const lineItems = items.map(item => ({
    itemId: item.id,
    amount: Math.round(item.unitPrice * 100), // Convertir en centimes
    quantity: item.quantity
  }));
  
  const requestBody = {
    orderId,
    currencyCode,
    amount: Math.round(amount * 100), // Convertir en centimes
    order: {
      lineItems,
      countryCode: "US"
    }
  };
  
  try {
    // Nous utilisons la méthode fetch du navigateur pour faire l'appel à l'API
    const response = await fetch("https://api.sandbox.primer.io/client-session", {
      method: "POST",
      headers: {
        "X-Api-Key": API_KEY,
        "X-Api-Version": "2.4",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      // Gérer les erreurs de l'API
      const errorData = await response.json();
      console.error("Primer API error:", errorData);
      throw new Error(`Erreur API Primer: ${response.status} ${response.statusText}`);
    }
    
    // Convertir la réponse en JSON
    const data = await response.json();
    console.log("Primer client session created:", data);
    
    return data;
  } catch (error) {
    console.error("Error creating Primer client session:", error);
    
    // En cas d'erreur, nous revenons à une simulation pour ne pas bloquer l'application
    console.warn("Falling back to simulated client session due to API error");
    
    const fallbackResponse: PrimerClientSessionResponse = {
      clientToken: `sim_fallback_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`,
      clientExpirationDate: new Date(Date.now() + 3600000).toISOString(), // Expire dans 1 heure
      orderId,
      currencyCode,
      amount: Math.round(amount * 100), // Convertir en centimes
      order: {
        lineItems,
        countryCode: "US"
      }
    };
    
    return fallbackResponse;
  }
};
