# Helius DAS API Interface

A comprehensive web interface for interacting with the Helius Digital Asset Standards (DAS) API on Solana. This project provides a user-friendly dashboard for querying and managing digital assets, including NFTs, compressed NFTs, and fungible tokens.

![Static Badge](https://img.shields.io/badge/solana-mainnet-success)
![GitHub License](https://img.shields.io/badge/license-MIT-blue)
![Status](https://img.shields.io/badge/status-in%20development-orange)

## Features

- 🔐 Wallet authentication (Phantom, Solflare, etc.)
- 📊 Asset portfolio viewing
- 🖼️ NFT metadata display
- 💎 Compressed NFT support
- 💰 Token balance tracking
- 🔍 Advanced asset search
- 🌓 Light/dark mode support
- 💻 Responsive design

## Development Setup

### Prerequisites

- Node.js >= 18
- Helius API Key
- Solana Wallet

### Installation

1. Clone the repository:

```bash
git clone https://github.com/nothingdao/helius-das-api.git
cd helius-das-api
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file:

```env
HELIUS_API_KEY="your-helius-api-key"
```

4. Start the development server:

For Netlify:

```bash
netlify dev
```

For Vercel:

```bash
vercel dev
```

## Project Structure

```
src/
├── components/              # React components
│   ├── methods/            # DAS API method components
│   └── shared/             # Shared/common components
├── lib/                    # Core API utilities
├── netlify/                # Netlify serverless functions
│   └── functions/
├── pages/                  # Vercel API routes
│   └── api/
└── types/                  # TypeScript type definitions
```

## Implementation Status

### ✅ Completed

#### Core Setup

- [x] Project structure
- [x] Wallet connection
- [x] Basic routing

#### DAS API Methods

- [x] Get Asset
- [x] Get Asset Batch
- [x] Get Asset Proof
- [x] Get Asset Proof Batch
- [x] Search Assets
- [x] Get Asset by Owner

### 🚧 In Progress

#### DAS API Methods

- [ ] Get Assets by Authority
- [ ] Get Assets by Creator
- [ ] Get Assets by Group

#### Features

- [ ] Asset type filtering
- [ ] Batch operations
- [ ] Advanced sorting options
- [ ] Error boundaries

### 📋 Planned

#### DAS API Methods

- [ ] Get Signatures for Asset
- [ ] Get Token Accounts
- [ ] Get NFT Events
- [ ] Get Collections
- [ ] Search Collections

#### Features

- [ ] Asset price tracking
- [ ] Portfolio analytics
- [ ] Bulk operations
- [ ] Data export
- [ ] Advanced filtering

#### Technical

- [ ] Unit tests
- [ ] E2E tests
- [ ] CI/CD setup
- [ ] API documentation
- [ ] Performance optimization

## Deployment Options

### Netlify Deployment

1. Set up your environment variables in Netlify:

```
HELIUS_API_KEY=your_api_key_here
```

2. Deploy using the Netlify CLI or connect your repository to Netlify

Available at `/.netlify/functions/[endpoint]`

### Vercel Deployment

1. Set up your environment variables in Vercel:

```
HELIUS_API_KEY=your_api_key_here
```

2. Deploy using the Vercel CLI or connect your repository to Vercel

Available at `/api/[endpoint]`

## API Endpoints

### Currently Implemented

| Endpoint                | Status | Description                           |
| ----------------------- | ------ | ------------------------------------- |
| `get-asset`             | ✅     | Get an asset by its ID                |
| `get-asset-batch`       | ✅     | Get multiple assets by their IDs      |
| `get-assets-by-owner`   | ✅     | Get assets owned by an address        |
| `search-assets`         | ✅     | Search assets with various filters    |
| `get-asset-proof`       | 🚧     | Get merkle proof for compressed asset |
| `get-asset-proof-batch` | 🚧     | Get multiple asset proofs             |

### Available Methods

Each endpoint supports both Netlify and Vercel deployments:

Netlify:

```
/.netlify/functions/[endpoint]
```

Vercel:

```
/api/[endpoint]
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

[MIT License](LICENSE)

## Acknowledgments

- [Helius](https://helius.xyz/) - DAS API provider
- [DaisyUI](https://daisyui.com/) - UI components
- [@solana/web3.js](https://solana-labs.github.io/solana-web3.js/) - Solana integration

## Support

For support, please open an issue or refer to the [Helius Documentation](https://docs.helius.xyz/).
