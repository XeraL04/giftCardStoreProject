export function AuthFooter() {
  return (
    <footer className="bg-white/80 backdrop-blur-md border-t border-blue-100 mt-20 shadow-inner">
      {/* Accent underline */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-fuchsia-400 to-purple-600"></div>
      
      {/* Content */}
      <div className="container mx-auto max-w-7xl text-center py-5 px-4">
        <p className="text-gray-500 text-xs">
          &copy; {new Date().getFullYear()}{" "}
          <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-fuchsia-500">
            ArcVerse
          </span>
          . Customer Area.
        </p>
      </div>
    </footer>
  );
}
