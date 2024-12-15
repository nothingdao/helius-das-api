// src/components/WalletModal.tsx
import * as React from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { X } from 'lucide-react'
import { WalletReadyState } from '@solana/wallet-adapter-base'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface WalletModalProps {
  isOpen: boolean
  onClose: () => void
}

export const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose }) => {
  const { wallets, select } = useWallet()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect Wallet</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {wallets.map((wallet) => (
            <Button
              key={wallet.adapter.name}
              variant="outline"
              onClick={() => {
                select(wallet.adapter.name)
                onClose()
              }}
              disabled={wallet.readyState === WalletReadyState.Unsupported}
              className="w-full flex justify-between items-center p-3 hover:bg-accent"
            >
              <div className="flex items-center gap-3">
                {wallet.adapter.icon && (
                  <img
                    src={wallet.adapter.icon}
                    alt={`${wallet.adapter.name} icon`}
                    className="w-6 h-6"
                  />
                )}
                <span className="font-semibold">{wallet.adapter.name}</span>
              </div>
              {wallet.readyState === WalletReadyState.Installed && (
                <Badge variant="default">Installed</Badge>
              )}
            </Button>
          ))}
        </div>

        <div className="mt-6 text-sm text-muted-foreground text-center">
          <p>New to Solana wallets?</p>
          <Button
            variant="link"
            onClick={() => window.open('https://solana.com/ecosystem/explore?categories=wallet', '_blank')}
            className="text-primary"
          >
            Learn More
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default WalletModal
