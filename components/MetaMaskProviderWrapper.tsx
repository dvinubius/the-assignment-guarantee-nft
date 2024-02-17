'use client'

import { MetaMaskProvider } from '@metamask/sdk-react'
import React from 'react'


function MetaMaskProviderWrapper({children}: {children: React.ReactNode}) {
  const host = typeof window !== "undefined" ? window.location.host : "defaultHost";

  const sdkOptions = {
    logging: { developerMode: false },
    checkInstallationImmediately: false,
    dappMetadata: {
      name: "GuaranteeNFT",
      url: host, // using the host constant defined above
    },
};

  return (
    <MetaMaskProvider debug={false} sdkOptions={sdkOptions}>
      {children}
    </MetaMaskProvider>
  )
}

export default MetaMaskProviderWrapper