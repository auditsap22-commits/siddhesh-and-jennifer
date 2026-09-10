import type { Metadata } from "next"
import { TableFinder } from "@/components/ui/table-finder"
import { siteConfig } from "@/content/site"

const coupleNames = `${siteConfig.couple.groomNickname} & ${siteConfig.couple.brideNickname}`

export const metadata: Metadata = {
  title: `Find Your Table | ${coupleNames}`,
  description: `Search your name to find your seat at ${coupleNames}'s wedding reception.`,
}

export default function FindYourTablePage() {
  return <TableFinder />
}
