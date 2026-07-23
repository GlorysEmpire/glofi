'use client'

/**
 * Global wallet connection state (MetaMask / injected provider).
 * Listens for account changes so UI stays in sync when the user switches wallets.
 */
import { createContext, useContext, useState, useEffect } from 'react'

type WalletContextType = {
  walletAddress: string
  connected: boolean
  loading: boolean
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
}

const WalletContext = createContext<WalletContextType>({
  walletAddress: '',
  connected: false,
  loading: false,
  connectWallet: async () => {},
  disconnectWallet: () => {},
})

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [walletAddress, setWalletAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const connected = walletAddress !== ''

  // ─── Restore session + listen for account switches ─────────────────────

  useEffect(() => {
    const eth = (window as unknown as { ethereum?: {
      request: (args: { method: string }) => Promise<string[]>
      on?: (event: string, handler: (...args: unknown[]) => void) => void
      removeListener?: (event: string, handler: (...args: unknown[]) => void) => void
    } }).ethereum

    if (!eth) return

    // Silently attach if already authorized (no popup)
    async function checkWallet() {
      try {
        const accounts = await eth!.request({ method: 'eth_accounts' })
        if (accounts.length > 0) setWalletAddress(accounts[0])
      } catch {
        // ignore — user may have locked wallet
      }
    }
    checkWallet()

    // Keep address current when user switches accounts in MetaMask
    function onAccountsChanged(accounts: unknown) {
      const list = accounts as string[]
      if (list?.length > 0) setWalletAddress(list[0])
      else setWalletAddress('')
    }

    eth.on?.('accountsChanged', onAccountsChanged)
    return () => {
      eth.removeListener?.('accountsChanged', onAccountsChanged)
    }
  }, [])

  // ─── Explicit connect (popup) ──────────────────────────────────────────

  async function connectWallet() {
    const eth = (window as unknown as { ethereum?: {
      request: (args: { method: string }) => Promise<string[]>
    } }).ethereum

    if (!eth) {
      alert('Please install MetaMask to continue. Visit metamask.io')
      return
    }

    try {
      setLoading(true)
      const accounts = await eth.request({ method: 'eth_requestAccounts' })
      if (accounts.length > 0) setWalletAddress(accounts[0])
    } catch {
      alert('Wallet connection rejected. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  /** Local disconnect only — user should also revoke site in MetaMask for full security. */
  function disconnectWallet() {
    setWalletAddress('')
  }

  return (
    <WalletContext.Provider
      value={{
        walletAddress,
        connected,
        loading,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  return useContext(WalletContext)
}
