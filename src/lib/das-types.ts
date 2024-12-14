// src/lib/das-types.ts

export interface DasMethod {
  id: string
  name: string
  path: string
  description: string
}

export const DAS_METHODS: DasMethod[] = [
  {
    id: 'get-asset',
    name: 'Get Asset',
    path: '/das/get-asset',
    description: 'Get an asset by its ID',
  },
  {
    id: 'get-asset-batch',
    name: 'Get Asset Batch',
    path: '/das/get-asset-batch',
    description: 'Get multiple assets by their IDs',
  },
  {
    id: 'get-asset-proof',
    name: 'Get Asset Proof',
    path: '/das/get-asset-proof',
    description: 'Get Merkle proof for a compressed asset',
  },
  {
    id: 'get-asset-proof-batch',
    name: 'Get Asset Proof Batch',
    path: '/das/get-asset-proof-batch',
    description: 'Get multiple asset proofs',
  },
  {
    id: 'search-assets',
    name: 'Search Assets',
    path: '/das/search-assets',
    description: 'Search for assets using various parameters',
  },
  {
    id: 'get-assets-by-owner',
    name: 'Get Assets by Owner',
    path: '/das/get-assets-by-owner',
    description: 'Get assets owned by an address',
  },
  {
    id: 'get-assets-by-authority',
    name: 'Get Assets by Authority',
    path: '/das/get-assets-by-authority',
    description: 'Get assets with a specific authority',
  },
  {
    id: 'get-assets-by-creator',
    name: 'Get Assets by Creator',
    path: '/das/get-assets-by-creator',
    description: 'Get assets created by an address',
  },
  {
    id: 'get-assets-by-group',
    name: 'Get Assets by Group',
    path: '/das/get-assets-by-group',
    description: 'Get assets by group key and value',
  },
  {
    id: 'get-signatures-for-asset',
    name: 'Get Signatures for Asset',
    path: '/das/get-signatures-for-asset',
    description: 'Get transaction signatures for a compressed asset',
  },
  {
    id: 'get-token-accounts',
    name: 'Get Token Accounts',
    path: '/das/get-token-accounts',
    description: 'Get token accounts for a mint or owner',
  },
  {
    id: 'get-nft-editions',
    name: 'Get NFT Editions',
    path: '/das/get-nft-editions',
    description: 'Get edition NFTs for a master NFT',
  },
]
