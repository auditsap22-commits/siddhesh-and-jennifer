"use client"

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  AlertCircle,
  Armchair,
  CheckCircle2,
  Clock,
  QrCode,
  RefreshCw,
  Search,
  User,
  XCircle,
} from "lucide-react"
import { Cinzel } from "next/font/google"
import localFont from "next/font/local"
import { useSiteConfig } from "@/hooks/use-site-config"
import { layeredSectionTitleSize, sectionType } from "@/lib/section-typography"

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
})

const theSeasons = localFont({
  src: "../../Font/Fontspring-DEMO-theseasons-reg.otf",
  display: "swap",
  variable: "--font-the-seasons",
})

const aboveTheBeyond = localFont({
  src: "../../Font/above-the-beyond-script.otf",
  display: "swap",
  variable: "--font-above-beyond",
})

const lsGold = {
  base: "#c5a059",
  bright: "#093327",
  soft: "#093327",
} as const

const ink = {
  navy: "#093327",
  deep: "#093327",
  slate: "#315E50",
  gold: "#c5a059",
  champagne: "#e8d5c4",
} as const

const paper = {
  cream: "#fdf8f2",
  lift: "#fff9f0",
} as const

const creamWash = `
  radial-gradient(80% 55% at 50% 0%, color-mix(in srgb, #e8d5c4 28%, transparent), transparent 62%),
  radial-gradient(ellipse 70% 42% at 100% 0%, color-mix(in srgb, ${ink.gold} 14%, transparent), transparent 68%),
  radial-gradient(ellipse 70% 42% at 0% 100%, color-mix(in srgb, ${ink.gold} 12%, transparent), transparent 68%),
  linear-gradient(180deg, #fdf8f2 0%, #f3ebe1 100%)
`

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

function GoldFrame() {
  const goldLineColor = "color-mix(in srgb, #c5a059 78%, transparent)"

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute z-[5]"
      style={{
        inset: "clamp(0.45rem, 1.6vw, 0.9rem)",
        border: `1px solid ${goldLineColor}`,
      }}
    >
      <div
        className="pointer-events-none absolute"
        style={{
          inset: 5,
          border: "1px solid color-mix(in srgb, #c5a059 62%, transparent)",
        }}
      />
      <CornerOrnament className="absolute -left-px -top-px h-[clamp(1.85rem,7vw,2.35rem)] w-[clamp(1.85rem,7vw,2.35rem)] text-[#c5a059]" />
      <CornerOrnament className="absolute -right-px -top-px h-[clamp(1.85rem,7vw,2.35rem)] w-[clamp(1.85rem,7vw,2.35rem)] -scale-x-100 text-[#c5a059]" />
      <CornerOrnament className="absolute -bottom-px -left-px h-[clamp(1.85rem,7vw,2.35rem)] w-[clamp(1.85rem,7vw,2.35rem)] -scale-y-100 text-[#c5a059]" />
      <CornerOrnament className="absolute -bottom-px -right-px h-[clamp(1.85rem,7vw,2.35rem)] w-[clamp(1.85rem,7vw,2.35rem)] -scale-100 text-[#c5a059]" />
    </div>
  )
}

function CornerDecorations() {
  return (
    <>
      <div className="pointer-events-none absolute left-0 top-0 z-10 w-[clamp(8.5rem,42vw,16.5rem)]">
        <Image
          src="/decoration/left-top-decoration.png"
          alt=""
          width={1138}
          height={1172}
          className="h-auto w-full"
          sizes="(max-width: 768px) 42vw, 264px"
        />
      </div>
      <div className="pointer-events-none absolute right-0 top-0 z-10 w-[clamp(7.5rem,38vw,14.5rem)]">
        <Image
          src="/decoration/right-top-decoration.png"
          alt=""
          width={1283}
          height={1226}
          className="h-auto w-full"
          sizes="(max-width: 768px) 38vw, 232px"
        />
      </div>
      <div className="pointer-events-none absolute bottom-0 left-0 z-10 w-[clamp(7.5rem,38vw,14.5rem)]">
        <Image
          src="/decoration/left-bottom-decoration.png"
          alt=""
          width={1115}
          height={1411}
          className="h-auto w-full"
          sizes="(max-width: 768px) 38vw, 232px"
        />
      </div>
      <div className="pointer-events-none absolute bottom-0 right-0 z-10 w-[clamp(8.5rem,42vw,16.5rem)]">
        <Image
          src="/decoration/right-bottom-decoration.png"
          alt=""
          width={988}
          height={1487}
          className="h-auto w-full"
          sizes="(max-width: 768px) 42vw, 264px"
        />
      </div>
    </>
  )
}

const goldLine = `color-mix(in srgb, ${ink.gold} 55%, transparent)`

const cardStyle = {
  background: `linear-gradient(180deg, color-mix(in srgb, ${ink.champagne} 22%, ${paper.cream}) 0%, ${paper.cream} 52%, color-mix(in srgb, ${ink.gold} 8%, ${paper.cream}) 100%)`,
  borderColor: goldLine,
  borderWidth: "1px",
  borderStyle: "solid" as const,
  boxShadow: `0 10px 28px color-mix(in srgb, ${ink.navy} 12%, transparent), inset 0 1px 0 color-mix(in srgb, ${ink.champagne} 50%, transparent)`,
} as const

const innerSurfaceStyle = {
  background: `color-mix(in srgb, ${ink.champagne} 16%, ${paper.cream})`,
  borderColor: goldLine,
} as const

type RsvpStatus = "pending" | "confirmed" | "declined" | "request"

interface ApiGuest {
  id: string | number
  name: string
  role?: string
  allowedGuests?: number
  companions?: Array<{ name: string; relationship: string }>
  tableNumber?: string
  isVip?: boolean
  status?: RsvpStatus
}

interface SeatEntry {
  key: string
  name: string
  tableNumber: string
  status: RsvpStatus
  isCompanion: boolean
  relationship?: string
  primaryName?: string
  isVip: boolean
}

function tableSortValue(label: string) {
  const match = label.match(/(\d+)/)
  return match ? parseInt(match[1], 10) : Number.MAX_SAFE_INTEGER
}

function toTitleCase(value: string) {
  return value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) =>
      word
        .split("-")
        .map((part) =>
          part ? part.charAt(0).toUpperCase() + part.slice(1).toLowerCase() : part,
        )
        .join("-"),
    )
    .join(" ")
}

function formatTableLabel(raw: string) {
  const value = raw.trim()
  if (!value) return ""
  const labeled = /^table\b/i.test(value) ? value : `Table ${value}`
  return toTitleCase(labeled)
}

function TableLabel({
  label,
  className,
  style,
}: {
  label: string
  className?: string
  style?: CSSProperties
}) {
  const match = label.match(/^(.*?)(\d+)\s*$/)
  if (!match) {
    return (
      <span className={className} style={style}>
        {label}
      </span>
    )
  }

  return (
    <span className={className} style={style}>
      {match[1]}
      <span className={`${cinzel.className} font-bold`} style={{ fontWeight: 700 }}>
        {match[2]}
      </span>
    </span>
  )
}

function HighlightedText({ text, query }: { text: string; query: string }) {
  const needle = query.trim()
  if (!needle) return <>{text}</>

  const lowerText = text.toLowerCase()
  const lowerQuery = needle.toLowerCase()
  const index = lowerText.indexOf(lowerQuery)
  if (index < 0) return <>{text}</>

  return (
    <>
      {text.slice(0, index)}
      <span className="font-semibold" style={{ color: ink.gold }}>
        {text.slice(index, index + needle.length)}
      </span>
      {text.slice(index + needle.length)}
    </>
  )
}

function tableAnchorId(label: string) {
  return `seating-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`
}

function rsvpCopy(status: RsvpStatus) {
  if (status === "confirmed") {
    return { label: "RSVP confirmed", short: "Confirmed" }
  }
  if (status === "declined") {
    return { label: "Unable to attend", short: "Declined" }
  }
  return { label: "Awaiting RSVP", short: "Pending" }
}

function RsvpBadge({ status, compact = false }: { status: RsvpStatus; compact?: boolean }) {
  const copy = rsvpCopy(status)
  const isConfirmed = status === "confirmed"
  const isDeclined = status === "declined"
  const Icon = isConfirmed ? CheckCircle2 : isDeclined ? XCircle : Clock

  return (
    <span
      className={`${cinzel.className} inline-flex shrink-0 items-center gap-1 rounded-full border font-semibold uppercase tracking-[0.1em] ${
        compact
          ? "px-1.5 py-px text-[0.5rem] sm:px-2 sm:text-[0.575rem]"
          : "px-2 py-0.5 text-[0.55rem] sm:px-2.5 sm:text-[0.625rem]"
      }`}
      style={{
        color: isConfirmed ? "#166534" : isDeclined ? "#991b1b" : ink.slate,
        borderColor: isConfirmed
          ? "color-mix(in srgb, #166534 35%, transparent)"
          : isDeclined
            ? "color-mix(in srgb, #991b1b 35%, transparent)"
            : goldLine,
        backgroundColor: isConfirmed
          ? "color-mix(in srgb, #166534 10%, white)"
          : isDeclined
            ? "color-mix(in srgb, #991b1b 8%, white)"
            : `color-mix(in srgb, ${ink.champagne} 22%, ${paper.cream})`,
      }}
    >
      <Icon className={compact ? "h-2.5 w-2.5" : "h-3 w-3"} aria-hidden />
      {copy.short}
    </span>
  )
}

function buildSeatEntries(guests: ApiGuest[]): SeatEntry[] {
  const entries: SeatEntry[] = []

  for (const guest of guests) {
    const name = guest.name?.trim()
    if (!name) continue

    const tableNumber = (guest.tableNumber || "").trim()
    const status = guest.status || "pending"
    const companions = Array.isArray(guest.companions)
      ? guest.companions.filter((companion) => companion.name?.trim())
      : []

    const displayName = toTitleCase(name)

    entries.push({
      key: `guest-${guest.id}`,
      name: displayName,
      tableNumber,
      status,
      isCompanion: false,
      isVip: guest.isVip === true,
    })

    companions.forEach((companion, index) => {
      entries.push({
        key: `guest-${guest.id}-companion-${index}`,
        name: toTitleCase(companion.name),
        tableNumber,
        status,
        isCompanion: true,
        relationship: companion.relationship?.trim()
          ? toTitleCase(companion.relationship)
          : "",
        primaryName: displayName,
        isVip: false,
      })
    })
  }

  return entries
}

function groupSeatsByTable(entries: SeatEntry[]) {
  const groups = new Map<string, SeatEntry[]>()

  for (const entry of entries) {
    if (!entry.tableNumber) continue
    const existing = groups.get(entry.tableNumber) ?? []
    existing.push(entry)
    groups.set(entry.tableNumber, existing)
  }

  return [...groups.entries()]
    .sort(([a], [b]) => {
      const diff = tableSortValue(a) - tableSortValue(b)
      return diff !== 0 ? diff : a.localeCompare(b)
    })
    .map(([tableNumber, seats]) => ({
      tableNumber,
      label: formatTableLabel(tableNumber),
      seats: [...seats].sort((a, b) => a.name.localeCompare(b.name)),
    }))
}

const howItWorks = [
  {
    step: "One",
    title: "Scan",
    icon: QrCode,
    body: "Open your camera and scan the code. You'll arrive on this seating page.",
  },
  {
    step: "Two",
    title: "Search",
    icon: Search,
    body: "Type your name to see your table number.",
  },
  {
    step: "Three",
    title: "Sit",
    icon: Armchair,
    body: "Walk to your table, take your seat, and enjoy the evening.",
  },
] as const

export function TableFinder() {
  const siteConfig = useSiteConfig()
  const groomName = siteConfig.couple.groomNickname || siteConfig.couple.groom
  const brideName = siteConfig.couple.brideNickname || siteConfig.couple.bride

  const [entries, setEntries] = useState<SeatEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [selectedSeat, setSelectedSeat] = useState<SeatEntry | null>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  const fetchGuests = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/guests")
      if (!response.ok) throw new Error("Failed to fetch guests")
      const data: ApiGuest[] = await response.json()
      setEntries(buildSeatEntries(Array.isArray(data) ? data : []))
    } catch (err) {
      console.error("Error fetching guests:", err)
      setError("We couldn't load the seating list. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchGuests()
  }, [])

  const filteredSeats = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()
    if (!query) return []

    return entries
      .filter((entry) => entry.name.toLowerCase().includes(query))
      .sort((a, b) => {
        const aName = a.name.toLowerCase()
        const bName = b.name.toLowerCase()
        const aStarts = aName.startsWith(query)
        const bStarts = bName.startsWith(query)
        if (aStarts && !bStarts) return -1
        if (!aStarts && bStarts) return 1
        return aName.localeCompare(bName)
      })
      .slice(0, 12)
  }, [searchQuery, entries])

  useEffect(() => {
    setIsSearching(searchQuery.trim().length > 0 && filteredSeats.length > 0 && !selectedSeat)
  }, [searchQuery, filteredSeats.length, selectedSeat])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearching(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const tables = useMemo(() => groupSeatsByTable(entries), [entries])

  const tablemates = useMemo(() => {
    if (!selectedSeat?.tableNumber) return []
    return entries
      .filter(
        (entry) =>
          entry.tableNumber === selectedSeat.tableNumber && entry.key !== selectedSeat.key,
      )
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [entries, selectedSeat])

  const handleSelectSeat = (seat: SeatEntry) => {
    setSelectedSeat(seat)
    setSearchQuery(seat.name)
    setIsSearching(false)
  }

  return (
    <main
      className={`${theSeasons.variable} ${aboveTheBeyond.variable} relative min-h-screen overflow-x-hidden`}
      style={{ background: creamWash }}
    >
      <GoldFrame />
      <CornerDecorations />

      <section className="relative z-20 mx-auto max-w-6xl px-4 pb-16 pt-[clamp(5.5rem,12vh,8rem)] sm:px-6 sm:pb-20 md:px-8">
        <div className="mx-auto max-w-xl text-center @container/table-hero">
          <div className="flex items-center justify-center gap-2 sm:gap-3.5">
            <span
              className="h-px w-4 sm:w-7 md:w-9"
              style={{
                background:
                  "linear-gradient(to right, transparent, color-mix(in srgb, #c5a059 70%, transparent))",
              }}
              aria-hidden
            />
            <p
              className={`${cinzel.className} ${sectionType.label} shrink-0 py-0.5 font-semibold uppercase leading-normal tracking-[0.22em] min-[400px]:tracking-[0.3em] sm:tracking-[0.4em]`}
              style={{ color: lsGold.soft }}
            >
              {groomName}
              <span
                className={`${aboveTheBeyond.className} mx-1 inline-block normal-case tracking-normal sm:mx-2`}
                style={{
                  fontSize: "1.35em",
                  color: ink.gold,
                  verticalAlign: "middle",
                }}
                aria-hidden
              >
                &
              </span>
              {brideName}
            </p>
            <span
              className="h-px w-4 sm:w-7 md:w-9"
              style={{
                background:
                  "linear-gradient(to left, transparent, color-mix(in srgb, #c5a059 70%, transparent))",
              }}
              aria-hidden
            />
          </div>

          <h1
            className="welcome-title-lockup relative mx-auto mt-5 w-full max-w-full text-center sm:mt-8"
            style={
              {
                "--title-size": layeredSectionTitleSize.main,
                "--script-size": layeredSectionTitleSize.script,
              } as CSSProperties
            }
          >
            <span
              className={`${theSeasons.className} block uppercase leading-[0.78] tracking-[0.06em] min-[400px]:tracking-[0.1em] sm:tracking-[0.13em] pb-1 sm:pb-1.5`}
              style={{ fontSize: "var(--title-size)", color: lsGold.bright }}
            >
              Find Your Table
            </span>
            <span
              aria-hidden
              className={`${aboveTheBeyond.className} mx-auto mt-1.5 block w-fit max-w-full px-1 leading-[0.88] sm:mt-2.5 sm:leading-[0.9]`}
              style={{ fontSize: "var(--script-size)", color: ink.gold }}
            >
              Please be seated
            </span>
            <span className="sr-only">Please be seated</span>
          </h1>

          <div ref={searchRef} className="relative z-30 mx-auto mt-6 w-full sm:mt-8">
            <label htmlFor="table-search" className="sr-only">
              Search your name to find your table
            </label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 sm:h-5 sm:w-5"
                style={{ color: ink.gold }}
              />
              <input
                id="table-search"
                type="search"
                inputMode="search"
                enterKeyHint="search"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setSelectedSeat(null)
                }}
                onFocus={() => {
                  if (searchQuery.trim() && filteredSeats.length > 0 && !selectedSeat) {
                    setIsSearching(true)
                  }
                }}
                placeholder="Search your name..."
                className="w-full rounded-full border py-3.5 pl-12 pr-5 font-sans text-base shadow-md outline-none transition-shadow duration-300 focus:shadow-lg sm:py-4 sm:pl-14"
                style={{
                  borderColor: goldLine,
                  color: ink.navy,
                  backgroundColor: "color-mix(in srgb, #faf7ef 92%, white)",
                  boxShadow: `0 10px 28px color-mix(in srgb, ${ink.deep} 18%, transparent)`,
                }}
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
              />
            </div>

            {isSearching && (
              <div
                className="absolute left-0 right-0 z-[9999] mt-2 overflow-hidden rounded-2xl border shadow-2xl"
                style={{
                  backgroundColor: "color-mix(in srgb, #faf7ef 98%, white)",
                  borderColor: goldLine,
                }}
              >
                <div className="max-h-[min(18rem,50vh)] overflow-y-auto overscroll-contain">
                  {filteredSeats.map((seat) => (
                    <button
                      key={seat.key}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleSelectSeat(seat)}
                      className="flex w-full items-center gap-3 border-b px-3.5 py-3 text-left last:border-b-0 sm:px-4"
                      style={{ borderColor: goldLine }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = `color-mix(in srgb, ${ink.gold} 14%, ${paper.cream})`
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent"
                      }}
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: ink.gold }}>
                        <User className="h-4 w-4" style={{ color: ink.deep }} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div
                          className="truncate font-sans text-[0.9375rem] font-semibold normal-case"
                          style={{ color: ink.navy }}
                        >
                          <HighlightedText text={seat.name} query={searchQuery} />
                        </div>
                        {seat.isCompanion && seat.primaryName ? (
                          <div className={`${sectionType.label} mt-0.5 truncate normal-case`} style={{ color: ink.slate }}>
                            Guest of {seat.primaryName}
                          </div>
                        ) : null}
                      </div>
                      <span
                        className={`${theSeasons.className} shrink-0 text-base tracking-[0.02em]`}
                        style={{ color: ink.navy }}
                      >
                        {seat.tableNumber ? (
                          <TableLabel label={formatTableLabel(seat.tableNumber)} />
                        ) : (
                          <span className={`font-goudy-italic ${sectionType.label}`} style={{ color: ink.slate }}>
                            No table yet
                          </span>
                        )}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {searchQuery.trim() && filteredSeats.length === 0 && !isLoading && (
              <div
                className="absolute left-0 right-0 z-[9999] mt-2 rounded-2xl border px-4 py-3.5 text-left shadow-xl"
                style={{
                  backgroundColor: `color-mix(in srgb, ${paper.cream} 97%, white)`,
                  borderColor: goldLine,
                }}
              >
                <p className={`font-goudy-italic ${sectionType.textSnug}`} style={{ color: ink.navy }}>
                  We couldn&apos;t find that name. Try another spelling, or ask the couple if
                  you&apos;re not on the list.
                </p>
              </div>
            )}
          </div>
        </div>

        {selectedSeat && (
          <div
            className="mx-auto mt-5 max-w-xl rounded-2xl border px-5 py-6 text-center sm:mt-7 sm:px-8 sm:py-8"
            style={cardStyle}
          >
            <p className={`font-goudy-italic ${sectionType.text}`} style={{ color: ink.slate }}>
              Hello{" "}
              <span className="font-semibold" style={{ color: ink.navy }}>
                {selectedSeat.name}
              </span>
              {selectedSeat.isCompanion && selectedSeat.primaryName
                ? `, guest of ${selectedSeat.primaryName}`
                : ""}
            </p>

            {selectedSeat.tableNumber ? (
              <>
                <div
                  className="mx-auto my-4 h-px w-16"
                  style={{ background: `linear-gradient(to right, transparent, ${ink.gold}, transparent)` }}
                />
                <p
                  className={`${cinzel.className} text-[0.65rem] font-semibold uppercase tracking-[0.22em]`}
                  style={{ color: ink.gold }}
                >
                  Your table
                </p>
                <p
                  className={`${theSeasons.className} mt-2 text-[2.15rem] leading-none tracking-[0.04em] sm:text-5xl`}
                  style={{ color: ink.navy }}
                >
                  <TableLabel label={formatTableLabel(selectedSeat.tableNumber)} />
                </p>
              </>
            ) : (
              <p
                className={`${theSeasons.className} mt-4 text-lg tracking-[0.04em] sm:text-xl`}
                style={{ color: ink.navy }}
              >
                Your table will be posted soon
              </p>
            )}

            <div className="mt-3 flex justify-center">
              <RsvpBadge status={selectedSeat.status} />
            </div>

            <p
              className={`font-goudy-italic mx-auto mt-3 max-w-md ${sectionType.textSnug}`}
              style={{ color: ink.navy }}
            >
              {selectedSeat.status === "confirmed" && selectedSeat.tableNumber
                ? "You're all set. Find your table and enjoy the celebration."
                : selectedSeat.status === "confirmed"
                  ? "You're confirmed. Your table will appear here once seating is posted."
                  : selectedSeat.status === "declined"
                    ? "You've let us know you can't attend. If plans change, please tell the couple."
                    : selectedSeat.tableNumber
                      ? "A seat is waiting for you. Please RSVP so we can confirm it."
                      : "Please RSVP first. Your table will appear here once seating is posted."}
            </p>

            {selectedSeat.status !== "confirmed" && selectedSeat.status !== "declined" && (
              <Link
                href="/#guest-list"
                className={`${cinzel.className} mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-full border px-5 py-2.5 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] sm:w-auto sm:rounded-sm sm:tracking-[0.2em]`}
                style={{
                  backgroundColor: ink.gold,
                  borderColor: `color-mix(in srgb, ${ink.champagne} 70%, transparent)`,
                  color: ink.deep,
                }}
              >
                Confirm your attendance
              </Link>
            )}

            {tablemates.length > 0 && (
              <div className="mt-5 rounded-xl border p-3 text-left sm:p-4" style={innerSurfaceStyle}>
                <p
                  className={`${cinzel.className} mb-2 text-[0.6rem] font-semibold uppercase tracking-[0.16em]`}
                  style={{ color: ink.gold }}
                >
                  Seated with you
                </p>
                <ul className="space-y-2">
                  {tablemates.map((mate) => (
                    <li key={mate.key} className="flex items-center justify-between gap-2">
                      <span
                        className={`min-w-0 truncate font-goudy-italic ${sectionType.text}`}
                        style={{ color: ink.navy }}
                      >
                        {mate.name}
                      </span>
                      <RsvpBadge status={mate.status} compact />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="mx-auto mt-10 max-w-6xl sm:mt-16">
          <div className="mb-5 text-center sm:mb-7">
            <h2
              className={`${theSeasons.className} text-xl uppercase tracking-[0.12em] sm:text-3xl`}
              style={{ color: lsGold.bright }}
            >
              Seating Chart
            </h2>
            <p className={`font-goudy-italic mx-auto mt-1.5 max-w-xl px-2 ${sectionType.text}`} style={{ color: lsGold.soft }}>
              Everyone is grouped by table. RSVP status sits beside each name.
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
              <RsvpBadge status="confirmed" compact />
              <RsvpBadge status="pending" compact />
              <RsvpBadge status="declined" compact />
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-10" style={{ color: lsGold.soft }}>
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span className={`font-goudy-italic ${sectionType.text}`}>Loading seating...</span>
            </div>
          ) : error ? (
            <div className="mx-auto max-w-md rounded-2xl border p-5 text-center" style={cardStyle}>
              <AlertCircle className="mx-auto mb-2 h-5 w-5" style={{ color: "#991b1b" }} />
              <p className={`font-goudy-italic ${sectionType.text}`} style={{ color: ink.navy }}>
                {error}
              </p>
              <button
                type="button"
                onClick={fetchGuests}
                className={`${cinzel.className} mt-3 inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-[0.6875rem] font-semibold uppercase tracking-[0.18em]`}
                style={{ backgroundColor: ink.gold, color: ink.deep, borderColor: goldLine }}
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Try again
              </button>
            </div>
          ) : tables.length === 0 ? (
            <p className={`font-goudy-italic text-center ${sectionType.text}`} style={{ color: lsGold.soft }}>
              Seating is still being arranged. Search your name above, or check back soon.
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
              {tables.map((table) => {
                const isSelectedTable = selectedSeat?.tableNumber === table.tableNumber
                const confirmedCount = table.seats.filter((seat) => seat.status === "confirmed").length

                return (
                  <article
                    key={table.tableNumber}
                    id={tableAnchorId(table.tableNumber)}
                    className="rounded-2xl border p-3.5 sm:p-5"
                    style={{
                      ...cardStyle,
                      borderColor: isSelectedTable ? ink.gold : goldLine,
                      boxShadow: isSelectedTable
                        ? `0 12px 36px color-mix(in srgb, ${ink.gold} 28%, transparent)`
                        : cardStyle.boxShadow,
                    }}
                  >
                    <div
                      className="mb-3 flex items-center gap-3 border-b pb-3"
                      style={{ borderColor: goldLine }}
                    >
                      <div
                        className={`${cinzel.className} flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg font-bold sm:h-12 sm:w-12 sm:text-xl`}
                        style={{
                          backgroundColor: ink.gold,
                          color: ink.deep,
                          fontWeight: 700,
                        }}
                      >
                        {table.tableNumber.match(/(\d+)/)?.[1] ?? "—"}
                      </div>
                      <div className="min-w-0">
                        <p
                          className={`${theSeasons.className} text-lg tracking-[0.04em] sm:text-xl`}
                          style={{ color: ink.navy }}
                        >
                          <TableLabel label={table.label} />
                        </p>
                        <p className={`font-goudy-italic ${sectionType.label}`} style={{ color: ink.slate }}>
                          {table.seats.length} {table.seats.length === 1 ? "guest" : "guests"}
                          {" · "}
                          {confirmedCount} confirmed
                        </p>
                      </div>
                    </div>
                    <ul className="space-y-1 sm:space-y-1.5">
                      {table.seats.map((seat) => {
                        const isSelected = selectedSeat?.key === seat.key
                        return (
                          <li
                            key={seat.key}
                            className="flex items-center justify-between gap-2 rounded-lg px-1.5 py-1.5 sm:px-2"
                            style={{
                              backgroundColor: isSelected
                                ? `color-mix(in srgb, ${ink.gold} 16%, ${paper.cream})`
                                : "transparent",
                            }}
                          >
                            <div className="min-w-0">
                              <p
                                className={`truncate font-goudy-italic text-[0.8125rem] sm:text-[0.9375rem] ${
                                  seat.status === "declined" ? "line-through opacity-70" : ""
                                }`}
                                style={{ color: ink.navy }}
                              >
                                {seat.name}
                              </p>
                              {seat.isCompanion && seat.primaryName ? (
                                <p className={`${sectionType.label} truncate`} style={{ color: ink.slate }}>
                                  Guest of {seat.primaryName}
                                  {seat.relationship ? ` · ${seat.relationship}` : ""}
                                </p>
                              ) : null}
                            </div>
                            <RsvpBadge status={seat.status} compact />
                          </li>
                        )
                      })}
                    </ul>
                  </article>
                )
              })}
            </div>
          )}
        </div>

          <div className="mx-auto mt-12 max-w-4xl border-t pt-8 sm:mt-16 sm:pt-10" style={{ borderColor: `color-mix(in srgb, ${lsGold.base} 45%, transparent)` }}>
            <p
              className={`${cinzel.className} mb-2 text-center text-[0.65rem] font-semibold uppercase tracking-[0.2em] sm:text-[0.6875rem] sm:tracking-[0.22em]`}
              style={{ color: ink.gold }}
            >
              How it works
            </p>
            <p
              className={`font-goudy-italic mx-auto mb-5 max-w-md px-2 text-center sm:mb-6 ${sectionType.textSnug}`}
              style={{ color: lsGold.soft }}
            >
              Three simple steps from the doorway to your seat.
            </p>
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              {howItWorks.map((item) => (
                <div key={item.title} className="rounded-xl border px-2 py-4 text-center sm:px-4 sm:py-5" style={cardStyle}>
                  <p
                    className={`${cinzel.className} text-[0.5rem] font-semibold uppercase tracking-[0.16em] sm:text-[0.625rem] sm:tracking-[0.22em]`}
                    style={{ color: ink.gold }}
                  >
                    {item.step}
                  </p>
                  <div
                    className="mx-auto my-2.5 flex h-9 w-9 items-center justify-center rounded-full sm:my-3 sm:h-10 sm:w-10"
                    style={{ backgroundColor: ink.gold }}
                  >
                    <item.icon className="h-4 w-4" style={{ color: ink.deep }} />
                  </div>
                  <h3
                    className={`${theSeasons.className} text-[0.9rem] tracking-[0.06em] sm:text-xl sm:tracking-[0.08em]`}
                    style={{ color: ink.navy }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className={`font-goudy-italic mx-auto mt-1.5 max-w-[16rem] text-[0.65rem] leading-snug sm:mt-2 sm:text-[inherit] ${sectionType.textSnug}`}
                    style={{ color: ink.slate }}
                  >
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
        </div>
      </section>
    </main>
  )
}
