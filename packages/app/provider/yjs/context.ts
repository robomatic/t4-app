import { createContext, type Context } from 'react'
import { WebrtcProvider } from 'y-webrtc'
import * as Y from 'yjs'

export type DocContext = Context<Y.Doc | null>
export type NetworkProviderContext = Context<WebrtcProvider | null>

/*
 * internalDoc: private document persisted to idb
 * sharedDoc: document persisted to idb and shared to wrtc
 * bbNetowrkDocProvider: wrtc awareness and presence
 */
export const InternalDocContext: DocContext = createContext<Y.Doc | null>(null)
export const SharedDocContext: DocContext = createContext<Y.Doc | null>(null)
export const NetworkProviderContext = createContext<WebrtcProvider | null>(null)
