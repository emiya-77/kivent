/* eslint-disable react-hooks/incompatible-library */
"use client"

import z from "zod";
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useConvexMutation, useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { zodResolver } from "@hookform/resolvers/zod"
import { districts_en, divisions_en } from "bangladesh-location-data";
import { useForm } from "react-hook-form";
import UpgradeModal from "@/components/upgrade-modal";
import Image from "next/image";
import { UnsplashImagePicker } from "@/components/unsplash-image-picker";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Crown } from "lucide-react";

// HH:MM in 24h
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const eventSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters long"),
    description: z
        .string()
        .min(20, "Description must be at least 20 characters long"),
    category: z.string().min(1, "Please select a category"),

    startDate: z.date({ required_error: "Start date is required" }),
    endDate: z.date({ required_error: "End date is required" }),
    startTime: z.string().regex(timeRegex, "Start time must be HH:MM"),
    endTime: z.string().regex(timeRegex, "End time must be HH:MM"),

    locationType: z.enum(["physical", "online"]).default("physical"),
    venue: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    address: z.string().optional(),
    city: z.string().min(1, "City is required"),
    state: z.string().optional(),

    capacity: z.number().min(1, "Capacity must be at least 1"),
    ticketType: z.enum(["free", "paid"]).default("free"),
    ticketPrice: z.number().optional(),
    coverImage: z.string().optional(),
    themeColor: z.string().default("#CF8F30"),
})

const CreateEvent = () => {
    const router = useRouter();

    const [showImagePicker, setShowImagePicker] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [upgradeReason, setUpgradeReason] = useState("limit"); // "limit" or "color"

    // Check if user has Pro plan
    const { has } = useAuth();
    const hasPro = has?.({ plan: "pro" });

    const { data: currentUser } = useConvexQuery(
        api.users.getCurrentUser
    )
    const { mutate: createEvent, isLoading } = useConvexMutation(
        api.events.createEvent
    );

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        control,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(eventSchema),
        defaultValues: {
            locationType: "physical",
            ticketType: "free",
            capacity: 50,
            themeColor: "#CF8F30",
            category: "",
            state: "",
            city: "",
            startTime: "",
            endTime: "",
        }
    })

    const themeColor = watch("themeColor");
    const ticketType = watch("ticketType");
    const selectedState = watch("selectedState");
    const startDate = watch("startDate");
    const endDate = watch("endDate");
    const coverImage = watch("coverImage");

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

    // Color presets - show all for Pro, only default for Free
    const colorPresets = [
        "#CF8F30", // Default color (always available)
        ...(hasPro ? ["#4c1d95", "#065f46", "#92400e", "#7f1d1d", "#831843"] : []),
    ];

    return (
        <div
            style={{
                backgroundColor: themeColor
            }}
            className="min-h-screen transition-colors duration-300 px-6 py-8 -mt-6 md:-mt-16 lg:-mt-5 lg:rounded-md"
        >
            <div className="max-w-6xl mx-auto flex flex-col gap-5 md:flex-row justify-between mb-10">
                <div>
                    <h1 className="text-4xl font-bold">Create Event</h1>
                    {!hasPro && (
                        <p className="text-sm text-muted-foreground">
                            Free: {currentUser?.freeEventsCreated || 0}/1 events created
                        </p>
                    )}
                </div>

                {/* AI Event Creator */}
            </div>

            <div className="max-w-6xl mx-auto grid md:grid-cols-[320px_1fr] gap-10">
                {/* Left: Image + Theme */}
                <div className="space-y-6">
                    <div className="aspect-square w-full rounded-xl overflow-hidden flex items-center justify-center cursor-pointer border"
                        onClick={() => setShowImagePicker(true)}
                    >
                        {coverImage ? (
                            <Image
                                src={coverImage}
                                alt="Cover"
                                className="w-full h-full object-cover"
                                width={500}
                                height={500}
                            />
                        ) : (
                            <span className="opacity-60 text-sm">
                                Click to add cover image
                            </span>
                        )}
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label className="text-sm">Theme Color</Label>
                            {!hasPro && (
                                <Badge variant="secondary" className="text-xs gap-1">
                                    <Crown className="w-3 h-3" />
                                    Pro
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Form */}
                <div>Right</div>
            </div>

            {/* Unsplash Picker */}
            {showImagePicker && (
                <UnsplashImagePicker
                    isOpen={showImagePicker}
                    onClose={() => setShowImagePicker(false)}
                    onSelect={(url) => {
                        setValue("coverImage", url);
                        setShowImagePicker(false)
                    }}
                />
            )}

            {/* Upgrade Modal */}
            <UpgradeModal
                isOpen={showUpgradeModal}
                onClose={() => setShowUpgradeModal(false)}
                trigger={upgradeReason}
            />
        </div>
    )
}

export default CreateEvent;