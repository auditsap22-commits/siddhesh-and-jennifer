"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Cormorant_Garamond } from "next/font/google"
import { ArrowRight } from "lucide-react"
import { siteConfig } from "@/content/site"
import "./hero.css"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
})

const DECO = {
  tl: "/decoration/left-top-decoration.png",
  tr: "/decoration/right-top-decoration.png",
  bl: "/decoration/left-bottom-decoration.png",
  br: "/decoration/right-bottom-decoration.png",
  names: "/decoration/couple.png",
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

export function Hero() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 150)
    return () => clearTimeout(t)
  }, [])

  const ceremonyDay = siteConfig.ceremony.day
  const ceremonyTime = siteConfig.ceremony.time
  const ceremonyDate = siteConfig.ceremony.date
  const ceremonyLocation = siteConfig.ceremony.location
  const receptionLocation = siteConfig.reception.location
  const receptionTime = siteConfig.reception.time
  const groomName = siteConfig.couple.groomNickname ?? siteConfig.couple.groom
  const brideName = siteConfig.couple.brideNickname ?? siteConfig.couple.bride

  return (
    <section
      id="home"
      className={`hero-invite ${cormorant.className}`}
    >
      <article
        className={`hero-invite__card transition-all duration-700 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="hero-invite__washes" aria-hidden="true" />

        <div className="hero-invite__deco hero-invite__deco--tl" aria-hidden="true">
          <Image
            src={DECO.tl}
            alt=""
            width={1138}
            height={1172}
            priority
            sizes="(max-width: 768px) 42vw, 220px"
          />
        </div>
        <div className="hero-invite__deco hero-invite__deco--tr" aria-hidden="true">
          <Image
            src={DECO.tr}
            alt=""
            width={1283}
            height={1226}
            priority
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
          <div className="hero-invite__copy">
            <p className="hero-invite__intro">
              With grateful hearts, together with our families, we warmly invite
              you to celebrate with us as we say “I do.”
            </p>

            <div
              className="hero-invite__names"
              role="img"
              aria-label={`${groomName} and ${brideName}`}
            >
              <Image
                src={DECO.names}
                alt={`${groomName} and ${brideName}`}
                width={1672}
                height={941}
                priority
                sizes="(max-width: 768px) 68vw, 360px"
              />
            </div>

            <div className="hero-invite__details">
              <p className="hero-invite__meta">The Ceremony</p>
              {ceremonyLocation ? (
                <p className="hero-invite__location">{ceremonyLocation}</p>
              ) : null}
              {(ceremonyDay || ceremonyTime) && (
                <p className="hero-invite__when">
                  {[ceremonyDay, ceremonyTime].filter(Boolean).join(" · ")}
                </p>
              )}
              {ceremonyDate ? (
                <p className="hero-invite__date">{ceremonyDate}</p>
              ) : null}
              {(receptionLocation || receptionTime) && (
                <p className="hero-invite__follow">
                  Reception to follow
                  {receptionLocation ? ` at ${receptionLocation}` : ""}
                  {receptionTime ? ` · ${receptionTime}` : ""}
                </p>
              )}
            </div>
          </div>

          <div className="hero-invite__footer">
            <a href="#guest-list" className="hero-invite__cta">
              <span>Confirm your attendance (RSVP)</span>
              <span className="hero-invite__cta-icon">
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.25} aria-hidden />
              </span>
            </a>
          </div>
        </div>
      </article>
    </section>
  )
}
