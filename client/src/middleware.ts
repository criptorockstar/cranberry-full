import { NextRequest, NextResponse } from "next/server";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

async function verifyToken(accessToken: string) {
  try {
    const response = await fetch(`${apiUrl}/users/verify-token`, {
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

// New function to check if the user is an admin
async function isAdmin(accessToken: string) {
  try {
    const response = await fetch(`${apiUrl}/users/isadmin`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log("admin response", response);

    if (response.ok) {
      const data = await response.json();
      return data.isAdmin;
    }

    return false;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

// Middleware function
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookies = request.cookies;

  // List of public routes that do not require authentication
  const publicRoutes = ["/iniciar-sesion"];

  // Check if the user is already authenticated
  const accessTokenCookie = cookies.get("access_token");

  // Extract the access token value if present
  const accessToken = accessTokenCookie ? accessTokenCookie.value : null;

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
  const protectedRoutes = ["/dashboard"];

  // Check if the current route is a protected route
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (accessToken) {
      const isValidToken = await verifyToken(accessToken);

      if (!isValidToken) {
        // Redirect to login if the token is invalid
        return NextResponse.redirect(new URL("/iniciar-sesion", request.url));
      }

      // Check if the user is admin before allowing access to dashboard routes
      const isUserAdmin = await isAdmin(accessToken);
      if (!isUserAdmin) {
        // Redirect to login if the user is not an admin
        return NextResponse.redirect(new URL("/iniciar-sesion", request.url));
      }
    } else {
      // Redirect to login if the access token is not present
      return NextResponse.redirect(new URL("/iniciar-sesion", request.url));
    }
  }

  // Allow access to the route if authenticated and authorized
  return NextResponse.next();
}

// Middleware configuration to apply to specific routes
export const config = {
  matcher: ["/iniciar-sesion", "/dashboard"],
};
