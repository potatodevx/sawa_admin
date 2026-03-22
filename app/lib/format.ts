export function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function statusClass(status: string): string {
  if (status === 'active' || status === 'engaged') {
    return 'chip chipActive';
  }
  if (status === 'flagged' || status === 'inactive') {
    return 'chip chipWarning';
  }
  return 'chip chipNeutral';
}
