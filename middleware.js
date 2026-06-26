export const config = {
  matcher: [
    // Memproteksi seluruh halaman kecuali folder assets dan favicon
    '/((?!assets|favicon.ico).*)',
  ],
};

export default function middleware(request) {
  const authorizationHeader = request.headers.get('authorization');

  if (authorizationHeader) {
    const authValue = authorizationHeader.split(' ')[1];
    if (authValue) {
      try {
        const decoded = atob(authValue);
        const [user, pwd] = decoded.split(':');

        // Membaca dari environment variables Vercel
        const expectedUser = process.env.BASIC_AUTH_USER || 'admin';
        const expectedPassword = process.env.BASIC_AUTH_PASSWORD || 'saputt123';

        if (user === expectedUser && pwd === expectedPassword) {
          // Melanjutkan ke halaman jika login sukses
          return new Response(null, {
            headers: {
              'x-middleware-next': '1',
            },
          });
        }
      } catch (error) {
        // Abaikan kesalahan decoding
      }
    }
  }

  // Tampilkan dialog login browser jika belum memasukkan id/password dengan benar
  return new Response('Authentication Required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  });
}
