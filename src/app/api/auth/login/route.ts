import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const cleanEmail = email?.trim().toLowerCase() || "";
    const isValidEmail = cleanEmail === "admin@bravo.mx" || cleanEmail === "admin@bravocredito.com" || cleanEmail.includes("admin");
    
    // Compare password with ADMIN_SECRET_KEY from environment variables
    const secretKey = process.env.ADMIN_SECRET_KEY;
    if (!secretKey) {
      console.error("ADMIN_SECRET_KEY not set in environment.");
      return NextResponse.json({ success: false, error: "Error de configuración de servidor." }, { status: 500 });
    }

    // Accept both the original hardcoded password (for retro-compatibility during dev) and the secretKey
    // But ideally, we only want the secretKey. For now, since the UI says "Bravo2026!" we'll allow it locally
    // but in prod it should be the secret key. Wait, the prompt says "cambia en producción", so the user
    // expects to type the secretKey as the password in the login screen.
    if (isValidEmail && password === secretKey) {
      // Create response and set HttpOnly cookie
      const response = NextResponse.json({ success: true });
      
      response.cookies.set({
        name: "bravo_admin_token",
        value: secretKey,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24, // 1 day
      });

      return response;
    }

    return NextResponse.json({ success: false, error: "Usuario o contraseña incorrectos." }, { status: 401 });
  } catch (error: any) {
    console.error("[Login Error]", error);
    return NextResponse.json({ success: false, error: "Fallo en el servidor." }, { status: 500 });
  }
}
