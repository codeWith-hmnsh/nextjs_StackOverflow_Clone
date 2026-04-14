"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileVideo, CheckCircle2, AlertCircle, Loader2, LogIn } from "lucide-react";
import { SignInButton, useAuth } from "@clerk/nextjs";

export default function VideoUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();

  const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) return;

    if (file.size > MAX_FILE_SIZE) {
      setError("File size too large. Max size is 100MB.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      // Step 1: Get a signed upload signature from our server
      const sigResponse = await fetch("/api/cloudinary-sign");
      if (!sigResponse.ok) throw new Error("Failed to get upload signature");
      const { signature, timestamp, folder, cloudName, apiKey } = await sigResponse.json();

      // Step 2: Determine resource type
      let resourceType = "video";
      let fileType = "video";
      if (file.type.startsWith("image/")) {
        resourceType = "image";
        fileType = "image";
      } else if (file.type === "application/pdf") {
        resourceType = "raw";
        fileType = "pdf";
      }

      // Step 3: Upload DIRECTLY to Cloudinary (bypasses Next.js entirely)
      const cloudinaryFormData = new FormData();
      cloudinaryFormData.append("file", file);
      cloudinaryFormData.append("api_key", apiKey);
      cloudinaryFormData.append("timestamp", timestamp.toString());
      cloudinaryFormData.append("signature", signature);
      cloudinaryFormData.append("folder", folder);

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
        {
          method: "POST",
          body: cloudinaryFormData,
        }
      );

      if (!uploadResponse.ok) {
        const errData = await uploadResponse.json();
        throw new Error(errData.error?.message || "Cloudinary upload failed");
      }

      const result = await uploadResponse.json();

      setUploadProgress(90);

      // Step 4: Save metadata to our database (tiny JSON payload — no size issues)
      const saveResponse = await fetch("/api/video-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publicId: result.public_id,
          title,
          description,
          originalSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
          compressedSize: `${(result.bytes / (1024 * 1024)).toFixed(2)} MB`,
          duration: result.duration || 0,
          fileType,
        }),
      });

      if (!saveResponse.ok) {
        const errData = await saveResponse.json();
        throw new Error(errData.details || "Failed to save media record");
      }

      setUploadProgress(100);
      router.push("/");
    } catch (err: any) {
      console.error("Upload failed:", err);
      setError(err.message || "Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10">
      <div className="mb-12">
        <h1 className="text-4xl font-black mb-2 tracking-tight">Upload Video</h1>
        <p className="text-base-content/60">Share your videos with the world. Smart previews are auto-generated.</p>
      </div>

      <div className="card bg-base-200 border border-base-300 overflow-visible">
        <div className="card-body p-8">
          {(!isLoaded || !isSignedIn) ? (
            <div className="text-center py-10 flex flex-col items-center justify-center gap-4">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-2">
                <Upload size={40} />
              </div>
              <h2 className="text-2xl font-bold">Authentication Required</h2>
              <p className="text-base-content/60 max-w-md mx-auto mb-6">
                You must be signed in to upload media to the platform.
              </p>
              <SignInButton mode="modal">
                <button className="btn btn-primary rounded-xl px-10 gap-2">
                  <LogIn size={20} />
                  Sign In to Upload
                </button>
              </SignInButton>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* File Drop Zone */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold uppercase tracking-widest text-[10px] text-base-content/50">Video File</span>
                </label>
                <div
                  className={`relative border-2 border-dashed rounded-2xl p-10 transition-all text-center ${
                    file ? "border-primary/50 bg-primary/5" : "border-base-300 hover:border-primary/30 hover:bg-base-300"
                  }`}
                >
                  <input
                    type="file"
                    accept="video/*,image/*,application/pdf"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    required
                  />
                  <div className="flex flex-col items-center">
                    {file ? (
                      <>
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 text-primary">
                          {file.type.startsWith("video/") ? <FileVideo size={32} /> : file.type.startsWith("image/") ? <Upload size={32} /> : <AlertCircle size={32} />}
                        </div>
                        <span className="font-bold text-sm mb-1">{file.name}</span>
                        <span className="text-xs text-base-content/50">{(file.size / (1024 * 1024)).toFixed(2)} MB / 100MB MAX</span>
                      </>
                    ) : (
                      <>
                        <div className="w-16 h-16 bg-base-300 rounded-2xl flex items-center justify-center mb-4 text-base-content/40">
                          <Upload size={32} />
                        </div>
                        <p className="text-sm font-bold mb-1">Click to browse or drag and drop</p>
                        <p className="text-xs text-base-content/50">Video, Image, or PDF (Max 100MB)</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Title & Description */}
              <div className="grid grid-cols-1 gap-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-bold uppercase tracking-widest text-[10px] text-base-content/50">Title</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="A catchy title for your video"
                    className="input input-bordered focus:input-primary rounded-xl"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-bold uppercase tracking-widest text-[10px] text-base-content/50">Description</span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tell us more about this video"
                    className="textarea textarea-bordered focus:textarea-primary rounded-xl min-h-[120px] resize-none"
                  />
                </div>
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-base-content/60 font-bold">
                    <span>Uploading to Cloudinary…</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <progress className="progress progress-primary w-full" value={uploadProgress} max="100" />
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="alert alert-error bg-error/10 border-error/20 text-error flex gap-3 text-xs font-bold py-3 rounded-xl">
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="btn btn-ghost rounded-xl px-8"
                  disabled={isUploading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading || !file || !title}
                  className="btn btn-primary rounded-xl px-12 shadow-lg shadow-primary/20"
                >
                  {isUploading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={18} />
                      Confirm Upload
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
