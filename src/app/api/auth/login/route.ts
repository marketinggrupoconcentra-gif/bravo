import { NextRequest, NextResponse } from "next/server";
import {
  createSessionToken,
  isAllowedAdminEmail,
  COOKIE_NAME,
  SESSION_TTL_SECONDS,
} from "@/lib/auth/admin";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // 1. Validate email against explicit allowlist (no permissive substring matching)
    const cleanEmail = email?.trim().toLowerCase() || "";
    if (!isAllowedAdminEmail(cleanEmail)) {
      return NextResponse.json(
        { success: false, error: "Usuario o contraseña incorrectos." },
        { status: 401 }
      );
    }

    // 2. Validate password against ADMIN_SECRET_KEY
    const secretKey = process.env.ADMIN_SECRET_KEY;
    if (!secretKey) {
      console.error("[Login] ADMIN_SECRET_KEY is not configured.");
      return NextResponse.json(
        { success: false, error: "Error de configuración de servidor." },
        { status: 500 }
      );
    }

    if (password !== secretKey) {
      return NextResponse.json(
        { success: false, error: "Usuario o contraseña incorrectos." },
        { status: 401 }
      );
    }

    // 3. Generate a signed session token (NOT the secret itself)
    const sessionToken = createSessionToken();

    const response = NextResponse.json({ success: true });
    response.cookies.set({
      name: COOKIE_NAME,
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: SESSION_TTL_SECONDS,
    });

    return response;
  } catch (error: unknown) {
    console.error("[Login Error]", error);
    return NextResponse.json(
      { success: false, error: "Fallo en el servidor." },
      { status: 500 }
    );
  }
}
