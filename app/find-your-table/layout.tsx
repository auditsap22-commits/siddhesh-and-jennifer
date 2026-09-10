"use client"

import { useEffect } from "react"

export default function FindYourTableLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    const navbar = document.querySelector("nav") as HTMLElement | null
    if (navbar) navbar.style.display = "none"
    return () => {
      if (navbar) navbar.style.display = ""
    }
  }, [])

  return <>{children}</>
}
