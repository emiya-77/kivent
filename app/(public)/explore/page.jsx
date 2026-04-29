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

  return <div>ExplorePage</div>
}

export default ExplorePage