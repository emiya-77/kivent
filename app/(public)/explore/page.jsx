"use client"

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { api } from "@/convex/_generated/api"
import { useConvexQuery } from "@/hooks/use-convex-query"
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef } from "react";

const ExplorePage = () => {
  // Fetch current user for location
  const {data: currentUser} = useConvexQuery(api.users.getCurrentUser);
  const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));
  const router = useRouter();

  const {data: featuredEvents, isLoading: loadingFeatured} = useConvexQuery(
    api.explore.getFeatureEvents,
    {limit: 3}
  );

  console.log("Featured Events:", featuredEvents);

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

  const handleEventClick = (slug) => {
    router.push(`/explore/${slug}`);
  }

  return (
    <>
      <div className="pb-12 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">Discover Events</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Explore featured events, find what&apos;s happening locally, or browse events across Bangladesh
        </p>
      </div>

      {/* Featured Carousel */}
      {featuredEvents && featuredEvents.length > 0 && 
        <div className="mb-16">
          <Carousel
            className="w-full" 
            plugins={[plugin.current]}
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
          >
            <CarouselContent>
              {featuredEvents.map((event) => (
                <CarouselItem key={event._id}>
                  <div 
                    onClick={() => handleEventClick(event.slug)}
                    className="relative h-100 rounded-xl overflow-hidden cursor-pointer"
                  >
                    {event.coverImage ? (
                      <Image 
                        src={event.coverImage}
                        alt={event.title}
                        fill
                        className="object-cover"
                        priority
                      />
                    ) : (
                      <div 
                        className="absolute inset-0"
                        style={{
                          backgroundColor: event.themeColor
                        }}
                      />
                    )}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      }

      {/* Local Events */}

      {/* Browse by Category */}

      {/* Popular Events */}

      {/* Empty State */}
    </>
  );
}

export default ExplorePage