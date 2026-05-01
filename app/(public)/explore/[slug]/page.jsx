"use client"

import { CATEGORIES } from '@/lib/data';
import { parseLocationSlug } from '@/lib/locations-utils';
import { useParams, useRouter } from 'next/navigation';

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

  return (
    <div>DynamicExplorePage</div>
  )
}

export default DynamicExplorePage