
export default function ShopLoading() {
  return (
    <>
      <main className="container mx-auto px-4 pt-36 pb-24">
        <div className="text-center mb-8">
          <div className="skeleton h-12 w-64 mx-auto mb-4" />
          <div className="skeleton h-5 w-48 mx-auto" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border border-border">
              <div className="skeleton aspect-[3/4]" />
              <div className="p-4 space-y-2">
                <div className="skeleton h-5 w-3/4" />
                <div className="skeleton h-6 w-16" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
