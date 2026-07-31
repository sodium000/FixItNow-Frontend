
"use client";

import { useState } from "react";
import { Eye, EyeOff, UploadCloud, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";

export default function RegistrationCard() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };
  const clearPhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  return (
    <Card className="mx-auto  w-full max-w-4xl overflow-hidden rounded-[40px] shadow-2xl border-0 ">
      <div className="flex w-full gap-4 flex-col md:flex-row">
        {/* Hero */}
        <div className="w-full md:w-1/2">
          <section className="bg-[#121212] ml-2 px-6 py-8 sm:px-8 text-center h-auto min-h-55 md:h-full relative rounded-b-4xl md:rounded-br-4xl md:rounded-bl-md rounded-tr-md rounded-tl-md md:rounded-tl-4xl overflow-hidden flex flex-col items-center justify-center">
            <div className="absolute left-8 top-8 h-16 w-16 rounded-full bg-purple-500/20 blur-3xl" />
            <div className="absolute bottom-10 right-10 h-16 w-16 rounded-full bg-green-500/20 blur-3xl" />

            <div className="relative mx-auto mb-4 h-32 w-32 sm:h-44 sm:w-44 md:h-56 md:w-56">
              <svg
                viewBox="0 0 240 240"
                xmlns="http://www.w3.org/2000/svg"
                className="h-full w-full"
              >
                <defs>
                  <linearGradient id="cardGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#22c55e" />
                  </linearGradient>
                </defs>

                {/* Back card */}
                <rect
                  x="30"
                  y="60"
                  width="140"
                  height="90"
                  rx="14"
                  fill="#1f1f1f"
                  stroke="#333"
                  strokeWidth="2"
                />

                {/* Front id/profile card */}
                <rect
                  x="55"
                  y="85"
                  width="150"
                  height="100"
                  rx="16"
                  fill="url(#cardGrad)"
                  opacity="0.15"
                />
                <rect
                  x="55"
                  y="85"
                  width="150"
                  height="100"
                  rx="16"
                  fill="none"
                  stroke="url(#cardGrad)"
                  strokeWidth="2.5"
                />

                {/* Avatar circle */}
                <circle
                  cx="95"
                  cy="120"
                  r="18"
                  fill="url(#cardGrad)"
                  opacity="0.9"
                />
                <circle cx="95" cy="115" r="7" fill="#121212" />
                <path d="M 82 133 Q 95 122 108 133" fill="#121212" />

                {/* Text lines */}
                <rect
                  x="125"
                  y="108"
                  width="60"
                  height="6"
                  rx="3"
                  fill="#e5e5e5"
                />
                <rect
                  x="125"
                  y="122"
                  width="45"
                  height="5"
                  rx="2.5"
                  fill="#8a8a8a"
                />
                <rect
                  x="125"
                  y="133"
                  width="50"
                  height="5"
                  rx="2.5"
                  fill="#8a8a8a"
                />

                {/* Checkmark badge */}
                <circle cx="185" cy="100" r="14" fill="#22c55e" />
                <path
                  d="M 179 100 L 183.5 104.5 L 191.5 95.5"
                  fill="none"
                  stroke="#121212"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Floating dots */}
                <circle cx="45" cy="70" r="3" fill="#a855f7" opacity="0.7" />
                <circle cx="195" cy="165" r="3" fill="#22c55e" opacity="0.7" />
                <circle cx="35" cy="150" r="2" fill="#a855f7" opacity="0.5" />
              </svg>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Join and Take Control
            </h1>

            <p className="mt-2 text-xs text-gray-400">
              Create your account to start managing your money with Quicken.
            </p>
          </section>
        </div>

        {/* Form */}
        <div className="w-full md:w-1/2">
          <section className="p-6 sm:p-2">
            {/* Logo */}
            <div className="mb-6 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black">
                <div className="h-2 w-4 rounded-full border-b-2 border-white" />
              </div>
              <span className="text-xl font-bold">.Finance</span>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-extrabold">Create Account</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Fill in your details to get started
              </p>
            </div>

            <form className="space-y-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="name"
                  className="text-xs font-semibold text-gray-500"
                >
                  Full Name
                </Label>
                <Input
                  id="name"
                  placeholder="Full Name"
                  type="text"
                  className="h-12 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="email"
                  className="text-xs font-semibold text-gray-500"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  placeholder="Email"
                  type="email"
                  className="h-12 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="phone"
                  className="text-xs font-semibold text-gray-500"
                >
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  placeholder="Phone Number"
                  type="tel"
                  className="h-12 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="photo"
                  className="text-xs font-semibold text-gray-500"
                >
                  Profile Photo
                </Label>

                {!photoPreview ? (
                  <label
                    htmlFor="photo"
                    className="flex h-12 w-full cursor-pointer items-center gap-2 rounded-xl border border-input bg-transparent px-3 text-sm text-gray-500 hover:bg-accent/50"
                  >
                    <UploadCloud size={18} className="text-gray-400" />
                    <span>Upload photo</span>
                    <input
                      id="photo"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="flex h-12 w-full items-center justify-between gap-2 rounded-xl border border-input px-3">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <Image 
                        src={photoPreview}
                        alt="Photo preview"
                        className="h-8 w-8 shrink-0 rounded-full object-cover"
                      />
                      <span className="truncate text-sm text-gray-600">
                        {photoFile?.name }
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={clearPhoto}
                      className="shrink-0 text-gray-400 hover:text-gray-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="password"
                  className="text-xs font-semibold text-gray-500"
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}
                    className="h-12 rounded-xl pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="confirmPassword"
                  className="text-xs font-semibold text-gray-500"
                >
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    placeholder="Confirm Password"
                    type={showConfirmPassword ? "text" : "password"}
                    className="h-12 rounded-xl pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <Button type="submit" className="h-12 w-full rounded-xl">
                Create Account
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
              Sign up with Google
            </Button>

            <p className="mt-5 text-center text-xs text-muted-foreground">
              Already have an account?{" "}
              <button className="font-bold text-black hover:underline">
                <Link href="/login">Sign In</Link>
              </button>
            </p>
          </section>
        </div>
      </div>
    </Card>
  );
}
