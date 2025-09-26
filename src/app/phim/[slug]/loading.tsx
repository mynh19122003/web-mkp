export default function Loading() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section Skeleton */}
      <div className="relative h-screen">
        <div className="absolute inset-0 bg-gray-900 animate-pulse" />
        
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-3xl">
              {/* Title Skeleton */}
              <div className="h-16 bg-gray-800 rounded animate-pulse mb-4" />
              
              {/* Subtitle Skeleton */}
              <div className="h-6 bg-gray-800 rounded animate-pulse mb-4 w-2/3" />

              {/* Info Skeleton */}
              <div className="flex gap-4 mb-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-6 w-20 bg-gray-800 rounded animate-pulse" />
                ))}
              </div>

              {/* Genres Skeleton */}
              <div className="flex gap-2 mb-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-8 w-24 bg-gray-800 rounded-full animate-pulse" />
                ))}
              </div>

              {/* Description Skeleton */}
              <div className="space-y-2 mb-8">
                <div className="h-4 bg-gray-800 rounded animate-pulse" />
                <div className="h-4 bg-gray-800 rounded animate-pulse w-4/5" />
                <div className="h-4 bg-gray-800 rounded animate-pulse w-3/5" />
              </div>

              {/* Buttons Skeleton */}
              <div className="flex gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-12 w-32 bg-gray-800 rounded animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section Skeleton */}
      <div className="relative z-20 bg-black -mt-32 pt-32">
        <div className="container mx-auto px-4 lg:px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content Skeleton */}
            <div className="lg:col-span-2">
              <div className="h-8 bg-gray-800 rounded animate-pulse mb-6 w-1/3" />
              <div className="bg-gray-900 rounded-lg p-6 mb-12">
                <div className="grid grid-cols-8 gap-3">
                  {[...Array(16)].map((_, i) => (
                    <div key={i} className="h-12 bg-gray-800 rounded animate-pulse" />
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Skeleton */}
            <div className="lg:col-span-1">
              <div className="bg-gray-900 rounded-lg p-6">
                <div className="h-6 bg-gray-800 rounded animate-pulse mb-6 w-2/3" />
                <div className="space-y-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i}>
                      <div className="h-4 bg-gray-800 rounded animate-pulse mb-1 w-1/2" />
                      <div className="h-5 bg-gray-700 rounded animate-pulse w-3/4" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}