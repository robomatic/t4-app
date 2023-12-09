import 'client-only'
import { atom, useAtom } from 'jotai'
import { IndexeddbPersistence } from 'y-indexeddb'
import * as Y from 'yjs'
import { WebrtcProvider } from 'y-webrtc'

const internalDocName = 'lofi'
const networkDocName = 'shared'
const signaling = ['ws://localhost:4444']

const iDoc = new Y.Doc()
const sDoc = new Y.Doc()
const nProv = new WebrtcProvider(networkDocName, sDoc, { signaling })

new IndexeddbPersistence(networkDocName, sDoc)
new IndexeddbPersistence(internalDocName, iDoc)

const internalDocAtom = atom(iDoc)
const sharedDocAtom = atom(sDoc)
const networkProviderAtom = atom(nProv)

export function useInternalDoc() {
  return [...useAtom(internalDocAtom)] as const
}

export function useSharedDoc() {
  return [...useAtom(sharedDocAtom)] as const
}

export function useNetworkProvider() {
  return [...useAtom(networkProviderAtom)] as const
}
