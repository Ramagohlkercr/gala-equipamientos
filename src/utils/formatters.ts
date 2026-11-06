/**
 * Format number as Argentine Peso: $ 150.000,00 or $ 150.000
 */
export function formatCurrency(amount: number, showDecimals: boolean = false): string {
  if (isNaN(amount)) return '$ 0';
  
  const formatted = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(amount);

  // Normalize non-breaking spaces
  return formatted.replace(/\u00A0/g, ' ');
}

/**
 * Format standard YYYY-MM-DD string to Argentine DD/MM/AAAA
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const parts = dateString.split('-');
  if (parts.length !== 3) return dateString;
  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
}

/**
 * Format standard YYYY-MM-DD string to friendly Spanish format: "8 de Noviembre, 2026"
 */
export function formatDateFriendly(dateString: string): string {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-').map(Number);
  if (!year || !month || !day) return dateString;

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  return `${day} de ${months[month - 1]}, ${year}`;
}

/**
 * Format phone for display and WhatsApp link
 */
export function formatPhone(phone: string): string {
  return phone.replace(/[^\d+]/g, '');
}

/**
 * Generate a clean WhatsApp chat link with optional pre-filled message
 */
export function buildWhatsAppLink(phone: string, message: string = ''): string {
  const cleanPhone = phone.replace(/\D/g, '');
  // If Argentine local mobile without country code (+54), prepend 549
  let intlPhone = cleanPhone;
  if (!intlPhone.startsWith('54') && intlPhone.length >= 10) {
    intlPhone = `549${intlPhone}`;
  }
  const encodedMsg = encodeURIComponent(message);
  return `https://wa.me/${intlPhone}${message ? `?text=${encodedMsg}` : ''}`;
}
