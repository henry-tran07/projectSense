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
    <Card className="w-full max-w-md border-0 shadow-lg">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-3xl font-bold font-sans">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 pt-2">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="text-sm">
            <Link href={switchHref} className="text-orange-500 hover:text-orange-600 underline underline-offset-2">
              {switchText}
            </Link>
          </div>

          {displayError && (
            <p className="text-red-500 text-sm text-center">{displayError}</p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-400 hover:bg-orange-500 text-white text-base font-semibold h-11"
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
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground uppercase">or</span>
          <Separator className="flex-1" />
        </div>

        <Button
          type="button"
          variant="outline"
          disabled={loading}
          onClick={handleGoogleSignIn}
          className="w-full h-11 text-base font-medium gap-2"
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
