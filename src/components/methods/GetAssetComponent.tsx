// src/components/methods/GetAssetComponent.tsx
import React, { useState } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface AssetResponse {
  jsonrpc: string;
  result: any;
  id: string;
}

const GetAssetComponent = () => {
  const [assetId, setAssetId] = useState("");
  const [response, setResponse] = useState<null | AssetResponse>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  // Display options
  const [showFungible, setShowFungible] = useState(false);
  const [showInscription, setShowInscription] = useState(false);
  const [showUnverifiedCollections, setShowUnverifiedCollections] = useState(false);
  const [showCollectionMetadata, setShowCollectionMetadata] = useState(false);

  const handleRun = async () => {
    setError("");
    setResponse(null);
    setLoading(true);

    try {
      // Build the query string with options
      const queryParams = new URLSearchParams({
        assetId: assetId,
        ...(showFungible && { showFungible: 'true' }),
        ...(showInscription && { showInscription: 'true' }),
        ...(showUnverifiedCollections && { showUnverifiedCollections: 'true' }),
        ...(showCollectionMetadata && { showCollectionMetadata: 'true' })
      });

      const res = await fetch(
        `/.netlify/functions/get-asset?${queryParams.toString()}`
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error.message || 'Error fetching asset data');
      }

      setResponse(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Get Asset</h1>
        <p className="text-base-content/70">
          Retrieve information about an asset by its ID. This method returns all relevant information,
          including metadata for any NFT (cNFT, pNFT, core NFT) or Token.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="assetId" className="block text-sm font-medium mb-2">
            Asset ID
          </label>
          <input
            id="assetId"
            type="text"
            value={assetId}
            onChange={(e) => setAssetId(e.target.value)}
            className="input input-bordered w-full"
            placeholder="Enter Asset ID"
          />
        </div>

        <div>
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="btn btn-sm btn-ghost"
          >
            {showOptions ? 'Hide' : 'Show'} Display Options
          </button>

          {showOptions && (
            <div className="mt-4 space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={showFungible}
                  onChange={(e) => setShowFungible(e.target.checked)}
                />
                <span>Show Fungible</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={showInscription}
                  onChange={(e) => setShowInscription(e.target.checked)}
                />
                <span>Show Inscription</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={showUnverifiedCollections}
                  onChange={(e) => setShowUnverifiedCollections(e.target.checked)}
                />
                <span>Show Unverified Collections</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={showCollectionMetadata}
                  onChange={(e) => setShowCollectionMetadata(e.target.checked)}
                />
                <span>Show Collection Metadata</span>
              </label>
            </div>
          )}
        </div>

        <button
          onClick={handleRun}
          disabled={!assetId || loading}
          className="btn btn-primary w-full"
        >
          {loading ? 'Loading...' : 'Run'}
        </button>

        {error && (
          <div className="alert alert-error">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        {response && !error && (
          <div className="space-y-4">
            <div className="alert alert-success">
              <CheckCircle2 className="w-4 h-4" />
              <span>Successfully retrieved asset data</span>
            </div>

            <div className="bg-base-200 p-4 rounded-lg">
              <pre className="overflow-auto max-h-[500px] text-sm">
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GetAssetComponent;
