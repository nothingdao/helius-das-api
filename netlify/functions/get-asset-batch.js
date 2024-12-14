// netlify/functions/get-asset-batch.js
export const handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  const HELIUS_API_KEY = process.env.HELIUS_API_KEY;

  if (!HELIUS_API_KEY) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Helius API key is not set in environment variables." })
    };
  }

  try {
    // Parse the request body to get the asset IDs
    const { assetIds, showFungible, showInscription, showUnverifiedCollections, showCollectionMetadata } = JSON.parse(event.body);

    if (!assetIds || !Array.isArray(assetIds) || assetIds.length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Missing or invalid 'assetIds' in request body" })
      };
    }

    if (assetIds.length > 1000) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Cannot request more than 1000 assets at once" })
      };
    }

    const body = {
      jsonrpc: "2.0",
      id: "helius-test",
      method: "getAssetBatch",
      params: {
        ids: assetIds,
        displayOptions: {
          ...(showFungible && { showFungible: showFungible === "true" }),
          ...(showInscription && { showInscription: showInscription === "true" }),
          ...(showUnverifiedCollections && { showUnverifiedCollections: showUnverifiedCollections === "true" }),
          ...(showCollectionMetadata && { showCollectionMetadata: showCollectionMetadata === "true" })
        }
      }
    };

    const response = await fetch(`https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    // Check for errors in the Helius API response
    if (data.error) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify(data)
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Error in get-asset-batch function:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Internal server error",
        details: error.message
      })
    };
  }
};
