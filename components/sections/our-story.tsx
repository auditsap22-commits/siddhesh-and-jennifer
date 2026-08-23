"use client"

import Image from "next/image"
import localFont from "next/font/local"
import { layeredSectionTitleSize, sectionType } from "@/lib/section-typography"

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

const paperWash = {
  cream: "#f7f4eb",
  lift: "#f9f6ee",
  sage: "#4b5d44",
  sageSoft: "#6a7b5c",
  wash: "#8b9d78",
} as const

const storyBackground = `
  radial-gradient(80% 55% at 50% 0%, color-mix(in srgb, #c9d2bc 22%, transparent), transparent 62%),
  radial-gradient(ellipse 70% 42% at 100% 0%, color-mix(in srgb, ${paperWash.wash} 28%, transparent), transparent 68%),
  radial-gradient(ellipse 70% 42% at 0% 100%, color-mix(in srgb, ${paperWash.wash} 22%, transparent), transparent 68%),
  linear-gradient(180deg, #ece6d6 0%, #e4ddcc 100%)
`

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

function OurStoryTitle() {
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
        Our Story
      </span>
      <span
        aria-hidden
        className={`${aboveTheBeyond.className} mx-auto block w-fit max-w-full px-1 leading-[0.88] sm:leading-[0.9] mt-2 sm:mt-2.5 md:mt-3`}
        style={{
          fontSize: "var(--script-size)",
          color: paperWash.sageSoft,
        }}
      >
        coming home
      </span>
      <span className="sr-only">coming home</span>
    </h2>
  )
}

export function OurStory() {
  return (
    <div
      className={`${theSeasons.variable} ${aboveTheBeyond.variable} relative w-full`}
      style={{ background: storyBackground }}
    >
      <section
        id="our-story"
        className="relative z-10 overflow-hidden pt-8 pb-8 sm:pt-10 sm:pb-10 md:pt-12 md:pb-12 lg:pt-14 lg:pb-14"
      >
        <CornerDecorations />

        <div className="relative z-20 mb-6 px-6 pt-10 text-center sm:mb-8 sm:px-10 sm:pt-12 md:mb-10 md:px-12 md:pt-14">
          <OurStoryTitle />
          <div className="mt-4 flex items-center justify-center gap-2 sm:mt-5 md:mt-6">
            <span
              className="h-px w-8 sm:w-12 md:w-16"
              style={{
                background:
                  "linear-gradient(to right, transparent, color-mix(in srgb, #4b5d44 38%, transparent))",
              }}
            />
            <span
              className="h-0.5 w-0.5 rounded-full sm:h-1 sm:w-1"
              style={{ backgroundColor: paperWash.sageSoft }}
              aria-hidden
            />
            <span
              className="h-px w-8 sm:w-12 md:w-16"
              style={{
                background:
                  "linear-gradient(to left, transparent, color-mix(in srgb, #4b5d44 38%, transparent))",
              }}
            />
          </div>
        </div>

        <div
          className={`relative z-20 mx-auto max-w-[28rem] space-y-7 px-6 pb-10 text-center font-goudy-italic sm:max-w-[32rem] sm:space-y-9 sm:px-10 sm:pb-12 md:space-y-10 md:px-12 md:pb-14 ${sectionType.textRelaxed}`}
          style={{ color: paperWash.sage }}
        >
          <p className="text-pretty leading-[1.85] sm:leading-[1.9]">
            Distance taught us patience.
            <br />
            Working overseas strengthened our dreams,
            <br />
            and every sacrifice brought us closer
            <br />
            to this moment.
          </p>
          <p className="text-pretty leading-[1.85] sm:leading-[1.9]">
            Now, we are finally coming home
            <br />
            to begin our greatest journey together.
          </p>
          <p className="text-pretty leading-[1.85] sm:leading-[1.9]">
            We would be honored to celebrate
            <br />
            our wedding with you.
          </p>
        </div>
      </section>
    </div>
  )
}
