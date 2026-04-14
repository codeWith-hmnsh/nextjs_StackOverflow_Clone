"use client";

import { useState, useRef } from "react";
import { CldImage, getCldImageUrl } from "next-cloudinary";
import { Download, Share2, Image as ImageIcon, CheckCircle2, Loader2, Maximize2 } from "lucide-react";

// Social media formats
const SOCIAL_FORMATS = {
  "Instagram Post (1:1)": { width: 1080, height: 1080, aspectRatio: "1:1" },
  "Instagram Portrait (4:5)": { width: 1080, height: 1350, aspectRatio: "4:5" },
  "Instagram Stories (9:16)": { width: 1080, height: 1920, aspectRatio: "9:16" },
  "Twitter Post (16:9)": { width: 1200, height: 675, aspectRatio: "16:9" },
  "Twitter Header (3:1)": { width: 1500, height: 500, aspectRatio: "3:1" },
  "Facebook Cover (205:78)": { width: 820, height: 312, aspectRatio: "205:78" },
};

type SocialFormat = keyof typeof SOCIAL_FORMATS;

export default function SocialSharePage() {
  const [selectedFormat, setSelectedFormat] = useState<SocialFormat>("Instagram Post (1:1)");
  const [isUploading, setIsUploading] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const [publicId, setPublicId] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "social-share"); // You might need to create this preset on Cloudinary

    try {
      // For simplicity in this demo, we'll use an unsigned upload or the same upload API logic.
      // But here we'll just simulate getting a publicId after upload.
      // In a real app, you'd call your API.
      const response = await fetch("/api/image-upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setPublicId(data.publicId);
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = () => {
    if (!publicId) return;

    // Generate accurate Cloudinary URL utilizing correct cropping mechanisms
    const url = getCldImageUrl({
      width: SOCIAL_FORMATS[selectedFormat].width,
      height: SOCIAL_FORMATS[selectedFormat].height,
      src: publicId,
      crop: "fill",
      gravity: "auto",
      format: "png",
      rawTransformations: ["fl_attachment"], 
    });

    // Create a temporary anchor element and force download
    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedFormat.replace(/\s+/g, "_").toLowerCase()}.png`;
    
    // Fallback: Using _blank allows browsers that aggressively block attachments to open it in a new window to save
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto py-10">
      <div className="mb-12">
        <h1 className="text-4xl font-black mb-2 tracking-tight">Social Media Image Creator</h1>
        <p className="text-base-content/60">Generate perfectly sized images for all social platforms instantly.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Controls */}
        <div className="space-y-8">
          <div className="card bg-base-200 border border-base-300">
            <div className="card-body p-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-base-content/50 mb-4">1. Choose Image</h3>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileUpload}
                className="file-input file-input-bordered file-input-primary w-full rounded-xl" 
                disabled={isUploading}
              />
            </div>
          </div>

          <div className="card bg-base-200 border border-base-300">
            <div className="card-body p-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-base-content/50 mb-4">2. Select Platform</h3>
              <div className="form-control w-full">
                <select 
                  className="select select-bordered focus:select-primary rounded-xl"
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value as SocialFormat)}
                >
                  {Object.keys(SOCIAL_FORMATS).map((format) => (
                    <option key={format} value={format}>{format}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {publicId && (
            <button 
              onClick={handleDownload}
              className="btn btn-primary w-full rounded-xl shadow-lg shadow-primary/20 gap-2 h-14"
            >
              <Download size={20} />
              Download for {selectedFormat}
            </button>
          )}
        </div>

        {/* Preview Area */}
        <div className="lg:col-span-2">
          <div className="card bg-base-200 border border-base-300 min-h-[500px] flex items-center justify-center p-8 overflow-hidden relative">
            <div className="absolute top-4 left-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-base-content/30">
              <Maximize2 size={14} />
              Live AI Preview
            </div>

            {!publicId ? (
              <div className="text-center opacity-40">
                <div className="w-20 h-20 bg-base-300 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <ImageIcon size={40} />
                </div>
                <p className="font-bold">Upload an image to get started</p>
                <p className="text-xs">AI will handle the cropping and resizing</p>
              </div>
            ) : (
              <div className="relative group max-w-full max-h-full">
                {isTransforming && (
                  <div className="absolute inset-0 z-10 bg-base-200/50 backdrop-blur-sm flex items-center justify-center rounded-2xl">
                    <Loader2 className="animate-spin text-primary" size={40} />
                  </div>
                )}
                <div className="shadow-2xl shadow-black/40 rounded-lg overflow-hidden border-4 border-base-300 bg-black">
                  <CldImage
                    width={SOCIAL_FORMATS[selectedFormat].width}
                    height={SOCIAL_FORMATS[selectedFormat].height}
                    src={publicId}
                    sizes="100vw"
                    alt="Social Media Preview"
                    crop="fill"
                    gravity="auto"
                    onLoadingComplete={() => setIsTransforming(false)}
                    onLoad={() => setIsTransforming(false)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
