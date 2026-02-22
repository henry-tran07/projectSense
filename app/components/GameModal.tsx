"use client";

import React from "react";
import { IoGameControllerOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface gameModalProps {}

export const GameModal: React.FC<gameModalProps> = () => {
  const router = useRouter();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="hover:text-orange-400 text-4xl md:text-5xl mr-5 hover:scale-110 ease-in-out duration-200">
          <IoGameControllerOutline className="text-3xl md:text-4xl hover:text-orange-400 text-orange-300" />
        </button>
      </DialogTrigger>

      <DialogContent className="w-[90%] max-w-md md:max-w-2xl rounded-2xl glass-card bg-orange-500/40 p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-2 text-center">
          <DialogTitle className="text-3xl md:text-5xl font-bold text-orange-700 text-center">
            Mini Games
          </DialogTitle>
          <DialogDescription className="sr-only">Choose a mini game to play</DialogDescription>
          <Separator className="mx-auto w-2/3 bg-orange-300/50 mt-2" />
        </DialogHeader>

        <div className="flex flex-col gap-4 px-6 pb-8 pt-2">
          <Button
            variant="ghost"
            className="w-full h-16 md:h-20 rounded-2xl glass-button text-orange-700 text-xl md:text-2xl font-semibold hover:scale-[1.02]"
            onClick={() => router.push("/zetamac")}
          >
            Zetamac
          </Button>
          <Button
            variant="ghost"
            className="w-full h-16 md:h-20 rounded-2xl glass-button text-orange-700 text-xl md:text-2xl font-semibold hover:scale-[1.02]"
            onClick={() => router.push("/twenty-four")}
          >
            24
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
