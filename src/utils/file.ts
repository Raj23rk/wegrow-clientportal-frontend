export const isPdfVisual = (url?: string | null): boolean => {
  if (!url || typeof url !== 'string') return false;
  const clean = url.trim().toLowerCase();
  return (
    clean.startsWith('data:application/pdf') ||
    clean.startsWith('data:application/x-pdf') ||
    clean.split('?')[0].endsWith('.pdf')
  );
};
