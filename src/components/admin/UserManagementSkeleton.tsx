export default function UserManagementSkeleton() {
  return (
    <div className="min-h-screen bg-lightwhite">
      {/* Header Section Skeleton */}
      <div className="bg-lightwhite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-4">
            <div>
              <div className="h-6 sm:h-8 bg-lightaccentwhite rounded-lg w-48 sm:w-64 mb-2 animate-pulse"></div>
              <div className="h-3 sm:h-4 bg-lightaccentwhite rounded-lg w-72 sm:w-96 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              className="bg-lightwhite border border-lightaccentwhite rounded-xl p-6"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-lightaccentwhite rounded-xl animate-pulse">
                  <div className="h-6 w-6 bg-lightaccentwhite rounded animate-pulse"></div>
                </div>
                <div className="flex-1">
                  <div className="h-8 bg-lightaccentwhite rounded-lg w-12 mb-2 animate-pulse"></div>
                  <div className="h-4 bg-lightaccentwhite rounded-lg w-24 animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table Skeleton */}
        <div className="bg-lightwhite border border-lightaccentwhite rounded-xl shadow-sm overflow-hidden hidden md:block">
          {/* Table Header Skeleton */}
          <div className="px-6 py-4 border-b border-lightaccentwhite bg-lightwhite">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-6 bg-lightaccentwhite rounded-lg w-32 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Table Headers Skeleton */}
          <div className="px-6 py-4 border-b border-lightaccentwhite bg-lightwhite">
            <div className="grid grid-cols-5 gap-6">
              <div className="h-4 bg-lightaccentwhite rounded w-16 animate-pulse"></div>
              <div className="h-4 bg-lightaccentwhite rounded w-20 animate-pulse"></div>
              <div className="h-4 bg-lightaccentwhite rounded w-24 animate-pulse"></div>
              <div className="h-4 bg-lightaccentwhite rounded w-16 animate-pulse"></div>
              <div className="h-4 bg-lightaccentwhite rounded w-16 animate-pulse"></div>
            </div>
          </div>

          {/* Table Rows Skeleton */}
          <div className="divide-y divide-lightaccentwhite">
            {[1, 2, 3, 4, 5].map((index) => (
              <div key={index} className="px-6 py-4">
                <div className="grid grid-cols-5 gap-6 items-center">
                  {/* User Info */}
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 bg-lightaccentwhite rounded-full animate-pulse"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-lightaccentwhite rounded-lg w-32 mb-2 animate-pulse"></div>
                      <div className="h-3 bg-lightaccentwhite rounded-lg w-40 animate-pulse"></div>
                    </div>
                  </div>

                  {/* Current Role */}
                  <div className="h-6 bg-lightaccentwhite rounded-full w-20 animate-pulse"></div>

                  {/* Role Selector */}
                  <div className="h-10 bg-lightaccentwhite rounded-lg w-32 animate-pulse"></div>

                  {/* Registration Date */}
                  <div className="h-4 bg-lightaccentwhite rounded-lg w-24 animate-pulse"></div>

                  {/* Actions */}
                  <div className="flex justify-center">
                    <div className="h-8 w-8 bg-lightaccentwhite rounded-lg animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Cards Skeleton */}
        <div className="md:hidden space-y-4">
          {/* Mobile Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="h-6 bg-lightaccentwhite rounded-lg w-40 animate-pulse"></div>
            </div>
            <div className="h-5 w-5 bg-lightaccentwhite rounded-full animate-pulse"></div>
          </div>

          {/* Mobile Cards */}
          {[1, 2, 3, 4].map((index) => (
            <div
              key={index}
              className="bg-lightwhite border border-lightaccentwhite rounded-xl p-4 space-y-4"
            >
              {/* User Info */}
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-lightaccentwhite rounded-full animate-pulse"></div>
                <div className="flex-1 min-w-0">
                  <div className="h-4 bg-lightaccentwhite rounded-lg w-32 mb-2 animate-pulse"></div>
                  <div className="h-3 bg-lightaccentwhite rounded-lg w-40 animate-pulse"></div>
                </div>
                <div className="h-8 w-8 bg-lightaccentwhite rounded-lg animate-pulse"></div>
              </div>

              {/* Role and Actions */}
              <div className="grid grid-cols-1 gap-4">
                {/* Current Role */}
                <div>
                  <div className="h-3 bg-lightaccentwhite rounded w-16 mb-2 animate-pulse"></div>
                  <div className="h-6 bg-lightaccentwhite rounded-full w-20 animate-pulse"></div>
                </div>

                {/* Role Selector */}
                <div>
                  <div className="h-3 bg-lightaccentwhite rounded w-20 mb-2 animate-pulse"></div>
                  <div className="h-10 bg-lightaccentwhite rounded-lg w-full animate-pulse"></div>
                </div>

                {/* Registration Date */}
                <div>
                  <div className="h-3 bg-lightaccentwhite rounded w-24 mb-1 animate-pulse"></div>
                  <div className="h-4 bg-lightaccentwhite rounded-lg w-20 animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
