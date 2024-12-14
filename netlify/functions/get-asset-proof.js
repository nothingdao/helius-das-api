// netlify/functions/get-asset-proof.js
export const handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

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
    const { assetId } = event.queryStringParameters || {};

    if (!assetId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Missing 'assetId' parameter" })
      };
    }

    const body = {
      jsonrpc: "2.0",
      id: "helius-test",
      method: "getAssetProof",
      params: {
        id: assetId
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
    console.error('Error in get-asset-proof function:', error);

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
