/** Public Google Ads destination read from the account's event snippet. */
export const LEAD_CONVERSION_DESTINATION = "AW-18448937166/IHlKCM2u5fgcEM7hkd1E";

type MeasurementWindow = Window & {
  gtag?: (command: string, event: string, parameters: Record<string, unknown>) => void;
};

const measuredLeads = new Set<string>();
const STORAGE_KEY = "bs_measured_leads";

function getMeasurementWindow(): MeasurementWindow | null {
  if (typeof window === "undefined") return null;
  // Preview/testing must never create production conversions.
  if (
    !["xekhachbaccuongnguyet.com", "www.xekhachbaccuongnguyet.com"].includes(
      window.location.hostname,
    )
  ) {
    return null;
  }
  return window as MeasurementWindow;
}

/** Call only after the backend acknowledges a persisted lead with its ID. No contact data is sent. */
export function trackSavedLead(leadId: string): void {
  const target = getMeasurementWindow();
  // The backend also acknowledges quarantined requests with an RQ ID; those are not leads.
  if (!target?.gtag || !/^LD-\d{8}-\d{6}-\d{4}$/.test(leadId) || measuredLeads.has(leadId)) return;
  let saved: string[] = [];
  try {
    const value: unknown = JSON.parse(target.sessionStorage.getItem(STORAGE_KEY) || "[]");
    if (Array.isArray(value))
      saved = value.filter((item): item is string => typeof item === "string");
  } catch {
    // Storage can be unavailable; transaction_id still lets Google deduplicate.
  }
  if (saved.includes(leadId)) return;
  try {
    target.gtag("event", "conversion", {
      send_to: LEAD_CONVERSION_DESTINATION,
      transaction_id: leadId,
    });
    measuredLeads.add(leadId);
    target.sessionStorage.setItem(STORAGE_KEY, JSON.stringify([...saved, leadId].slice(-100)));
  } catch {
    // Analytics must never change the result of a successful booking request.
  }
}

/** Observe phone/Zalo clicks separately; they are not verified leads or completed calls. */
export function installContactMeasurement(): () => void {
  const onClick = (event: MouseEvent) => {
    const target = getMeasurementWindow();
    if (!target?.gtag || !(event.target instanceof Element)) return;
    const anchor = event.target.closest("a[href]") as HTMLAnchorElement | null;
    if (!anchor) return;
    const channel =
      anchor.protocol === "tel:" ? "phone" : anchor.hostname === "zalo.me" ? "zalo" : null;
    if (!channel) return;
    try {
      target.gtag("event", "contact_click", { contact_method: channel });
    } catch {
      // Navigation to the chosen contact channel must always work.
    }
  };
  document.addEventListener("click", onClick);
  return () => document.removeEventListener("click", onClick);
}
