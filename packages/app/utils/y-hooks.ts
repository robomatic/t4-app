import 'client-only'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useInternalDoc, useNetworkProvider } from 'app/atoms/lofi-store'
import type { Awareness } from 'y-protocols/awareness'
import * as Y from 'yjs'

type YDoc = Y.Doc

/**
 * React hook for obtaining the Yjs Awareness instance from the current context.
 *
 * @returns The Yjs Awareness instance for the current document.
 */
export function useAwareness(): Awareness {
  const [ctx] = useNetworkProvider()
  if (!ctx) {
    throw new Error('Yjs hooks must be used within a YDocProvider')
  }
  return ctx.awareness
}

/**
 * React hook that returs a setter function for the local presence object.
 *
 * @returns A setter function for the local presence object.
 */
export function usePresenceSetter<T extends Record<string, any>>(): (presence: T) => void {
  const awareness = useAwareness()

  const setLocalPresence = useCallback(
    (localState: any) => {
      if (awareness) {
        awareness.setLocalState(localState)
      }
    },
    [awareness]
  )

  return setLocalPresence
}

type UsePresenceOptions = {
  includeSelf?: boolean
}

/** React hook that returns other users’ presence values as a `Map<number, any>`. */
export function usePresence<T extends Record<string, any>>(
  options?: UsePresenceOptions
): Map<number, T> {
  const awareness = useAwareness()
  const [presence, setPresence] = useState<Map<number, T>>(new Map())

  const includeSelf = options?.includeSelf || false

  useEffect(() => {
    if (awareness) {
      const callback = () => {
        const map = new Map()
        awareness.getStates().forEach((state, clientID) => {
          if (!includeSelf && clientID === awareness.clientID) return

          if (Object.keys(state).length > 0) {
            map.set(clientID, state)
          }
        })

        setPresence(map)
      }
      awareness.on('change', callback)
      return () => {
        awareness.off('change', callback)
      }
    }
  }, [awareness, includeSelf])

  return presence
}

function useRedraw() {
  const [_, setRedraw] = useState(0)
  return useCallback(() => setRedraw((x) => x + 1), [setRedraw])
}

/** Represents possible values to pass to hooks that return Yjs objects,
 * which determines whether or not they trigger a re-render when the
 * Yjs object changes.
 *
 * - `'deep'` will re-render when any nested property changes.
 * - `'shallow'` will re-render when the object itself changes.
 * - `'none'` will never re-render.
 */
export type ObserverKind = 'deep' | 'shallow' | 'none'

/**
 * Options for hooks that return Yjs objects, like {@link useMap}.
 *
 * @see {@link ObserverKind}
 */
export type ObjectOptions = {
  observe?: ObserverKind
}

/**
 * Returns a `Y.Map<T>` object from the `Y.Doc` in the current context.
 *
 * The string `name` is the name of the top-level Yjs object to return.
 * Two clients that call `useMap(...)` with the same `name` will get
 * the same object.
 *
 * By default, this will subscribe the calling component to updates on
 * the object and its children. See {@link ObjectOptions} and
 * {@link ObserverKind} for finer control of observer behavior.
 *
 * @typeParam T The type of the values in the map. Keys are always strings.
 * @param name The name of the top-level Yjs object to return.
 * @param objectOptions
 * @returns
 */
export function useMap<T>(
  name: string,
  yDoc?: YDoc | undefined,
  objectOptions?: ObjectOptions
): Y.Map<T> {
  let doc = yDoc
  if (!doc) {
    const [iDoc] = useInternalDoc()
    doc = iDoc
  }
  const map = useMemo(() => doc.getMap<T>(name), [doc, name])
  useObserve(map, objectOptions?.observe || 'deep')

  return map
}

/**
 * Returns a `Y.Array<T>` object from the `Y.Doc` in the current context.
 *
 * The string `name` is the name of the top-level Yjs object to return.
 * Two clients that call `useArray(...)` with the same `name` will get
 * the same object.
 *
 * By default, this will subscribe the calling component to updates on
 * the object and its children. See {@link ObjectOptions} and
 * {@link ObserverKind} for finer control of observer behavior.
 *
 * @typeParam T The type of the values in the array.
 * @param name The name of the top-level Yjs object to return.
 * @param objectOptions
 * @returns
 */
export function useArray<T>(
  name: string,
  yDoc: YDoc | undefined,
  objectOptions?: ObjectOptions
): Y.Array<T> {
  let doc = yDoc
  if (!doc) {
    const [iDoc] = useInternalDoc()
    doc = iDoc
  }
  const array = useMemo(() => doc.getArray<T>(name), [doc, name])
  useObserve(array, objectOptions?.observe || 'deep')

  return array
}

/**
 * Returns a `Y.Text` object from the `Y.Doc` in the current context.
 *
 * The string `name` is the name of the top-level Yjs object to return.
 * Two clients that call `useText(...)` with the same `name` will get
 * the same object.
 *
 * By default, this will subscribe the calling component to updates on
 * the object and its children. See {@link ObjectOptions} and
 * {@link ObserverKind} for finer control of observer behavior.
 *
 * @param name The name of the top-level Yjs object to return.
 * @param objectOptions
 * @returns
 */
export function useText(
  name: string,
  yDoc: YDoc | undefined,
  observerKind?: ObjectOptions
): Y.Text {
  let doc = yDoc
  if (!doc) {
    const [iDoc] = useInternalDoc()
    doc = iDoc
  }
  const text = useMemo(() => doc.getText(name), [doc, name])
  useObserve(text, observerKind?.observe || 'deep')

  return text
}

/**
 * A hook that causes its calling component to re-render when the given
 * Yjs object changes.
 *
 * The `kind` parameter determines the level of change that will trigger
 * a re-render. See {@link ObserverKind} for more information.
 *
 * @param object The Yjs object to observe.
 * @param kind The kind of observation to perform.
 */
export function useObserve(object: Y.AbstractType<any>, kind: ObserverKind) {
  const redraw = useRedraw()

  useEffect(() => {
    if (kind === 'deep') {
      object.observeDeep(redraw)
    } else if (kind === 'shallow') {
      object.observe(redraw)
    }

    return () => {
      if (kind === 'deep') {
        object.unobserveDeep(redraw)
      } else if (kind === 'shallow') {
        object.unobserve(redraw)
      }
    }
  })
}
