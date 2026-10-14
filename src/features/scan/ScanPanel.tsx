import { useEffect, useRef, useState } from 'react'
import type { IScannerControls } from '@zxing/browser'

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
      <h2 id="camera-heading" className="text-lg font-semibold text-slate-900">
        Escanear con cámara
      </h2>
      {status === 'unavailable' ? (
        <p
          role="status"
          className="rounded-2xl bg-white p-4 text-sm text-slate-600 shadow-sm ring-1 ring-slate-200"
        >
          La cámara no está disponible en este navegador. Usá «Simular
          escaneo» para elegir un producto.
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-slate-900 ring-1 ring-slate-200">
          <video
            ref={videoRef}
            className="h-56 w-full object-cover"
            muted
            playsInline
            aria-label="Vista de la cámara"
          />
          {status === 'starting' && (
            <p className="bg-slate-900 px-4 py-2 text-center text-xs text-slate-300">
              Activando la cámara…
            </p>
          )}
        </div>
      )}
    </section>
  )
}
