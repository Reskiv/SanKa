// Shared by Vite dev/preview and public/_headers for compatible static hosts.
export function securityHeaders({ dev = false } = {}) {
  const policy = [
    "default-src 'self'", "base-uri 'self'", "object-src 'none'",
    dev ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'" : "script-src 'self'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' data: https://fonts.gstatic.com",
    "img-src 'self' data: blob: https:",
    `connect-src 'self' https://server.arcgisonline.com https://fonts.googleapis.com https://fonts.gstatic.com${dev ? ' ws: wss:' : ''}`,
    "frame-ancestors 'self'", "form-action 'self'", "manifest-src 'self'",
  ].join('; ');
  return {
    'Content-Security-Policy': policy,
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(self), camera=(), microphone=(), payment=(), usb=()',
    'X-DNS-Prefetch-Control': 'off',
  };
}
