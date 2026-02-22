"use client";
import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { UserSettings } from "@/app/types";

const DEFAULT_SETTINGS: UserSettings = {
  questionLimited: true,
  rightLeft: false,
  autoEnter: true,
};

export function useSettings(userEmail: string | null) {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userEmail) {
      setLoading(false);
      return;
    }
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, "users", userEmail);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSettings({ ...DEFAULT_SETTINGS, ...docSnap.data() as Partial<UserSettings> });
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [userEmail]);

  const updateSetting = async (key: keyof UserSettings, value: boolean) => {
    if (!userEmail) return;
    try {
      const docRef = doc(db, "users", userEmail);
      await updateDoc(docRef, { [key]: value });
      setSettings((prev) => ({ ...prev, [key]: value }));
    } catch (error) {
      console.error("Failed to update setting:", error);
    }
  };

  return { settings, loading, updateSetting };
}
