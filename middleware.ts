// frontend/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtDecode } from 'jwt-decode';

interface AuthUser {
  userId: string;
  role: 'USER' | 'ADMIN' | 'MODERATOR';
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('authToken')?.value;
  const { pathname } = request.nextUrl;

  // Si l'utilisateur essaie d'accéder à une page protégée sans token
  if (!token && (pathname.startsWith('/profile') || pathname.startsWith('/admin'))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token) {
    try {
        const user: AuthUser = jwtDecode(token);

        // Si l'utilisateur essaie d'accéder à /admin mais n'est pas ADMIN
        if (pathname.startsWith('/admin') && user.role !== 'ADMIN') {
            return NextResponse.redirect(new URL('/', request.url)); // Redirige vers l'accueil
        }
    } catch (error) {
        // Si le token est invalide, on le supprime et on redirige
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('authToken');
        return response;
    }
  }

  return NextResponse.next();
}

// Spécifie les routes sur lesquelles ce middleware doit s'exécuter
export const config = {
  matcher: ['/profile/:path*', '/admin/:path*'],
}