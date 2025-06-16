"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT } from "jose";

export type LoginFormState = {
  success: boolean;
  message: string;
  errors?: {
    email?: string[];
    password?: string[];
  };
};

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME || "admin-auth-token";
const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

export async function loginAction(
  prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !JWT_SECRET) {
    console.error("Variáveis de ambiente faltando.");
    return {
      success: false,
      message: "Erro de configuração do servidor. Contate o administrador.",
    };
  }

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    try {
      const payload = { userId: "admin", email: ADMIN_EMAIL, role: "admin" };

      const token = await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime(JWT_EXPIRES_IN)
        .sign(new TextEncoder().encode(JWT_SECRET));

      (await cookies()).set(AUTH_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 1 dia
      });
    } catch (error) {
      console.error("Erro ao gerar token JWT:", error);
      return {
        success: false,
        message: "Erro interno do servidor ao tentar logar.",
      };
    }

    redirect("/admin");
  } else {
    return {
      success: false,
      message: "Email ou senha inválidos.",
    };
  }
}
