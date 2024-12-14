import React, { useState } from "react";
import { AlertCircle, CheckCircle2, Copy, Info, Plus, X } from "lucide-react";

interface AssetResponse {
  result: {
    compression?: {
      compressed: boolean;
      tree?: string;
    };
    interface?: string;
  };
}

interface ProofBatchResponse {
  jsonrpc: string;
  result: {
    [key: string]: {
      root: string;
      proof: string[];
      node_index: number;
      leaf: string;
      tree_id: string;
    };
  };
  id: string;
}

const GetAssetProofBatchComponent = () => {
  const [assetIds, setAssetIds] = useState<string[]>(['']);
  const [response, setResponse] = useState<null | ProofBatchResponse>(null);
  const [error, setError] = useState("");
  const [warnings, setWarnings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);

  // Example compressed NFTs for testing
  const EXAMPLE_CNFTS = [
    'F9Lw3ki3hJ7PF9HQXsBzoY8GyE6sPoEZZdXJBsTTD2rk',  // Mad Lads #8420
    'Bu1DEKeawy7txbnCEJE4BU3BKLXaNAKCYcHR4XhndGss',  // Famous Fox Federation #3053
    '4nDWFT3optebp4p6eWyVTkTE4qADQNQxDFqzdHPXZFaj'   // Shadow Super Coder
  ];

  const handleAddAssetId = () => {
    setAssetIds([...assetIds, '']);
  };

  const handleRemoveAssetId = (index: number) => {
    const newAssetIds = assetIds.filter((_, i) => i !== index);
    setAssetIds(newAssetIds.length ? newAssetIds : ['']);
    // Clear warning for removed asset
    const newWarnings = { ...warnings };
    delete newWarnings[assetIds[index]];
    setWarnings(newWarnings);
  };

  const handleAssetIdChange = (index: number, value: string) => {
    const newAssetIds = [...assetIds];
    newAssetIds[index] = value;
    setAssetIds(newAssetIds);
    // Clear warning for changed asset
    const newWarnings = { ...warnings };
    delete newWarnings[assetIds[index]];
    setWarnings(newWarnings);
  };

  const checkIfCompressed = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(
        `/.netlify/functions/get-asset?assetId=${encodeURIComponent(id)}`
      );

      if (!res.ok) {
        throw new Error(`Failed to verify asset ${id}`);
      }

      const data: AssetResponse = await res.json();

      if (!data.result?.compression?.compressed) {
        setWarnings(prev => ({
          ...prev,
          [id]: `Asset ${id} is not a compressed NFT`
        }));
        return false;
      }

      return true;
    } catch (err) {
      setWarnings(prev => ({
        ...prev,
        [id]: `Failed to verify asset ${id}`
      }));
      return false;
    }
  };

  const handleRun = async () => {
    setError("");
    setResponse(null);
    setWarnings({});

    const validAssetIds = assetIds.filter(id => id.trim());

    if (validAssetIds.length === 0) {
      setError("Please enter at least one asset ID");
      return;
    }

    if (validAssetIds.length > 1000) {
      setError("Cannot request more than 1,000 proofs at once");
      return;
    }

    // First validate all assets
    setValidating(true);
    const validationPromises = validAssetIds.map(checkIfCompressed);
    const validationResults = await Promise.all(validationPromises);
    setValidating(false);

    // Filter for only compressed NFTs
    const compressedAssetIds = validAssetIds.filter((_, index) => validationResults[index]);

    if (compressedAssetIds.length === 0) {
      setError("No valid compressed NFTs found in the provided list");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/.netlify/functions/get-asset-proof-batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assetIds: compressedAssetIds
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error.message || 'Error fetching proofs');
      }

      setResponse(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Get Asset Proof Batch</h1>
        <p className="text-base-content/70">
          Get merkle proofs for multiple compressed NFTs by their IDs. You can request up to 1,000 proofs at once.
        </p>
        <div className="alert alert-info mt-4">
          <Info className="w-4 h-4" />
          <div className="flex flex-col">
            <span>Only compressed NFTs (cNFTs) are supported by this endpoint.</span>
            <span className="text-xs mt-1">Example cNFT IDs: {EXAMPLE_CNFTS.join(', ')}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          {assetIds.map((id, index) => (
            <div key={index} className="space-y-1">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={id}
                  onChange={(e) => handleAssetIdChange(index, e.target.value)}
                  className={`input input-bordered flex-1 ${warnings[id] ? 'input-warning' : ''
                    }`}
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
              {warnings[id] && (
                <div className="text-warning text-sm px-2">
                  {warnings[id]}
                </div>
              )}
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

        <button
          onClick={handleRun}
          disabled={loading || validating || assetIds.every(id => !id.trim())}
          className="btn btn-primary w-full"
        >
          {validating ? 'Validating...' : loading ? 'Loading...' : 'Run'}
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
              <span>Successfully retrieved proofs</span>
            </div>

            <div className="space-y-4">
              {Object.entries(response.result).map(([assetId, proof], index) => (
                <div key={index} className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title text-lg flex justify-between items-center">
                      <span className="truncate">Asset: {assetId}</span>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => copyToClipboard(assetId)}
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">Root:</p>
                          <p className="text-sm break-all">{proof.root}</p>
                        </div>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => copyToClipboard(proof.root)}
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>

                      <div>
                        <div className="flex justify-between items-center">
                          <p className="font-semibold">Proof ({proof.proof.length} nodes):</p>
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => copyToClipboard(JSON.stringify(proof.proof))}
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="bg-base-300 p-2 rounded-lg mt-2">
                          <pre className="text-xs overflow-auto max-h-40">
                            {JSON.stringify(proof.proof, null, 2)}
                          </pre>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="font-semibold">Node Index:</p>
                          <p className="text-sm">{proof.node_index}</p>
                        </div>
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold">Tree ID:</p>
                            <p className="text-sm break-all">{proof.tree_id}</p>
                          </div>
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => copyToClipboard(proof.tree_id)}
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">Leaf:</p>
                          <p className="text-sm break-all">{proof.leaf}</p>
                        </div>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => copyToClipboard(proof.leaf)}
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GetAssetProofBatchComponent;
