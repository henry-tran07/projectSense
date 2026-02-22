"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";
import { Loader2 } from "lucide-react";

interface AuthFormProps {
  mode: "login" | "register";
  onSubmit: (email: string, password: string) => Promise<void>;
  onGoogleSignIn: () => Promise<void>;
  error: string | null;
}

export function AuthForm({ mode, onSubmit, onGoogleSignIn, error }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const isLogin = mode === "login";
  const title = isLogin ? "Login" : "Sign Up";
  const submitLabel = isLogin ? "Login" : "Sign Up";
  const googleLabel = isLogin ? "Sign In with Google" : "Sign Up with Google";
  const switchText = isLogin ? "Don't have an account?" : "Already have an account?";
  const switchHref = isLogin ? "/register" : "/";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError(null);

    if (!email.trim()) {
      setValidationError("Email is required.");
      return;
    }
    if (!password.trim()) {
      setValidationError("Password is required.");
      return;
    }

    setLoading(true);
    try {
      await onSubmit(email, password);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setValidationError(null);
    setLoading(true);
    try {
      await onGoogleSignIn();
    } finally {
      setLoading(false);
    }
  };

  const displayError = validationError || error;

  return (
    <Card className="glass-card w-full max-w-md p-1">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-3xl font-bold text-orange-700 tracking-tight">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 pt-2">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="h-11 bg-white/50 border-white/40 focus:bg-white/70 focus:border-orange-300 transition-all duration-200 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="h-11 bg-white/50 border-white/40 focus:bg-white/70 focus:border-orange-300 transition-all duration-200 rounded-xl"
            />
          </div>

          <div className="text-sm">
            <Link
              href={switchHref}
              className="text-orange-600 hover:text-orange-700 underline underline-offset-2 transition-colors"
            >
              {switchText}
            </Link>
          </div>

          {displayError && <p className="text-red-500 text-sm text-center">{displayError}</p>}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white text-base font-semibold h-12 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
            style={{ boxShadow: '0 4px 20px rgba(249, 115, 22, 0.35)' }}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait...
              </>
            ) : (
              submitLabel
            )}
          </Button>
        </form>

        <div className="flex items-center gap-3">
          <Separator className="flex-1 bg-gray-200/50" />
          <span className="text-xs text-gray-500 uppercase tracking-wider">or</span>
          <Separator className="flex-1 bg-gray-200/50" />
        </div>

        <Button
          type="button"
          variant="outline"
          disabled={loading}
          onClick={handleGoogleSignIn}
          className="w-full h-12 text-base font-medium gap-2 rounded-xl bg-white/50 border-white/40 hover:bg-white/70 transition-all duration-200"
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <FcGoogle className="h-5 w-5" />
          )}
          {googleLabel}
        </Button>
      </CardContent>
    </Card>
  );
}
