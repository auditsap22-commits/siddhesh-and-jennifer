"use client"

import { useState } from "react"
import { Cinzel } from "next/font/google"
import localFont from "next/font/local"
import { useSiteConfig } from "@/hooks/use-site-config"
import { layeredSectionTitleSize, sectionType } from "@/lib/section-typography"
import Image from "next/image"

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

const outsideDividerLineStyle = {
  background: `linear-gradient(to right, transparent, ${outsideInk.line}, transparent)`,
} as const

const ct = {
  body: sectionType.text,
  bodyLg: sectionType.textRelaxed,
  label: sectionType.label,
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

function RegistryTitle() {
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
        Gift Guide
      </span>
      <span
        aria-hidden
        className={`${aboveTheBeyond.className} mx-auto block w-fit max-w-full px-1 leading-[0.88] sm:leading-[0.9] mt-2 sm:mt-2.5 md:mt-3`}
        style={{
          fontSize: "var(--script-size)",
          color: outsideInk.textSoft,
        }}
      >
        With gratitude
      </span>
      <span className="sr-only">With gratitude</span>
    </h2>
  )
}

export function Registry() {
  const siteConfig = useSiteConfig()
  const registryItems = Object.values(siteConfig.giftRegistry ?? {})
  const [activeQr, setActiveQr] = useState(registryItems[0]?.id ?? "")
  const activeItem = registryItems.find((item) => item.id === activeQr) ?? registryItems[0]
  const { brideNickname, groomNickname } = siteConfig.couple

  return (
    <section
      id="registry"
      className={`${theSeasons.variable} ${aboveTheBeyond.variable} relative z-10 bg-transparent pt-8 pb-8 sm:pt-10 sm:pb-10 md:pt-12 md:pb-12 lg:pt-14 lg:pb-14`}
    >
      <div className="relative z-20 mx-auto max-w-3xl px-4 @container/registry sm:px-6 md:px-8">
        <div className="relative z-20 px-6 text-center sm:px-10 md:px-12">
          <div className="mx-auto mb-5 sm:mb-6 md:mb-7">
            <OutsideDivider />
          </div>
          <div className="mx-auto mt-2 sm:mt-3 md:mt-4">
            <RegistryTitle />
          </div>
          <p
            className={`font-goudy-italic mx-auto mt-4 max-w-2xl whitespace-pre-line px-2 sm:mt-5 md:mt-6 ${ct.bodyLg}`}
            style={{ color: outsideInk.textSoft }}
          >
            {`As love is what this day is all about,\nyour presence is already the greatest gift we could ever ask for.\nHowever, if you'd like to give, a monetary gift toward our future would be most appreciated.`}
          </p>
          <div className="flex items-center justify-center pt-3 sm:pt-4">
            <span className="h-px w-16 sm:w-24 md:w-32" style={{ background: outsideInk.line }} />
          </div>
        </div>

        {registryItems.length > 0 && activeItem && (
          <div className="relative z-20 mt-6 text-center sm:mt-8 md:mt-10">
            {registryItems.length > 1 && (
              <div className="mb-5 flex flex-wrap items-center justify-center gap-2 sm:mb-6">
                {registryItems.map((item) => {
                  const isActive = item.id === activeQr
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveQr(item.id)}
                      className={`${cinzel.className} rounded-sm border px-4 py-2 ${sectionType.label} font-semibold uppercase tracking-[0.16em] transition-all duration-300 sm:px-5 sm:py-2.5 sm:tracking-[0.2em]`}
                      style={
                        isActive
                          ? {
                              backgroundColor: C.navy,
                              borderColor: "color-mix(in srgb, #3d4a36 35%, transparent)",
                              color: C.paper,
                              boxShadow: "0 8px 20px color-mix(in srgb, #4b5d44 28%, transparent)",
                            }
                          : {
                              backgroundColor: "transparent",
                              borderColor: outsideInk.line,
                              color: outsideInk.textSoft,
                            }
                      }
                    >
                      {item.label}
                    </button>
                  )
                })}
              </div>
            )}

            <p
              className={`${cinzel.className} ${ct.label} mb-4 font-semibold uppercase tracking-[0.18em] sm:mb-5`}
              style={{ color: outsideInk.text }}
            >
              {activeItem.label}
            </p>

            <div className="mx-auto mb-4 inline-flex sm:mb-5">
              <div className="relative h-44 w-44 sm:h-52 sm:w-52 md:h-56 md:w-56">
                <Image
                  src={activeItem.src}
                  alt={`${activeItem.label} QR code`}
                  fill
                  className="rounded-lg object-contain"
                  sizes="(max-width: 640px) 176px, 224px"
                />
              </div>
            </div>

            {activeItem.accountNumber && (
              <div className="mx-auto max-w-sm">
                <p
                  className={`${cinzel.className} ${ct.label} mb-1 font-semibold uppercase tracking-[0.14em]`}
                  style={{ color: outsideInk.text }}
                >
                  Account Details
                </p>
                <p
                  className={`font-goudy-italic ${ct.bodyLg}`}
                  style={{ color: outsideInk.textSoft }}
                >
                  {activeItem.accountNumber}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 space-y-2 text-center sm:mt-8">
          <p
            className={`font-goudy-italic ${ct.body}`}
            style={{ color: outsideInk.textSoft }}
          >
            Thank you from the bottom of our hearts.
          </p>
          <p
            className={`font-goudy-italic ${ct.body} italic`}
            style={{ color: outsideInk.textSoft }}
          >
            With love,
            <br />
            {groomNickname} and {brideNickname}
          </p>
        </div>
      </div>
    </section>
  )
}
