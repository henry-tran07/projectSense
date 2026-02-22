"use client";
import { useState, useEffect } from "react";
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import { auth } from "@/firebase/config";
import { useRouter } from "next/navigation";

export function useAuth(redirectTo?: string) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (!currentUser && redirectTo) {
        router.push(redirectTo);
      }
    });
    return () => unsubscribe();
  }, [redirectTo, router]);

  const logout = async () => {
    await signOut(auth);
    router.push("/");
  };

  return { user, loading, logout };
}
