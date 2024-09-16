import { NextRequest, NextResponse } from "next/server";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.cranberrymayorista.com";

// Función para verificar si el token es válido
async function verifyToken(accessToken: string) {
  try {
    const response = await fetch(`${API_URL}/users/verify-token`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.isValid;
    }

    return false;
  } catch (error) {
    console.error("Error verifying token:", error);
    return false;
  }
}

// Función para verificar si el usuario es admin
async function verifyAdmin(accessToken: string) {
  try {
    const response = await fetch(`${API_URL}/users/isadmin`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      const role = await response.text();
      return role.includes("Admin");
    }

    return false;
  } catch (error) {
    console.error("Error verifying admin role:", error);
    return false;
  }
}

// Middleware function
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // List of public routes that do not require authentication
  const publicRoutes = ["/iniciar-sesion"];

  // Check if the user is already authenticated
  const accessToken = request.cookies.get("accessToken")?.value;

  // Redirect authenticated users away from public routes
  if (publicRoutes.includes(pathname) && accessToken) {
    const isValidToken = await verifyToken(accessToken);

    if (isValidToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Skip authentication for public routes without token
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // List of protected routes
  const protectedRoutes = ["/dashboard", "/dashboard/agregar-producto"];

  // Check if the current route is a protected route
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (accessToken) {
      const isValidToken = await verifyToken(accessToken);

      if (!isValidToken) {
        // Redirect to login if the token is invalid
        return NextResponse.redirect(new URL("/iniciar-sesion", request.url));
      }

      // Verificar si el usuario es admin si la ruta es "/dashboard"
      if (pathname.startsWith("/dashboard")) {
        const isAdmin = await verifyAdmin(accessToken);

        if (!isAdmin) {
          // Si no es admin, redirigir a una página de no autorizado o de inicio
          return NextResponse.redirect(new URL("/", request.url));
        }
      }
    } else {
      // Redirect to login if the access token is not present
      return NextResponse.redirect(new URL("/iniciar-sesion", request.url));
    }
  }

  // Allow access to the route if authenticated
  return NextResponse.next();
}

// Middleware configuration to apply to specific routes
export const config = {
  matcher: ["/dashboard", "/iniciar-sesion", "/dashboard/agregar-producto"],
};
