"use client";

import Button from "@components/Button";
import { cn } from "@utils/helpers";
import {
  CheckCircle2,
  KeyRound,
  LockKeyhole,
  Mail,
  User2,
} from "lucide-react";
import Link from "next/link";
import {
  FormEvent,
  InputHTMLAttributes,
  ReactNode,
  useState,
} from "react";
import AnonBirdIcon from "@/assets/icons/AnonBirdIcon";

function AuthBrand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex w-full flex-col items-center text-center">
      <div
        className={cn(
          "flex items-center justify-center gap-6 text-white",
          compact ? "gap-4" : "gap-5 sm:gap-7",
        )}
      >
        <AnonBirdIcon size={compact ? 72 : 100} />
        <span
          className={cn(
            "font-semibold leading-none tracking-normal text-white",
            compact ? "text-4xl" : "text-5xl sm:text-[3.5rem]",
          )}
        >
          AnonBird
        </span>
      </div>
    </div>
  );
}

function AuthShell({
  children,
  className,
  compactBrand = false,
}: {
  children: ReactNode;
  className?: string;
  compactBrand?: boolean;
}) {
  return (
    <main className="min-h-screen bg-nb-gray-950 px-5 py-8 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl flex-col items-center justify-center gap-6 sm:gap-8">
        <AuthBrand compact={compactBrand} />
        <section className={cn("w-full", className)}>{children}</section>
      </div>
    </main>
  );
}

function AuthField({
  label,
  icon,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-3 block text-xl font-semibold text-white">
        {label}
      </span>
      <span className="relative block">
        <span className="pointer-events-none absolute left-4 top-1/2 flex -translate-y-1/2 items-center text-white/65">
          {icon}
        </span>
        <input
          {...props}
          className="h-16 w-full rounded-md border border-nb-gray-700 bg-[#303a4a] px-5 pl-14 text-xl font-medium text-white placeholder:text-nb-gray-350 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-netbird-400/40 focus-visible:ring-offset-2 focus-visible:ring-offset-nb-gray-950 disabled:cursor-not-allowed disabled:opacity-40"
        />
      </span>
    </label>
  );
}

export function LoginPreviewScreen() {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <AuthShell className="max-w-3xl">
      <form
        onSubmit={handleSubmit}
        className="rounded-[28px] border border-nb-gray-800 bg-nb-gray-940 px-6 py-8 shadow-2xl shadow-black/20 sm:px-20 sm:py-10"
      >
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-semibold text-white sm:text-5xl">
            Sign in to AnonBird
          </h1>
          <p className="text-2xl font-medium text-white/80">
            Enter your AnonBird credentials
          </p>
        </div>

        <div className="space-y-5">
          <AuthField
            label="Email Address"
            type="email"
            defaultValue="programmermr0@gmail.com"
            icon={<Mail size={22} className="text-white/65" />}
          />
          <AuthField
            label="Password"
            type="password"
            defaultValue="anonbird-password"
            icon={<LockKeyhole size={22} className="text-white/65" />}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          className="mt-7 h-16 w-full rounded-2xl !text-2xl font-semibold text-white shadow-lg shadow-netbird-950/20"
        >
          Sign in
        </Button>

        <p className="mt-6 text-center text-lg font-medium text-white/70">
          Need an account?{" "}
          <Link className="text-netbird-300 hover:text-white" href="/register">
            Create one
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}

export function RegisterPreviewScreen() {
  const [password, setPassword] = useState("");
  const hasLength = password.length >= 8;
  const hasNumber = /[0-9]/.test(password);
  const hasLetter = /[a-zA-Z]/.test(password);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <AuthShell compactBrand className="max-w-5xl">
      <div className="grid overflow-hidden rounded-[28px] border border-nb-gray-800 bg-nb-gray-940 shadow-2xl shadow-black/20 lg:grid-cols-[0.85fr_1.15fr]">
        <aside className="flex min-h-[22rem] flex-col justify-between bg-[#20252b] p-8 sm:p-10 lg:min-h-[34rem]">
          <div>
            <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-netbird/15">
              <KeyRound size={34} className="text-netbird-300" />
            </div>
            <h1 className="max-w-sm text-4xl font-semibold leading-tight text-white sm:text-5xl">
              Create your AnonBird account
            </h1>
          </div>

          <div className="space-y-4 text-lg font-medium text-white/78">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={22} className="shrink-0 text-netbird-300" />
              <span>Invite verified</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 size={22} className="shrink-0 text-netbird-300" />
              <span>Password protected</span>
            </div>
          </div>
        </aside>

        <form onSubmit={handleSubmit} className="p-8 sm:p-10 lg:p-12">
          <div className="mb-9">
            <h2 className="text-3xl font-semibold text-white">
              Registration
            </h2>
            <p className="mt-3 text-lg font-medium text-white/65">
              Fill in your profile and set a password.
            </p>
          </div>

          <div className="space-y-6">
            <AuthField
              label="Full Name"
              type="text"
              placeholder="Your name"
              icon={<User2 size={22} className="text-white/65" />}
            />
            <AuthField
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              icon={<Mail size={22} className="text-white/65" />}
            />
            <AuthField
              label="Password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              icon={<LockKeyhole size={22} className="text-white/65" />}
            />
          </div>

          <div className="mt-5 grid gap-3 text-base font-medium text-white/70 sm:grid-cols-3">
            <PasswordCheck checked={hasLength}>8 characters</PasswordCheck>
            <PasswordCheck checked={hasLetter}>One letter</PasswordCheck>
            <PasswordCheck checked={hasNumber}>One number</PasswordCheck>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="mt-9 h-16 w-full rounded-2xl !text-2xl font-semibold text-white"
          >
            Create Account
          </Button>

          <p className="mt-7 text-center text-lg font-medium text-white/70">
            Already registered?{" "}
            <Link className="text-netbird-300 hover:text-white" href="/login">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </AuthShell>
  );
}

function PasswordCheck({
  checked,
  children,
}: {
  checked: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg border px-3 py-2",
        checked
          ? "border-netbird-400/40 bg-netbird/10 text-white"
          : "border-nb-gray-800 bg-nb-gray-925 text-white/55",
      )}
    >
      <CheckCircle2
        size={16}
        className={checked ? "text-netbird-300" : "text-white/30"}
      />
      <span>{children}</span>
    </div>
  );
}
