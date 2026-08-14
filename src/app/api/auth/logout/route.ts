import { NextResponse } from "next/server";
import { COOKIE_NAME } from "@/lib/auth/admin";

export async function POST() {
  try {
    const response = NextResponse.json({ success: true });
    response.cookies.set({
      name: COOKIE_NAME,
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 0,
    });
    return response;
  } catch (error: unknown) {
    console.error("[Logout Error]", error);
    return NextResponse.json(
      { success: false, error: "Fallo en el servidor." },
      { status: 500 }
    );
  }
}
