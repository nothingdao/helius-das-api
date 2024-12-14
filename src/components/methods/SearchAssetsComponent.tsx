import React, { useState } from "react";
import { AlertCircle, CheckCircle2, Search } from "lucide-react";

interface SearchParams {
  ownerAddress?: string;
  page?: number;
  limit?: number;
  sortBy?: {
    sortBy: 'created' | 'recent_action' | 'updated' | 'none';
    sortDirection: 'asc' | 'desc';
  };
  frozen?: boolean;
  burnt?: boolean;
  tokenType?: 'fungible' | 'nonFungible' | 'regularNFT' | 'compressedNFT' | 'all';
  compressed?: boolean;
  delegate?: string;
  creatorAddress?: string;
  creatorVerified?: boolean;
  displayOptions?: {
    showUnverifiedCollections?: boolean;
    showCollectionMetadata?: boolean;
    showGrandTotal?: boolean;
    showNativeBalance?: boolean;
    showInscription?: boolean;
    showZeroBalance?: boolean;
  };
}

const SearchAssetsComponent = () => {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    page: 1,
    limit: 100,
    displayOptions: {
      showUnverifiedCollections: true,
      showCollectionMetadata: true,
      showGrandTotal: true,
      showNativeBalance: true,
      showInscription: true
    }
  });
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setError("");
    setResponse(null);
    setLoading(true);

    // Validate required fields based on tokenType
    if (searchParams.tokenType && !searchParams.ownerAddress) {
      setError("Owner address is required when using tokenType filter");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/.netlify/functions/search-assets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchParams),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error.message || 'Error searching assets');
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
        <h1 className="text-3xl font-bold mb-2">Search Assets</h1>
        <p className="text-base-content/70">
          Search for assets using a variety of parameters. This method supports searching for
          compressed NFTs, regular NFTs, and fungible tokens.
        </p>
      </div>

      <div className="space-y-6">
        {/* Basic Search Parameters */}
        <div className="card bg-base-200">
          <div className="card-body">
            <h3 className="card-title text-lg">Basic Search</h3>
            <div className="space-y-4">
              <div>
                <label className="label">
                  <span className="label-text">Owner Address</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={searchParams.ownerAddress || ''}
                  onChange={(e) => setSearchParams({
                    ...searchParams,
                    ownerAddress: e.target.value
                  })}
                  placeholder="Enter owner address"
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Token Type</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={searchParams.tokenType || ''}
                  onChange={(e) => setSearchParams({
                    ...searchParams,
                    tokenType: e.target.value as any
                  })}
                >
                  <option value="">Any</option>
                  <option value="fungible">Fungible Tokens</option>
                  <option value="nonFungible">All NFTs</option>
                  <option value="regularNFT">Regular NFTs</option>
                  <option value="compressedNFT">Compressed NFTs</option>
                  <option value="all">All</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">
                    <span className="label-text">Page</span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered w-full"
                    value={searchParams.page || 1}
                    onChange={(e) => setSearchParams({
                      ...searchParams,
                      page: parseInt(e.target.value)
                    })}
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
                    value={searchParams.limit || 100}
                    onChange={(e) => setSearchParams({
                      ...searchParams,
                      limit: Math.min(parseInt(e.target.value), 1000)
                    })}
                    min="1"
                    max="1000"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Display Options */}
        <div className="card bg-base-200">
          <div className="card-body">
            <h3 className="card-title text-lg">Display Options</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={searchParams.displayOptions?.showUnverifiedCollections || false}
                  onChange={(e) => setSearchParams({
                    ...searchParams,
                    displayOptions: {
                      ...searchParams.displayOptions,
                      showUnverifiedCollections: e.target.checked
                    }
                  })}
                />
                <span>Show Unverified Collections</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={searchParams.displayOptions?.showCollectionMetadata || false}
                  onChange={(e) => setSearchParams({
                    ...searchParams,
                    displayOptions: {
                      ...searchParams.displayOptions,
                      showCollectionMetadata: e.target.checked
                    }
                  })}
                />
                <span>Show Collection Metadata</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={searchParams.displayOptions?.showGrandTotal || false}
                  onChange={(e) => setSearchParams({
                    ...searchParams,
                    displayOptions: {
                      ...searchParams.displayOptions,
                      showGrandTotal: e.target.checked
                    }
                  })}
                />
                <span>Show Grand Total</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={searchParams.displayOptions?.showNativeBalance || false}
                  onChange={(e) => setSearchParams({
                    ...searchParams,
                    displayOptions: {
                      ...searchParams.displayOptions,
                      showNativeBalance: e.target.checked
                    }
                  })}
                />
                <span>Show Native Balance</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={searchParams.displayOptions?.showInscription || false}
                  onChange={(e) => setSearchParams({
                    ...searchParams,
                    displayOptions: {
                      ...searchParams.displayOptions,
                      showInscription: e.target.checked
                    }
                  })}
                />
                <span>Show Inscription</span>
              </label>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleSearch}
            disabled={loading}
            className="btn btn-primary flex-1"
          >
            {loading ? 'Searching...' : 'Search'}
            <Search className="w-4 h-4 ml-2" />
          </button>
        </div>

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
              <span>Found {response.result?.items?.length || 0} assets</span>
              {response.result?.total && (
                <span className="ml-2">(Total: {response.result.total})</span>
              )}
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

export default SearchAssetsComponent;
