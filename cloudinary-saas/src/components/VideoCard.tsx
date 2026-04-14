"use client";

import { useState, useRef } from "react";
import { getCldVideoUrl, getCldImageUrl } from "next-cloudinary";
import { Download, Clock, Files } from "lucide-react";

interface Video {
  id: string;
  title: string;
  description?: string | null;
  publicId: string;
  originalSize: string;
  compressedSize: string;
  duration: number | null;
  fileType: string;
}

export default function VideoCard({ video }: { video: Video }) {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Direct mp4 URL — Cloudinary auto-converts any format (MOV/AVI etc.)
  const previewUrl = getCldVideoUrl({
    src: video.publicId,
    width: 640,
    height: 360,
    rawTransformations: ["f_mp4", "q_auto:low"],
  });

  // Still thumbnail from video (first frame)
  const thumbnailUrl = getCldImageUrl({
    src: video.publicId,
    width: 400,
    height: 225,
    crop: "fill",
    gravity: "auto",
    format: "jpg",
    assetType: "video",
  });

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const downloadUrl = getCldVideoUrl({
    src: video.publicId,
    rawTransformations: ["fl_attachment", "f_mp4"],
  });

  const handleMouseEnter = () => {
    setIsHovered(true);
    videoRef.current?.play().catch(() => {});
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div
      className="card bg-base-200 shadow-xl overflow-hidden group border border-base-300 hover:border-primary/50 transition-all duration-300"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <figure className="relative aspect-video bg-black">
        {video.fileType === "video" ? (
          <>
            {/* Thumbnail — fades out on hover */}
            <img
              src={thumbnailUrl}
              alt={video.title}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                isHovered ? "opacity-0" : "opacity-100"
              }`}
            />

            {/* Video — always in DOM so it preloads; ref used to imperatively play/pause */}
            <video
              ref={videoRef}
              src={previewUrl}
              muted
              loop
              playsInline
              preload="metadata"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            />

            {/* Duration badge */}
            <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-[10px] text-white flex items-center gap-1 font-mono z-10">
              <Clock size={10} />
              {formatDuration(video.duration || 0)}
            </div>

            {/* Hover badge */}
            {isHovered && (
              <div className="absolute top-2 left-2 bg-primary/90 px-2 py-0.5 rounded text-[10px] text-primary-content font-bold uppercase tracking-wider z-10">
                ▶ Preview
              </div>
            )}
          </>
        ) : video.fileType === "image" ? (
          <img
            src={getCldImageUrl({ src: video.publicId, width: 400, height: 225, crop: "fill", assetType: "image" })}
            alt={video.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-base-300 gap-2">
            <Files size={40} className="text-base-content/20" />
            <span className="text-[10px] uppercase font-black tracking-widest text-base-content/40">PDF / Document</span>
          </div>
        )}
      </figure>

      <div className="card-body p-5">
        <h2 className="card-title text-base line-clamp-1">{video.title}</h2>
        <p className="text-xs text-base-content/60 line-clamp-2 min-h-[2rem]">
          {video.description || "No description provided"}
        </p>

        <div className="grid grid-cols-2 gap-2 mt-4 text-[10px] uppercase font-bold tracking-widest text-base-content/50">
          <div className="flex flex-col gap-1 border-r border-base-300">
            <span className="flex items-center gap-1"><Files size={12} /> Original</span>
            <span className="text-base-content text-xs">{video.originalSize}</span>
          </div>
          <div className="flex flex-col gap-1 pl-2">
            <span className="flex items-center gap-1 text-primary"><Files size={12} /> Optimized</span>
            <span className="text-primary text-xs">{video.compressedSize}</span>
          </div>
        </div>

        <div className="card-actions justify-end mt-4">
          <a
            href={downloadUrl}
            download={`${video.title}.mp4`}
            className="btn btn-primary btn-sm btn-circle shadow-lg shadow-primary/20 hover:scale-110 active:scale-95 transition-all"
          >
            <Download size={16} />
          </a>
        </div>
      </div>

      <div className="h-1 w-0 group-hover:w-full bg-primary transition-all duration-[8000ms] ease-linear" />
    </div>
  );
}
