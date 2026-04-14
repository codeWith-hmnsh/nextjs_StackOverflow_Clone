import prisma from "@/lib/prisma";
import VideoCard from "@/components/VideoCard";
import { VideoOff, Lock, LogIn } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { SignInButton } from "@clerk/nextjs";

export default async function HomePage() {
  const { userId } = await auth();

  // If no user is logged in, show an empty state instantly securely
  if (!userId) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-black tracking-tight mb-2">My Library</h1>
            <p className="text-base-content/60">Sign in to manage and preview your uploaded media assets.</p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-base-300 rounded-3xl bg-base-200/50">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 text-primary">
            <Lock size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">Sign in to view your library</h3>
          <p className="text-base-content/60 mb-6 font-medium max-w-sm text-center">Your uploaded videos, images, and documents are securely kept private.</p>
          <SignInButton mode="modal">
            <button className="btn btn-primary rounded-xl px-10 gap-2 shadow-lg shadow-primary/20">
              <LogIn size={20} />
              Sign In Now
            </button>
          </SignInButton>
        </div>
      </div>
    );
  }

  // Fetch only the strictly owned videos for the logged-in user
  const videos = await prisma.video.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">My Library</h1>
          <p className="text-base-content/60">Manage and preview your uploaded media assets.</p>
        </div>
        <div className="badge badge-primary badge-outline font-mono py-3 font-bold">
          {videos.length} Assets Found
        </div>
      </div>

      {videos.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-base-300 rounded-3xl bg-base-200/50">
          <div className="w-16 h-16 bg-base-300 rounded-2xl flex items-center justify-center mb-4 text-base-content/40">
            <VideoOff size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">No videos found</h3>
          <p className="text-base-content/60 mb-6">Upload your first video to see it here!</p>
          <a href="/video-upload" className="btn btn-primary">
            Upload Video
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((video: any) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}
