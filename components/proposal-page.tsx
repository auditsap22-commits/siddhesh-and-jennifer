"use client"

import { useState, useEffect, useCallback, useMemo, useRef, useLayoutEffect, Suspense, type CSSProperties, type ReactNode } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "motion/react"
import {
  Heart,
  Check,
  X,
  Sparkles,
} from "lucide-react"
import localFont from "next/font/local"
import { Cinzel, Cormorant_Garamond } from "next/font/google"
import { useSiteConfig } from "@/hooks/use-site-config"
import { LoadingScreen } from "@/components/loader/LoadingScreen"
import { getRoleSingular } from "@/lib/proposal-roles"
import { normalizeWeddingDateString, parseWeddingDate } from "@/lib/wedding-date"
import { sectionType, welcomeTitleSize } from "@/lib/section-typography"
import { siteConfig as defaultSiteConfig } from "@/content/site"
import type { ProposalRole, ProposalResponse } from "@/lib/proposal-types"

const Silk = dynamic(() => import("@/components/silk"), { ssr: false })

const SILK_COLOR = "#105844"

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
})

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
})

const theSeasons = localFont({
  src: "../Font/Fontspring-DEMO-theseasons-reg.otf",
  display: "swap",
  variable: "--font-the-seasons",
})

const aboveTheBeyond = localFont({
  src: "../Font/above-the-beyond-script.otf",
  display: "swap",
  variable: "--font-above-beyond",
})

const C = {
  cream: "#fdf8f2",
  creamDeep: "#f3ebe1",
  paper: "#fff9f0",
  ink: "#093327",
  gold: "#c5a059",
  goldBright: "#d4af37",
  goldSoft: "#e6d3a3",
} as const

const goldLine = `color-mix(in srgb, ${C.gold} 62%, transparent)`

const palette = {
  body: C.ink,
  bodySoft: `color-mix(in srgb, ${C.ink} 68%, white)`,
  heading: C.ink,
  title: C.ink,
  label: C.ink,
  accent: C.gold,
  script: C.ink,
} as const

const NAME_SHADOW = `0 1px 0 color-mix(in srgb, ${C.paper} 90%, white), 0 0 12px color-mix(in srgb, ${C.goldSoft} 40%, transparent)`

const BORDER_SOFT = goldLine
const INNER_SURFACE = `color-mix(in srgb, ${C.gold} 8%, ${C.paper})`

const dividerLineStyle = {
  background: `linear-gradient(to right, transparent, ${goldLine}, transparent)`,
} as const

const nameStyle: CSSProperties = {
  fontSize: "clamp(0.6875rem, 2.55vw, 1.0625rem)",
  lineHeight: 1.3,
}

const paperTexture =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 220 220' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.45'/%3E%3C/svg%3E\")"

const cardStyle: CSSProperties = {
  backgroundColor: C.paper,
  backgroundImage: `
    radial-gradient(ellipse 70% 42% at 100% 0%, color-mix(in srgb, ${C.gold} 14%, transparent), transparent 68%),
    radial-gradient(ellipse 70% 42% at 0% 100%, color-mix(in srgb, ${C.gold} 12%, transparent), transparent 68%),
    linear-gradient(180deg, ${C.cream} 0%, ${C.paper} 52%, ${C.creamDeep} 100%),
    ${paperTexture}
  `,
  backgroundSize: "cover, cover, cover, 180px 180px",
  borderColor: goldLine,
  borderWidth: "1px",
  borderStyle: "solid",
  boxShadow: `0 12px 36px color-mix(in srgb, ${C.ink} 12%, transparent), inset 0 1px 0 color-mix(in srgb, ${C.paper} 70%, transparent)`,
}

const primaryBtnStyle: CSSProperties = {
  fontWeight: 600,
  backgroundColor: C.ink,
  borderColor: "color-mix(in srgb, #093327 72%, #041c16)",
  color: C.cream,
  boxShadow: "0 6px 20px color-mix(in srgb, #093327 35%, transparent)",
}

const secondaryBtnStyle: CSSProperties = {
  fontWeight: 600,
  color: C.ink,
  backgroundColor: C.paper,
  borderColor: goldLine,
}

const labelStyle = (color: string, extra?: CSSProperties): CSSProperties => ({
  fontFamily: cinzel.style.fontFamily,
  fontWeight: 600,
  color,
  ...extra,
})

function CornerOrnament({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 56 56" fill="none" aria-hidden="true">
      <path d="M54 3H20.5C9.6 3 3 9.6 3 20.5V54" stroke="currentColor" strokeWidth="1.15" />
      <path d="M54 8H23C12.8 8 8 12.8 8 23V54" stroke="currentColor" strokeWidth="0.8" opacity="0.72" />
      <circle cx="19" cy="19" r="1.55" fill="currentColor" />
      <path d="M14.5 19.5c2.4-5 5.2-7.6 9.8-9.6" stroke="currentColor" strokeWidth="0.7" />
    </svg>
  )
}

function GoldFrame() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute z-[5]"
      style={{
        inset: "clamp(0.45rem, 1.6vw, 0.9rem)",
        border: `1px solid color-mix(in srgb, ${C.gold} 78%, transparent)`,
      }}
    >
      <div
        className="pointer-events-none absolute"
        style={{
          inset: 5,
          border: `1px solid color-mix(in srgb, ${C.gold} 62%, transparent)`,
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
      <div className="pointer-events-none absolute left-0 top-0 z-10 w-[clamp(7rem,38vw,14rem)]">
        <Image src="/decoration/left-top-decoration.png" alt="" width={1138} height={1172} className="h-auto w-full" sizes="(max-width: 768px) 38vw, 224px" />
      </div>
      <div className="pointer-events-none absolute right-0 top-0 z-10 w-[clamp(6.5rem,34vw,12rem)]">
        <Image src="/decoration/right-top-decoration.png" alt="" width={1283} height={1226} className="h-auto w-full" sizes="(max-width: 768px) 34vw, 192px" />
      </div>
      <div className="pointer-events-none absolute bottom-0 left-0 z-10 w-[clamp(6.5rem,34vw,12rem)]">
        <Image src="/decoration/left-bottom-decoration.png" alt="" width={1115} height={1411} className="h-auto w-full" sizes="(max-width: 768px) 34vw, 192px" />
      </div>
      <div className="pointer-events-none absolute bottom-0 right-0 z-10 w-[clamp(7rem,38vw,14rem)]">
        <Image src="/decoration/right-bottom-decoration.png" alt="" width={988} height={1487} className="h-auto w-full" sizes="(max-width: 768px) 38vw, 224px" />
      </div>
    </>
  )
}

function OrnamentalDivider({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`flex items-center justify-center ${compact ? "gap-1.5" : "gap-2"}`}>
      <span
        className={`h-px ${compact ? "w-6 sm:w-10" : "w-8 sm:w-12"}`}
        style={dividerLineStyle}
      />
      <span
        className="h-0.5 w-0.5 rounded-full sm:h-1 sm:w-1"
        style={{ background: C.gold }}
        aria-hidden
      />
      <span
        className={`h-px ${compact ? "w-6 sm:w-10" : "w-8 sm:w-12"}`}
        style={{
          background: `linear-gradient(to left, transparent, ${C.gold})`,
        }}
      />
    </div>
  )
}

function LayeredProposalTitle({
  main,
  script,
  titleSize = welcomeTitleSize.main,
  scriptSize = welcomeTitleSize.script,
  scriptOverlap = welcomeTitleSize.overlap,
  scriptClassName = "",
}: {
  main: string
  script: string
  titleSize?: string
  scriptSize?: string
  scriptOverlap?: string
  scriptClassName?: string
}) {
  return (
    <h2
      className="welcome-title-lockup relative mx-auto w-full max-w-full text-center"
      style={
        {
          "--welcome-size": titleSize,
          "--script-size": scriptSize,
          "--script-overlap": scriptOverlap,
        } as CSSProperties
      }
    >
      <span
        className={`${theSeasons.className} block uppercase leading-[0.78] tracking-[0.08em] min-[400px]:tracking-[0.11em] sm:tracking-[0.13em] md:tracking-[0.14em]`}
        style={{
          fontSize: "var(--welcome-size)",
          color: palette.title,
        }}
      >
        {main}
      </span>
      <span
        aria-hidden
        className={`${aboveTheBeyond.className} relative z-10 mx-auto block w-fit max-w-full px-1 leading-[0.88] sm:leading-[0.9] ${scriptClassName}`}
        style={{
          marginTop: "var(--script-overlap)",
          fontSize: "var(--script-size)",
          color: palette.script,
          textShadow: NAME_SHADOW,
        }}
      >
        {script}
      </span>
      <span className="sr-only">{script}</span>
    </h2>
  )
}

function ProposalPersonalInvitationTitle() {
  return <LayeredProposalTitle main="A Special Invitation" script="just for you" />
}

function ProposalFlowHeader({
  icon,
  main,
  script,
  iconClassName = "",
  iconStyle,
  animated = false,
}: {
  icon: ReactNode
  main: string
  script: string
  iconClassName?: string
  iconStyle?: CSSProperties
  animated?: boolean
}) {
  const iconNode = (
    <div
      className={`flex h-12 w-12 items-center justify-center rounded-full shadow-sm backdrop-blur-sm ${iconClassName}`}
      style={iconStyle}
    >
      {icon}
    </div>
  )

  return (
    <>
      <div className="mb-6 flex justify-center">
        {animated ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.6 }}
          >
            {iconNode}
          </motion.div>
        ) : (
          iconNode
        )}
      </div>

      <div className="mb-4">
        <LayeredProposalTitle main={main} script={script} />
      </div>
    </>
  )
}

function ProposalFlowSubheader({ children }: { children: ReactNode }) {
  return (
    <p
      className={`${cinzel.className} ${sectionType.label} mx-auto mb-4 max-w-lg font-semibold uppercase tracking-[0.12em] sm:mb-5 sm:tracking-[0.16em] md:tracking-[0.18em]`}
      style={{ color: palette.label }}
    >
      {children}
    </p>
  )
}

function ProposalFlowBody({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <p
      className={`${cormorant.className} italic mx-auto max-w-lg ${sectionType.textRelaxed} ${className}`}
      style={{ color: palette.body }}
    >
      {children}
    </p>
  )
}

function ProposalCoupleIdentity({ groom, bride }: { groom: string; bride: string }) {
  return (
    <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-2 sm:max-w-md sm:gap-2.5 md:gap-3">
      <div className="relative w-[clamp(4.25rem,17vw,6.25rem)]">
        <Image
          src="/monogram/monog.png"
          alt="Jennifer and Siddhesh monogram"
          width={289}
          height={382}
          className="h-auto w-full drop-shadow-[0_8px_20px_rgba(9,51,39,0.12)]"
          priority
          sizes="(max-width: 768px) 17vw, 100px"
        />
      </div>
      <div
        className="w-[min(82%,18rem)] sm:w-[min(76%,20rem)]"
        role="img"
        aria-label={`${groom} and ${bride}`}
      >
        <Image
          src="/decoration/couple.png"
          alt={`${groom} and ${bride}`}
          width={1672}
          height={941}
          className="h-auto w-full"
          priority
          sizes="(max-width: 768px) 68vw, 320px"
        />
      </div>
    </div>
  )
}

function ProposalCeremonyDetails({
  venue,
  day,
  time,
  date,
}: {
  venue: string
  day: string
  time: string
  date: string
}) {
  const whenLine = [day, time].filter(Boolean).join(" · ")

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-1.5 px-1 text-center sm:max-w-md sm:gap-2 sm:px-2">
      {venue ? (
        <p
          className={`${cinzel.className} text-[clamp(0.78rem,3vw,0.95rem)] font-bold uppercase tracking-[0.16em]`}
          style={{ color: palette.heading }}
        >
          {venue}
        </p>
      ) : null}
      {whenLine ? (
        <p
          className={`${cinzel.className} text-[clamp(0.62rem,2.4vw,0.74rem)] font-semibold uppercase tracking-[0.2em]`}
          style={{ color: palette.heading }}
        >
          {whenLine}
        </p>
      ) : null}
      {date ? (
        <p
          className={`${cormorant.className} text-[clamp(0.9rem,3.2vw,1.05rem)] font-medium italic`}
          style={{ color: palette.body }}
        >
          {date}
        </p>
      ) : null}
    </div>
  )
}

function ProposalRoleTitle({ roleSingular }: { roleSingular: string }) {
  return (
    <div className="mx-auto w-full max-w-xl space-y-3 text-left sm:space-y-4">
      {/* <p
        className={`${cinzel.className} ${sectionType.label} font-semibold uppercase tracking-[0.16em] sm:tracking-[0.2em] md:tracking-[0.24em]`}
        style={{ color: palette.label }}
      >
        Will You Stand With Us As Our
      </p> */}

      {/* <div className="flex items-center justify-center gap-3">
       <InlineDivider compact />
        <span
          className={`${aboveTheBeyond.className} shrink-0 text-[clamp(1rem,3vw,1.35rem)] leading-none`}
          style={{ color: palette.accent }}
          aria-hidden
        >
          &
        </span>
        <InlineDivider compact /> 
      </div> */}

      <h2
        className={`${theSeasons.className} capitalize leading-[0.98] tracking-[0.04em] sm:leading-[1.1] sm:tracking-[0.08em] [overflow-wrap:anywhere]`}
        style={{
          fontSize: "clamp(1.85rem, 8vw, 3.75rem)",
          color: palette.title,
          textShadow: NAME_SHADOW,
        }}
      >
        {roleSingular}?
      </h2>
    </div>
  )
}

function DividerLine({ className = "w-16 sm:w-24 md:w-32" }: { className?: string }) {
  return <span className={`h-px ${className}`} style={dividerLineStyle} aria-hidden />
}

function ProposalCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative w-full ${className}`}>
      <div
        className="relative isolate overflow-hidden rounded-xl border sm:rounded-2xl"
        style={cardStyle}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background:
              "radial-gradient(ellipse 46% 28% at 88% 10%, rgb(197 160 89 / 12%), transparent 72%), radial-gradient(ellipse 46% 28% at 10% 90%, rgb(210 145 122 / 10%), transparent 72%)",
          }}
        />
        <GoldFrame />
        <CornerDecorations />
        <div className="relative z-20 p-6 text-center sm:p-10 md:p-12 md:py-14 lg:p-14 lg:py-16">
          {children}
        </div>
      </div>
    </div>
  )
}

function ProposalIntroSection() {
  const siteConfig = useSiteConfig()

  const groomNickname = siteConfig.couple.groomNickname || siteConfig.couple.groom
  const brideNickname = siteConfig.couple.brideNickname || siteConfig.couple.bride
  const ceremonyDate =
    siteConfig.ceremony.date ?? siteConfig.wedding.date ?? defaultSiteConfig.ceremony.date
  const parsedDate = useMemo(
    () => parseWeddingDate(ceremonyDate, parseWeddingDate(defaultSiteConfig.ceremony.date)),
    [ceremonyDate],
  )
  const ceremonyDay =
    siteConfig.ceremony.day ?? parsedDate.dayOfWeek ?? defaultSiteConfig.ceremony.day
  const ceremonyTime =
    siteConfig.ceremony.time ?? siteConfig.wedding.time ?? defaultSiteConfig.ceremony.time
  const fullDateLabel = normalizeWeddingDateString(ceremonyDate)
  const venue =
    siteConfig.wedding.venue ?? siteConfig.ceremony.location ?? defaultSiteConfig.ceremony.location

  return (
    <div
      className="mx-auto w-full max-w-xl space-y-5 text-center sm:space-y-6 md:space-y-7"
      style={{ color: palette.body, WebkitFontSmoothing: "antialiased" }}
    >
      <header className="space-y-3 px-1 sm:space-y-4 sm:px-2 md:space-y-5">
        <ProposalCoupleIdentity groom={groomNickname} bride={brideNickname} />
        <ProposalPersonalInvitationTitle />
        <div className="pt-1 sm:pt-2">
          <OrnamentalDivider compact />
        </div>
      </header>

      <div
        className={`${cormorant.className} italic mx-auto max-w-xl space-y-3 px-1 text-pretty sm:space-y-3.5 sm:px-2 ${sectionType.textRelaxed}`}
        style={{ color: palette.body }}
      >
        <p>
          As we prepare for our wedding day, we keep coming back to the people who have meant the
          most to us — and you are one of them.
        </p>
        <p>
          This is not a general invitation. It is a personal ask, from our hearts to yours: we would
          love for you to be part of our celebration in a way that is truly special.
        </p>
      </div>

      <ProposalCeremonyDetails
        venue={venue}
        day={ceremonyDay}
        time={ceremonyTime}
        date={fullDateLabel}
      />

      <div className="pt-1 sm:pt-2">
        <OrnamentalDivider compact />
      </div>
    </div>
  )
}

const primaryBtnClass =
  `${cinzel.className} cursor-pointer rounded-full border px-5 py-3 text-[0.65rem] font-semibold uppercase tracking-[0.2em] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md disabled:opacity-50 sm:px-7 sm:py-3.5 sm:text-xs sm:tracking-[0.24em] md:px-8 md:py-4 md:tracking-[0.28em]`

const secondaryBtnClass =
  `${cinzel.className} cursor-pointer rounded-full border px-5 py-3 text-[0.65rem] font-semibold uppercase tracking-[0.2em] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:px-7 sm:py-3.5 sm:text-xs sm:tracking-[0.24em] md:px-8 md:py-4 md:tracking-[0.28em]`

function ProposalAskSection({
  roleSingular,
  description,
  coAttendants,
  onYes,
  onNo,
}: {
  roleSingular: string
  description: string
  coAttendants: string[]
  onYes: () => void
  onNo: () => void
}) {
  const questionRef = useRef<HTMLDivElement>(null)
  const [questionHeight, setQuestionHeight] = useState<number | null>(null)

  useLayoutEffect(() => {
    const node = questionRef.current
    if (!node) return

    const syncHeight = () => {
      setQuestionHeight(node.getBoundingClientRect().height)
    }

    syncHeight()
    const observer = new ResizeObserver(syncHeight)
    observer.observe(node)

    return () => observer.disconnect()
  }, [roleSingular, description])

  return (
    <div className="relative mx-auto mt-0 w-full sm:mt-10">
      {/* {coAttendants.length > 0 && (
        <div
          className="mx-auto mb-8 max-w-lg space-y-3 rounded-xl px-5 py-4 text-center sm:px-6 sm:py-5"
          style={{ border: `1px solid ${BORDER_SOFT}`, backgroundColor: INNER_SURFACE }}
        >
          <div
            className={`${cinzel.className} flex items-center justify-center gap-2 text-[10px] font-semibold tracking-[0.2em] uppercase sm:text-xs`}
            style={labelStyle(palette.label)}
          >
            <Sparkles className="h-3.5 w-3.5 shrink-0" />
            <span>Co-members standing in this position</span>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {coAttendants.map((name, idx) => (
              <span
                key={idx}
                className={`${cormorant.className} italic rounded-full px-3 py-1 text-xs shadow-sm`}
                style={{ color: palette.body, border: `1px solid ${BORDER_SOFT}`, backgroundColor: C.paper }}
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      )} */}

      <div
        className="relative pt-2 sm:pt-12"
      >
        <div className="mb-6 flex items-center justify-center sm:mb-8">
          <DividerLine className="w-full max-w-md" />
        </div>
        <div className="relative mt-6 sm:mt-10 sm:flex sm:items-end sm:justify-between sm:gap-8 md:gap-10">
          <div className="grid grid-cols-[minmax(0,1.15fr)_minmax(8.5rem,0.9fr)] sm:flex sm:min-w-0 sm:flex-1 sm:flex-col">
            <div className="col-start-1 row-start-1 min-w-0">
              <ProposalRoleTitle roleSingular={roleSingular} />
            </div>

            <p
              ref={questionRef}
              className={`${cormorant.className} italic col-start-1 row-start-2 mt-3 min-w-0 text-left sm:mt-6 sm:max-w-xl ${sectionType.textRelaxed}`}
              style={{ color: palette.body }}
            >
              &ldquo;{description}&rdquo;
            </p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              aria-hidden
              className="pointer-events-none relative col-start-2 row-start-1 row-span-2 -mr-1 min-h-[320px] sm:hidden"
            >
              <Image
                src="/decoration/couplenew.png"
                alt=""
                fill
                className="object-contain object-bottom object-right drop-shadow-[0_16px_36px_rgba(9,51,39,0.14)]"
                sizes="42vw"
                priority
              />
            </motion.div>

            <div className="col-span-2 mt-8 hidden w-full flex-row gap-3 sm:mt-12 sm:flex sm:max-w-md md:mt-14">
              <button
                onClick={onYes}
                className={`${primaryBtnClass} min-w-0 flex-1`}
                style={primaryBtnStyle}
              >
                Yes, I&apos;d Be Honored
              </button>
              <button
                onClick={onNo}
                className={`${secondaryBtnClass} min-w-0 flex-1`}
                style={secondaryBtnStyle}
              >
                Regretfully Decline
              </button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            aria-hidden
            style={
              questionHeight
                ? ({ "--ask-image-h": `${questionHeight}px` } as CSSProperties)
                : undefined
            }
            className="pointer-events-none relative hidden shrink-0 sm:block sm:w-[min(36vw,240px)] md:w-[min(32vw,280px)] lg:w-[300px]"
          >
            <div className="relative aspect-[941/1672] w-full sm:min-h-[var(--ask-image-h)] sm:translate-y-4 md:translate-y-6">
              <Image
                src="/decoration/couplenew.png"
                alt=""
                fill
                className="object-contain object-bottom drop-shadow-[0_20px_48px_rgba(42,37,32,0.12)]"
                sizes="300px"
                priority
              />
            </div>
          </motion.div>

          <div className="mt-6 flex w-full flex-row gap-2.5 sm:hidden">
            <button
              onClick={onYes}
              className={`${primaryBtnClass} min-h-11 min-w-0 flex-1 px-4 py-3.5`}
              style={primaryBtnStyle}
            >
              Yes
            </button>
            <button
              onClick={onNo}
              className={`${secondaryBtnClass} min-h-11 min-w-0 flex-1 px-4 py-3.5`}
              style={secondaryBtnStyle}
            >
              Decline
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

type ProposalFlowState =
  | "question"
  | "yes_details"
  | "yes_submitted"
  | "no_clicked"
  | "no_submitted"

interface ProposalPageProps {
  role: ProposalRole
}

export function ProposalPage({ role }: ProposalPageProps) {
  const [isReady, setIsReady] = useState(false)
  const [flowState, setFlowState] = useState<ProposalFlowState>("question")
  const [preferredName, setPreferredName] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [validationError, setValidationError] = useState("")
  const [responses, setResponses] = useState<ProposalResponse[]>([])

  const handleLoadingComplete = useCallback(() => {
    setIsReady(true)
  }, [])

  useEffect(() => {
    fetch("/api/proposal-responses", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setResponses(Array.isArray(data) ? data : []))
      .catch(() => setResponses([]))
  }, [])

  const coAttendants = responses
    .filter((r) => r.role === role.id && r.status === "Confirmed")
    .map((r) => r.name || "A Secret Supporter")

  const submitResponse = async (status: "Confirmed" | "Declined", name: string) => {
    const response = await fetch("/api/proposal-responses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        role: role.id,
        name,
        status,
        submittedAt: new Date().toISOString(),
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to submit response")
    }

    window.dispatchEvent(new Event("entourageUpdated"))
  }

  const handleYesSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!preferredName.trim()) {
      setValidationError(
        "Please type your preferred name so we can add it to our invitation."
      )
      return
    }
    setValidationError("")
    setSubmitting(true)

    try {
      await submitResponse("Confirmed", preferredName.trim())
      setFlowState("yes_submitted")
    } catch (err) {
      console.error("Failed to submit confirmation:", err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleNoSubmit = async () => {
    setSubmitting(true)
    try {
      await submitResponse("Declined", "Declined Entourage Offer")
      setFlowState("no_submitted")
    } catch (err) {
      console.error("Failed to submit decline:", err)
    } finally {
      setSubmitting(false)
    }
  }

  const roleSingular = getRoleSingular(role.title)

  return (
    <div
      className={`${theSeasons.variable} ${aboveTheBeyond.variable} ${cormorant.className} relative min-h-screen select-none overflow-x-hidden px-3 py-10 sm:px-6 sm:py-16 md:py-20`}
      style={{ color: palette.body }}
    >
      {process.env.NEXT_PUBLIC_ENABLE_DECOR !== "false" ? (
        <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
          <Suspense fallback={<div className="h-full w-full" style={{ backgroundColor: SILK_COLOR }} />}>
            <Silk speed={8} scale={0.9} color={SILK_COLOR} noiseIntensity={0} rotation={0.3} />
          </Suspense>
        </div>
      ) : (
        <div className="pointer-events-none fixed inset-0 z-0" style={{ backgroundColor: SILK_COLOR }} aria-hidden />
      )}

      {!isReady && <LoadingScreen onComplete={handleLoadingComplete} />}

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={isReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mx-auto flex w-full max-w-2xl flex-col items-center justify-center lg:max-w-4xl min-h-[calc(100dvh-5rem)] sm:min-h-[calc(100dvh-8rem)]"
        style={{ color: palette.body }}
      >
        <AnimatePresence mode="wait">
          {flowState === "question" && (
            <motion.div
              key="question-box"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <ProposalCard>
              <div className="relative z-10 w-full space-y-6 pt-2 sm:space-y-9 sm:pt-3">
                <ProposalIntroSection />

                <div
                  className="mx-auto max-w-xl space-y-4 px-1 py-6 sm:space-y-5 sm:px-2 sm:py-9"
                >
                  <figure
                    className="rounded-md border px-4 py-3.5 sm:rounded-lg sm:px-5 sm:py-4"
                    style={{
                      background: INNER_SURFACE,
                      borderColor: goldLine,
                      boxShadow: `inset 3px 0 0 ${C.gold}`,
                    }}
                  >
                    <blockquote>
                      <p
                        className={`${cormorant.className} italic ${sectionType.textSnug}`}
                        style={{ color: palette.body }}
                      >
                        In choosing who will stand with us, we did not begin with titles — we began
                        with the people who have walked with us, believed in us, and loved us along
                        the way.
                      </p>
                    </blockquote>
                  </figure>

                  <div
                    className={`${cormorant.className} italic space-y-3 text-pretty sm:space-y-3.5 ${sectionType.textRelaxed}`}
                    style={{ color: palette.body }}
                  >
                    <p>
                      You have been a blessing in our lives — through your kindness, your laughter,
                      and the love you have shown us. That is why we are reaching out to you
                      personally, and not to everyone.
                    </p>
                    <p>
                      We cannot imagine this day without the people who matter most standing close
                      beside us. If your heart is open to it, it would mean the world to us to
                      have you there not only as someone we cherish, but as an important part of
                      our wedding.
                    </p>
                    <p
                      className={`${cinzel.className} ${sectionType.label} font-semibold uppercase tracking-[0.1em] sm:tracking-[0.14em] md:tracking-[0.16em]`}
                      style={{ color: palette.accent }}
                    >
                      With sincerity and gratitude, we ask — would you stand with us as our:
                    </p>
                  </div>
                </div>

                <ProposalAskSection
                  roleSingular={roleSingular}
                  description={role.description}
                  coAttendants={coAttendants}
                  onYes={() => setFlowState("yes_details")}
                  onNo={() => setFlowState("no_clicked")}
                />
              </div>
              </ProposalCard>
            </motion.div>
          )}

          {flowState === "yes_details" && (
            <motion.form
              key="yes-form"
              onSubmit={handleYesSubmit}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
            >
              <ProposalCard>
              <div className="relative z-10 w-full space-y-4 py-1 sm:space-y-6 sm:py-3">
                <ProposalFlowHeader
                  icon={<Check className="h-6 w-6" style={{ color: C.ink }} />}
                  iconClassName="border"
                  iconStyle={{
                    backgroundColor: C.paper,
                    borderColor: goldLine,
                    boxShadow: `0 6px 18px color-mix(in srgb, ${C.ink} 10%, transparent)`,
                  }}
                  main="We are Honored"
                  script="you said yes"
                />

                <ProposalFlowSubheader>A few details to complete your response</ProposalFlowSubheader>

                <ProposalFlowBody className="mb-2 max-w-md text-center sm:mb-3">
                  Thank you for accepting our invitation to stand with us. Your yes means more to
                  us than we can easily put into words — we are truly grateful.
                </ProposalFlowBody>

                <p
                  className={`${cormorant.className} italic mx-auto mb-1 max-w-md text-center ${sectionType.textSnug}`}
                  style={{ color: palette.bodySoft }}
                >
                  Please enter the exact name you would like displayed on our wedding invitation
                  and guest lists:
                </p>

                <div className="mx-auto max-w-md text-left">
                  <label className={`${cinzel.className} mb-2 block text-[10px] font-semibold tracking-[0.16em] uppercase sm:text-[12px]`} style={labelStyle(palette.label)}>
                    Your Preferred Name <span style={{ color: palette.accent }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aunt Maria Clara / Mr. James Bond"
                    value={preferredName}
                    onChange={(e) => setPreferredName(e.target.value)}
                    className={`${cormorant.className} italic w-full rounded-xl px-4 py-2.5 text-xs transition-all focus:outline-none sm:py-3 sm:text-sm`}
                    style={{
                      color: palette.body,
                      backgroundColor: INNER_SURFACE,
                      border: `1px solid ${BORDER_SOFT}`,
                      boxShadow: `inset 0 1px 2px color-mix(in srgb, ${C.ink} 8%, transparent)`,
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = C.gold
                      e.currentTarget.style.boxShadow = `0 0 0 2px color-mix(in srgb, ${C.gold} 35%, transparent)`
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = BORDER_SOFT
                      e.currentTarget.style.boxShadow = `inset 0 1px 2px color-mix(in srgb, ${C.ink} 8%, transparent)`
                    }}
                  />
                  {validationError && (
                    <p className="mt-2 flex items-center gap-1 text-xs font-medium" style={{ color: C.gold }}>
                      <span>⚠️</span> {validationError}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-center pt-4">
                  <DividerLine className="w-full max-w-md" />
                </div>
                <div className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`${primaryBtnClass} flex-1`}
                    style={primaryBtnStyle}
                  >
                    {submitting ? "Saving..." : "Submit Response"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFlowState("question")}
                    className={secondaryBtnClass}
                    style={secondaryBtnStyle}
                  >
                    Cancel
                  </button>
                </div>
              </div>
              </ProposalCard>
            </motion.form>
          )}

          {flowState === "yes_submitted" && (
            <motion.div
              key="yes-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <ProposalCard>
              <div className="relative z-10 space-y-4">
                <ProposalFlowHeader
                  animated
                  icon={<Sparkles className="h-8 w-8" style={{ color: C.ink }} />}
                  iconClassName="border"
                  iconStyle={{
                    color: C.ink,
                    backgroundColor: C.paper,
                    borderColor: goldLine,
                    boxShadow: `0 6px 18px color-mix(in srgb, ${C.ink} 10%, transparent)`,
                  }}
                  main="Its Official"
                  script="thank you"
                />

                <ProposalFlowSubheader>Your response has been received</ProposalFlowSubheader>

                <div
                  className="mx-auto mb-2 max-w-sm rounded-2xl px-6 py-4 shadow-sm backdrop-blur-sm sm:mb-4"
                  style={{ border: `1px solid ${BORDER_SOFT}`, backgroundColor: INNER_SURFACE }}
                >
                  <span
                    className={`${cinzel.className} mb-1 block text-[10px] font-semibold tracking-[0.16em] uppercase sm:text-[12px]`}
                    style={labelStyle(palette.label)}
                  >
                    Registered name
                  </span>
                  <p
                    className={`${cormorant.className} italic ${sectionType.text} font-medium`}
                    style={{ ...nameStyle, color: palette.heading }}
                  >
                    {preferredName}
                  </p>
                  <span
                    className={`${cinzel.className} mt-2 block text-[10px] font-semibold tracking-[0.14em] uppercase sm:text-[11px]`}
                    style={{ color: palette.bodySoft }}
                  >
                    Standing as our {role.title}
                  </span>
                </div>

                <ProposalFlowBody className="mb-8 max-w-md text-center sm:mb-10">
                  Having you stand with us fills our hearts with joy and gratitude. We cannot wait
                  to celebrate this beautiful day together with you by our side.
                </ProposalFlowBody>

                <div className="flex items-center justify-center pb-2 sm:pb-3">
                  <DividerLine className="w-full max-w-md" />
                </div>

                <Link
                  href="/"
                  className={`${primaryBtnClass} mx-auto inline-block w-full max-w-sm`}
                  style={primaryBtnStyle}
                >
                  Return to Wedding Page
                </Link>
              </div>
              </ProposalCard>
            </motion.div>
          )}

          {flowState === "no_clicked" && (
            <motion.div
              key="no-confirm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <ProposalCard>
              <div className="relative z-10 space-y-4">
                <ProposalFlowHeader
                  icon={<X className="h-6 w-6" style={{ color: C.ink }} />}
                  iconClassName="border"
                  iconStyle={{
                    backgroundColor: C.paper,
                    borderColor: goldLine,
                    boxShadow: `0 6px 18px color-mix(in srgb, ${C.ink} 10%, transparent)`,
                  }}
                  main="Thank You"
                  script="for responding"
                />

                <ProposalFlowSubheader>We understand and appreciate your honesty</ProposalFlowSubheader>

                <ProposalFlowBody className="mb-8 max-w-lg text-center sm:mb-10">
                  While we&apos;re saddened that you won&apos;t be able to join us in this role, we
                  truly appreciate your support and well wishes as we begin this new chapter
                  together.
                </ProposalFlowBody>

                <div className="flex items-center justify-center pt-4">
                  <DividerLine className="w-full max-w-md" />
                </div>
                <div className="mx-auto flex max-w-xs flex-col gap-3 sm:max-w-md sm:flex-row">
                  <button
                    onClick={handleNoSubmit}
                    disabled={submitting}
                    className={`${cinzel.className} flex-1 cursor-pointer rounded-sm border px-8 py-4 text-[11px] font-semibold tracking-[0.18em] uppercase shadow-md transition-all duration-300 disabled:opacity-50`}
                    style={primaryBtnStyle}
                  >
                    {submitting ? "Sending..." : "Send Response"}
                  </button>
                  <button
                    onClick={() => setFlowState("question")}
                    className={secondaryBtnClass}
                    style={secondaryBtnStyle}
                  >
                    Go Back
                  </button>
                </div>
              </div>
              </ProposalCard>
            </motion.div>
          )}

          {flowState === "no_submitted" && (
            <motion.div
              key="no-submitted-box"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <ProposalCard>
              <div className="relative z-10 space-y-4">
                <ProposalFlowHeader
                  icon={<Heart className="h-6 w-6" style={{ color: C.ink }} />}
                  iconStyle={{
                    color: C.ink,
                    backgroundColor: C.paper,
                    border: `1px solid ${goldLine}`,
                    boxShadow: `0 6px 18px color-mix(in srgb, ${C.ink} 10%, transparent)`,
                  }}
                  main="Response Sent"
                  script="successfully"
                />

                <ProposalFlowSubheader>Your message has reached us</ProposalFlowSubheader>

                <ProposalFlowBody className="mb-6 max-w-md text-center sm:mb-8">
                  We have received your response. Your love, support, and well wishes mean the
                  world to us regardless. We look forward to celebrating other special milestones
                  with you in the future.
                </ProposalFlowBody>

                <div className="flex items-center justify-center pb-2 sm:pb-3">
                  <DividerLine className="w-full max-w-md" />
                </div>

                <Link
                  href="/"
                  className={`${secondaryBtnClass} mx-auto inline-block w-full max-w-sm`}
                  style={secondaryBtnStyle}
                >
                  Return to Wedding Page
                </Link>
              </div>
              </ProposalCard>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
