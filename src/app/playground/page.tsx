
// src/app/playground/page.tsx

export default function PlaygroundPage() {
  // This page is no longer in use and can be safely deleted.
  // Returning null or a minimal component to effectively remove its functionality.
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.warn("The /playground page is deprecated and will be removed or made non-functional. Please remove any links to it.");
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground justify-center items-center">
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold text-primary mb-4">Playground Removed</h1>
        <p className="text-foreground/70">
          This Playground page is no longer in use.
        </p>
      </div>
    </div>
  );
}
