import { useEffect, useRef, useState } from 'react'
import type { IScannerControls } from '@zxing/browser'

import { CameraIcon } from '../../components/ui/icons'
import { IconTile } from '../../components/ui/IconTile'

interface ScanPanelProps {
  /** Called with the raw payload (the sku) of every decoded QR code. */
  onDecode: (raw: string) => void
}

type CameraStatus = 'starting' | 'scanning' | 'unavailable'

/**
 * Live camera QR scanner.
 *
 * `@zxing/browser` is imported lazily inside the effect so the initial bundle
 * and the jsdom test environment never load it. When the browser exposes no
 * camera (in-app browsers, denied permission, unsupported device) the panel
 * degrades to a message and leaves the simulated scan as the way forward.
 */
export function ScanPanel({ onDecode }: ScanPanelProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const controlsRef = useRef<IScannerControls | null>(null)
  const onDecodeRef = useRef(onDecode)
  const [status, setStatus] = useState<CameraStatus>('starting')

  useEffect(() => {
    onDecodeRef.current = onDecode
  }, [onDecode])

  useEffect(() => {
    const mediaDevices =
      typeof navigator === 'undefined' ? undefined : navigator.mediaDevices
    const canUseCamera = Boolean(mediaDevices && mediaDevices.getUserMedia)
    const video = videoRef.current

    if (!canUseCamera || !video) {
      setStatus('unavailable')
      return
    }

    let cancelled = false

    async function start(element: HTMLVideoElement) {
      try {
        const { BrowserQRCodeReader } = await import('@zxing/browser')
        if (cancelled) {
          return
        }
        const reader = new BrowserQRCodeReader()
        const controls = await reader.decodeFromVideoDevice(
          undefined,
          element,
          (result) => {
            if (result) {
              onDecodeRef.current(result.getText())
            }
          },
        )
        if (cancelled) {
          controls.stop()
          return
        }
        controlsRef.current = controls
        setStatus('scanning')
      } catch {
        if (!cancelled) {
          setStatus('unavailable')
        }
      }
    }

    void start(video)

    return () => {
      cancelled = true
      controlsRef.current?.stop()
      controlsRef.current = null
    }
  }, [])

  return (
    <section aria-labelledby="camera-heading" className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <IconTile tone="blue">
          <CameraIcon className="h-6 w-6" />
        </IconTile>
        <h2 id="camera-heading" className="text-lg font-semibold text-ink">
          Escanear con cámara
        </h2>
      </div>

      {status === 'unavailable' ? (
        <p
          role="status"
          className="rounded-card bg-surface p-4 text-sm text-muted shadow-card"
        >
          La cámara no está disponible en este navegador. Usá «Simular
          escaneo» para elegir un producto.
        </p>
      ) : (
        <div className="overflow-hidden rounded-card bg-ink shadow-card">
          <video
            ref={videoRef}
            className="h-56 w-full object-cover"
            muted
            playsInline
            aria-label="Vista de la cámara"
          />
          {status === 'starting' && (
            <p className="bg-ink px-4 py-2 text-center text-xs text-white/70">
              Activando la cámara…
            </p>
          )}
        </div>
      )}
    </section>
  )
}
