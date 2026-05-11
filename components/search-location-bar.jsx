"use client"

import { api } from "@/convex/_generated/api";
import { useConvexMutation, useConvexQuery } from "@/hooks/use-convex-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SearchLocationBar = () => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [showSearchResults, setShowSearchResults] = useState(false);
    const searchRef = useRef(null);

    const { data: currentUser, isLoading } = useConvexQuery(
        api.users.getCurrentUser
    );
    const { mutate: updateLocation } = useConvexMutation(
        api.users.completeOnboarding
    );

    return (
        <div>SearchLocationBar</div>
    )
}

export default SearchLocationBar;