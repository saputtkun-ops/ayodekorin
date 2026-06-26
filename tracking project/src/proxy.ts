import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(req: NextRequest) {
  const authorizationHeader = req.headers.get('authorization');

  if (authorizationHeader) {
    // Header format: "Basic <base64-encoded-username-password>"
    const authValue = authorizationHeader.split(' ')[1];
    if (authValue) {
      try {
        const decoded = atob(authValue);
        const [user, pwd] = decoded.split(':');

        // Membaca username dan password dari environment variables Vercel
        const expectedUser = process.env.BASIC_AUTH_USER || 'admin';
        const expectedPassword = process.env.BASIC_AUTH_PASSWORD || 'saputt123';

        if (user === expectedUser && pwd === expectedPassword) {
          return NextResponse.next();
        }
      } catch (error) {
        // Abaikan kesalahan decoding base64
      }
    }
  }

  // Jika tidak terautorisasi, kirim respons 401 untuk memicu dialog login browser
  return new NextResponse('Authentication Required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  });
}

// Konfigurasi jalur (paths) yang akan diproteksi oleh proxy
export const config = {
  matcher: [
    /*
     * Memproteksi seluruh jalur halaman, kecuali:
     * - api (rute API)
     * - _next/static (berkas statis Next.js)
     * - _next/image (optimasi gambar Next.js)
     * - favicon.ico (ikon favicon)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

// Ekspor sebagai nama 'middleware' untuk kompatibilitas ke belakang
export const middleware = proxy;
