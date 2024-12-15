// src/components/methods/GetAssetBatchComponent.tsx
import React, { useState } from "react";
import { AlertCircle, CheckCircle2, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface AssetResponse {
  jsonrpc: string;
  result: any[];
  id: string;
}

const GetAssetBatchComponent = () => {
  const [assetIds, setAssetIds] = useState<string[]>([""]);
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
    setAssetIds([...assetIds, ""]);
  };

  const handleRemoveAssetId = (index: number) => {
    const newAssetIds = assetIds.filter((_, i) => i !== index);
    setAssetIds(newAssetIds.length ? newAssetIds : [""]);
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

    const validAssetIds = assetIds.filter((id) => id.trim());

    if (validAssetIds.length === 0) {
      setError("Please enter at least one asset ID");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/.netlify/functions/get-asset-batch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assetIds: validAssetIds,
          showFungible,
          showInscription,
          showUnverifiedCollections,
          showCollectionMetadata,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error.message || "Error fetching asset data");
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
        <p className="text-gray-600">
          Retrieve information about multiple assets by their IDs. You can request up to 1,000 assets at once.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          {assetIds.map((id, index) => (
            <div key={index} className="flex gap-2">
              <Input
                type="text"
                value={id}
                onChange={(e) => handleAssetIdChange(index, e.target.value)}
                placeholder="Enter Asset ID"
              />
              <Button
                variant="outline"
                onClick={() => handleRemoveAssetId(index)}
                disabled={assetIds.length === 1}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}

          <Button onClick={handleAddAssetId} disabled={assetIds.length >= 1000} variant="ghost">
            <Plus className="w-4 h-4" /> Add Asset ID
          </Button>
        </div>
        <div>
          <Button variant="outline" onClick={() => setShowOptions(!showOptions)}>
            {showOptions ? "Hide" : "Show"} Display Options
          </Button>

          {showOptions && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={showFungible}
                  onCheckedChange={(checked) => setShowFungible(checked as boolean)}
                />
                <span>Show Fungible</span>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={showInscription}
                  onCheckedChange={(checked) => setShowInscription(checked as boolean)}
                />
                <span>Show Inscription</span>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={showUnverifiedCollections}
                  onCheckedChange={(checked) => setShowUnverifiedCollections(checked as boolean)}
                />
                <span>Show Unverified Collections</span>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={showCollectionMetadata}
                  onCheckedChange={(checked) => setShowCollectionMetadata(checked as boolean)}
                />
                <span>Show Collection Metadata</span>
              </div>
            </div>
          )}
        </div>

        <Button
          onClick={handleRun}
          disabled={loading || assetIds.every((id) => !id.trim())}
          className="w-full"
        >
          {loading ? "Loading..." : "Run"}
        </Button>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {response && !error && (
          <div className="space-y-4">
            <Alert variant="default">
              <CheckCircle2 className="w-4 h-4" />
              <AlertTitle>Successfully retrieved asset data</AlertTitle>
            </Alert>

            <div className="bg-gray-100 p-4 rounded-lg">
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
