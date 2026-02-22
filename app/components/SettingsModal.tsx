"use client";

import { IoMdSettings } from "react-icons/io";
import { TbLogout2 } from "react-icons/tb";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface User {
  email: string | null;
}

interface SettingsModalProps {
  loading: boolean;
  rightLeft: boolean;
  updateUser: (userId: string, newData: Record<string, boolean>) => Promise<void>;
  user: User | null;
  setRightLeft: (value: boolean) => void;
  questionLimited: boolean;
  logout: () => void;
  setQuestionLimited: (value: boolean) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  loading,
  rightLeft,
  updateUser,
  user,
  setRightLeft,
  questionLimited,
  logout,
  setQuestionLimited,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="glass-button rounded-full h-10 w-10 flex items-center justify-center text-orange-600 hover:text-orange-700">
          <IoMdSettings className="h-5 w-5" />
        </button>
      </DialogTrigger>

      <DialogContent className="w-[90vw] max-w-md sm:max-w-lg rounded-2xl glass-card glass-card-elevated p-6 bg-white/80">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-700 text-center">
            Settings
          </DialogTitle>
          <DialogDescription className="sr-only">
            Configure your application settings
          </DialogDescription>
        </DialogHeader>

        <Separator className="my-1" />

        {loading ? (
          <div className="text-center text-lg py-4">Loading...</div>
        ) : (
          <div className="space-y-5 px-2 sm:px-6">
            <p className="text-xs uppercase tracking-wider text-orange-600/60 font-semibold px-2 sm:px-6">Gameplay</p>
            {/* Answer Right to Left toggle */}
            <div className="flex items-center justify-between">
              <Label
                htmlFor="right-to-left"
                className="text-base sm:text-lg md:text-xl font-medium cursor-pointer"
              >
                Answer Right to Left
              </Label>
              <Switch
                id="right-to-left"
                checked={rightLeft}
                onCheckedChange={(checked) => {
                  updateUser(user?.email ?? "", { rightLeft: checked });
                  setRightLeft(checked);
                }}
              />
            </div>

            {/* Infinite Questions toggle */}
            <div className="flex items-center justify-between">
              <Label
                htmlFor="infinite-questions"
                className="text-base sm:text-lg md:text-xl font-medium cursor-pointer"
              >
                Infinite Questions
              </Label>
              <Switch
                id="infinite-questions"
                checked={!questionLimited}
                onCheckedChange={(checked) => {
                  updateUser(user?.email ?? "", { questionLimited: !checked });
                  setQuestionLimited(!checked);
                }}
              />
            </div>
          </div>
        )}

        <Separator className="my-1" />

        <p className="text-xs uppercase tracking-wider text-orange-600/60 font-semibold">Account</p>

        {/* Email display */}
        <p className="text-center text-sm md:text-base text-muted-foreground">
          Currently signed in as: {user?.email ?? ""}
        </p>

        {/* Sign out button */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="lg"
            onClick={logout}
            className="gap-2 text-base font-bold text-orange-700 border-orange-300 hover:bg-orange-50"
          >
            Sign out
            <TbLogout2 className="h-5 w-5" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
