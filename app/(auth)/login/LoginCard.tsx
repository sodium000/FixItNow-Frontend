/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { loginUser } from "./loginfuntion";
import { useMutation } from "@tanstack/react-query";

export interface LoginUserType {
  email: string;
  password: string;
}

export default function LoginCard() {
  const [showPassword, setShowPassword] = useState(false);

  const mutation = useMutation({
    mutationFn: loginUser,
  });

  console.log(mutation);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginUserType>();

  return (
    <Card className="mx-auto w-full max-w-4xl overflow-hidden rounded-[40px] shadow-2xl border-0">
      {/* Hero + Form wrapper */}
      <div className="flex w-full flex-col md:flex-row">
        <div className="w-full md:w-1/2">
          <section className="bg-[#121212] ml-4 px-6 py-10 sm:px-8 text-center h-auto min-h-80 md:h-full relative rounded-b-4xl md:rounded-br-4xl md:rounded-bl-md rounded-tr-md rounded-tl-md md:rounded-tl-4xl overflow-hidden flex flex-col items-center justify-center">
            <div className="absolute left-8 top-8 h-16 w-16 rounded-full bg-purple-500/20 blur-3xl" />
            <div className="absolute bottom-10 right-10 h-16 w-16 rounded-full bg-green-500/20 blur-3xl" />

            <div className="relative mx-auto mb-6 h-40 w-40 sm:h-56 sm:w-56 md:h-70 md:w-70">
              <svg
                viewBox="0 0 240 240"
                xmlns="http://www.w3.org/2000/svg"
                className="h-full w-full"
              >
                <defs>
                  <linearGradient id="serviceGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#22c55e" />
                  </linearGradient>
                </defs>

                {/* Phone body */}
                <rect
                  x="70"
                  y="30"
                  width="100"
                  height="180"
                  rx="18"
                  fill="#1f1f1f"
                  stroke="#333"
                  strokeWidth="2"
                />
                <rect
                  x="82"
                  y="46"
                  width="76"
                  height="128"
                  rx="6"
                  fill="#0c0c0c"
                />

                {/* Screen: house / booking card */}
                <rect
                  x="90"
                  y="56"
                  width="60"
                  height="38"
                  rx="8"
                  fill="url(#serviceGrad)"
                  opacity="0.9"
                />
                {/* little house glyph on the card */}
                <path
                  d="M 108 74 L 120 65 L 132 74"
                  fill="none"
                  stroke="#0c0c0c"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.7"
                />
                <rect
                  x="112"
                  y="74"
                  width="16"
                  height="12"
                  rx="1.5"
                  fill="#0c0c0c"
                  opacity="0.6"
                />
                <rect
                  x="97"
                  y="84"
                  width="34"
                  height="6"
                  rx="3"
                  fill="#ffffff"
                />

                {/* Screen: service list rows (each a category chip) */}
                <rect
                  x="94"
                  y="106"
                  width="12"
                  height="12"
                  rx="4"
                  fill="#a855f7"
                  opacity="0.8"
                />
                <rect
                  x="111"
                  y="109"
                  width="30"
                  height="5"
                  rx="2.5"
                  fill="#8a8a8a"
                />

                <rect
                  x="94"
                  y="124"
                  width="12"
                  height="12"
                  rx="4"
                  fill="#22c55e"
                  opacity="0.8"
                />
                <rect
                  x="111"
                  y="127"
                  width="26"
                  height="5"
                  rx="2.5"
                  fill="#8a8a8a"
                />

                <rect
                  x="94"
                  y="142"
                  width="12"
                  height="12"
                  rx="4"
                  fill="#a855f7"
                  opacity="0.8"
                />
                <rect
                  x="111"
                  y="145"
                  width="32"
                  height="5"
                  rx="2.5"
                  fill="#8a8a8a"
                />

                {/* Home indicator */}
                <rect
                  x="112"
                  y="163"
                  width="36"
                  height="4"
                  rx="2"
                  fill="#333"
                />

                {/* Floating tool badge (wrench) */}
                <circle
                  cx="52"
                  cy="70"
                  r="20"
                  fill="url(#serviceGrad)"
                  opacity="0.15"
                />
                <circle
                  cx="52"
                  cy="70"
                  r="20"
                  fill="none"
                  stroke="url(#serviceGrad)"
                  strokeWidth="2.5"
                />
                <path
                  d="M 45 77 L 56 66 M 56 66 A 4 4 0 1 0 58 64 A 4 4 0 0 0 56 66"
                  fill="none"
                  stroke="#e5e5e5"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Rating chip */}
                <rect
                  x="182"
                  y="140"
                  width="42"
                  height="30"
                  rx="8"
                  fill="#1f1f1f"
                  stroke="#333"
                  strokeWidth="2"
                />
                <path
                  d="M 203 148 L 206 154 L 212 155 L 208 159 L 209 165 L 203 162 L 197 165 L 198 159 L 194 155 L 200 154 Z"
                  fill="#22c55e"
                />

                {/* Floating dots */}
                <circle cx="200" cy="50" r="3" fill="#a855f7" opacity="0.7" />
                <circle cx="45" cy="185" r="3" fill="#22c55e" opacity="0.7" />
                <circle cx="30" cy="120" r="2" fill="#a855f7" opacity="0.5" />
              </svg>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Manage your Money Anywhere
            </h1>

            <p className="mt-2 text-xs text-gray-400">
              You can manage your money on the go with Quicken on the web.
            </p>
          </section>
        </div>

        {/* Form */}

        <div className="w-full md:w-1/2">
          <section className="p-6 sm:p-8">
            {/* Logo */}

            <div className="mb-8 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black">
                <div className="h-2 w-4 rounded-full border-b-2 border-white" />
              </div>

              <span className="text-xl font-bold">.Finance</span>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-extrabold">Welcome Back!</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Please enter login details below
              </p>
            </div>

            <form
              onSubmit={handleSubmit((data) => {
                mutation.mutate(data);
              })}
              className="space-y-4"
            >
              <Input
                {...register("email", {
                  required: "Email is required",
                })}
                placeholder="Email"
                type="email"
                className="h-12 rounded-xl"
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}

              <div className="relative">
                <Input
                  {...register("password", {
                    required: "Password is required",
                  })}
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  className="h-12 rounded-xl pr-12"
                />
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="text-right">
                <button
                  type="button"
                  className="text-xs font-semibold hover:underline"
                >
                  Forget password?
                </button>
              </div>

              <Button
                disabled={mutation.isPending}
                type="submit"
                className="h-12 w-full rounded-xl"
              >
                {mutation.isPending ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <div className="my-8 flex items-center gap-4">
              <Separator className="flex-1" />

              <span className="text-[10px] uppercase tracking-widest text-gray-400">
                or continue
              </span>

              <Separator className="flex-1" />
            </div>

            <Button variant="outline" className="h-12 w-full rounded-xl">
              <svg viewBox="0 0 24 24" className="mr-2 h-5 w-5">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Login with Google
            </Button>

            <p className="mt-10 text-center text-xs text-muted-foreground">
              Don't have an account?{" "}
              <button className="font-bold text-black hover:underline">
                <Link href="/registration"> Sign Up</Link>
              </button>
            </p>
          </section>
        </div>
      </div>
    </Card>
  );
}
