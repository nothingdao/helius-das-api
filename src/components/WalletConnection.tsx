// src/components/WalletConnection.tsx
import * as React from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { ChevronDown, Wallet, LogOut, Settings, History } from 'lucide-react'
import { PublicKey } from '@solana/web3.js'
import { WalletModal } from './WalletModal'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

export const WalletConnection: React.FC = () => {
  const { publicKey, connected, disconnect } = useWallet()
  const [isWalletModalOpen, setIsWalletModalOpen] = React.useState<boolean>(false)

  const truncatePublicKey = (key: PublicKey | null): string => {
    if (!key) return ''
    const base58 = key.toBase58()
    return `${base58.slice(0, 4)}...${base58.slice(-4)}`
  }

  return (
    <div className="relative">
      {connected ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Wallet className="w-3 h-3" />
              {truncatePublicKey(publicKey)}
              <ChevronDown className="w- h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onSelect={() => console.log('Transaction History clicked')}
              className="cursor-pointer"
            >
              <History className="mr-2 h-4 w-4" />
              <span>Transactions</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onSelect={() => console.log('Settings clicked')}
              className="cursor-pointer"
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onSelect={() => disconnect()}
              className="cursor-pointer text-destructive focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Disconnect</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsWalletModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Wallet className="w-4 h-4" />
          Connect Wallet
        </Button>
      )}

      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
      />
    </div>
  )
}

export default WalletConnection
