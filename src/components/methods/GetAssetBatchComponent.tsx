// src/components/methods/GetAssetBatchComponent.tsx
import React, { useState } from "react";
import { AlertCircle, CheckCircle2, Plus, X } from "lucide-react";

interface AssetResponse {
  jsonrpc: string;
  result: any[];
  id: string;
}

const GetAssetBatchComponent = () => {
  const [assetIds, setAssetIds] = useState<string[]>(['']);
  const [response, setResponse] = useState<null | AssetResponse>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  // Display options
  const [showFungible, setShowFungible] = useState(false);
  const [showInscription, setShowInscription] = useState(false);
  const [showUnverifiedCollections, setShowUnverifiedCollections] = useState(false);
  const [showCollectionMetadata, setShowCollectionMetadata] = useState(false);

  const handleAddAssetId = () => {
    setAssetIds([...assetIds, '']);
  };

  const handleRemoveAssetId = (index: number) => {
    const newAssetIds = assetIds.filter((_, i) => i !== index);
    setAssetIds(newAssetIds.length ? newAssetIds : ['']);
  };

  const handleAssetIdChange = (index: number, value: string) => {
    const newAssetIds = [...assetIds];
    newAssetIds[index] = value;
    setAssetIds(newAssetIds);
  };

  const handleRun = async () => {
    setError("");
    setResponse(null);
    setLoading(true);

    // Filter out empty asset IDs
    const validAssetIds = assetIds.filter(id => id.trim());

    if (validAssetIds.length === 0) {
      setError("Please enter at least one asset ID");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/.netlify/functions/get-asset-batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assetIds: validAssetIds,
          showFungible,
          showInscription,
          showUnverifiedCollections,
          showCollectionMetadata
        }),
      });

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
        <h1 className="text-3xl font-bold mb-2">Get Asset Batch</h1>
        <p className="text-base-content/70">
          Retrieve information about multiple assets by their IDs. You can request up to 1,000 assets at once.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          {assetIds.map((id, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={id}
                onChange={(e) => handleAssetIdChange(index, e.target.value)}
                className="input input-bordered flex-1"
                placeholder="Enter Asset ID"
              />
              <button
                onClick={() => handleRemoveAssetId(index)}
                className="btn btn-ghost btn-square"
                disabled={assetIds.length === 1}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}

          <button
            onClick={handleAddAssetId}
            className="btn btn-ghost btn-sm"
            disabled={assetIds.length >= 1000}
          >
            <Plus className="w-4 h-4" />
            Add Asset ID
          </button>
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
          disabled={loading || assetIds.every(id => !id.trim())}
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

export default GetAssetBatchComponent;
