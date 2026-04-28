import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { register } from "next/dist/next-devtools/userspace/pages/pages-dev-overlay-setup";

export default defineSchema({
    // Users Table
    users: defineTable({
        name: v.string(),
        tokenIdentifier: v.string(), // Clerk user ID for authentication
        email: v.string(),
        imageUrl: v.optional(v.string()),

        // Onboarding fields
        hasCompletedOnboarding: v.boolean(),

        location: v.optional(
            v.object({
                city: v.string(),
                state: v.optional(v.string()),
                country: v.string(),
            })
        ),
        interests: v.optional(v.array(v.string())), // Main 3 categories of interest

        // Organizer tracking (User Subscription)
        freeEventsCreated: v.number(), // Track free events created (limit 1)

        // Timestamps
        createdAt: v.number(),
        updatedAt: v.number(),
    }).index("by_token", ["tokenIdentifier"]),

    events: defineTable({
        title: v.string(),
        description: v.string(),
        slug: v.string(),

        // Organizer
        organizerId: v.id("users"),
        organizerName: v.string(),

        // Event Details
        category: v.string(),
        tags: v.array(v.string()),
        startDate: v.number(),
        endDate: v.number(),

        // Location
        location: v.union(v.literal("physical"), v.literal("virtual")),
        venue: v.optional(v.string()),
        address: v.optional(v.string()),
        city: v.optional(v.string()),
        state: v.optional(v.string()),

        // Capacity & Ticketing
        capacity: v.number(),
        ticketType: v.union(v.literal("free"), v.literal("paid")),
        ticketPrice: v.optional(v.number()), // Paid at event (offline)
        registrationCount: v.number(),

        // Customization
        coverImage: v.optional(v.string()),
        themeColor: v.optional(v.string()),
        
        // Timestamps
        createdAt: v.number(),
        updatedAt: v.number(),
    })
    .index("by_organizer", ["organizerId"])
    .index("by_category", ["category"])
    .index("by_start_date", ["startDate"])
    .index("by_slug", ["slug"])
    .searchIndex("search_title", {searchField: "title"}),

    registrations: defineTable({
        eventId: v.id("events"),
        userId: v.id("users"),
        
        // Attendee info
        attendeeName: v.string(),
        attendeeEmail: v.string(),

        // Check-in
        checkedIn: v.boolean(),
        checkedInAt: v.optional(v.number()),

        // Status
        status: v.union(v.literal("confirmed"), v.literal("cancelled")),

        registeredAt: v.number(),
    })
    .index("by_event", ["eventId"])
    .index("by_user", ["userId"])
    .index("by_event_user", ["eventId", "userId"])
    .index("by_qr_code", ["qrCode"]),
})