"use client"

import { useId, useState } from "react"
import { Check, Copy, Download, ExternalLink } from "lucide-react"
import { QRCodeCanvas } from "qrcode.react"
import { Cinzel } from "next/font/google"
import localFont from "next/font/local"
import { useSiteConfig } from "@/hooks/use-site-config"

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
})

const theSeasons = localFont({
  src: "../Font/Fontspring-DEMO-theseasons-reg.otf",
  display: "swap",
})

const C = {
  cream: "#fdf8f2",
  lift: "#fff9f0",
  ink: "#093327",
  gold: "#c5a059",
} as const

export function getTableFinderUrl(siteUrl: string) {
  return `${siteUrl.replace(/\/$/, "")}/find-your-table`
}

function CornerOrnament({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 56 56" fill="none" aria-hidden="true">
      <path
        d="M54 3H20.5C9.6 3 3 9.6 3 20.5V54"
        stroke="currentColor"
        strokeWidth="1.15"
      />
      <path
        d="M54 8H23C12.8 8 8 12.8 8 23V54"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.72"
      />
      <circle cx="19" cy="19" r="1.55" fill="currentColor" />
      <path
        d="M14.5 19.5c2.4-5 5.2-7.6 9.8-9.6"
        stroke="currentColor"
        strokeWidth="0.7"
      />
    </svg>
  )
}

export function TableFinderQrCard() {
  const siteConfig = useSiteConfig()
  const groomName = siteConfig.couple.groomNickname || siteConfig.couple.groom
  const brideName = siteConfig.couple.brideNickname || siteConfig.couple.bride
  const printId = useId()
  const tableFinderUrl = getTableFinderUrl(siteConfig.couple.siteUrl)
  const [copied, setCopied] = useState(false)
  const printCanvasId = `table-finder-qr-print-${printId.replace(/:/g, "")}`

  const sanitizedGroom = groomName.replace(/\s+/g, "").toLowerCase()
  const sanitizedBride = brideName.replace(/\s+/g, "").toLowerCase()

  const downloadQRCode = () => {
    const canvas = document.getElementById(printCanvasId) as HTMLCanvasElement | null
    if (!canvas) return
    const link = document.createElement("a")
    link.download = `${sanitizedGroom}-${sanitizedBride}-find-your-table-qr.png`
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(tableFinderUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy table finder link:", error)
    }
  }

  return (
    <div className="relative">
    <div
      className={`${theSeasons.className} relative overflow-hidden rounded-[1.75rem] p-2.5 sm:p-3`}
      style={{ backgroundColor: C.ink }}
    >
      <div
        className="rounded-[1.35rem] px-5 py-6 sm:px-8 sm:py-8"
        style={{ backgroundColor: C.cream }}
      >
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:gap-10">
          <div className="flex shrink-0 flex-col items-center">
            <div
              className="relative rounded-md p-4 sm:p-5"
              style={{
                backgroundColor: C.lift,
                boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${C.gold} 55%, transparent)`,
              }}
            >
              <CornerOrnament className="absolute -left-0.5 -top-0.5 h-8 w-8 text-[#c5a059] sm:h-9 sm:w-9" />
              <CornerOrnament className="absolute -right-0.5 -top-0.5 h-8 w-8 -scale-x-100 text-[#c5a059] sm:h-9 sm:w-9" />
              <CornerOrnament className="absolute -bottom-0.5 -left-0.5 h-8 w-8 -scale-y-100 text-[#c5a059] sm:h-9 sm:w-9" />
              <CornerOrnament className="absolute -bottom-0.5 -right-0.5 h-8 w-8 -scale-100 text-[#c5a059] sm:h-9 sm:w-9" />
              <QRCodeCanvas
                value={tableFinderUrl}
                size={220}
                includeMargin={false}
                fgColor={C.ink}
                bgColor={C.lift}
                level="H"
                className="h-[min(52vw,220px)] w-[min(52vw,220px)]"
              />
            </div>
            <p
              className={`${cinzel.className} mt-3 text-[0.6rem] font-semibold uppercase tracking-[0.22em]`}
              style={{ color: C.gold }}
            >
              Scan to find your table
            </p>
          </div>

          <div className="min-w-0 flex-1 text-center lg:text-left">
            <p
              className={`${cinzel.className} text-[0.7rem] font-semibold uppercase tracking-[0.28em]`}
              style={{ color: C.gold }}
            >
              {groomName}
              <span className="mx-1.5 font-normal" aria-hidden>
                &
              </span>
              {brideName}
            </p>
            <h2
              className="mt-2 text-[1.85rem] uppercase leading-[0.95] tracking-[0.08em] sm:text-[2.35rem]"
              style={{ color: C.ink }}
            >
              Find Your Table
            </h2>
            <p
              className="font-goudy-italic mx-auto mt-3 max-w-md text-[0.95rem] leading-relaxed lg:mx-0"
              style={{ color: C.ink }}
            >
              Place this code at the entrance. Guests scan it, search their name,
              and go straight to their table.
            </p>

            <div className="mt-5 flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap lg:justify-start">
              <button
                type="button"
                onClick={downloadQRCode}
                className={`${cinzel.className} inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 py-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] shadow-sm transition-opacity hover:opacity-90`}
                style={{ backgroundColor: C.gold, color: C.cream }}
              >
                <Download className="h-4 w-4" aria-hidden />
                Download QR
              </button>
              <button
                type="button"
                onClick={copyLink}
                className={`${cinzel.className} inline-flex min-h-11 items-center justify-center gap-2 rounded-full border px-5 py-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.16em] transition-colors`}
                style={{
                  borderColor: `color-mix(in srgb, ${C.gold} 55%, transparent)`,
                  color: C.ink,
                  backgroundColor: copied
                    ? `color-mix(in srgb, ${C.gold} 16%, ${C.cream})`
                    : "transparent",
                }}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied" : "Copy Link"}
              </button>
              <a
                href="/find-your-table"
                target="_blank"
                rel="noopener noreferrer"
                className={`${cinzel.className} inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.16em]`}
                style={{ color: C.ink }}
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Preview page
              </a>
            </div>

            <p
              className="font-goudy-italic mt-3 text-[0.8rem] leading-snug"
              style={{ color: `color-mix(in srgb, ${C.ink} 72%, white)` }}
            >
              Saves a print-ready PNG for signs and table cards.
            </p>
          </div>
        </div>
      </div>
    </div>
      <div
        aria-hidden
        className="pointer-events-none fixed left-[-10000px] top-0"
      >
        <QRCodeCanvas
          id={printCanvasId}
          value={tableFinderUrl}
          size={1024}
          includeMargin
          fgColor={C.ink}
          bgColor={C.lift}
          level="H"
        />
      </div>
    </div>
  )
}
