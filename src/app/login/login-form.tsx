"use client";

import { useActionState, useState } from "react";
import {
  Eye,
  EyeOff,
  KeyRound,
  LoaderCircle,
  LogIn,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { loginAction, type LoginState } from "@/lib/auth-actions";

const initialState: LoginState = {
  error: null,
};

const inputClassName =
  "h-12 w-full rounded-lg border border-input bg-background py-3 pl-11 pr-11 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState,
  );
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <label
          htmlFor="identifier"
          className="text-ba se font-medium text-muted-foreground"
        >
          Username atau email
        </label>

        <div className="relative mt-2">
          <UserRound
            size={20}
            strokeWidth={1.8}
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />

          <input
            id="identifier"
            name="identifier"
            type="text"
            autoComplete="username"
            placeholder="Masukkan username atau email"
            required
            maxLength={100}
            className={inputClassName}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="text-base font-medium text-muted-foreground"
        >
          Password
        </label>

        <div className="relative mt-2">
          <KeyRound
            size={20}
            strokeWidth={1.8}
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />

          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Masukkan password"
            required
            maxLength={200}
            className={inputClassName}
          />

          <button
            type="button"
            onClick={() => setShowPassword((previous) => !previous)}
            aria-label={
              showPassword ? "Sembunyikan password" : "Lihat password"
            }
            className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {showPassword ? (
              <EyeOff size={20} strokeWidth={1.8} />
            ) : (
              <Eye size={20} strokeWidth={1.8} />
            )}
          </button>
        </div>
      </div>

      {state.error && (
        <p
          role="alert"
          className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive"
        >
          {state.error}
        </p>
      )}

      <Button
        type="submit"
        disabled={isPending}
        className="h-12 w-full cursor-pointer gap-2 rounded-lg text-base font-semibold transition-colors disabled:cursor-not-allowed"
      >
        {isPending ? (
          <>
            <LoaderCircle size={20} className="animate-spin" />
            Memproses...
          </>
        ) : (
          <>
            <LogIn size={20} />
            Masuk
          </>
        )}
      </Button>
    </form>
  );
}
