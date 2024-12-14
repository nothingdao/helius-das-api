// netlify/functions/get-asset.js
export const handler = async (event) => {
  const HELIUS_API_KEY = process.env.HELIUS_API_KEY;

  if (!HELIUS_API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Helius API key is not set in environment variables." }),
    };
  }

  const { assetId, showFungible, showInscription } = event.queryStringParameters;

  if (!assetId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing 'assetId' parameter" }),
    };
  }

  const body = {
    jsonrpc: "2.0",
    id: "test",
    method: "getAsset",
    params: {
      id: assetId,
      displayOptions: {
        ...(showFungible && { showFungible: showFungible === "true" }),
        ...(showInscription && { showInscription: showInscription === "true" }),
      },
    },
  };

  try {
    const response = await fetch(`https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Helius API responded with status ${response.status}`);
    }

    const result = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
