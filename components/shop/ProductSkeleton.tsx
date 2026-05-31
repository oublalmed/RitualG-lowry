export function ProductSkeleton() {
  return (
    <article className="flex flex-col animate-pulse">
      <div className="aspect-[3/4] w-full bg-gradient-to-br from-[#F5EDE0] to-[#EDE0CF] rounded-sm" />
      <div className="pt-4 space-y-2">
        <div className="h-2.5 w-16 bg-[#C9A875]/30 rounded" />
        <div className="h-4 w-3/4 bg-[#3D2B1F]/10 rounded" />
        <div className="h-3 w-full bg-[#3D2B1F]/8 rounded" />
        <div className="flex gap-2 mt-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-3 w-3 bg-[#C9A875]/20 rounded-full" />
          ))}
        </div>
        <div className="h-4 w-24 bg-[#3D2B1F]/10 rounded" />
      </div>
    </article>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }, (_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}
