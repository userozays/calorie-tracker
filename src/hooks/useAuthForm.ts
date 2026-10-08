"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { authService } from "@/services/authService";
import { errorMessage } from "@/services/http";
import { useAuth } from "./useAuth";

/** State and submit logic of the sign-in / sign-up form; on success it goes to `returnTo`. */
export function useAuthForm(mode: "login" | "register", returnTo: string) {
  const { completeAuth } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      if (mode === "register") await authService.register(username, password);
      else await authService.login(username, password);
      await completeAuth();
      // Stays "pending" while the next page loads, so the button can't be pressed twice.
      router.replace(returnTo);
    } catch (err) {
      setError(errorMessage(err));
      setPending(false);
    }
  }

  return {
    username,
    setUsername,
    password,
    setPassword,
    showPassword,
    toggleShowPassword: () => setShowPassword((v) => !v),
    pending,
    error,
    canSubmit: !pending && username.trim().length > 0 && password.length > 0,
    submit,
  };
}
