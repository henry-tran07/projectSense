"use client";

import React from "react";
import MathComponent from "./MathComponent";
import { problemSet } from "../utils/problemGenerator";
import { videoMap } from "../utils/problemGenerator";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface videoModalProps {
  trick: number;
}

export const VideoModal: React.FC<videoModalProps> = ({ trick }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="hover:scale-105 hover:bg-orange-500 flex font-extrabold md:w-1/4 w-1/2 justify-center text-center items-center mt-auto h-full duration-200 ease-in-out text-4xl align-baseline text-white rounded-r-2xl bg-orange-400 p-4">
          ?
        </button>
      </DialogTrigger>

      <DialogContent className="w-[90%] max-w-md md:max-w-3xl rounded-xl p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-2 text-center">
          <DialogTitle className="text-2xl md:text-4xl font-semibold text-orange-500 underline text-center">
            <MathComponent math={problemSet[Number(trick)]} />
          </DialogTitle>
          <DialogDescription className="sr-only">Tutorial video for this trick</DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-6">
          <div
            className="relative w-full"
            style={{
              paddingBottom: "56.25%",
              height: 0,
              overflow: "hidden",
              background: "#000",
            }}
          >
            <video
              controls
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
              }}
            >
              <source src={`/project sense vids/${videoMap[trick]}`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
