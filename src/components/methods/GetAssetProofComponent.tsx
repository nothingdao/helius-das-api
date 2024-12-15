// src/components/methods/GetAssetProofComponent.tsx
import React, { useState } from "react";
import { AlertCircle, CheckCircle2, Copy, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

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
        throw new Error(data.error.message || "Error fetching proof");
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
    toast("Copied to clipboard!");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Get Asset Proof</h1>
        <p className="text-base-content/70">
          Get a merkle proof for a compressed NFT (cNFT) by its ID. This proof is essential for transactions involving compressed NFTs.
        </p>
        <Alert variant="default" className="mt-4">
          <Info className="w-4 h-4" />
          <span>Note: Asset proofs are only available for compressed NFTs.</span>
        </Alert>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="assetId" className="block text-sm font-medium mb-2">
            Asset ID
          </label>
          <Input
            id="assetId"
            type="text"
            value={assetId}
            onChange={(e) => setAssetId(e.target.value)}
            placeholder="Enter Asset ID"
          />
        </div>

        <Button
          onClick={handleRun}
          disabled={!assetId || loading}
          className="w-full"
        >
          {loading ? "Loading..." : "Run"}
        </Button>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </Alert>
        )}

        {response && !error && (
          <div className="space-y-4">
            <Alert variant="default">
              <CheckCircle2 className="w-4 h-4" />
              <span>Successfully retrieved proof</span>
            </Alert>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Proof Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">Root:</p>
                      <p className="text-sm break-all">{response.result.root}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(response.result.root)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>

                  <div>
                    <div className="flex justify-between items-center">
                      <p className="font-semibold">Proof ({response.result.proof.length} nodes):</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(JSON.stringify(response.result.proof))}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
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
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(response.result.tree_id)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">Leaf:</p>
                      <p className="text-sm break-all">{response.result.leaf}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(response.result.leaf)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GetAssetProofComponent;
