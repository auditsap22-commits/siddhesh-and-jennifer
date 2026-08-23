"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Section } from "@/components/section"
import { motion } from "motion/react"
import { Cinzel } from "next/font/google"
import localFont from "next/font/local"
import { useSiteConfig } from "@/hooks/use-site-config"
import Counter from "@/components/Counter"
import { parseWeddingDate } from "@/lib/wedding-date"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

interface CountdownUnitProps {
  value: number
  label: string
}

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["700"],
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
  text: "#ffffff",
  textSoft: "rgba(255, 255, 255, 0.82)",
  line: "rgba(255, 255, 255, 0.45)",
} as const

const outsideDividerLineStyle = {
  background: `linear-gradient(to right, transparent, ${C.line}, transparent)`,
} as const

function OutsideDivider() {
  return (
    <div className="flex items-center justify-center gap-1.5">
      <span className="h-px w-6 sm:w-10" style={outsideDividerLineStyle} />
      <span
        className="h-0.5 w-0.5 rounded-full sm:h-1 sm:w-1"
        style={{ backgroundColor: C.line }}
        aria-hidden
      />
      <span
        className="h-px w-6 sm:w-10"
        style={{
          background: `linear-gradient(to left, transparent, ${C.line}, transparent)`,
        }}
      />
    </div>
  )
}

function CountdownTitle() {
  return (
    <h2
      className="relative mx-auto w-full max-w-full text-center"
      style={
        {
          "--title-size": "clamp(2.15rem, 11vw, 4.5rem)",
          "--script-size": "clamp(1.1rem, 4.5vw, 2.25rem)",
        } as React.CSSProperties
      }
    >
      <span
        className={`${theSeasons.className} block uppercase leading-[0.78] tracking-[0.08em] min-[400px]:tracking-[0.11em] sm:tracking-[0.15em] md:tracking-[0.18em] pb-1 sm:pb-1.5`}
        style={{
          fontSize: "var(--title-size)",
          color: C.text,
        }}
      >
        Counting Down
      </span>
      <span
        aria-hidden
        className={`${aboveTheBeyond.className} mx-auto block w-fit max-w-full px-1 leading-[0.88] sm:leading-[0.9] mt-2 sm:mt-2.5 md:mt-3`}
        style={{
          fontSize: "var(--script-size)",
          color: C.textSoft,
        }}
      >
        To our forever
      </span>
      <span className="sr-only">To our forever</span>
    </h2>
  )
}

function CountdownUnit({ value, label }: CountdownUnitProps) {
  const places = value >= 100 ? [100, 10, 1] : [10, 1]

  return (
    <div className="flex flex-col items-center gap-1.5 sm:gap-2">
      {/* Card container */}
      <div className="relative w-full max-w-[88px] sm:max-w-[96px] md:max-w-[110px] lg:max-w-[120px]">
        {/* Main card */}
        <div
          className="relative rounded-xl px-2.5 py-2.5 sm:rounded-2xl sm:px-3.5 sm:py-3.5 md:px-4 md:py-4"
          style={{
            border: `1px solid ${C.line}`,
            backgroundColor: "transparent",
          }}
        >
          <div className="relative z-10 flex items-center justify-center">
            <Counter
              value={value}
              places={places}
              fontSize={26}
              padding={4}
              gap={2}
              textColor={C.text}
              fontWeight={800}
              borderRadius={6}
              horizontalPadding={3}
              gradientHeight={0}
              gradientFrom="transparent"
              gradientTo="transparent"
              counterStyle={{
                backgroundColor: "transparent",
              }}
              digitStyle={{
                minWidth: "1.15ch",
                fontFamily: "Arial, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                color: C.text,
              }}
            />
          </div>
        </div>
      </div>

      <span
        className="text-[10px] font-inter font-semibold uppercase tracking-[0.16em] sm:text-xs md:text-sm"
        style={{ color: C.textSoft }}
      >
        {label}
      </span>
    </div>
  )
}

export function Countdown() {
  const siteConfig = useSiteConfig()
  const ceremonyDate = siteConfig.ceremony.date
  const ceremonyTimeDisplay = siteConfig.ceremony.time
  const parsedDate = parseWeddingDate(ceremonyDate)
  const ceremonyMonth = parsedDate.month
  const ceremonyDayNumber = parsedDate.day
  const ceremonyYear = parsedDate.year
  const { brideNickname, groomNickname } = siteConfig.couple
  const ceremonyDay = siteConfig.ceremony.day || parsedDate.dayOfWeek
  const ceremonyDayShort = ceremonyDay.slice(0, 3).toUpperCase()
  // Parse the date: December 20, 2025 at 10:30 AM PH Time (GMT+0800)
  // Extract time from "10:30 A.M., PH Time" -> "10:30 A.M."
  const timeStr = ceremonyTimeDisplay.split(",")[0].trim() // "10:30 A.M."
  
  // Create date string in ISO-like format for better parsing
  // December 20, 2025 -> 2025-12-20
  const monthMap: { [key: string]: string } = {
    "January": "01", "February": "02", "March": "03", "April": "04",
    "May": "05", "June": "06", "July": "07", "August": "08",
    "September": "09", "October": "10", "November": "11", "December": "12"
  }
  const monthNum =
    monthMap[ceremonyMonth.charAt(0) + ceremonyMonth.slice(1).toLowerCase()] || "12"
  const dayNum = ceremonyDayNumber
  
  // Parse time: "3:00 PM" -> 15:00
  const timeMatch = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i)
  let hour = 15 // default 3 PM
  let minutes = 0
  
  if (timeMatch) {
    hour = parseInt(timeMatch[1])
    minutes = parseInt(timeMatch[2])
    const ampm = timeMatch[3].toUpperCase()
    if (ampm === "PM" && hour !== 12) hour += 12
    if (ampm === "AM" && hour === 12) hour = 0
  }
  
  // Create date in GMT+8 (PH Time)
  // Using Date.UTC and adjusting for GMT+8 offset (subtract 8 hours to convert GMT+8 to UTC)
  const parsedTargetDate = new Date(Date.UTC(
    parseInt(ceremonyYear),
    parseInt(monthNum) - 1,
    parseInt(dayNum),
    hour - 8, // Convert GMT+8 to UTC
    minutes,
    0
  ))
  
  const targetTimestamp = Number.isNaN(parsedTargetDate.getTime())
    ? new Date(Date.UTC(2026, 1, 8, 8, 0, 0)).getTime() // Fallback: February 8, 2026, 4:00 PM GMT+8 = 8:00 AM UTC
    : parsedTargetDate.getTime()

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const targetDate = targetTimestamp
      const now = new Date().getTime()
      const difference = targetDate - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      } else {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [targetTimestamp])

  return (
    <Section
      id="countdown"
      className={`${theSeasons.variable} ${aboveTheBeyond.variable} hero-invite relative overflow-hidden !bg-transparent [background:transparent] [--hero-gold:rgba(255,255,255,0.62)] [--hero-gold-bright:#ffffff] [--hero-gold-soft:rgba(255,255,255,0.82)]`}
    >
      {/* Monogram - centered at top */}
      <div className="relative z-10 mb-6 flex justify-center pt-16 sm:mb-8 sm:pt-20 md:mb-10 md:pt-24">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative"
        >
          <div className="relative w-72 h-72 sm:w-96 sm:h-96 md:w-[28rem] md:h-[28rem] lg:w-[36rem] lg:h-[36rem] xl:w-[40rem] xl:h-[40rem]">
            <Image
              src={siteConfig.couple.monogram}
              alt={`${groomNickname} & ${brideNickname} Monogram`}
              fill
              className="object-contain"
              sizes="(max-width: 640px) 18rem, (max-width: 768px) 24rem, (max-width: 1024px) 28rem, (max-width: 1280px) 36rem, 40rem"
            />
          </div>
        </motion.div>
      </div>

      {/* Header */}
      <div className="relative z-10 mb-6 px-3 text-center sm:mb-8 sm:px-4 md:mb-10">
        <div className="mx-auto mb-4 sm:mb-5">
          <OutsideDivider />
        </div>
        <CountdownTitle />
        <div className="mt-3 flex items-center justify-center sm:mt-4">
          <span className="h-px w-16 sm:w-24 md:w-32" style={{ background: C.line }} />
        </div>
      </div>

      {/* Save The Date Card */}
      <div className="relative z-10">
        <div className="flex justify-center px-3 sm:px-4">
          <div className="max-w-2xl w-full">

            {/* Numeric countdown: Days / Hours / Minutes / Seconds */}
            <div className="mt-2 sm:mt-4 md:mt-6 font-inter">
              <div className="flex flex-col items-center gap-3 sm:gap-4 md:gap-6">
                {/* 2x2 on mobile, 4 in a row from md+ */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 w-full max-w-sm sm:max-w-md md:max-w-xl">
                  <CountdownUnit value={timeLeft.days} label="Days" />
                  <CountdownUnit value={timeLeft.hours} label="Hours" />
                  <CountdownUnit value={timeLeft.minutes} label="Minutes" />
                  <CountdownUnit value={timeLeft.seconds} label="Seconds" />
                </div>
              </div>
            </div>
          </div>
          
        </div>
        
            {/* Date Section - Layout matched with hero date block */}
            <div className="relative mb-6 p-6 pb-16 sm:mb-8 sm:rounded-3xl sm:p-8 sm:pb-20 md:p-10 md:pb-24">
              <div className="w-full max-w-2xl mx-auto">
                <div
                  className={`${cinzel.className} flex flex-col items-center gap-1.5 font-bold sm:gap-2.5 md:gap-3`}
                  style={{ color: C.text }}
                >
                  {/* Month */}
                  <span className="text-[0.65rem] uppercase tracking-[0.4em] sm:text-xs sm:tracking-[0.5em] md:text-sm">
                    {ceremonyMonth}
                  </span>

                  {/* Day and time row */}
                  <div className="flex w-full items-center gap-2 sm:gap-4 md:gap-5">
                    {/* Day of week & divider */}
                    <div className="flex flex-1 items-center justify-end gap-1.5 sm:gap-2.5">
                      <span className="h-[0.5px] flex-1" style={{ background: C.line }} />
                      <span
                        className="text-[0.6rem] uppercase tracking-[0.3em] sm:text-[0.7rem] sm:tracking-[0.4em] md:text-xs"
                        style={{ color: C.textSoft }}
                      >
                        {ceremonyDayShort}
                      </span>
                      <span className="h-[0.5px] w-6 sm:w-8 md:w-10" style={{ background: C.line }} />
                    </div>

                    {/* Day number */}
                    <div className="relative flex items-center justify-center px-3 sm:px-4 md:px-5">
                      <span
                        className={`${cinzel.className} relative text-[3rem] font-bold leading-none tracking-wider sm:text-[4.5rem] md:text-[5.5rem] lg:text-[6rem]`}
                      >
                        {ceremonyDayNumber}
                      </span>
                    </div>

                    {/* Time */}
                    <div className="flex flex-1 items-center gap-1.5 sm:gap-2.5">
                      <span className="h-[0.5px] w-6 sm:w-8 md:w-10" style={{ background: C.line }} />
                      <span
                        className="text-[0.6rem] uppercase tracking-[0.3em] sm:text-[0.7rem] sm:tracking-[0.4em] md:text-xs"
                        style={{ color: C.textSoft }}
                      >
                        {ceremonyTimeDisplay.split(",")[0]}
                      </span>
                      <span className="h-[0.5px] flex-1" style={{ background: C.line }} />
                    </div>
                  </div>

                  {/* Year */}
                  <span className="text-[0.65rem] uppercase tracking-[0.4em] sm:text-xs sm:tracking-[0.5em] md:text-sm">
                    {ceremonyYear}
                  </span>
                </div>
              </div>
            </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-[calc(var(--hero-frame-inset)+2.25rem)] z-10 flex justify-center px-16 text-center sm:bottom-[calc(var(--hero-frame-inset)+2.75rem)] sm:px-24 md:bottom-[calc(var(--hero-frame-inset)+3.25rem)] md:px-32">
        <div>
          <span
            className={`${theSeasons.className} block uppercase tracking-[0.16em] sm:tracking-[0.2em]`}
            style={{
              fontSize: "clamp(0.8rem, 2.2vw, 1.1rem)",
              color: C.textSoft,
            }}
          >
            Until We Say
          </span>
          <span
            className={`${aboveTheBeyond.className} mt-1 block leading-[0.9] sm:mt-1.5`}
            style={{
              fontSize: "clamp(1.35rem, 4.5vw, 2.25rem)",
              color: C.text,
            }}
          >
            &ldquo;I Do.&rdquo;
          </span>
        </div>
      </div>
    </Section>
  )
}
