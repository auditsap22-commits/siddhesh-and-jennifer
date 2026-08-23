"use client"

import { useEffect, useRef, useState } from "react"
import { useSiteConfig } from "@/hooks/use-site-config"
import { useAudio } from "@/contexts/audio-context"
import { Cinzel } from "next/font/google"
import localFont from "next/font/local"
import { Loader2, Music2 } from "lucide-react"
import { layeredSectionTitleSize } from "@/lib/section-typography"
import { MobilePlaylistPlayer } from "@/components/sections/mobile-playlist-player"
import type { SpotifyPlaylistData } from "@/lib/spotify-playlist"

const LIST_EMBED_HEIGHT = 380
const LARGE_EMBED_HEIGHT = 452

interface SpotifyPlaybackUpdate {
  playingURI: string
  isPaused: boolean
  isBuffering: boolean
  duration: number
  position: number
}

interface SpotifyEmbedController {
  addListener: (
    event: "playback_update" | "playback_started" | "ready",
    callback: (event: { data?: SpotifyPlaybackUpdate }) => void
  ) => void
  removeListener: (
    event: "playback_update" | "playback_started" | "ready",
    callback: (event: { data?: SpotifyPlaybackUpdate }) => void
  ) => void
  destroy: () => void
}

interface SpotifyIframeApi {
  createController: (
    element: HTMLElement,
    options: {
      uri?: string
      url?: string
      width?: string
      height?: string
      theme?: string
    },
    callback: (controller: SpotifyEmbedController) => void
  ) => void
}

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (IFrameAPI: SpotifyIframeApi) => void
  }
}

let cachedSpotifyIframeApi: SpotifyIframeApi | null = null
const spotifyApiReadyQueue: Array<(api: SpotifyIframeApi) => void> = []

function getSpotifyResource(spotifyUrl: string) {
  const match = spotifyUrl.match(
    /open\.spotify\.com\/(?:embed\/)?(playlist|album|track|episode)\/([^/?]+)/
  )
  if (!match) return null
  return { type: match[1], id: match[2] }
}

function getSpotifyUri(spotifyUrl: string): string {
  const resource = getSpotifyResource(spotifyUrl)
  if (!resource) return spotifyUrl
  return `spotify:${resource.type}:${resource.id}`
}

function getSpotifyEmbedUrl(spotifyUrl: string, embedUrl?: string): string {
  const resource = getSpotifyResource(embedUrl || spotifyUrl)
  if (!resource) return embedUrl || spotifyUrl
  return `https://open.spotify.com/embed/${resource.type}/${resource.id}?utm_source=generator&theme=0`
}

function loadSpotifyIframeApi(onReady: (api: SpotifyIframeApi) => void) {
  if (cachedSpotifyIframeApi) {
    onReady(cachedSpotifyIframeApi)
    return
  }

  spotifyApiReadyQueue.push(onReady)

  if (spotifyApiReadyQueue.length > 1) return

  const previousReady = window.onSpotifyIframeApiReady
  window.onSpotifyIframeApiReady = (IFrameAPI) => {
    cachedSpotifyIframeApi = IFrameAPI
    previousReady?.(IFrameAPI)
    spotifyApiReadyQueue.splice(0).forEach((callback) => callback(IFrameAPI))
  }

  const existingScript = document.querySelector(
    'script[src="https://open.spotify.com/embed/iframe-api/v1"]'
  )
  if (!existingScript) {
    const script = document.createElement("script")
    script.src = "https://open.spotify.com/embed/iframe-api/v1"
    script.async = true
    document.body.appendChild(script)
  }
}

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

const palette = {
  heading: C.goldBright,
} as const

const outsideDividerLineStyle = {
  background: `linear-gradient(to right, transparent, ${outsideInk.line}, transparent)`,
} as const

const ct = {
  bodyLg: "text-sm sm:text-base md:text-lg",
  btn: "text-[0.625rem] sm:text-[0.6875rem] md:text-xs",
} as const

const cardStyle = {
  background: `linear-gradient(180deg, #fdf8f2 0%, ${C.paper} 52%, #f3ebe1 100%)`,
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: goldLine,
  boxShadow: `0 12px 36px color-mix(in srgb, #093327 12%, transparent), inset 0 1px 0 color-mix(in srgb, #fdf8f2 70%, transparent)`,
} as const

const buttonStyle = {
  backgroundColor: C.navy,
  borderColor: "color-mix(in srgb, #093327 72%, #041c16)",
  color: C.paper,
  boxShadow: "0 10px 24px color-mix(in srgb, #093327 28%, transparent)",
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

function PlaylistTitle({ title, script }: { title: string; script: string }) {
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
        className={`${theSeasons.className} block max-w-[16ch] mx-auto text-balance uppercase leading-[0.98] tracking-[0.04em] min-[400px]:tracking-[0.08em] sm:max-w-none sm:leading-[0.86] sm:tracking-[0.13em] md:leading-[0.78] md:tracking-[0.14em] pb-1 sm:pb-1.5`}
        style={{
          fontSize: "var(--title-size)",
          color: outsideInk.text,
        }}
      >
        {title}
      </span>
      <span
        aria-hidden
        className={`${aboveTheBeyond.className} mx-auto block w-fit max-w-[92%] px-1 leading-[1.05] sm:leading-[0.9] mt-1.5 sm:mt-2.5 md:mt-3`}
        style={{
          fontSize: "var(--script-size)",
          color: outsideInk.textSoft,
        }}
      >
        {script}
      </span>
      <span className="sr-only">{script}</span>
    </h2>
  )
}

function getEmbedHeight() {
  if (typeof window === "undefined") return LIST_EMBED_HEIGHT
  return window.matchMedia("(min-width: 768px)").matches
    ? LARGE_EMBED_HEIGHT
    : LIST_EMBED_HEIGHT
}

function SpotifyMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={className}
      fill="currentColor"
    >
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  )
}

export function WeddingPlaylist() {
  const siteConfig = useSiteConfig()
  const {
    title,
    subtitle,
    playlistName,
    spotifyUrl,
    embedUrl,
    spotifyTitle,
    curator,
    coverUrl,
    tracks,
  } = siteConfig.playlist
  const spotifyUri = getSpotifyUri(spotifyUrl)
  const embedSrc = getSpotifyEmbedUrl(spotifyUrl, embedUrl)
  const playlistSourceUrl = embedUrl || spotifyUrl
  const hostRef = useRef<HTMLDivElement>(null)
  const controllerRef = useRef<SpotifyEmbedController | null>(null)
  const playbackStateRef = useRef<"playing" | "paused">("paused")
  const { pauseMusic, resumeMusic } = useAudio()
  const [embedHeight, setEmbedHeight] = useState(LARGE_EMBED_HEIGHT)
  const [isReady, setIsReady] = useState(false)
  const [useFallbackIframe, setUseFallbackIframe] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [livePlaylist, setLivePlaylist] = useState<SpotifyPlaylistData | null>(
    null
  )

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)")
    const sync = () => {
      setIsDesktop(media.matches)
      setEmbedHeight(getEmbedHeight())
    }
    sync()
    media.addEventListener("change", sync)
    return () => media.removeEventListener("change", sync)
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    async function loadLivePlaylist() {
      try {
        const response = await fetch(
          `/api/spotify-playlist?url=${encodeURIComponent(playlistSourceUrl)}`,
          { signal: controller.signal }
        )
        if (!response.ok) return
        const data = (await response.json()) as SpotifyPlaylistData
        if (data?.title || data?.tracks?.length) {
          setLivePlaylist(data)
        }
      } catch {
        // Keep the hardcoded fallbacks in site.ts if Spotify is unreachable.
      }
    }

    setLivePlaylist(null)
    loadLivePlaylist()

    return () => controller.abort()
  }, [playlistSourceUrl])

  useEffect(() => {
    const host = hostRef.current
    if (!host || !isDesktop) return

    let mounted = true

    const handlePlaybackStateChange = (isPlaying: boolean) => {
      if (isPlaying && playbackStateRef.current !== "playing") {
        playbackStateRef.current = "playing"
        pauseMusic()
      } else if (!isPlaying && playbackStateRef.current === "playing") {
        playbackStateRef.current = "paused"
        resumeMusic()
      }
    }

    const fallbackTimer = window.setTimeout(() => {
      if (mounted && !controllerRef.current) {
        setUseFallbackIframe(true)
      }
    }, 3500)

    const initController = (IFrameAPI: SpotifyIframeApi) => {
      if (!mounted || !hostRef.current) return

      hostRef.current.replaceChildren()
      const target = document.createElement("div")
      hostRef.current.appendChild(target)

      IFrameAPI.createController(
        target,
        {
          url: embedSrc,
          uri: spotifyUri,
          width: "100%",
          height: String(embedHeight),
          theme: "dark",
        },
        (EmbedController) => {
          if (!mounted) {
            EmbedController.destroy()
            return
          }

          controllerRef.current = EmbedController
          window.clearTimeout(fallbackTimer)

          const handlePlaybackUpdate = (event: {
            data?: SpotifyPlaybackUpdate
          }) => {
            if (typeof event.data?.isPaused === "boolean") {
              handlePlaybackStateChange(!event.data.isPaused)
            }
          }

          const handlePlaybackStarted = () => {
            handlePlaybackStateChange(true)
          }

          EmbedController.addListener("ready", () => {
            if (mounted) setIsReady(true)
          })
          EmbedController.addListener("playback_update", handlePlaybackUpdate)
          EmbedController.addListener("playback_started", handlePlaybackStarted)

          window.setTimeout(() => {
            if (mounted) setIsReady(true)
          }, 800)
        }
      )
    }

    loadSpotifyIframeApi(initController)

    return () => {
      mounted = false
      window.clearTimeout(fallbackTimer)
      if (playbackStateRef.current === "playing") {
        resumeMusic()
      }
      playbackStateRef.current = "paused"
      controllerRef.current?.destroy()
      controllerRef.current = null
      if (host) host.replaceChildren()
    }
  }, [embedHeight, embedSrc, isDesktop, pauseMusic, resumeMusic, spotifyUri])

  useEffect(() => {
    const handlePlaybackStateChange = (isPlaying: boolean) => {
      if (isPlaying && playbackStateRef.current !== "playing") {
        playbackStateRef.current = "playing"
        pauseMusic()
      } else if (!isPlaying && playbackStateRef.current === "playing") {
        playbackStateRef.current = "paused"
        resumeMusic()
      }
    }

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== "https://open.spotify.com") return

      const data =
        typeof event.data === "string"
          ? (() => {
              try {
                return JSON.parse(event.data)
              } catch {
                return null
              }
            })()
          : event.data

      if (!data || typeof data !== "object") return

      const record = data as Record<string, unknown>
      const payload =
        (record.payload as Record<string, unknown> | undefined) ?? record
      const name = String(record.type ?? record.name ?? payload.name ?? "")
      const playback = (payload.data ?? payload) as Record<string, unknown>

      if (name.includes("playback_started")) {
        handlePlaybackStateChange(true)
        return
      }

      if (
        name.includes("playback_update") &&
        typeof playback.isPaused === "boolean"
      ) {
        handlePlaybackStateChange(!playback.isPaused)
      }
    }

    window.addEventListener("message", onMessage)
    return () => window.removeEventListener("message", onMessage)
  }, [pauseMusic, resumeMusic])

  return (
    <section
      id="playlist"
      className={`${theSeasons.variable} ${aboveTheBeyond.variable} relative z-10 bg-transparent pt-7 pb-8 sm:pt-10 sm:pb-10 md:pt-12 md:pb-12 lg:pt-14 lg:pb-14`}
    >
      <div className="relative z-20 mx-auto w-full max-w-3xl overflow-x-hidden px-2 @container/playlist min-[400px]:px-3 sm:px-6 md:px-8">
        <div className="relative z-20 px-1 text-center sm:px-10 md:px-12">
          <div className="mx-auto mb-4 sm:mb-6 md:mb-7">
            <OutsideDivider />
          </div>
          <div className="mx-auto mt-1.5 sm:mt-3 md:mt-4">
            <PlaylistTitle title={title} script={playlistName} />
          </div>
          <p
            className={`font-goudy-italic ${ct.bodyLg} mx-auto mt-3 max-w-[22rem] leading-relaxed px-1 sm:mt-5 sm:max-w-lg sm:px-2 md:mt-6`}
            style={{ color: outsideInk.textSoft }}
          >
            {subtitle}
          </p>
          <div className="flex items-center justify-center pt-2.5 sm:pt-4">
            <span className="h-px w-12 sm:w-24 md:w-32" style={{ background: outsideInk.line }} />
          </div>
        </div>

        <div
          className="relative mt-5 overflow-hidden rounded-[22px] border backdrop-blur-xl sm:mt-8 sm:rounded-2xl sm:backdrop-blur-2xl md:mt-10"
          style={cardStyle}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-4 top-0 h-px sm:inset-x-8"
            style={{ background: `linear-gradient(to right, transparent, ${C.gold}, transparent)` }}
          />
          <div
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
            style={{
              background: `linear-gradient(135deg, color-mix(in srgb, ${C.goldSoft} 28%, transparent) 0%, transparent 48%)`,
            }}
            aria-hidden
          />

          <div className="relative z-20 px-3.5 py-4 sm:px-5 sm:py-5 md:px-6 md:py-6">
            <div className="mb-3 flex items-center justify-center gap-2 sm:mb-4 sm:gap-2.5">
              <span className="h-px w-6 sm:w-12" style={{ background: goldLine }} />
              <div
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full sm:h-9 sm:w-9"
                style={{
                  backgroundColor: C.navy,
                  boxShadow: `0 4px 12px color-mix(in srgb, ${C.navy} 40%, transparent)`,
                }}
              >
                <Music2 className="h-3 w-3 sm:h-4 sm:w-4" style={{ color: C.paper }} />
              </div>
              <p
                className={`${cinzel.className} text-[0.625rem] font-semibold uppercase tracking-[0.16em] sm:text-[0.6875rem] sm:tracking-[0.26em] md:text-xs`}
                style={{ color: palette.heading }}
              >
                Listen with us
              </p>
              <span className="h-px w-6 sm:w-12" style={{ background: goldLine }} />
            </div>

            <p
              className="font-goudy-italic mb-3 hidden text-center text-[0.8rem] leading-snug sm:mb-4 sm:block sm:text-[0.9rem]"
              style={{ color: C.navy }}
            >
              Play our songs below, or open the full playlist in Spotify.
            </p>

            <div className="md:hidden">
              <MobilePlaylistPlayer
                title={livePlaylist?.title || spotifyTitle}
                curator={livePlaylist?.curator || curator}
                coverUrl={livePlaylist?.coverUrl || coverUrl}
                spotifyUrl={spotifyUrl}
                tracks={
                  livePlaylist?.tracks?.length ? livePlaylist.tracks : tracks
                }
              />
            </div>

            <div
              className="relative hidden overflow-hidden rounded-xl md:block"
              style={{
                border: `1px solid ${goldLine}`,
                backgroundColor: "#121212",
                boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${C.gold} 18%, transparent)`,
              }}
              onPointerDown={() => pauseMusic()}
            >
              {!isReady && (
                <div
                  className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2.5 px-5 text-center sm:gap-3 sm:px-6"
                  style={{ backgroundColor: "#121212" }}
                >
                  <Loader2
                    className="h-5 w-5 animate-spin sm:h-7 sm:w-7"
                    style={{ color: C.gold }}
                  />
                  <p
                    className={`${cinzel.className} text-[0.625rem] font-semibold uppercase tracking-[0.18em] sm:text-[0.6875rem] sm:tracking-[0.22em]`}
                    style={{ color: C.goldSoft }}
                  >
                    Loading playlist
                  </p>
                </div>
              )}

              {useFallbackIframe ? (
                <iframe
                  src={embedSrc}
                  title={`${playlistName} — Spotify playlist`}
                  width="100%"
                  height={embedHeight}
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  onLoad={() => setIsReady(true)}
                  className="block w-full max-w-full border-0"
                  style={{ height: embedHeight }}
                />
              ) : (
                <div
                  ref={hostRef}
                  title={`${playlistName} — Spotify playlist`}
                  className="w-full max-w-full overflow-hidden [&_iframe]:block [&_iframe]:h-full [&_iframe]:w-full [&_iframe]:max-w-full [&_iframe]:border-0"
                  style={{ height: embedHeight }}
                />
              )}
            </div>

            <div className="pt-3 sm:pt-4">
              <a
                href={spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`${cinzel.className} group relative inline-flex w-full min-h-11 items-center justify-center gap-2 rounded-md border px-3 py-2.5 text-center font-semibold uppercase tracking-[0.12em] touch-manipulation transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 sm:min-h-12 sm:rounded-sm sm:px-8 sm:py-3 sm:tracking-[0.24em] md:tracking-[0.28em] ${ct.btn}`}
                style={buttonStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "color-mix(in srgb, #093327 88%, #041c16)"
                  e.currentTarget.style.borderColor = C.gold
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = C.navy
                  e.currentTarget.style.borderColor = buttonStyle.borderColor
                }}
              >
                <SpotifyMark className="relative z-10 h-4 w-4 shrink-0" />
                <span className="relative z-10 whitespace-nowrap">Open in Spotify</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
