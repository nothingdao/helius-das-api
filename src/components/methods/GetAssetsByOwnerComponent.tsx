import React, { useState } from "react";
import { AlertCircle, CheckCircle2, Info, ArrowLeft, ArrowRight } from "lucide-react";

interface SortBy {
  sortBy: 'created' | 'recent_action' | 'updated' | 'none';
  sortDirection: 'asc' | 'desc';
}

interface DisplayOptions {
  showUnverifiedCollections?: boolean;
  showCollectionMetadata?: boolean;
  showGrandTotal?: boolean;
  showFungible?: boolean;
  showNativeBalance?: boolean;
  showInscription?: boolean;
  showZeroBalance?: boolean;
}

interface AssetsResponse {
  jsonrpc: string;
  result: {
    total: number;
    limit: number;
    page: number;
    items: any[];
    nativeBalance?: {
      lamports: number;
      price_per_sol?: number;
      total_price?: number;
    };
  };
  id: string;
}

const GetAssetsByOwnerComponent = () => {
  const [ownerAddress, setOwnerAddress] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(100);
  const [sortBy, setSortBy] = useState<SortBy>({
    sortBy: 'created',
    sortDirection: 'desc'
  });
  const [displayOptions, setDisplayOptions] = useState<DisplayOptions>({
    showUnverifiedCollections: false,
    showCollectionMetadata: true,
    showGrandTotal: true,
    showFungible: true,
    showNativeBalance: true,
    showInscription: false,
    showZeroBalance: false
  });

  const [response, setResponse] = useState<AssetsResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    setError("");
    setResponse(null);
    setLoading(true);

    if (!ownerAddress) {
      setError("Owner address is required");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/.netlify/functions/get-assets-by-owner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ownerAddress,
          page,
          limit,
          sortBy,
          options: displayOptions
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error.message || 'Error fetching assets');
      }

      setResponse(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatSol = (lamports: number) => {
    return (lamports / 1e9).toFixed(4);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Get Assets by Owner</h1>
        <p className="text-base-content/70">
          Get all assets owned by an address, including NFTs, compressed NFTs, fungible tokens, and native SOL balance.
        </p>
      </div>

      <div className="space-y-6">
        {/* Main Parameters */}
        <div className="card bg-base-200">
          <div className="card-body">
            <h3 className="card-title text-lg">Search Parameters</h3>
            <div className="space-y-4">
              <div>
                <label className="label">
                  <span className="label-text">Owner Address</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={ownerAddress}
                  onChange={(e) => setOwnerAddress(e.target.value)}
                  placeholder="Enter wallet address"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">
                    <span className="label-text">Page</span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered w-full"
                    value={page}
                    onChange={(e) => setPage(Math.max(1, parseInt(e.target.value)))}
                    min="1"
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">Limit (max 1000)</span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered w-full"
                    value={limit}
                    onChange={(e) => setLimit(Math.min(1000, Math.max(1, parseInt(e.target.value))))}
                    min="1"
                    max="1000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">
                    <span className="label-text">Sort By</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={sortBy.sortBy}
                    onChange={(e) => setSortBy({
                      ...sortBy,
                      sortBy: e.target.value as any
                    })}
                  >
                    <option value="created">Created</option>
                    <option value="recent_action">Recent Action</option>
                    <option value="updated">Updated</option>
                    <option value="none">None</option>
                  </select>
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">Sort Direction</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={sortBy.sortDirection}
                    onChange={(e) => setSortBy({
                      ...sortBy,
                      sortDirection: e.target.value as 'asc' | 'desc'
                    })}
                  >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Display Options */}
        <div className="card bg-base-200">
          <div className="card-body">
            <h3 className="card-title text-lg">Display Options</h3>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={displayOptions.showUnverifiedCollections}
                  onChange={(e) => setDisplayOptions({
                    ...displayOptions,
                    showUnverifiedCollections: e.target.checked
                  })}
                />
                <span>Show Unverified Collections</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={displayOptions.showCollectionMetadata}
                  onChange={(e) => setDisplayOptions({
                    ...displayOptions,
                    showCollectionMetadata: e.target.checked
                  })}
                />
                <span>Show Collection Metadata</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={displayOptions.showGrandTotal}
                  onChange={(e) => setDisplayOptions({
                    ...displayOptions,
                    showGrandTotal: e.target.checked
                  })}
                />
                <span>Show Grand Total</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={displayOptions.showFungible}
                  onChange={(e) => setDisplayOptions({
                    ...displayOptions,
                    showFungible: e.target.checked
                  })}
                />
                <span>Show Fungible Tokens</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={displayOptions.showNativeBalance}
                  onChange={(e) => setDisplayOptions({
                    ...displayOptions,
                    showNativeBalance: e.target.checked
                  })}
                />
                <span>Show Native Balance</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={displayOptions.showInscription}
                  onChange={(e) => setDisplayOptions({
                    ...displayOptions,
                    showInscription: e.target.checked
                  })}
                />
                <span>Show Inscriptions</span>
              </label>
            </div>
          </div>
        </div>

        {/* Controls */}
        <button
          onClick={handleFetch}
          disabled={loading || !ownerAddress}
          className="btn btn-primary w-full"
        >
          {loading ? 'Loading...' : 'Get Assets'}
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
              <span>Found {response.result.items.length} assets</span>
              {response.result.total && (
                <span className="ml-2">(Total: {response.result.total})</span>
              )}
            </div>

            {response.result.nativeBalance && (
              <div className="alert alert-info">
                <Info className="w-4 h-4" />
                <div>
                  <p>Native Balance: {formatSol(response.result.nativeBalance.lamports)} SOL</p>
                  {response.result.nativeBalance.price_per_sol && (
                    <p>Value: ${(response.result.nativeBalance.price_per_sol * parseFloat(formatSol(response.result.nativeBalance.lamports))).toFixed(2)} USD</p>
                  )}
                </div>
              </div>
            )}

            <div className="bg-base-200 p-4 rounded-lg">
              <pre className="overflow-auto max-h-[500px] text-sm">
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center">
              <button
                className="btn btn-sm"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page <= 1}
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </button>
              <span>Page {page}</span>
              <button
                className="btn btn-sm"
                onClick={() => setPage(page + 1)}
                disabled={response.result.items.length < limit}
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GetAssetsByOwnerComponent;
