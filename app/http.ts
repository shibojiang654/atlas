export async function readApiError(res: Response): Promise<string> {
  const contentType = res.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    try {
      const data = (await res.json()) as { error?: string; message?: string };
      return data.error || data.message || `Request failed (${res.status})`;
    } catch {
      return `Request failed (${res.status})`;
    }
  }

  const raw = await res.text();
  if (raw.toLowerCase().includes("<!doctype html")) {
    return `API route not available (${res.status}). For Python serverless routes, run with 'vercel dev'.`;
  }

  return raw.slice(0, 300) || `Request failed (${res.status})`;
}
