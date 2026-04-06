"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleLikeAction } from "../lib/appwrite/likeActions";
import { useRouter } from "next/navigation";

interface LikeButtonProps {
  documentId: string;
  collectionId: string;
  initialLikes: string[];
  userId: string | null;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function LikeButton({
  documentId,
  collectionId,
  initialLikes = [],
  userId,
  className,
  size = "md",
}: LikeButtonProps) {
  const [likes, setLikes] = useState<string[]>(initialLikes);
  const [isLiking, setIsLiking] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(userId);
  const router = useRouter();

  useEffect(() => {
    if (!userId) {
      import("../lib/appwrite/config").then(({ account }) => {
        account.get()
          .then((user) => setCurrentUserId(user.$id))
          .catch(() => setCurrentUserId(null));
      });
    }
  }, [userId]);

  const isLiked = currentUserId ? likes.includes(currentUserId) : false;
  const count = likes.length;

  const handleToggleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUserId) {
      router.push("/login");
      return;
    }

    if (isLiking) return;

    setIsLiking(true);

    // Optimistic UI Update
    const newLikes = isLiked
      ? likes.filter((id) => id !== currentUserId)
      : [...likes, currentUserId];
    setLikes(newLikes);

    const result = await toggleLikeAction({
      documentId,
      collectionId,
      userId: currentUserId,
    });

    if (!result.success) {
      // Revert if failed
      setLikes(likes);
      console.error(result.error);
    } else {
      router.refresh(); // Sync potential changes from others
    }

    setIsLiking(false);
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-base",
    lg: "text-2xl",
  };

  return (
    <button
      onClick={handleToggleLike}
      disabled={isLiking}
      className={cn(
        "flex flex-col items-center gap-1 group transition-all duration-300 active:scale-90",
        className
      )}
      title={isLiked ? "Unlike" : "Like"}
    >
      <div
        className={cn(
          "flex items-center justify-center rounded-2xl border-2 transition-all shadow-sm",
          size === "lg" ? "w-12 h-12" : size === "md" ? "w-10 h-10" : "w-8 h-8",
          isLiked
            ? "border-red-200 bg-red-50 text-red-500 shadow-red-100/50"
            : "border-gray-100 bg-white text-gray-300 hover:border-red-100 hover:text-red-300"
        )}
      >
        <Heart
          className={cn(
            iconSizes[size],
            isLiked && "fill-current scale-110",
            "transition-transform group-hover:scale-110"
          )}
        />
      </div>
      <span
        className={cn(
          "font-black tracking-tight",
          textSizes[size],
          isLiked ? "text-red-500" : "text-gray-900"
        )}
      >
        {count}
      </span>
    </button>
  );
}
