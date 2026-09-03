"use client"

import React from "react"
import Image from "next/image"
import localFont from "next/font/local"
import { Cinzel } from "next/font/google"
import { ArrowRight } from "lucide-react"
import { StorySection } from "@/components/StorySection"

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
  cream: "#fdf8f2",
  lift: "#fff9f0",
  gold: "#c5a059",
  ink: "#093327",
} as const

const goldLine = `color-mix(in srgb, ${C.gold} 62%, transparent)`

const creamWash = `
  radial-gradient(80% 55% at 50% 0%, color-mix(in srgb, #e8d5c4 28%, transparent), transparent 62%),
  radial-gradient(ellipse 70% 42% at 100% 0%, color-mix(in srgb, ${C.gold} 14%, transparent), transparent 68%),
  radial-gradient(ellipse 70% 42% at 0% 100%, color-mix(in srgb, ${C.gold} 12%, transparent), transparent 68%),
  linear-gradient(180deg, ${C.cream} 0%, #f3ebe1 100%)
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

function OrnamentalDivider() {
  return (
    <div className="flex items-center justify-center gap-1.5">
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
  )
}

function LoveStoryTitle() {
  return (
    <h1 className="relative mx-auto w-full max-w-3xl px-2 text-center">
      <span
        className={`${theSeasons.className} block text-[1.65rem] uppercase leading-[1.12] tracking-[0.06em] sm:text-[2.1rem] md:text-[2.5rem] md:tracking-[0.08em] lg:text-[2.9rem]`}
        style={{ color: C.ink }}
      >
        Every love story is beautiful
      </span>
      <span
        aria-hidden
        className={`${aboveTheBeyond.className} mx-auto mt-3 block w-fit max-w-full px-1 text-[1.35rem] leading-[1.2] sm:mt-4 sm:text-[1.7rem] md:mt-5 md:text-[2rem] lg:text-[2.2rem]`}
        style={{ color: C.ink }}
      >
        but ours is my favorite.
      </span>
      <span className="sr-only">but ours is my favorite</span>
    </h1>
  )
}

export function LoveStory() {
  return (
    <div
      className={`${theSeasons.variable} ${aboveTheBeyond.variable} relative isolate min-h-screen overflow-hidden`}
      style={{ background: creamWash }}
    >
      <CornerDecorations />
      <div className="relative px-5 pb-4 pt-16 text-center sm:px-8 sm:pb-6 sm:pt-20 md:px-10 md:pt-24">
        <div className="relative z-20 mx-auto max-w-5xl">
          <div className="mx-auto mb-6 sm:mb-8 md:mb-10">
            <OrnamentalDivider />
          </div>
          <LoveStoryTitle />
        </div>
      </div>

      <StorySection
        theme="light"
        layout="image-left"
        isFirst={true}
        title="Where It All Began"
        imageSrc="/mobile/couples (1).JPG"
        text={
          <>
            <p>Every love story begins with a single moment.</p>
            <p>
              Ours began on October 16, 2022, a date we&apos;ll always cherish because it was not only
              the day we met, but also Jennifer&apos;s birthday.
            </p>
          </>
        }
      />

      <StorySection
        theme="light"
        layout="image-right"
        imageSrc="/mobile/couples (2).JPG"
        text={
          <>
            <p>
              At the time, Jennifer was working in Taiwan, while Siddhesh was living and working in
              the Netherlands.
            </p>
            <p>Even though we were miles apart, we felt an instant connection.</p>
            <p>
              What started as simple conversations soon became the best part of our days. We spent
              more than a year getting to know one another, learning about each other&apos;s cultures,
              sharing our dreams, and discovering that distance was no match for what we were
              building together.
            </p>
          </>
        }
      />

      <StorySection
        theme="light"
        layout="image-left"
        imageSrc="/mobile/couples (3).JPG"
        text={
          <>
            <p>
              As our relationship grew stronger, we knew we wanted to build a future side by side.
            </p>
            <p>
              Siddhesh supported Jennifer every step of the way in applying for her visa to move to
              Europe.
            </p>
            <p>
              When the visa was finally granted, it wasn&apos;t just the approval of paperwork, it was
              the beginning of a new chapter in our lives.
            </p>
          </>
        }
      />

      <StorySection
        theme="light"
        layout="image-right"
        imageSrc="/mobile/couples (4).JPG"
        text={
          <>
            <p>Living together in the Netherlands has been one of our greatest adventures.</p>
            <p>
              Every day has brought new experiences, new lessons, and countless little moments that
              made us fall even deeper in love.
            </p>
            <p>
              We found a kind of peace in each other that neither of us had ever experienced before,
              a love that feels like home.
            </p>
          </>
        }
      />

      <StorySection
        theme="light"
        layout="image-left"
        imageSrc="/mobile/couples (5).JPG"
        text={
          <>
            <p>Together, we have celebrated milestones we once only dreamed about.</p>
            <p>
              We have grown in our chosen careers, built a life together, and purchased our very
              first home.
            </p>
            <p>
              Surrounded by the love and support of Siddhesh&apos;s warm and welcoming family, we were
              blessed to celebrate our marriage in India, honoring his traditions and heritage.
            </p>
          </>
        }
      />

      <StorySection
        theme="light"
        layout="image-right"
        imageSrc="/mobile/couples (6).JPG"
        text={
          <>
            <p>Now, our journey brings us to another beautiful celebration.</p>
            <p>
              We are so excited to celebrate our marriage once again—this time in the Philippines,
              surrounded by Jennifer&apos;s family and friends.
            </p>
            <p>
              This day is more than a wedding; it is the union of two hearts, two families, two
              cultures, and two countries.
            </p>
          </>
        }
      />

      <StorySection
        theme="light"
        layout="image-left"
        isLast={true}
        imageSrc="/mobile/couples (7).jpg"
        text={
          <>
            <p>
              It is a celebration of love that crossed borders, embraced differences, and proved
              that home is not a place, but the person you choose to spend your life with.
            </p>
            <p>
              Thank you for being part of our journey and for celebrating this unforgettable chapter
              with us. Your love, support, and presence mean more to us than words can express.
            </p>
          </>
        }
      />

      <div className="relative px-5 pb-20 pt-8 text-center sm:px-8 sm:pb-24 sm:pt-10 md:px-10 md:pb-28 md:pt-12">
        <div className="relative z-20 mx-auto max-w-2xl">
          <div className="mx-auto mb-6 sm:mb-8">
            <OrnamentalDivider />
          </div>
          <blockquote>
            <p
              className={`${aboveTheBeyond.className} mb-3 text-[1.35rem] leading-[1.2] sm:text-[1.65rem] md:text-[1.9rem]`}
              style={{ color: C.ink }}
            >
              With all our love,
            </p>
            <p
              className={`${cinzel.className} text-[0.95rem] font-semibold uppercase tracking-[0.18em] sm:text-[1.05rem] sm:tracking-[0.2em]`}
              style={{ color: C.ink }}
            >
              Jennifer &amp; Siddhesh
            </p>
          </blockquote>

          <div className="mt-10 flex justify-center sm:mt-12 md:mt-14">
            <a
              href="#guest-list"
              className={`${cinzel.className} group inline-flex items-center gap-4 rounded-full border py-1.5 pl-8 pr-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.2em] transition-all duration-300 hover:scale-[1.02] sm:gap-5 sm:py-2 sm:pl-10 sm:pr-2 sm:text-[0.75rem] sm:tracking-[0.24em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-4`}
              style={{
                backgroundColor: C.ink,
                borderColor: "color-mix(in srgb, #093327 72%, #041c16)",
                color: C.lift,
                boxShadow: "0 6px 20px color-mix(in srgb, #093327 35%, transparent)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  "color-mix(in srgb, #093327 88%, #041c16)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = C.ink
              }}
            >
              <span>Join us</span>
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full sm:h-11 sm:w-11"
                style={{
                  backgroundColor: C.lift,
                  boxShadow: "0 1px 0 color-mix(in srgb, #093327 10%, transparent)",
                }}
              >
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 sm:h-5 sm:w-5"
                  strokeWidth={2.25}
                  style={{ color: C.ink }}
                  aria-hidden
                />
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
