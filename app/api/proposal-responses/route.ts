import { type NextRequest, NextResponse } from "next/server"
import { siteConfig } from "@/content/site"
import {
  getGoogleScript,
  postGoogleScript,
  readGoogleScriptJson,
} from "@/lib/google-script-fetch"
import { getProposalRoleById } from "@/lib/proposal-roles"
import type { ProposalResponse, ProposalRole, ProposalSubmitPayload } from "@/lib/proposal-types"

const PROPOSAL_SCRIPT_URL = siteConfig.googleAPI.proposalResponses
const ENTOURAGE_SCRIPT_URL = siteConfig.googleAPI.entourage
const SPONSORS_SCRIPT_URL = siteConfig.googleAPI.sponsors

function normalizeResponse(row: Record<string, unknown>): ProposalResponse | null {
  const r = row as Record<string, string | undefined>
  const role = r.role ?? r.Role ?? ""
  const name = r.name ?? r.Name ?? ""
  const status = (r.status ?? r.Status ?? "") as ProposalResponse["status"]
  const submittedAt = r.submittedAt ?? r.SubmittedAt ?? r.timestamp ?? r.Timestamp ?? ""
  const category =
    r.category ?? r.Category ?? r.roleCategory ?? r.RoleCategory ?? ""
  const id = r.id ?? r.Id ?? `${role}-${submittedAt}-${name}`

  if (!role && !category && !name) return null
  if (status !== "Confirmed" && status !== "Declined") return null

  return {
    id,
    role,
    name,
    status,
    submittedAt,
    category,
  }
}

async function postScriptAction(
  url: string,
  payload: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const response = await postGoogleScript(url, payload)
  const data = await readGoogleScriptJson<Record<string, unknown>>(response)

  if (!response.ok) {
    throw new Error(
      typeof data.error === "string" ? data.error : "Google Apps Script request failed",
    )
  }

  if (typeof data.error === "string" && data.error.trim()) {
    throw new Error(data.error)
  }

  return data
}

async function syncEntourageName(roleDef: ProposalRole, name: string) {
  const fillPayload = {
    action: "fill-slot",
    Name: name,
    RoleCategory: roleDef.roleCategory,
    RoleCategoryAliases: roleDef.roleCategoryAliases ?? [],
    Email: "",
  }

  try {
    await postScriptAction(ENTOURAGE_SCRIPT_URL, fillPayload)
    return
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    if (!message.includes('Invalid action')) {
      throw error
    }
  }

  await postScriptAction(ENTOURAGE_SCRIPT_URL, {
    action: "create",
    Name: name,
    RoleCategory: roleDef.roleCategory,
    RoleTitle: roleDef.title,
    Email: "",
  })
}

async function syncSponsorName(
  roleDef: ProposalRole,
  name: string,
  fillColumn: "male" | "female",
) {
  const fillPayload =
    fillColumn === "male"
      ? {
          action: "fill-slot",
          fillColumn: "male",
          MalePrincipalSponsor: name,
          FemalePrincipalSponsor: "",
        }
      : {
          action: "fill-slot",
          fillColumn: "female",
          MalePrincipalSponsor: "",
          FemalePrincipalSponsor: name,
        }

  try {
    await postScriptAction(SPONSORS_SCRIPT_URL, fillPayload)
    return
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    if (!message.includes('Invalid action')) {
      throw error
    }
  }

  await postScriptAction(SPONSORS_SCRIPT_URL, {
    action: "create",
    MalePrincipalSponsor: fillColumn === "male" ? name : "",
    FemalePrincipalSponsor: fillColumn === "female" ? name : "",
  })
}

async function syncConfirmedToSheet(payload: ProposalSubmitPayload) {
  const roleDef = getProposalRoleById(payload.role)
  if (!roleDef || payload.status !== "Confirmed") return false

  const name = payload.name.trim()
  if (!name) return false

  if (roleDef.type === "entourage") {
    await syncEntourageName(roleDef, name)
    return true
  }

  if (roleDef.type === "sponsor-ninong") {
    await syncSponsorName(roleDef, name, "male")
    return true
  }

  if (roleDef.type === "sponsor-ninang") {
    await syncSponsorName(roleDef, name, "female")
    return true
  }

  return false
}

async function saveProposalLog(
  payload: ProposalSubmitPayload,
  roleCategory: string,
) {
  await postScriptAction(PROPOSAL_SCRIPT_URL, {
    action: "proposal",
    role: payload.role,
    name: payload.name,
    status: payload.status,
    submittedAt: payload.submittedAt,
    category: roleCategory,
    id: `${payload.role}-${Date.now()}`,
  })
}

export async function GET() {
  try {
    const response = await getGoogleScript(`${PROPOSAL_SCRIPT_URL}?action=proposals`)

    if (!response.ok) {
      throw new Error("Failed to fetch proposal responses")
    }

    const data = await response.json()

    if (Array.isArray(data)) {
      const parsed = data
        .map((row) => normalizeResponse(row as Record<string, unknown>))
        .filter((row): row is ProposalResponse => row !== null)
      return NextResponse.json(parsed, { status: 200 })
    }

    const rows = (data?.proposals ?? data?.GoogleSheetData ?? []) as Record<string, unknown>[]
    if (Array.isArray(rows)) {
      const parsed = rows
        .map((row) => normalizeResponse(row))
        .filter((row): row is ProposalResponse => row !== null)
      return NextResponse.json(parsed, { status: 200 })
    }

    return NextResponse.json([], { status: 200 })
  } catch (error) {
    console.error("Error fetching proposal responses:", error)
    return NextResponse.json(
      { error: "Failed to fetch proposal responses" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ProposalSubmitPayload
    const { role, name, status, submittedAt } = body

    if (!role || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (status !== "Confirmed" && status !== "Declined") {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const roleDef = getProposalRoleById(role)
    if (!roleDef) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    const payload: ProposalSubmitPayload = {
      role,
      name: name?.trim() || (status === "Declined" ? "Declined Entourage Offer" : ""),
      status,
      submittedAt: submittedAt || new Date().toISOString(),
    }

    if (status === "Confirmed" && !payload.name) {
      return NextResponse.json(
        { error: "Name is required for confirmed responses" },
        { status: 400 },
      )
    }

    await saveProposalLog(payload, roleDef.roleCategory)

    let synced = false
    if (status === "Confirmed" && payload.name) {
      try {
        synced = await syncConfirmedToSheet(payload)
      } catch (syncError) {
        console.error("Failed to sync confirmed name to entourage/sponsor sheet:", syncError)
      }
    }

    return NextResponse.json(
      {
        success: true,
        logSaved: true,
        synced,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error saving proposal response:", error)
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to save proposal response",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { id } = body

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "id is required" }, { status: 400 })
    }

    const data = await postScriptAction(PROPOSAL_SCRIPT_URL, {
      action: "delete-proposal",
      id: id.trim(),
    })

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error("Error deleting proposal response:", error)
    return NextResponse.json(
      { error: "Failed to delete proposal response" },
      { status: 500 }
    )
  }
}
