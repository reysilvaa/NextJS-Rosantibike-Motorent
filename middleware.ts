import { NextRequest, NextResponse } from 'next/server';

const CACHE_CONTROL_HEADER_VALUES = {
  // Cache statis untuk aset yang jarang berubah
  static: 'public, max-age=31536000, immutable',
  // Cache untuk halaman yang sering diakses tapi bisa berubah
  page: 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=31536000',
  // Tidak ada cache untuk halaman dinamis
  dynamic: 'no-store, must-revalidate',
  // Untuk media konten seperti gambar dan video
  media: 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=31536000',
  // CSS dan JS files
  assets: 'public, max-age=31536000, immutable',
};

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const pathname = request.nextUrl.pathname;

  // Atur header Cache-Control berdasarkan jenis resource
  if (pathname.match(/^\/fonts\/.+$/)) {
    response.headers.set('Cache-Control', CACHE_CONTROL_HEADER_VALUES.static);
  } else if (pathname.match(/^\/_next\/static\/.+$/)) {
    response.headers.set('Cache-Control', CACHE_CONTROL_HEADER_VALUES.assets);
  } else if (pathname.match(/^\/images\/.+$/)) {
    response.headers.set('Cache-Control', CACHE_CONTROL_HEADER_VALUES.media);
  } else if (pathname.match(/^\/(motorcycles|blog)\/[^\/]+$/)) {
    // Halaman detail motor atau blog - cache tapi bisa berubah
    response.headers.set('Cache-Control', CACHE_CONTROL_HEADER_VALUES.page);
  } else if (pathname.match(/^\/(api|booking|booking-history|contact)\/[^\/]+$/)) {
    // Halaman yang tidak boleh di-cache
    response.headers.set('Cache-Control', CACHE_CONTROL_HEADER_VALUES.dynamic);
  } else {
    // Default untuk halaman lainnya
    response.headers.set('Cache-Control', CACHE_CONTROL_HEADER_VALUES.page);
  }

  return response;
}

export const config = {
  matcher: [
    // Matcher untuk path yang perlu dikelola cache-nya
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 