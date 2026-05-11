/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { api } from "@/convex/_generated/api";
import { useConvexMutation, useConvexQuery } from "@/hooks/use-convex-query";
import { districts_en, divisions_en } from "bangladesh-location-data";
import { Calendar, Loader2, MapPin, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "./ui/input";
import { debounce } from "lodash";
import { getCategoryIcon } from "@/lib/data";
import { format } from "date-fns";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { createLocationSlug } from "@/lib/locations-utils";

const SearchLocationBar = () => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [showSearchResults, setShowSearchResults] = useState(false);
    const searchRef = useRef(null);

    const [selectedState, setSelectedState] = useState("");
    const [selectedCity, setSelectedCity] = useState("");

    const { data: currentUser, isLoading } = useConvexQuery(
        api.users.getCurrentUser
    );
    const { mutate: updateLocation } = useConvexMutation(
        api.users.completeOnboarding
    );

    const { data: searchResults, isLoading: searchLoading } = useConvexQuery(
        api.search.searchEvents,
        searchQuery.trim().length >= 2 ? { query: searchQuery, limit: 5 } : "skip"
    );

    const bdDivisions = divisions_en;
    const districts = districts_en;
    const bdDistricts = useMemo(() => {
        if (!selectedState) return [];
        const state = bdDivisions.find((s) => {
            if (s.title === selectedState) return s.value
        });

        if (!state) return [];
        return districts[state.value] || []
    }, [selectedState, bdDivisions, districts])

    useEffect(() => {
        if (currentUser?.location) {
            setSelectedState(currentUser.location.state || "");
            setSelectedCity(currentUser.location.city || "");
        }
    }, [currentUser, isLoading])

    const debouncedSetQuery = useRef(
        debounce((value) => setSearchQuery(value), 300)
    ).current;

    const handleSearchInput = (e) => {
        const value = e.target.value;
        debouncedSetQuery(value);
        setShowSearchResults(value.length >= 2);
    }

    const handleEventClick = (slug) => {
        setShowSearchResults(false);
        setSearchQuery("");

        router.push(`/events/${slug}`)
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSearchResults(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    })

    const handleLocationSelect = async (city, state) => {
        try {
            if (currentUser?.interests && currentUser?.location) {
                await updateLocation({
                    location: { city, state, country: "Bangladesh" },
                    interests: currentUser.interests,
                });
            }

            const slug = createLocationSlug(city, state);
            router.push(`/explore/${slug}`);
        } catch (error) {
            console.error("Failed to update location: ", error);
        }
    }

    return (
        <div className="flex items-center">
            <div className="relative flex w-full" ref={searchRef}>
                <div className="flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search events..."
                        onFocus={() => {
                            if (searchQuery.length >= 2) setShowSearchResults(true);
                        }}
                        onChange={handleSearchInput}
                        className="pl-10 w-full h-8 rounded-none rounded-l-md" />
                </div>

                {showSearchResults && (
                    <div className="absolute top-full mt-2 w-96 bg-background border rounded-lg shadow-lg z-50 max-h-[400px] overflow-y-auto">
                        {searchLoading ? (
                            <div className="p-4 flex items-center justify-center">
                                <Loader2 className="w-5 h-5 animate-spin text-purple-500" />
                            </div>
                        ) : searchResults && searchResults.length > 0 ? (
                            <div className="py-2">
                                <p className="px-4 py-2 text-xs font-semibold text-muted-foreground">
                                    SEARCH RESULTS
                                </p>
                                {searchResults.map((event) => {
                                    return <button
                                        key={event._id}
                                        className="w-full px-4 py-3 hover:bg-muted/50 text-left transition-colors"
                                        onClick={() => handleEventClick(event.slug)}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="text-2xl mt-0.5">
                                                {getCategoryIcon(event.category)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium mb-1 line-clamp-1">
                                                    {event.title}
                                                </p>
                                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {format(event.startDate, "MMM dd")}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="w-3 h-3" />
                                                        {event.city}
                                                    </span>
                                                </div>
                                            </div>
                                            {event.ticketType === "free" && (
                                                <Badge variant="secondary" className="text-xs">
                                                    Free
                                                </Badge>
                                            )}
                                        </div>
                                    </button>
                                })}
                            </div>
                        ) : null}
                    </div>
                )}
            </div>

            <Select
                value={selectedState}
                onValueChange={(value) => {
                    setSelectedState(value);
                    setSelectedCity("");
                }}
            >
                <SelectTrigger className="w-32 h-9 border-l-0 rounded-none">
                    <SelectValue placeholder="Division" />
                </SelectTrigger>
                <SelectContent>
                    {bdDivisions.map((state) => (
                        <SelectItem key={state.value} value={state.title}>
                            {state.title}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select
                value={selectedCity}
                onValueChange={(value) => {
                    setSelectedCity(value);
                    if (value && selectedState) {
                        handleLocationSelect(value, selectedState);
                    }
                }}
                disabled={!selectedState}
            >
                <SelectTrigger className="w-32 h-9 rounded-none rounded-r-md">
                    <SelectValue placeholder="District" />
                </SelectTrigger>
                <SelectContent>
                    {bdDistricts.length > 0 ? (
                        bdDistricts.map((district) => {
                            console.log("meow: ", district.title)
                            return <SelectItem key={district.title} value={district.title}>
                                {district.title}
                            </SelectItem>
                        })
                    ) : (
                        <SelectItem value="no-districts" disabled>
                            No districts available
                        </SelectItem>
                    )}
                </SelectContent>
            </Select>
        </div>
    )
}

export default SearchLocationBar;