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
        <button className="ml-5 md:text-5xl text-4xl hover:scale-110 ease-in-out duration-200">
          <IoMdSettings className="text-4xl text-orange-500 hover:text-orange-400" />
        </button>
      </DialogTrigger>

      <DialogContent className="w-[90vw] max-w-md sm:max-w-lg rounded-2xl glass-card p-6 bg-white/80">
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

        {/* Email display */}
        <p className="text-center text-sm md:text-base text-muted-foreground">
          Currently signed in as: {user?.email ?? ""}
        </p>

        {/* Sign out button */}
        <div className="flex justify-center">
          <Button
            variant="destructive"
            size="lg"
            onClick={logout}
            className="gap-2 text-base font-bold"
          >
            Sign out
            <TbLogout2 className="h-5 w-5" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
