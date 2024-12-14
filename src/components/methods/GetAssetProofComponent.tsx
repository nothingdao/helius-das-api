// src/components/methods/GetAssetProofComponent.tsx
import React, { useState } from "react";
import { AlertCircle, CheckCircle2, Copy, Info } from "lucide-react";

interface ProofResponse {
  jsonrpc: string;
  result: {
    root: string;
    proof: string[];
    node_index: number;
    leaf: string;
    tree_id: string;
  };
  id: string;
}

const GetAssetProofComponent = () => {
  const [assetId, setAssetId] = useState("");
  const [response, setResponse] = useState<null | ProofResponse>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRun = async () => {
    setError("");
    setResponse(null);
    setLoading(true);

    try {
      const res = await fetch(
        `/.netlify/functions/get-asset-proof?assetId=${encodeURIComponent(assetId)}`
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error.message || 'Error fetching proof');
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
        <h1 className="text-3xl font-bold mb-2">Get Asset Proof</h1>
        <p className="text-base-content/70">
          Get a merkle proof for a compressed NFT (cNFT) by its ID. This proof is essential for transactions involving compressed NFTs.
        </p>
        <div className="alert alert-info mt-4">
          <Info className="w-4 h-4" />
          <span>Note: Asset proofs are only available for compressed NFTs.</span>
        </div>
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
              <span>Successfully retrieved proof</span>
            </div>

            <div className="space-y-4">
              <div className="card bg-base-200">
                <div className="card-body">
                  <h3 className="card-title text-lg">Proof Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">Root:</p>
                        <p className="text-sm break-all">{response.result.root}</p>
                      </div>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => copyToClipboard(response.result.root)}
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>

                    <div>
                      <div className="flex justify-between items-center">
                        <p className="font-semibold">Proof ({response.result.proof.length} nodes):</p>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => copyToClipboard(JSON.stringify(response.result.proof))}
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="bg-base-300 p-2 rounded-lg mt-2">
                        <pre className="text-xs overflow-auto max-h-40">
                          {JSON.stringify(response.result.proof, null, 2)}
                        </pre>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="font-semibold">Node Index:</p>
                        <p className="text-sm">{response.result.node_index}</p>
                      </div>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">Tree ID:</p>
                          <p className="text-sm break-all">{response.result.tree_id}</p>
                        </div>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => copyToClipboard(response.result.tree_id)}
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">Leaf:</p>
                        <p className="text-sm break-all">{response.result.leaf}</p>
                      </div>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => copyToClipboard(response.result.leaf)}
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GetAssetProofComponent;
