"use client"

import z from "zod";
import { useRouter } from "next/navigation"
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { zodResolver } from "@hookform/resolvers/zod"

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
    themeColor: z.string().default("#C76E00"),
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

    useForm({
        resolver: zodResolver(),
        defaultValues: {
            locationType: "physical",
            ticketType: "free",
            capacity: 50,
            themeColor: "#C76E00",
            category: "",
            state: "",
            city: "",
            startTime: "",
            endTime: "",
        }
    })

    return (
        <div>CreateEvent</div>
    )
}

export default CreateEvent;