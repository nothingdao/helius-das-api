// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { WalletConnection } from './components/WalletConnection'
import { useWallet } from '@solana/wallet-adapter-react'
import * as React from 'react'
import { StyleSwitcher } from './components/StyleSwitcher'
import GetAssetComponent from './components/methods/GetAssetComponent'
import { DAS_METHODS } from './lib/das-types'
import GetAssetBatchComponent from './components/methods/GetAssetBatchComponent'
import GetAssetProofBatchComponent from './components/methods/GetAssetProofBatchComponent'
import GetAssetProofComponent from './components/methods/GetAssetProofComponent'
import SearchAssetsComponent from './components/methods/SearchAssetsComponent'
import GetAssetsByOwnerComponent from './components/methods/GetAssetsByOwnerComponent'

export const App: React.FC = () => {
  const { publicKey } = useWallet()

  return (

    <Router>

      <div className="flex min-h-screen flex-col">
        {/* Navbar */}
        <nav className='navbar bg-base-200 p-4'>
          <div className='container mx-auto'>
            <div className='flex-1 flex items-center gap-4'>
              <Link
                to='/'
                className='flex items-center gap-2 hover:text-primary'
              >
                helius-das-api
              </Link>
              {publicKey && (
                <Link
                  to='/dashboard'
                  className='hover:text-primary'
                >
                  Dashboard
                </Link>
              )}
            </div>

            <div className='flex-none flex items-center gap-4'>
              <StyleSwitcher />
              <WalletConnection />
            </div>
          </div>
        </nav>

        {/* Content Section */}
        <div className="flex flex-1">
          {/* Sidebar */}
          <nav className="w-64 bg-base-100 p-4 border-r border-base-300 text-sm">
            <div className="mb-4">
              <h2 className="">DAS API Methods</h2>
            </div>
            <ul className="space-y-2">
              {DAS_METHODS.map((method) => (
                <li key={method.id}>
                  <Link
                    to={method.path}
                    className="block px-4 py-2 hover:bg-base-200 rounded-lg transition-colors"
                  >
                    {method.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Main Content */}
          <div className="flex-1 p-4">
            <Routes>
              {/* Define routes for DAS methods */}
              <Route path="/das/get-asset" element={<GetAssetComponent />} />
              <Route path="/das/get-asset-batch" element={<GetAssetBatchComponent />} />
              <Route path="/das/get-asset-proof" element={<GetAssetProofComponent />} />
              <Route path="/das/get-asset-proof-batch" element={<GetAssetProofBatchComponent />} />
              <Route path="/das/search-assets" element={<SearchAssetsComponent />} />
              <Route path="/das/get-assets-by-owner" element={<GetAssetsByOwnerComponent />} />
            </Routes>
          </div>
        </div>
      </div>



    </Router>
  )
}

export default App
