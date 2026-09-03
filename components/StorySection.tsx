"use client"

import React, { useEffect, useRef, useState } from "react"
import localFont from "next/font/local"
import { Cormorant_Garamond } from "next/font/google"
import Image from "next/image"

const theSeasons = localFont({
  src: "../Font/Fontspring-DEMO-theseasons-reg.otf",
  display: "swap",
  variable: "--font-the-seasons",
})

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
})

const storyInk = {
  cream: "#fdf8f2",
  lift: "#fff9f0",
  champagne: "#c5a059",
  gold: "#c5a059",
  slate: "#093327",
  navy: "#093327",
  midnight: "#093327",
} as const

const lightSectionBg = `
  radial-gradient(80% 55% at 50% 0%, color-mix(in srgb, #e8d5c4 28%, transparent), transparent 62%),
  radial-gradient(ellipse 70% 42% at 100% 0%, color-mix(in srgb, ${storyInk.gold} 14%, transparent), transparent 68%),
  radial-gradient(ellipse 70% 42% at 0% 100%, color-mix(in srgb, ${storyInk.gold} 12%, transparent), transparent 68%),
  linear-gradient(180deg, ${storyInk.cream} 0%, #f3ebe1 100%)
`

export { lightSectionBg, storyInk }

interface StorySectionProps {
  imageSrc: string
  title?: string
  text: React.ReactNode
  layout: "image-left" | "image-right"
  theme?: "dark" | "light"
  isFirst?: boolean
  isLast?: boolean
}

export const StorySection: React.FC<StorySectionProps> = ({
  imageSrc,
  title,
  text,
  layout,
  isFirst = false,
  isLast = false,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const imageFrameStyle = {
    background: storyInk.lift,
    border: `1px solid color-mix(in srgb, ${storyInk.gold} 62%, transparent)`,
    boxShadow: `0 8px 24px color-mix(in srgb, ${storyInk.navy} 8%, transparent), inset 0 0 0 5px ${storyInk.lift}, inset 0 0 0 6px color-mix(in srgb, ${storyInk.gold} 42%, transparent)`,
  }

  const rotation = layout === "image-left" ? "rotate-1 md:rotate-2" : "-rotate-1 md:-rotate-2"
  const flexDirection = layout === "image-left" ? "flex-row" : "flex-row-reverse"

  return (
    <div className={`${theSeasons.variable} relative`}>
      <div
        ref={sectionRef}
        className={`relative z-10 mx-auto w-full max-w-6xl px-3 py-8 transition-all duration-1000 ease-out sm:px-6 sm:py-12 md:px-10 md:py-16 lg:px-12 lg:py-20 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"} ${isFirst ? "pt-6 sm:pt-8 md:pt-10" : ""} ${isLast ? "pb-6 sm:pb-8 md:pb-10" : ""}`}
      >
        <div className={`flex ${flexDirection} items-center justify-between gap-3 sm:gap-6 md:gap-12 lg:gap-16`}>
          <div className="flex w-[45%] shrink-0 justify-center md:w-5/12">
            <div
              className={`relative w-full transition-all delay-300 duration-1000 ease-out md:max-w-md ${rotation} ${isVisible ? "scale-100 opacity-100" : "scale-90 opacity-0"} `}
            >
              <div className="w-full p-1 sm:p-1.5 md:p-3" style={imageFrameStyle}>
                <div className="group relative aspect-[2/3] w-full overflow-hidden">
                  <Image
                    src={imageSrc}
                    alt="Story Moment"
                    fill
                    sizes="(max-width: 768px) 45vw, (max-width: 1024px) 40vw, 33vw"
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    quality={90}
                    priority={false}
                  />
                </div>
              </div>
            </div>
          </div>

          <div
            className="w-[55%] md:w-6/12"
            style={{ color: storyInk.navy }}
          >
            {title && (
              <h2
                className={`${theSeasons.className} mb-2.5 text-[0.95rem] uppercase leading-[1.15] tracking-[0.05em] transition-all delay-500 duration-1000 sm:mb-4 sm:text-[1.25rem] md:mb-5 md:text-[1.7rem] md:tracking-[0.07em] lg:mb-6 lg:text-[2rem] ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"} `}
                style={{ color: storyInk.navy }}
              >
                {title}
              </h2>
            )}

            <div
              className={`${cormorant.className} space-y-2.5 text-[0.875rem] font-medium leading-[1.65] transition-all delay-700 duration-1000 sm:space-y-3.5 sm:text-[1rem] sm:leading-[1.7] md:space-y-5 md:text-[1.125rem] md:leading-[1.75] lg:text-[1.2rem] lg:leading-[1.78] ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"} `}
            >
              {text}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
