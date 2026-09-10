/**
 * Google Apps Script web apps respond to POST with a 302 redirect.
 * Node's fetch must follow that redirect with GET (not POST) or the body is lost.
 */

const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308])

export async function postGoogleScript(
  url: string,
  payload: Record<string, unknown>,
): Promise<Response> {
  const initial = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    redirect: "manual",
    cache: "no-store",
  })

  if (!REDIRECT_STATUSES.has(initial.status)) {
    return initial
  }

  const location = initial.headers.get("location")
  if (!location) {
    throw new Error("Google Apps Script redirect missing location header")
  }

  return fetch(location, {
    method: "GET",
    redirect: "follow",
    cache: "no-store",
  })
}

export async function getGoogleScript(url: string): Promise<Response> {
  return fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    redirect: "follow",
    cache: "no-store",
  })
}

export async function readGoogleScriptJson<T = Record<string, unknown>>(
  response: Response,
): Promise<T> {
  const text = await response.text()

  try {
    return JSON.parse(text) as T
  } catch {
    throw new Error(
      response.ok
        ? "Google Apps Script returned invalid JSON"
        : `Google Apps Script request failed (${response.status})`,
    )
  }
}
