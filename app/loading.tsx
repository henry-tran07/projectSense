export default function Loading() {
  return (
    <div className="min-h-screen page-gradient flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-orange-200 border-t-orange-500 animate-spin" />
        <p className="font-display text-lg text-white/70">Loading...</p>
      </div>
    </div>
  );
}
