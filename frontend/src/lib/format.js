import { format } from 'date-fns'

export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    return format(new Date(dateString), 'dd MMM yyyy, HH:mm')
  } catch {
    return dateString
  }
}

