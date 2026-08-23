"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import MessageWallDisplay from "./message-wall-display"
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
  navy: "#093327",
  gold: "#c5a059",
  goldBright: "#093327",
  goldSoft: "#c5a059",
  paper: "#fff9f0",
} as const

const goldLine = `color-mix(in srgb, ${C.gold} 62%, transparent)`
const outsideInk = {
  text: "#ffffff",
  textSoft: "rgba(255, 255, 255, 0.82)",
  line: "rgba(255, 255, 255, 0.45)",
} as const
const outsideLine = `linear-gradient(to right, transparent, ${outsideInk.line}, transparent)`

const palette = {
  body: C.navy,
  heading: C.goldBright,
  label: C.navy,
  accent: C.gold,
} as const

const outsideDividerLineStyle = {
  background: outsideLine,
} as const

const cardStyle = {
  background: `linear-gradient(180deg, #fdf8f2 0%, ${C.paper} 52%, #f3ebe1 100%)`,
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: goldLine,
  boxShadow: `0 12px 36px color-mix(in srgb, #093327 12%, transparent), inset 0 1px 0 color-mix(in srgb, #fdf8f2 70%, transparent)`,
} as const

interface Message {
  timestamp: string
  name: string
  message: string
}

interface MessageFormProps {
  onSuccess?: () => void
  onMessageSent?: () => void
}

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

function coupleNicknames(siteConfig: ReturnType<typeof useSiteConfig>) {
  const groom = siteConfig.couple.groomNickname || siteConfig.couple.groom
  const bride = siteConfig.couple.brideNickname || siteConfig.couple.bride
  return { groom, bride, together: `${groom} and ${bride}` }
}

function MessagesTitle() {
  const { together } = coupleNicknames(useSiteConfig())

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
        Messages for {together}
      </span>
      <span
        aria-hidden
        className={`${aboveTheBeyond.className} mx-auto block w-fit max-w-full px-1 leading-[0.88] sm:leading-[0.9] mt-2 sm:mt-2.5 md:mt-3`}
        style={{
          fontSize: "var(--script-size)",
          color: outsideInk.textSoft,
        }}
      >
        Love notes & prayers
      </span>
      <span className="sr-only">Love notes and prayers</span>
    </h2>
  )
}

function MessageForm({ onSuccess, onMessageSent }: MessageFormProps) {
  const siteConfig = useSiteConfig()
  const { together } = coupleNicknames(siteConfig)

  const formRef = useRef<HTMLFormElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [nameValue, setNameValue] = useState("")
  const [messageValue, setMessageValue] = useState("")
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const message = formData.get("message") as string

    const googleFormData = new FormData()
    googleFormData.append("entry.405401269", name)
    googleFormData.append("entry.893740636", message)

    try {
      await fetch(siteConfig.googleAPI.messageForm, {
        method: "POST",
        mode: "no-cors",
        body: googleFormData,
      })

      toast({
        title: "Message sent",
        description: "Thank you for your kind words.",
        duration: 3000,
      })

      setIsSubmitted(true)
      setNameValue("")
      setMessageValue("")
      formRef.current?.reset()

      setTimeout(() => setIsSubmitted(false), 1000)

      if (onSuccess) onSuccess()
      if (onMessageSent) onMessageSent()
    } catch {
      toast({
        title: "Unable to send message",
        description: "Please try again in a moment.",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputBorder = (field: string) =>
    focusedField === field
      ? C.gold
      : `color-mix(in srgb, ${C.gold} 32%, transparent)`

  const inputClass = (field: string) =>
    `message-form-input w-full rounded-xl border-2 px-3 py-2 ${sectionType.text} shadow-sm transition-all duration-300 placeholder:italic hover:shadow-md focus:shadow-lg sm:px-4 sm:py-2.5 md:py-3 ${
      focusedField === field ? "shadow-lg" : ""
    }`

  return (
    <div className="relative mx-auto w-full max-w-md px-3 sm:px-0">
      <style>{`
        .message-form-input::placeholder,
        .message-form-textarea::placeholder {
          color: #9CA3AF !important;
          opacity: 1 !important;
        }
      `}</style>

      <Card
        className={`relative w-full overflow-hidden rounded-xl border backdrop-blur-xl transition-all duration-500 sm:rounded-2xl sm:backdrop-blur-2xl ${
          isFocused ? "scale-[1.01]" : ""
        } ${isSubmitted ? "animate-bounce" : ""}`}
        style={cardStyle}
      >
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{
            background: `linear-gradient(135deg, color-mix(in srgb, ${C.goldSoft} 28%, transparent) 0%, transparent 48%)`,
          }}
          aria-hidden
        />

        {isSubmitted && (
          <div
            className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
            style={{ backgroundColor: C.paper }}
          >
            <p
              className={`${cinzel.className} font-semibold ${sectionType.subheader}`}
              style={{ color: C.gold }}
            >
              Sent!
            </p>
          </div>
        )}

        <CardContent className="relative p-4 sm:p-5 md:p-6 lg:p-8">
          <div className="mb-4 text-center sm:mb-5 md:mb-6">
            <h3
              className={`${cinzel.className} ${sectionType.subheader} mb-1.5 font-semibold`}
              style={{ color: palette.heading }}
            >
              Share Your Love
            </h3>
            <p className={`font-goudy-italic ${sectionType.text}`} style={{ color: palette.body }}>
              Leave a short note for {together}.
            </p>
          </div>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="space-y-3 sm:space-y-4 md:space-y-5"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          >
            <div className="space-y-1.5 sm:space-y-2">
              <label
                className={`${cinzel.className} ${sectionType.text} font-medium`}
                style={{ color: palette.label }}
              >
                Your Name
              </label>
              <Input
                name="name"
                required
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
                onFocus={() => setFocusedField("name")}
                onBlur={() => setFocusedField(null)}
                placeholder="Full name"
                className={inputClass("name")}
                style={{
                  color: palette.body,
                  backgroundColor: C.paper,
                  borderColor: inputBorder("name"),
                }}
              />
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <div className="flex items-center justify-between gap-2">
                <label
                  className={`${cinzel.className} ${sectionType.text} font-medium`}
                  style={{ color: palette.label }}
                >
                  Your Message
                </label>
                {messageValue && (
                  <span
                    className={`${sectionType.label} ${messageValue.length > 500 ? "text-red-500" : ""}`}
                    style={messageValue.length <= 500 ? { color: palette.accent } : undefined}
                  >
                    {messageValue.length}/500
                  </span>
                )}
              </div>
              <Textarea
                name="message"
                required
                value={messageValue}
                onChange={(e) => {
                  if (e.target.value.length <= 500) {
                    setMessageValue(e.target.value)
                  }
                }}
                onFocus={() => setFocusedField("message")}
                onBlur={() => setFocusedField(null)}
                placeholder={`Write your wishes, prayer, or kind words for ${together}...`}
                className={`message-form-textarea ${inputClass("message")} min-h-[90px] resize-none placeholder:leading-relaxed sm:min-h-[110px] md:min-h-[130px]`}
                style={{
                  color: palette.body,
                  backgroundColor: C.paper,
                  borderColor: inputBorder("message"),
                }}
              />
            </div>

            <div className="flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting || !nameValue.trim() || !messageValue.trim()}
              className={`${cinzel.className} group inline-flex items-center gap-4 rounded-full border py-1 pl-7 pr-1 text-[0.625rem] font-semibold uppercase tracking-[0.22em] transition-all duration-300 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100 sm:gap-5 sm:py-1.5 sm:pl-9 sm:pr-1.5 sm:text-[0.6875rem] sm:tracking-[0.28em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-4`}
              style={{
                backgroundColor: C.navy,
                borderColor: "color-mix(in srgb, #093327 72%, #041c16)",
                color: C.paper,
                boxShadow: "0 6px 20px color-mix(in srgb, #093327 28%, transparent)",
              }}
              onMouseEnter={(e) => {
                if (e.currentTarget.disabled) return
                e.currentTarget.style.backgroundColor = "color-mix(in srgb, #093327 88%, #041c16)"
                e.currentTarget.style.borderColor = C.gold
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = C.navy
                e.currentTarget.style.borderColor =
                  "color-mix(in srgb, #093327 72%, #041c16)"
              }}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Sending...
                </span>
              ) : (
                <span>Send Message</span>
              )}
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full sm:h-10 sm:w-10"
                style={{
                  backgroundColor: C.paper,
                  boxShadow: "0 1px 0 color-mix(in srgb, #093327 10%, transparent)",
                }}
              >
                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 sm:h-4 sm:w-4"
                  strokeWidth={2.25}
                  style={{ color: C.navy }}
                  aria-hidden
                />
              </span>
            </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export function Messages() {
  const { together } = coupleNicknames(useSiteConfig())
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)

  const fetchMessages = useCallback(() => {
    setLoading(true)
    fetch("/api/messages", {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache" },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) {
          setMessages([])
          setLoading(false)
          return
        }
        const parsed = data.filter((m) => m.name || m.message || m.timestamp).reverse()
        setMessages(parsed)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Failed to fetch messages:", error)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  return (
    <section
      id="messages"
      className={`${theSeasons.variable} ${aboveTheBeyond.variable} relative z-10 bg-transparent pt-8 pb-8 sm:pt-10 sm:pb-10 md:pt-12 md:pb-12 lg:pt-14 lg:pb-14`}
    >
      <div className="relative z-10 mx-auto max-w-6xl px-3 @container/messages sm:px-4 md:px-6 lg:px-8">
        {/* Header — outside container */}
        <div className="mb-6 text-center sm:mb-8 md:mb-10">
          <div className="mx-auto mb-5 sm:mb-6 md:mb-7">
            <OutsideDivider />
          </div>
          <div className="mx-auto mt-2 sm:mt-3 md:mt-4">
            <MessagesTitle />
          </div>
          <p
            className={`font-goudy-italic mx-auto mt-4 max-w-2xl px-2 sm:mt-5 md:mt-6 ${sectionType.textRelaxed}`}
            style={{ color: outsideInk.textSoft }}
          >
            Leave a short note for {together}. Every wish and prayer becomes part of their story forever.
          </p>
          <div className="flex items-center justify-center pt-3 sm:pt-4">
            <span className="h-px w-16 sm:w-24 md:w-32" style={{ background: outsideInk.line }} />
          </div>
        </div>

        {/* Form container */}
        <div className="mb-6 flex justify-center sm:mb-8 md:mb-10">
          <div className="relative w-full max-w-xl">
            <MessageForm onMessageSent={fetchMessages} />
          </div>
        </div>

        {/* Message wall */}
        <div className="relative mx-auto max-w-4xl pb-2 sm:pb-3">
          <div className="mb-4 text-center sm:mb-6 md:mb-8">
            <h3
              className={`${cinzel.className} mb-1.5 font-semibold sm:mb-2 ${sectionType.subheader}`}
              style={{ color: outsideInk.text }}
            >
              Messages from Loved Ones
            </h3>
            <p className={`font-goudy-italic ${sectionType.text}`} style={{ color: outsideInk.textSoft }}>
              Warm words from family and friends
            </p>
            <div className="flex items-center justify-center pt-3 sm:pt-4">
              <span className="h-px w-16 sm:w-24 md:w-32" style={{ background: outsideInk.line }} />
            </div>
          </div>

          <MessageWallDisplay messages={messages} loading={loading} />
        </div>
      </div>
    </section>
  )
}
