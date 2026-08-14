import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json({ success: true });
    
    // Clear the auth cookie by setting a past expiration date
    response.cookies.set({
      name: "bravo_admin_token",
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (error: any) {
    console.error("[Logout Error]", error);
    return NextResponse.json({ success: false, error: "Fallo en el servidor." }, { status: 500 });
  }
}
