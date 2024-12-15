// src/App.tsx
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { useWallet } from '@solana/wallet-adapter-react'
import { ThemeProvider } from "@/components/theme-provider"

// ShadCN UI Imports
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

// Component Imports
import { WalletConnection } from './components/WalletConnection'
import GetAssetComponent from './components/methods/GetAssetComponent'
import { DAS_METHODS } from './lib/das-types'
import GetAssetBatchComponent from './components/methods/GetAssetBatchComponent'
import GetAssetProofBatchComponent from './components/methods/GetAssetProofBatchComponent'
import GetAssetProofComponent from './components/methods/GetAssetProofComponent'
import SearchAssetsComponent from './components/methods/SearchAssetsComponent'
import GetAssetsByOwnerComponent from './components/methods/GetAssetsByOwnerComponent'
import { ModeToggle } from './components/mode-toggle'

import { Toaster } from "@/components/ui/sonner"

function AppContent() {
  const { publicKey } = useWallet()
  const location = useLocation()

  // Function to get current page name from route
  const getCurrentPageName = () => {
    const method = DAS_METHODS.find(m => m.path === location.pathname)
    return method ? method.name : 'Dashboard'
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Toaster />

      <SidebarProvider>

        <div className="grid grid-cols-[auto_1fr] min-h-screen">
          <AppSidebar />

          <SidebarInset>
            <header className="flex h-16 items-center gap-2 border-b px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />

              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">DAS API</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  {publicKey && (
                    <>
                      <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                    </>
                  )}
                  <BreadcrumbItem>
                    <BreadcrumbPage>{getCurrentPageName()}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              <div className="ml-auto flex items-center gap-4">
                {/* <StyleSwitcher /> */}
                <ModeToggle />
                <WalletConnection />
              </div>
            </header>

            <main className="p-4">
              <Routes>
                <Route path="/das/get-asset" element={<GetAssetComponent />} />
                <Route path="/das/get-asset-batch" element={<GetAssetBatchComponent />} />
                <Route path="/das/get-asset-proof" element={<GetAssetProofComponent />} />
                <Route path="/das/get-asset-proof-batch" element={<GetAssetProofBatchComponent />} />
                <Route path="/das/search-assets" element={<SearchAssetsComponent />} />
                <Route path="/das/get-assets-by-owner" element={<GetAssetsByOwnerComponent />} />
              </Routes>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  )
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}
