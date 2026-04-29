"use client"

import { api } from "@/convex/_generated/api"
import { useConvexQuery } from "@/hooks/use-convex-query"

const ExplorePage = () => {
  // Fetch current user for location
  const {data: currentUser} = useConvexQuery(api.users.getCurrentUser);

  const {data: featuredEvents, isLoading: loadingFeatured} = useConvexQuery(
    api.explore.getFeatureEvents,
    {limit: 3}
  );

  const {data: localEvents, isLoading: loadingLocal} = useConvexQuery(
    api.explore.getEventsByLocation,
    {
      city: currentUser?.location?.city || "Dhaka",
      state: currentUser?.location?.state || "Dhaka",
      limit: 4,
    }
  );

  const {data: popularEvents, isLoading: loadingPopular} = useConvexQuery(
    api.explore.getPopularEvents,
    {limit: 6}
  );

  const {data: categoryCounts} = useConvexQuery(
    api.explore.getCategoryCounts
  );

  return (
    <>
      <div className="pb-12 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">Discover Events</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Explore featured events, find what&apos;s happening locally, or browse events across Bangladesh
        </p>
      </div>

      {/* Featured Carousel */}

      {/* Local Events */}

      {/* Browse by Category */}

      {/* Popular Events */}

      {/* Empty State */}
    </>
  );
}

export default ExplorePage