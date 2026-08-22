"use client"

import { Cinzel } from "next/font/google"
import localFont from "next/font/local"
import { ArrowRight } from "lucide-react"
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

const C = {
  navy: "#4b5d44",
  gold: "#6a7b5c",
  goldBright: "#4b5d44",
  goldSoft: "#6a7b5c",
  paper: "#f9f6ee",
} as const

const goldLine = `color-mix(in srgb, ${C.gold} 55%, transparent)`
const outsideInk = {
  text: "#ffffff",
  textSoft: "rgba(255, 255, 255, 0.82)",
  line: "rgba(255, 255, 255, 0.45)",
} as const
const outsideLine = `linear-gradient(to right, transparent, ${outsideInk.line}, transparent)`

const palette = {
  body: C.navy,
  heading: C.goldBright,
  accent: C.gold,
} as const

const outsideDividerLineStyle = {
  background: outsideLine,
} as const

const insideDividerLineStyle = {
  background: `linear-gradient(to right, transparent, ${goldLine}, transparent)`,
} as const

const cardStyle = {
  background: `linear-gradient(180deg, color-mix(in srgb, ${C.goldSoft} 28%, ${C.paper}) 0%, ${C.paper} 48%, color-mix(in srgb, ${C.gold} 10%, ${C.paper}) 100%)`,
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: goldLine,
  boxShadow: `0 12px 36px color-mix(in srgb, ${C.navy} 28%, transparent), inset 0 1px 0 color-mix(in srgb, ${C.goldSoft} 55%, transparent)`,
} as const

function OutsideDivider() {
  return (
    <div className="flex items-center justify-center gap-1.5">
      <span className="h-px w-6 sm:w-10" style={outsideDividerLineStyle} />
      <span
        className="h-0.5 w-0.5 rounded-full sm:h-1 sm:w-1"
        style={{ backgroundColor: outsideInk.line }}
        aria-hidden
      />
      <span
        className="h-px w-6 sm:w-10"
        style={{
          background: `linear-gradient(to left, transparent, ${outsideInk.line}, transparent)`,
        }}
      />
    </div>
  )
}

function InsideDivider() {
  return (
    <div className="flex items-center justify-center gap-1.5">
      <span className="h-px w-6 sm:w-10" style={insideDividerLineStyle} />
      <span
        className="h-0.5 w-0.5 rounded-full sm:h-1 sm:w-1"
        style={{ backgroundColor: goldLine }}
        aria-hidden
      />
      <span
        className="h-px w-6 sm:w-10"
        style={{
          background: `linear-gradient(to left, transparent, ${goldLine}, transparent)`,
        }}
      />
    </div>
  )
}

function VideoMessageTitle() {
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
          color: outsideInk.text,
        }}
      >
        Send Us a Video Message
      </span>
      <span
        aria-hidden
        className={`${aboveTheBeyond.className} mx-auto block w-fit max-w-full px-1 leading-[0.88] sm:leading-[0.9] mt-2 sm:mt-2.5 md:mt-3`}
        style={{
          fontSize: "var(--script-size)",
          color: outsideInk.textSoft,
        }}
      >
        A message we will treasure
      </span>
      <span className="sr-only">A message we will treasure</span>
    </h2>
  )
}

export function VideoMessage() {
  const siteConfig = useSiteConfig()
  const uploadUrl = siteConfig.snapShare?.googleDriveLink ?? ""

  return (
    <section
      id="video-message"
      className={`${theSeasons.variable} ${aboveTheBeyond.variable} relative z-10 bg-transparent pt-8 pb-8 sm:pt-10 sm:pb-10 md:pt-12 md:pb-12 lg:pt-14 lg:pb-14`}
    >
      <div className="relative z-20 mx-auto max-w-4xl px-4 @container/video-message sm:px-6 md:px-8">
        <div className="relative z-20 px-6 text-center sm:px-10 md:px-12">
          <div className="mx-auto mb-5 sm:mb-6 md:mb-7">
            <OutsideDivider />
          </div>
          <div className="mx-auto mt-2 sm:mt-3 md:mt-4">
            <VideoMessageTitle />
          </div>
          <div className="flex items-center justify-center pt-3 sm:pt-4">
            <span className="h-px w-16 sm:w-24 md:w-32" style={{ background: outsideInk.line }} />
          </div>
        </div>

        <div
          className="relative mt-6 overflow-hidden rounded-xl border backdrop-blur-xl sm:mt-8 sm:rounded-2xl sm:backdrop-blur-2xl md:mt-10"
          style={cardStyle}
        >
          <div
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
            style={{
              background: `linear-gradient(135deg, color-mix(in srgb, ${C.goldSoft} 28%, transparent) 0%, transparent 48%)`,
            }}
            aria-hidden
          />

          <div className="relative z-20 space-y-4 px-4 py-6 text-center sm:space-y-5 sm:px-6 sm:py-8 md:space-y-6 md:px-8 md:py-10">
            <div
              className={`font-goudy-italic space-y-2.5 sm:space-y-3 ${sectionType.textRelaxed}`}
              style={{ color: palette.body }}
            >
              <p>
                As we begin this new chapter under the Lord&apos;s guidance, we are deeply grateful
                for everyone He has placed in our lives.
              </p>
              <p style={{ color: palette.accent }}>
                You are a blessing we hold close to our hearts.
              </p>
              <p>
                We would love to receive a short video message from you—something we can keep and
                look back on through the years ahead.
              </p>
              <p>
                Your words will make our wedding day, and our life together, even more meaningful.
                Thank you for your love and support.
              </p>
            </div>

            <div className="mx-auto flex items-center justify-center pt-1 sm:pt-2">
              <InsideDivider />
            </div>

            <div className="space-y-3 pt-2 sm:space-y-4 sm:pt-3">
              <p
                className={`font-goudy-italic ${sectionType.text}`}
                style={{ color: palette.heading }}
              >
                Upload your video message here:
              </p>

              {uploadUrl ? (
                <a
                  href={uploadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${cinzel.className} group inline-flex items-center gap-4 rounded-full border py-1 pl-7 pr-1 text-[0.625rem] font-semibold uppercase tracking-[0.22em] transition-all duration-300 hover:scale-[1.02] sm:gap-5 sm:py-1.5 sm:pl-9 sm:pr-1.5 sm:text-[0.6875rem] sm:tracking-[0.28em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-4`}
                  style={{
                    backgroundColor: C.navy,
                    borderColor: "color-mix(in srgb, #3d4a36 35%, transparent)",
                    color: C.paper,
                    boxShadow: "0 6px 20px color-mix(in srgb, #4b5d44 28%, transparent)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#3d4a36"
                    e.currentTarget.style.borderColor = C.gold
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = C.navy
                    e.currentTarget.style.borderColor =
                      "color-mix(in srgb, #3d4a36 35%, transparent)"
                  }}
                >
                  <span>Upload Video Message</span>
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-full sm:h-10 sm:w-10"
                    style={{
                      backgroundColor: C.paper,
                      boxShadow: "0 1px 0 color-mix(in srgb, #4b5d44 10%, transparent)",
                    }}
                  >
                    <ArrowRight
                      className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 sm:h-4 sm:w-4"
                      strokeWidth={2.25}
                      style={{ color: C.navy }}
                      aria-hidden
                    />
                  </span>
                </a>
              ) : (
                <p className={`font-goudy-italic ${sectionType.text}`} style={{ color: palette.body }}>
                  Upload link coming soon.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
