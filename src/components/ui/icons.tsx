import type { SVGProps } from 'react'

/**
 * Icon set shared across the app.
 *
 * Linear/outline style: a single `currentColor`, rounded joins, drawn on a 24px
 * grid, so an icon always inherits the colour of its container. Icons are
 * decorative and always hidden from assistive tech — the accessible name lives
 * on the interactive element that wraps them.
 */
function Icon({ children, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  )
}

/** Shopping cart, used for the brand mark and the cart entry point. */
export function CartIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M3 4h2.2l2 11.2a1.6 1.6 0 0 0 1.6 1.3h8.4a1.6 1.6 0 0 0 1.6-1.3L21 8H6.2" />
      <circle cx="10" cy="20" r="1.5" />
      <circle cx="18" cy="20" r="1.5" />
    </Icon>
  )
}

/** Check mark, used by the success banner. */
export function CheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M20 6 9 17l-5-5" />
    </Icon>
  )
}

/** Back arrow for the "volver" affordances. */
export function ArrowLeftIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </Icon>
  )
}

/** Forward chevron for tappable list rows. */
export function ChevronRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="m9 6 6 6-6 6" />
    </Icon>
  )
}

/** Camera, for the live scanner panel. */
export function CameraIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M14.5 4h-5L8 6H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-4z" />
      <circle cx="12" cy="13" r="3.5" />
    </Icon>
  )
}

/** QR frame, for the scan entry point. */
export function ScanIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M4 7V5a2 2 0 0 1 2-2h2" />
      <path d="M16 3h2a2 2 0 0 1 2 2v2" />
      <path d="M20 17v2a2 2 0 0 1-2 2h-2" />
      <path d="M8 21H6a2 2 0 0 1-2-2v-2" />
      <path d="M4 12h16" />
    </Icon>
  )
}

/** Printer, for the receipt. */
export function PrintIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M6 9V3h12v6" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" rx="1" />
    </Icon>
  )
}

/** Receipt, for the purchase history. */
export function ReceiptIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M5 3h14v18l-2.5-1.5L14 21l-2-1.5L10 21l-2.5-1.5L5 21z" />
      <path d="M9 8h6" />
      <path d="M9 12h6" />
    </Icon>
  )
}

/** Plus, for increasing a cart line. */
export function PlusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </Icon>
  )
}

/** Minus, for decreasing a cart line. */
export function MinusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M5 12h14" />
    </Icon>
  )
}

/** Trash, for removing a cart line. */
export function TrashIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M4 7h16" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" />
      <path d="M9 7V4h6v3" />
    </Icon>
  )
}

/** Storefront, for the store picker and the empty states. */
export function StoreIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M4 9h16l-1 11a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z" />
      <path d="M4 9 5.5 4h13L20 9" />
      <path d="M9 21v-6h6v6" />
    </Icon>
  )
}

/** Building, for the mall picker. */
export function MallIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M3 21h18" />
      <path d="M5 21V7l7-4 7 4v14" />
      <path d="M9 21v-6h6v6" />
      <path d="M10 8h4" />
    </Icon>
  )
}

/** Shopping bag, for empty cart states. */
export function BagIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M6 8h12l-1 12H7z" />
      <path d="M9 8a3 3 0 0 1 6 0" />
    </Icon>
  )
}

/** Banknote, for the cash payment brand. */
export function CashIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="3" />
    </Icon>
  )
}

/** Bolt, for the digital wallet payment brands. */
export function BoltIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M13 3 5 13h5l-1 8 8-10h-5z" />
    </Icon>
  )
}
