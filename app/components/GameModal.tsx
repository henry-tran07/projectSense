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

interface gameModalProps {}

export const GameModal: React.FC<gameModalProps> = () => {
  const router = useRouter();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="glass-button rounded-full h-10 w-10 flex items-center justify-center text-orange-600 hover:text-orange-700">
          <IoGameControllerOutline className="h-5 w-5" />
        </button>
      </DialogTrigger>

      <DialogContent className="w-[90%] max-w-md md:max-w-2xl rounded-2xl glass-card-elevated p-6">
        <DialogHeader className="text-center">
          <DialogTitle className="text-3xl md:text-5xl font-bold text-orange-700 text-center">
            Mini Games
          </DialogTitle>
          <DialogDescription className="sr-only">Choose a mini game to play</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <Button
            variant="ghost"
            className="w-full h-16 md:h-20 rounded-2xl glass-button text-orange-700 text-xl md:text-2xl font-semibold hover:scale-[1.02]"
            onClick={() => router.push("/zetamac")}
          >
            Zetamac
            <span className="text-sm font-normal text-orange-600/60 block">Speed arithmetic</span>
          </Button>
          <Button
            variant="ghost"
            className="w-full h-16 md:h-20 rounded-2xl glass-button text-orange-700 text-xl md:text-2xl font-semibold hover:scale-[1.02]"
            onClick={() => router.push("/twenty-four")}
          >
            24
            <span className="text-sm font-normal text-orange-600/60 block">Make 24 from 4 numbers</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
