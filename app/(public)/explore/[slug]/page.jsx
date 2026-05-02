"use client"

import EventCard from '@/components/event-card';
import { useConvexQuery } from '@/hooks/use-convex-query';
import { CATEGORIES } from '@/lib/data';
import { parseLocationSlug } from '@/lib/locations-utils';
import { notFound, useParams, useRouter } from 'next/navigation';

const DynamicExplorePage = () => {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug;

  // Check if category is valid
  const categoryInfo = CATEGORIES.find((cat) => cat.id == slug);
  const isCategory = !!categoryInfo;

  // if not a category, validate location
  const { city, state, isValid } = !isCategory
    ? parseLocationSlug(slug)
    : { city: null, state: null, isValid: true };

  // if not valid category and location
  if(!isCategory && !isValid){
    notFound();
  }

  const {data: events, isLoading} = useConvexQuery(
    isCategory
      ? api.explore.getEventsByCategory
      : api.explore.getEventsByLocation,
    isCategory 
    ? { category: slug, limit: 50 }
    : city && state
      ? { city, state, limit: 50}
      : "skip"
  )

  const handleEventClick = (eventSlug) => {
    router.push(`/events/${eventSlug}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if(isCategory){
    return (
      <>
        <div className='pb-5'>
          <div className='flex items-center gap-4 mb-4'>
            <div className='text-6xl'>{categoryInfo.icon}</div>
            <div>
              <h1 className='text-5xl md:text-6xl font-bold'>
                {categoryInfo.label}
              </h1>
              <p className='text-lg text-muted-foreground mt-2'>
                {categoryInfo.description}
              </p>
            </div>
          </div>

          {events && events.length > 0 && (
            <p className='text-muted-foreground'>
              {events.length} event{events.length !== 1 ? "s": ""}
            </p>
          )}
        </div>
        
        {events && events.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {events.map((event) => (
                <EventCard 
                  key={event._id}
                  event={event}
                  onClick={() => handleEventClick(event.slug)}
                />
              ))}
            </div>
          ) : (
            <p className='text-muted-foreground'>
              No events found in this category
            </p>
          )}
      </>
    )
  }

  return (
    <div>DynamicExplorePage</div>
  )
}

export default DynamicExplorePage