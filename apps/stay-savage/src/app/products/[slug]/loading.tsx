
export default function ProductLoading() {
  return (
    <>
      <main className="container mx-auto px-4 pt-36 pb-24">
        <div className="skeleton h-4 w-48 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div>
            <div className="skeleton aspect-[3/4] mb-3" />
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="skeleton aspect-square" />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="skeleton h-10 w-3/4" />
            <div className="skeleton h-4 w-32" />
            <div className="skeleton h-8 w-20" />
            <div className="skeleton h-20 w-full" />
            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="skeleton h-12 w-16" />
              ))}
            </div>
            <div className="skeleton h-14 w-full" />
          </div>
        </div>
      </main>
    </>
  );
}
