import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

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

    registrations: defineTable({}),
})