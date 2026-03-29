/**
 * Shared StatusBadge component — single source of truth for shipment status badges.
 * Used across DriverDashboard, CompanyOfficerDashboard, CustomerDashboard, TrackShipment, etc.
 */

export const STATUS_CONFIG = {
  DELIVERED: {
    label: "Delivered",
    className: "badge-delivered",
    dot: "bg-emerald-500",
  },
  IN_TRANSIT: {
    label: "In Transit",
    className: "badge-in-transit",
    dot: "bg-indigo-500",
  },
  PENDING: {
    label: "Pending",
    className: "badge-pending",
    dot: "bg-amber-500",
  },
  DELAYED: {
    label: "Delayed",
    className: "badge-delayed",
    dot: "bg-rose-500",
  },
  CANCELLED: {
    label: "Cancelled",
    className:
      "bg-muted text-muted-foreground border border-border/60",
    dot: "bg-muted-foreground",
  },
  AT_RISK: {
    label: "At Risk",
    className: "badge-delayed",
    dot: "bg-rose-500",
  },
}

/**
 * @param {{ status: string }} props
 */
export function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || {
    label: status?.replace(/_/g, " ") ?? "Unknown",
    className: "bg-muted text-muted-foreground border border-border/60",
    dot: "bg-muted-foreground",
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${config.className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  )
}
