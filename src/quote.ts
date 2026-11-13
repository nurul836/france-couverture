export function validQuoteEndpoint(endpoint: string): boolean {
  if (!endpoint) return false;
  try {
    return new URL(endpoint).protocol === "https:";
  } catch {
    return false;
  }
}
/** Only an explicit server acknowledgement permits a successful state. */
export async function sendQuote(
  endpoint: string,
  data: FormData,
  signal?: AbortSignal,
): Promise<void> {
  if (!validQuoteEndpoint(endpoint))
    throw new Error("Envoi en ligne indisponible.");
  const response = await fetch(endpoint, {
    method: "POST",
    body: data,
    signal,
    headers: { Accept: "application/json" },
    credentials: "omit",
    redirect: "error",
  });
  const acknowledgement = await response.json().catch(() => null);
  if (!response.ok || acknowledgement?.accepted !== true)
    throw new Error(
      "Aucune confirmation de réception n’a été reçue. Veuillez nous appeler avant de renouveler votre demande.",
    );
}
