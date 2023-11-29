'use client'

import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import * as Y from 'yjs'
import { IndexeddbPersistence } from 'y-indexeddb'
import { WebrtcProvider } from 'y-webrtc'

import { InternalDocContext, SharedDocContext, NetworkProviderContext } from './context'

export type YjsProvider = {
  children: ReactNode
  signalUrls: string[]
}

export function YjsProvider({ children, signalUrls }: YjsProvider) {
  const internalDocName = 'robomatic'
  const networkDocName = 'shared'
  const [internalDoc, setInternalDoc] = useState<Y.Doc | null>(null)
  const [sharedDoc, setSharedDoc] = useState<Y.Doc | null>()
  const [networkProvider, setNetworkProvider] = useState<WebrtcProvider | null>()
  const [internalDocIdbPersistence, setInternalDocIdbPersistence] =
    useState<IndexeddbPersistence | null>()
  const [sharedDocIdbPersistence, setSharedDocIdbPersistence] =
    useState<IndexeddbPersistence | null>()

  useEffect(() => {
    const iDoc = new Y.Doc()
    const iPers = new IndexeddbPersistence(internalDocName, iDoc)
    setInternalDoc(iDoc)
    setInternalDocIdbPersistence(iPers)

    return () => {
      internalDoc?.destroy()
      internalDocIdbPersistence?.destroy()
    }
  }, [])

  useEffect(() => {
    const sDoc = new Y.Doc()
    const sPers = new IndexeddbPersistence(networkDocName, sDoc)
    setSharedDoc(sDoc)
    setSharedDocIdbPersistence(sPers)

    return () => {
      sharedDoc?.destroy()
      sharedDocIdbPersistence?.destroy()
    }
  }, [])

  useEffect(() => {
    if (sharedDoc) {
      const nProv = new WebrtcProvider(networkDocName, sharedDoc, { signaling: signalUrls })
      setNetworkProvider(nProv)
    }

    return () => {
      networkProvider?.destroy()
    }
  }, [sharedDoc])

  return (
    <>
      {internalDoc && sharedDoc && networkProvider ? (
        <InternalDocContext.Provider value={internalDoc}>
          <SharedDocContext.Provider value={sharedDoc}>
            <NetworkProviderContext.Provider value={networkProvider}>
              {children}
            </NetworkProviderContext.Provider>
          </SharedDocContext.Provider>
        </InternalDocContext.Provider>
      ) : (
        <div>Loading ...</div>
      )}
    </>
  )
}
