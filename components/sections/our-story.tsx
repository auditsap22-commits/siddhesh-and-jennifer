"use client"

import Image from "next/image"
import localFont from "next/font/local"
import { Cinzel } from "next/font/google"
import { layeredSectionTitleSize, sectionType } from "@/lib/section-typography"
import "./hero.css"

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
  ink: "#093327",
  gold: "#c5a059",
} as const

const goldLine = `color-mix(in srgb, ${C.gold} 62%, transparent)`

const DECO = {
  tl: "/decoration/left-top-decoration.png",
  tr: "/decoration/right-top-decoration.png",
  bl: "/decoration/left-bottom-decoration.png",
  br: "/decoration/right-bottom-decoration.png",
} as const

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

function OurStoryTitle() {
  return (
    <h2
      className="welcome-title-lockup relative mx-auto w-full max-w-full text-center"
      style={
        {
          "--title-size": layeredSectionTitleSize.main,
        } as React.CSSProperties
      }
    >
      <span
        className={`${theSeasons.className} block uppercase leading-[0.78] tracking-[0.08em] min-[400px]:tracking-[0.11em] sm:tracking-[0.13em] md:tracking-[0.14em]`}
        style={{
          fontSize: "var(--title-size)",
          color: C.ink,
        }}
      >
        Our Story
      </span>
    </h2>
  )
}

const storyParagraphs = [
  "Every love story begins with a single moment. Ours began on October 16, 2022, a date we'll always cherish because it was not only the day we met, but also Jennifer's birthday.",
  "At the time, Jennifer was working in Taiwan, while Siddhesh was living and working in the Netherlands. Even though we were miles apart, we felt an instant connection. What started as simple conversations soon became the best part of our days. We spent more than a year getting to know one another, learning about each other's cultures, sharing our dreams, and discovering that distance was no match for what we were building together.",
  "As our relationship grew stronger, we knew we wanted to build a future side by side. Siddhesh supported Jennifer every step of the way in applying for her visa to move to Europe. When the visa was finally granted, it wasn't just the approval of paperwork, it was the beginning of a new chapter in our lives.",
  "Living together in the Netherlands has been one of our greatest adventures. Every day has brought new experiences, new lessons, and countless little moments that made us fall even deeper in love. We found a kind of peace in each other that neither of us had ever experienced before, a love that feels like home.",
  "Together, we have celebrated milestones we once only dreamed about. We have grown in our chosen careers, built a life together, and purchased our very first home. Surrounded by the love and support of Siddhesh's warm and welcoming family, we were blessed to celebrate our marriage in India, honoring his traditions and heritage.",
  "Now, our journey brings us to another beautiful celebration.",
  "We are so excited to celebrate our marriage once again—this time in the Philippines, surrounded by Jennifer's family and friends. This day is more than a wedding; it is the union of two hearts, two families, two cultures, and two countries. It is a celebration of love that crossed borders, embraced differences, and proved that home is not a place, but the person you choose to spend your life with.",
  "Thank you for being part of our journey and for celebrating this unforgettable chapter with us. Your love, support, and presence mean more to us than words can express.",
] as const

export function OurStory() {
  return (
    <section
      id="our-story"
      className={`hero-invite hero-invite--story ${theSeasons.variable} ${aboveTheBeyond.variable}`}
    >
      <article className="hero-invite__card">
        <div className="hero-invite__washes" aria-hidden="true" />

        <div className="hero-invite__deco hero-invite__deco--tl" aria-hidden="true">
          <Image
            src={DECO.tl}
            alt=""
            width={1138}
            height={1172}
            sizes="(max-width: 768px) 42vw, 220px"
          />
        </div>
        <div className="hero-invite__deco hero-invite__deco--tr" aria-hidden="true">
          <Image
            src={DECO.tr}
            alt=""
            width={1283}
            height={1226}
            sizes="(max-width: 768px) 38vw, 200px"
          />
        </div>
        <div className="hero-invite__deco hero-invite__deco--bl" aria-hidden="true">
          <Image
            src={DECO.bl}
            alt=""
            width={1115}
            height={1411}
            sizes="(max-width: 768px) 38vw, 200px"
          />
        </div>
        <div className="hero-invite__deco hero-invite__deco--br" aria-hidden="true">
          <Image
            src={DECO.br}
            alt=""
            width={988}
            height={1487}
            sizes="(max-width: 768px) 42vw, 220px"
          />
        </div>

        <div className="hero-invite__frame" aria-hidden="true">
          <CornerOrnament className="hero-invite__corner hero-invite__corner--tl" />
          <CornerOrnament className="hero-invite__corner hero-invite__corner--tr" />
          <CornerOrnament className="hero-invite__corner hero-invite__corner--bl" />
          <CornerOrnament className="hero-invite__corner hero-invite__corner--br" />
        </div>

        <div className="hero-invite__panel">
          <header className="relative z-20 mx-auto w-full max-w-2xl space-y-3 sm:space-y-3.5 md:space-y-4">
            <OurStoryTitle />
            <div className="flex items-center justify-center gap-2">
              <span
                className="h-px w-8 sm:w-12"
                style={{
                  background: `linear-gradient(to right, transparent, ${goldLine})`,
                }}
              />
              <span
                className="h-0.5 w-0.5 rounded-full sm:h-1 sm:w-1"
                style={{ backgroundColor: goldLine }}
                aria-hidden
              />
              <span
                className="h-px w-8 sm:w-12"
                style={{
                  background: `linear-gradient(to left, transparent, ${goldLine})`,
                }}
              />
            </div>
          </header>

          <div
            className={`relative z-20 mx-auto mt-6 w-full max-w-2xl space-y-4 font-goudy-italic sm:mt-8 sm:space-y-5 md:mt-10 md:space-y-6 ${sectionType.textRelaxed}`}
            style={{ color: C.ink }}
          >
            {storyParagraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>

          <footer className="relative z-20 mx-auto mt-8 w-full max-w-2xl space-y-2 sm:mt-10 sm:space-y-2.5 md:mt-12">
            <p
              className={`${aboveTheBeyond.className} ${sectionType.script}`}
              style={{ color: C.ink }}
            >
              With all our love,
            </p>
            <p
              className={`${cinzel.className} ${sectionType.subheader} font-semibold tracking-[0.12em] sm:tracking-[0.16em] md:tracking-[0.18em]`}
              style={{ color: C.ink }}
            >
              Jennifer &amp; Siddhesh
            </p>
          </footer>
        </div>
      </article>
    </section>
  )
}
