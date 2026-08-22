"use client"

import { useState, useEffect } from "react"
import { RefreshCw } from "lucide-react"
import localFont from "next/font/local"
import Image from "next/image"
import { Cinzel } from "next/font/google"
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

const reminderInk = {
  navy: "#4b5d44",
  deep: "#3d4a36",
  slate: "#6a7b5c",
  gold: "#6a7b5c",
  champagne: "#c9d2bc",
} as const

const paperWash = {
  cream: "#f7f4eb",
  lift: "#f9f6ee",
  sage: "#4b5d44",
  sageSoft: "#6a7b5c",
  wash: "#8b9d78",
} as const

const creamWash = `
  radial-gradient(80% 55% at 50% 0%, color-mix(in srgb, #c9d2bc 22%, transparent), transparent 62%),
  radial-gradient(ellipse 70% 42% at 100% 0%, color-mix(in srgb, ${paperWash.wash} 28%, transparent), transparent 68%),
  radial-gradient(ellipse 70% 42% at 0% 100%, color-mix(in srgb, ${paperWash.wash} 22%, transparent), transparent 68%),
  linear-gradient(180deg, #ece6d6 0%, #e4ddcc 100%)
`

const palette = {
  body: reminderInk.champagne,
  heading: reminderInk.champagne,
  label: `color-mix(in srgb, ${reminderInk.champagne} 82%, transparent)`,
  accent: reminderInk.gold,
} as const

const guestCardStyle = {
  backgroundColor: `color-mix(in srgb, ${reminderInk.navy} 62%, transparent)`,
  borderColor: `color-mix(in srgb, ${reminderInk.gold} 32%, transparent)`,
  borderWidth: "1px",
  borderStyle: "solid",
} as const

const headerDividerLineStyle = {
  background:
    "linear-gradient(to right, transparent, color-mix(in srgb, #4b5d44 38%, transparent), transparent)",
} as const

const dividerLineStyle = {
  background: `linear-gradient(90deg, transparent, ${reminderInk.gold}, transparent)`,
} as const

const refreshButtonStyle = {
  color: paperWash.lift,
  backgroundColor: paperWash.sage,
  borderColor: "color-mix(in srgb, #3d4a36 35%, transparent)",
  boxShadow: "0 8px 22px color-mix(in srgb, #4b5d44 28%, transparent)",
} as const

const chipPrimaryStyle = {
  color: reminderInk.champagne,
  borderColor: `color-mix(in srgb, ${reminderInk.gold} 55%, transparent)`,
  backgroundColor: `color-mix(in srgb, ${reminderInk.gold} 16%, transparent)`,
} as const

const chipSecondaryStyle = {
  color: reminderInk.champagne,
  borderColor: `color-mix(in srgb, ${reminderInk.champagne} 28%, transparent)`,
  backgroundColor: `color-mix(in srgb, ${reminderInk.champagne} 8%, transparent)`,
} as const

const INVITATION_WORD = "/decoration/deco/invitation-word-image.png"

function InvitationWordDeco({ side }: { side: "left" | "right" }) {
  return (
    <div
      className={`pointer-events-none absolute top-[7%] bottom-[7%] z-[5] w-[1.7rem] sm:w-[2.55rem] md:w-[3.4rem] lg:w-[4.15rem] ${
        side === "left"
          ? "left-2.5 sm:left-3.5 md:left-4"
          : "right-2.5 sm:right-3.5 md:right-4"
      }`}
      aria-hidden
    >
      <div
        className={`h-full w-full ${side === "right" ? "-scale-x-100" : ""}`}
        style={{
          backgroundColor: reminderInk.champagne,
          WebkitMaskImage: `url("${INVITATION_WORD}")`,
          maskImage: `url("${INVITATION_WORD}")`,
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskSize: "contain",
          maskSize: "contain",
          WebkitMaskPosition: "center",
          maskPosition: "center",
        }}
      />
    </div>
  )
}

const ct = {
  label: sectionType.label,
  body: sectionType.text,
  bodyLg: sectionType.subheader,
  stat: "text-2xl sm:text-3xl md:text-4xl",
  guestName: sectionType.subheader,
  meta: sectionType.label,
} as const

function GuestsCoupleLabel({ groom, bride }: { groom: string; bride: string }) {
  const lineStyle = {
    background:
      "linear-gradient(to right, transparent, color-mix(in srgb, #4b5d44 35%, transparent))",
  }

  return (
    <div className="flex items-center justify-center gap-2.5 sm:gap-3.5 mt-8 sm:mt-10 md:mt-12">
      <span className="h-px w-5 sm:w-7 md:w-9" style={lineStyle} aria-hidden />
      <p
        className={`${cinzel.className} ${sectionType.label} shrink-0 py-0.5 font-semibold uppercase leading-normal tracking-[0.34em] min-[400px]:tracking-[0.38em] sm:tracking-[0.44em]`}
        style={{ color: paperWash.sage }}
      >
        Celebrating With {groom}
        <span
          className={`${aboveTheBeyond.className} mx-1.5 inline-block normal-case tracking-normal sm:mx-2`}
          style={{
            fontSize: "1.35em",
            color: paperWash.sageSoft,
            verticalAlign: "middle",
          }}
          aria-hidden
        >
          &
        </span>
        {bride}
      </p>
      <span
        className="h-px w-5 sm:w-7 md:w-9"
        style={{
          background:
            "linear-gradient(to left, transparent, color-mix(in srgb, #4b5d44 35%, transparent))",
        }}
        aria-hidden
      />
    </div>
  )
}

function BookOfGuestsTitle() {
  return (
    <h2
      className="welcome-title-lockup relative mx-auto w-full max-w-full text-center"
      style={
        {
          "--title-size": layeredSectionTitleSize.main,
          "--script-size": layeredSectionTitleSize.script,
        } as React.CSSProperties
      }
    >
      <span
        className={`${theSeasons.className} block uppercase leading-[0.78] tracking-[0.08em] min-[400px]:tracking-[0.11em] sm:tracking-[0.13em] md:tracking-[0.14em] pb-1 sm:pb-1.5`}
        style={{
          fontSize: "var(--title-size)",
          color: paperWash.sage,
        }}
      >
        Book of Guests
      </span>
      <span
        aria-hidden
        className={`${aboveTheBeyond.className} mx-auto block w-fit max-w-full px-1 leading-[0.88] sm:leading-[0.9] mt-2 sm:mt-2.5 md:mt-3`}
        style={{
          fontSize: "var(--script-size)",
          color: paperWash.sageSoft,
        }}
      >
        celebrating with us
      </span>
      <span className="sr-only">celebrating with us</span>
    </h2>
  )
}

interface Guest {
  id: string | number
  name: string
  role: string
  email?: string
  contact?: string
  message?: string
  allowedGuests: number
  companions: { name: string; relationship: string }[]
  tableNumber: string
  isVip: boolean
  status: 'pending' | 'confirmed' | 'declined' | 'request'
  addedBy?: string
  createdAt?: string
  updatedAt?: string
}

const CARDS_PER_VIEW = 4

export function BookOfGuests() {
  const siteConfig = useSiteConfig()
  const groomName = siteConfig.couple.groomNickname || siteConfig.couple.groom
  const brideName = siteConfig.couple.brideNickname || siteConfig.couple.bride

  const [totalGuests, setTotalGuests] = useState(0)
  const [rsvpCount, setRsvpCount] = useState(0)
  const [confirmedGuests, setConfirmedGuests] = useState<Guest[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [previousTotal, setPreviousTotal] = useState(0)
  const [showIncrease, setShowIncrease] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [justEntered, setJustEntered] = useState(false)

  // Helper function to get initials from name
  const getInitials = (name: string): string => {
    const words = name.trim().split(' ')
    if (words.length >= 2) {
      return (words[0][0] + words[words.length - 1][0]).toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  // Helper function to format date
  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Recently'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const formatLastUpdate = (date: Date): string =>
    date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })

  const fetchGuests = async (showLoading = false) => {
    if (showLoading) setIsRefreshing(true)
    
    try {
      // Fetch from local API route which connects to Google Sheets
      const response = await fetch("/api/guests", {
        cache: "no-store"
      })

      if (!response.ok) {
        throw new Error("Failed to fetch guest list")
      }

      const data: Guest[] = await response.json()

      // Filter only confirmed/attending guests
      const attendingGuests = data.filter((guest) => guest.status === "confirmed")
      
      // Sort guests: VIPs first, then by updatedAt (most recent first)
      const sortedGuests = attendingGuests.sort((a, b) => {
        // VIPs come first
        if (a.isVip && !b.isVip) return -1
        if (!a.isVip && b.isVip) return 1
        
        // Then sort by most recent update
        const dateA = new Date(a.updatedAt || 0).getTime()
        const dateB = new Date(b.updatedAt || 0).getTime()
        return dateB - dateA
      })
      
      // Calculate total guests by summing allowedGuests for each confirmed guest
      const totalGuestCount = attendingGuests.reduce((sum, guest) => {
        return sum + (guest.allowedGuests || 1)
      }, 0)
      
      // Show increase animation if count went up
      if (totalGuestCount > totalGuests && totalGuests > 0) {
        setPreviousTotal(totalGuests)
        setShowIncrease(true)
        setTimeout(() => setShowIncrease(false), 2000)
      }
      
      setTotalGuests(totalGuestCount)
      setRsvpCount(attendingGuests.length)
      setConfirmedGuests(sortedGuests)
      setLastUpdate(new Date())
    } catch (error: any) {
      console.error("Failed to load guests:", error)
    } finally {
      if (showLoading) {
        setTimeout(() => setIsRefreshing(false), 500)
      }
    }
  }

  // Get visible guests (max 4 cards) for carousel
  const getVisibleGuests = () => {
    if (confirmedGuests.length <= CARDS_PER_VIEW) return confirmedGuests
    const visible: Guest[] = []
    for (let i = 0; i < CARDS_PER_VIEW; i++) {
      const index = (currentIndex + i) % confirmedGuests.length
      visible.push(confirmedGuests[index])
    }
    return visible
  }

  useEffect(() => {
    // Initial fetch
    fetchGuests()

    // Set up automatic polling every 30 seconds for real-time updates
    const pollInterval = setInterval(() => {
      fetchGuests()
    }, 30000) // 30 seconds

    // Set up event listener for RSVP updates
    const handleRsvpUpdate = () => {
      // Add a small delay to allow Google Sheets to update
      setTimeout(() => {
        fetchGuests(true)
      }, 2000)
    }

    window.addEventListener("rsvpUpdated", handleRsvpUpdate)

    return () => {
      clearInterval(pollInterval)
      window.removeEventListener("rsvpUpdated", handleRsvpUpdate)
    }
  }, [totalGuests])

  // Auto-rotate carousel every 5 seconds when more than 4 guests
  useEffect(() => {
    if (confirmedGuests.length <= CARDS_PER_VIEW) return
    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentIndex((prev) => {
          const next = prev + CARDS_PER_VIEW
          return next >= confirmedGuests.length ? 0 : next
        })
        setIsTransitioning(false)
        setJustEntered(true)
        setTimeout(() => setJustEntered(false), 1100)
      }, 600)
    }, 5000)
    return () => clearInterval(interval)
  }, [confirmedGuests.length])

  return (
    <div
      id="guests"
      className={`${theSeasons.variable} ${aboveTheBeyond.variable} relative isolate z-10 overflow-hidden pt-8 pb-8 sm:pt-10 sm:pb-10 md:pt-12 md:pb-12 lg:pt-14 lg:pb-14`}
      style={{ background: creamWash }}
    >
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

      {/* Section Header */}
      <div className="relative z-20 mx-auto mb-6 max-w-5xl px-6 pt-10 text-center @container/book-of-guests sm:mb-8 sm:px-10 sm:pt-12 md:mb-10 md:px-12 md:pt-14">
        <GuestsCoupleLabel groom={groomName} bride={brideName} />
        <div className="mt-6 mb-4 sm:mt-8 sm:mb-5 md:mt-10 md:mb-6">
          <BookOfGuestsTitle />
        </div>
        <p
          className={`font-goudy-italic mx-auto max-w-2xl px-2 ${sectionType.textRelaxed}`}
          style={{ color: paperWash.sage }}
        >
          Meet the cherished souls joining us in celebration — your presence makes our day truly
          special.
        </p>
        <div className="flex items-center justify-center pt-3 sm:pt-4">
          <span className="h-px w-16 sm:w-24 md:w-32" style={headerDividerLineStyle} />
        </div>
      </div>

      {/* Guests content */}
      <div className="relative z-20 mx-auto w-full max-w-3xl px-3 pb-2 sm:max-w-4xl sm:px-6 md:px-8 lg:max-w-5xl">
        <div
          className="relative overflow-hidden"
          style={{
            backgroundColor: reminderInk.deep,
            backgroundImage: `radial-gradient(90% 48% at 50% 0%, color-mix(in srgb, ${reminderInk.gold} 18%, transparent) 0%, transparent 62%)`,
            boxShadow: `0 18px 48px color-mix(in srgb, ${reminderInk.deep} 34%, transparent)`,
          }}
        >
          <div
            className="pointer-events-none absolute inset-[0.7rem] z-20 sm:inset-4 md:inset-[1.15rem]"
            aria-hidden
            style={{
              boxShadow: `
                inset 0 0 0 1px ${reminderInk.gold},
                inset 0 0 0 5px ${reminderInk.deep},
                inset 0 0 0 6px ${reminderInk.champagne}
              `,
            }}
          />

          <InvitationWordDeco side="left" />
          <InvitationWordDeco side="right" />

          <div className="relative z-10 mx-auto w-full px-[3.15rem] py-11 sm:px-16 sm:py-14 md:px-[4.75rem] md:py-16">
            <div className="text-center">
              <p
                className={`${cinzel.className} ${ct.label} mb-3 font-semibold uppercase tracking-[0.2em] sm:mb-4`}
                style={{ color: palette.accent }}
              >
                Our Celebration
              </p>

              <div className="mb-1 flex items-center justify-center gap-3 sm:mb-2 sm:gap-4">
                <span
                  className={`${cinzel.className} ${ct.stat} font-semibold tabular-nums leading-none transition-transform duration-500 ${showIncrease ? "scale-110" : ""}`}
                  style={{ color: palette.accent }}
                >
                  {totalGuests}
                </span>
                <p
                  className={`${cinzel.className} ${ct.bodyLg} max-w-[10rem] text-left font-medium leading-snug sm:max-w-none`}
                  style={{ color: palette.heading }}
                >
                  {totalGuests === 1 ? "Guest" : "Guests"}
                  <span className="block text-[0.85em] font-normal opacity-90">Celebrating With Us</span>
                </p>
              </div>

              <div className="mb-4 mt-4 flex flex-wrap items-center justify-center gap-2 sm:mb-5 sm:mt-5 sm:gap-3">
                <span
                  className={`${cinzel.className} ${ct.meta} rounded-full border px-3 py-1 font-semibold uppercase tracking-[0.12em]`}
                  style={chipPrimaryStyle}
                >
                  {rsvpCount} {rsvpCount === 1 ? "RSVP" : "RSVPs"}
                </span>
                <span
                  className={`${cinzel.className} ${ct.meta} rounded-full border px-3 py-1 font-semibold uppercase tracking-[0.12em]`}
                  style={chipSecondaryStyle}
                >
                  {confirmedGuests.length} {confirmedGuests.length === 1 ? "Party" : "Parties"}
                </span>
              </div>

              <div className="mx-auto mb-4 h-px w-12 sm:mb-5 sm:w-16" style={dividerLineStyle} />

              <p className={`font-goudy-italic ${ct.body} mx-auto max-w-md leading-relaxed`} style={{ color: palette.body }}>
                Thank you for confirming your RSVP — your presence means the world to us.
              </p>

              <div className="mt-5 flex flex-col items-center gap-3 sm:mt-6">
                <p
                  className={`${cinzel.className} ${ct.meta} uppercase tracking-[0.14em]`}
                  style={{ color: palette.label }}
                >
                  {isRefreshing ? "Updating guest list" : `Updated ${formatLastUpdate(lastUpdate)}`}
                </p>
                <button
                  type="button"
                  onClick={() => fetchGuests(true)}
                  disabled={isRefreshing}
                  className={`${cinzel.className} ${ct.meta} inline-flex min-w-[9.5rem] items-center justify-center gap-2 rounded-full border px-5 py-2 font-semibold uppercase tracking-[0.16em] transition-all duration-300 hover:scale-[1.03] hover:brightness-110 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60 sm:min-w-[10.5rem] sm:px-6 sm:py-2.5`}
                  style={refreshButtonStyle}
                  aria-label="Update guest list"
                >
                  <RefreshCw
                    className={`h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4 ${isRefreshing ? "animate-spin" : ""}`}
                    aria-hidden
                  />
                  <span>{isRefreshing ? "Updating" : "Update"}</span>
                </button>
              </div>
            </div>

            {confirmedGuests.length > 0 && (
              <div className="mt-10 sm:mt-12 md:mt-14">
                <div className="mb-4 text-center sm:mb-6 md:mb-8">
                  <p
                    className={`${cinzel.className} ${ct.label} font-semibold uppercase tracking-[0.2em]`}
                    style={{ color: palette.accent }}
                  >
                    Joining Us
                  </p>
                  <p className={`font-goudy-italic ${ct.body} mt-1.5`} style={{ color: palette.body }}>
                    A glimpse of the wonderful guests celebrating with us
                  </p>
                </div>
                <div
                  className="relative overflow-hidden"
                  style={{
                    perspective: "1200px",
                    perspectiveOrigin: "center 85%",
                    transformStyle: "preserve-3d",
                  }}
                >
                  <div
                    className={`space-y-2 sm:space-y-3 md:space-y-4 ${isTransitioning ? "animate-guest-roll-out" : ""}`}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    {getVisibleGuests().map((guest, index) => (
                      <div
                        key={`${guest.id}-${currentIndex}-${index}`}
                        className={`relative z-20 group overflow-hidden rounded-xl border p-3.5 transition-all duration-300 sm:rounded-2xl sm:p-4 md:p-5 ${justEntered ? "animate-guest-roll-in" : ""}`}
                        style={{
                          ...guestCardStyle,
                          ...(justEntered
                            ? {
                                animationDelay: `${index * 120}ms`,
                                backfaceVisibility: "hidden",
                              }
                            : {}),
                        }}
                      >
                      <div className="relative z-[1] flex items-start gap-3 sm:gap-4">
                        <div className="relative flex-shrink-0">
                          <div
                            className="flex h-11 w-11 items-center justify-center rounded-full shadow-md ring-2 sm:h-12 sm:w-12 md:h-14 md:w-14"
                            style={{
                              background: `linear-gradient(145deg, ${reminderInk.gold} 0%, ${reminderInk.navy} 100%)`,
                              boxShadow: `0 0 0 2px color-mix(in srgb, ${reminderInk.champagne} 70%, transparent)`,
                            }}
                          >
                            <span
                              className={`${cinzel.className} font-semibold ${sectionType.text}`}
                              style={{ color: reminderInk.champagne }}
                            >
                              {getInitials(guest.name)}
                            </span>
                          </div>
                        </div>

                        <div className="min-w-0 flex-1 pt-0.5">
                          <div className="mb-2 flex items-start justify-between gap-2 sm:mb-2.5">
                            <div className="min-w-0">
                              <h3
                                className={`font-goudy-italic ${ct.guestName} truncate font-semibold leading-tight`}
                                style={{ color: palette.heading }}
                                title={guest.name}
                              >
                                {guest.name}
                              </h3>
                              {guest.role && (
                                <p
                                  className={`${cinzel.className} ${ct.meta} mt-0.5 font-medium uppercase tracking-wide`}
                                  style={{ color: palette.label }}
                                >
                                  {guest.role}
                                </p>
                              )}
                            </div>
                            {guest.isVip && (
                              <span
                                className={`${cinzel.className} ${ct.meta} shrink-0 rounded-full border px-2 py-0.5 font-semibold uppercase tracking-[0.12em]`}
                                style={{
                                  backgroundColor: reminderInk.gold,
                                  borderColor: reminderInk.champagne,
                                  color: reminderInk.deep,
                                }}
                              >
                                VIP
                              </span>
                            )}
                          </div>

                          <div className="mb-2 flex flex-wrap items-center gap-1.5 sm:mb-3 sm:gap-2">
                            <span
                              className={`${cinzel.className} ${ct.meta} rounded-full border px-2.5 py-1 font-semibold uppercase tracking-[0.1em]`}
                              style={chipPrimaryStyle}
                            >
                              {guest.allowedGuests} {guest.allowedGuests === 1 ? "Guest" : "Guests"}
                            </span>
                            <span
                              className={`${cinzel.className} ${ct.meta} rounded-full border px-2.5 py-1 font-semibold uppercase tracking-[0.1em]`}
                              style={chipSecondaryStyle}
                            >
                              {guest.tableNumber && guest.tableNumber.trim() !== "" ? (
                                <> {guest.tableNumber}</>
                              ) : (
                                <span className="opacity-65">No Table Yet</span>
                              )}
                            </span>
                          </div>

                          {guest.companions && guest.companions.length > 0 && (
                            <div
                              className="border-t pt-2.5 sm:pt-3"
                              style={{
                                borderColor: `color-mix(in srgb, ${reminderInk.gold} 28%, transparent)`,
                              }}
                            >
                              <span
                                className={`${cinzel.className} ${ct.meta} mb-2 block font-semibold uppercase tracking-[0.14em]`}
                                style={{ color: palette.label }}
                              >
                                With Them
                              </span>
                              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                {guest.companions.map((companion, idx) => (
                                  <div
                                    key={idx}
                                    className="inline-flex items-center gap-1.5 rounded-lg border px-2 py-0.5 sm:px-2.5 sm:py-1"
                                    style={{
                                      borderColor: `color-mix(in srgb, ${reminderInk.champagne} 28%, transparent)`,
                                      backgroundColor: `color-mix(in srgb, ${reminderInk.navy} 55%, transparent)`,
                                    }}
                                  >
                                    <span className={`font-goudy-italic ${ct.meta} whitespace-nowrap font-medium`} style={{ color: palette.body }}>
                                      {companion.name}
                                    </span>
                                    {companion.relationship && companion.relationship.trim() !== "" && (
                                      <span
                                        className={`${cinzel.className} ${sectionType.label} whitespace-nowrap rounded-full border px-1.5 py-0.5 font-medium sm:px-2`}
                                        style={chipSecondaryStyle}
                                      >
                                        {companion.relationship}
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div
                            className="mt-2.5 flex items-center justify-between gap-2 border-t pt-2.5 sm:pt-3"
                            style={{
                              borderColor: `color-mix(in srgb, ${reminderInk.gold} 22%, transparent)`,
                            }}
                          >
                            <span className={`font-goudy-italic ${ct.meta}`} style={{ color: palette.body, opacity: 0.85 }}>
                              Confirmed {formatDate(guest.updatedAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  </div>
                </div>
              </div>
            )}

            {confirmedGuests.length === 0 && !isRefreshing && (
              <div className="mt-10 text-center sm:mt-12">
                <div
                  className="mx-auto h-px w-12 sm:w-16"
                  style={dividerLineStyle}
                />
                <p className={`${cinzel.className} ${ct.bodyLg} mt-6 mb-2 font-semibold sm:mt-8`} style={{ color: palette.heading }}>
                  Guest list updating
                </p>
                <p className={`font-goudy-italic ${ct.body}`} style={{ color: palette.body }}>
                  Confirmed guests will appear here as RSVPs come in.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}