export const translateStatusToHebrew = (status: string): string => {
  if (!status) return status;

  const normalized = status.toLowerCase();
  switch (normalized) {
    case 'rejected':
      return 'נדחתה';
    case 'in process':
      return 'בטיפול';
    case 'approved':
    case 'completed':
      return 'אושרה';
    case 'canceled':
      return 'בוטלה';
    default:
      return status;
  }
};

export const translateTitleToHebrew = (title: string): string => {
  if (!title) return title;

  const normalized = title.toLowerCase();
  switch (normalized) {
    case 'employment':
      return 'אישור העסקה';
    case 'embassy':
      return 'מכתב לשגרירות';
    case 'freefit':
      return 'FreeFit';
    case 'car':
      return 'אישור החזקת רכב';
    case 'cibus':
      return 'בקשה להנפקת סיבוס';
    case 'shoes':
      return 'בקשה לנעלי עבודה';
    default:
      return title;
  }
};
