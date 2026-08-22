"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useState, useEffect } from "react"
import { Cinzel } from "next/font/google"
import { sectionType } from "@/lib/section-typography"
import { useSiteConfig } from "@/hooks/use-site-config"

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
})

const C = {
  navy: "#4b5d44",
  gold: "#6a7b5c",
  goldBright: "#4b5d44",
  goldSoft: "#6a7b5c",
  paper: "#f9f6ee",
} as const

const goldLine = `color-mix(in srgb, ${C.gold} 55%, transparent)`

const palette = {
  body: C.navy,
  heading: C.goldBright,
  label: C.goldSoft,
  accent: C.gold,
} as const

const messageCardStyle = {
  background: `linear-gradient(180deg, color-mix(in srgb, ${C.goldSoft} 28%, ${C.paper}) 0%, ${C.paper} 48%, color-mix(in srgb, ${C.gold} 10%, ${C.paper}) 100%)`,
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: goldLine,
  boxShadow: `0 12px 36px color-mix(in srgb, ${C.navy} 28%, transparent), inset 0 1px 0 color-mix(in srgb, ${C.goldSoft} 55%, transparent)`,
} as const

const skeletonBg = `color-mix(in srgb, ${C.gold} 22%, ${C.paper})`

interface Message {
  timestamp: string
  name: string
  message: string
}

interface MessageWallDisplayProps {
  messages: Message[]
  loading: boolean
}

export default function MessageWallDisplay({ messages, loading }: MessageWallDisplayProps) {
  const siteConfig = useSiteConfig()
  const groom = siteConfig.couple.groomNickname || siteConfig.couple.groom
  const bride = siteConfig.couple.brideNickname || siteConfig.couple.bride
  const together = `${groom} & ${bride}`
  const [visibleMessages, setVisibleMessages] = useState<Message[]>([])
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (messages.length > 0) {
      setIsAnimating(true)
      const timer = setTimeout(() => {
        setVisibleMessages(messages)
        setIsAnimating(false)
      }, 100)
      return () => clearTimeout(timer)
    }
    setVisibleMessages([])
  }, [messages])

  if (loading) {
    return (
      <div className="space-y-2 sm:space-y-3 md:space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="rounded-xl border sm:rounded-2xl" style={messageCardStyle}>
            <CardContent className="p-3 sm:p-4 md:p-5">
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-8 w-8 rounded-full sm:h-9 sm:w-9" style={{ backgroundColor: skeletonBg }} />
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-24 sm:w-32" style={{ backgroundColor: skeletonBg }} />
                    <Skeleton className="h-2.5 w-20" style={{ backgroundColor: skeletonBg }} />
                  </div>
                </div>
              </div>
              <Skeleton className="h-14 w-full rounded-lg sm:h-16" style={{ backgroundColor: skeletonBg }} />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (messages.length === 0) {
    return (
      <div className="px-4 py-8 text-center sm:py-12 md:py-16">
        <h3
          className={`${cinzel.className} mb-2 font-semibold sm:mb-3 ${sectionType.subheader}`}
          style={{ color: "#ffffff" }}
        >
          No messages yet
        </h3>
        <p
          className={`font-goudy-italic mx-auto mb-5 max-w-md sm:mb-6 ${sectionType.textRelaxed}`}
          style={{ color: "rgba(255, 255, 255, 0.82)" }}
        >
          Be the first to leave a short note for {together}.
        </p>
        <div className="flex justify-center">
          <span
            className={`font-goudy-italic ${sectionType.label} rounded-sm border px-4 py-2`}
            style={{
              color: C.gold,
              backgroundColor: C.paper,
              borderColor: goldLine,
            }}
          >
            Your message will appear here
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2.5 sm:space-y-3 md:space-y-4">
      {visibleMessages.map((msg, index) => (
        <Card
          key={index}
          className={`group relative transform overflow-hidden rounded-xl border transition-all duration-500 hover:scale-[1.01] sm:rounded-2xl ${
            isAnimating ? "translate-y-4 opacity-0" : "translate-y-0 opacity-100"
          }`}
          style={{
            ...messageCardStyle,
            transitionDelay: `${index * 100}ms`,
            animation: isAnimating ? "none" : "fadeInUp 0.6s ease-out forwards",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow =
              `0 16px 40px color-mix(in srgb, ${C.navy} 32%, transparent), 0 0 0 1px color-mix(in srgb, ${C.gold} 40%, transparent), inset 0 1px 0 color-mix(in srgb, ${C.goldSoft} 55%, transparent)`
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = messageCardStyle.boxShadow as string
          }}
        >
          <div
            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background: `linear-gradient(135deg, color-mix(in srgb, ${C.goldSoft} 28%, transparent) 0%, transparent 48%)`,
            }}
            aria-hidden
          />
          <div
            className="absolute left-0 top-0 h-0.5 w-full origin-left scale-x-0 transform transition-transform duration-500 group-hover:scale-x-100"
            style={{ backgroundColor: palette.accent }}
          />

          <CardContent className="relative p-3 sm:p-4 md:p-5">
            <div className="mb-2 flex items-start justify-between sm:mb-3">
              <div className="flex min-w-0 flex-1 items-center space-x-2 sm:space-x-3">
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full shadow-md ring-2 transition-transform duration-300 group-hover:scale-110 sm:h-9 sm:w-9 md:h-10 md:w-10"
                  style={{
                    backgroundColor: C.navy,
                    boxShadow: `0 0 0 2px color-mix(in srgb, ${C.goldSoft} 40%, white), 0 4px 12px color-mix(in srgb, ${C.navy} 28%, transparent)`,
                  }}
                >
                  <span
                    className={`${cinzel.className} ${sectionType.label} font-semibold`}
                    style={{ color: C.paper }}
                  >
                    {msg.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h4
                    className={`${cinzel.className} ${sectionType.text} truncate font-semibold`}
                    style={{ color: palette.heading }}
                  >
                    {msg.name}
                  </h4>
                  <span className={sectionType.label} style={{ color: palette.label }}>
                    {new Date(msg.timestamp).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>

            <div className="relative py-1 pl-5 pr-2 sm:py-2 sm:pl-6 sm:pr-4">
              <span
                className="font-goudy-italic absolute left-0 top-0 select-none text-2xl leading-none sm:text-3xl"
                style={{ color: palette.accent, opacity: 0.45 }}
              >
                &ldquo;
              </span>
              <p
                className={`font-goudy-italic relative z-10 italic ${sectionType.textRelaxed}`}
                style={{ color: palette.body }}
              >
                {msg.message}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
