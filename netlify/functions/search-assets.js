// netlify/functions/search-assets.js
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
    const searchParams = JSON.parse(event.body);

    // Build the request params
    const requestBody = {
      jsonrpc: "2.0",
      id: "helius-test",
      method: "searchAssets",
      params: {
        ...searchParams,
        page: searchParams.page || 1,
        limit: Math.min(searchParams.limit || 100, 1000)
      }
    };

    const response = await fetch(`https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
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
    console.error('Error in search-assets function:', error);

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
