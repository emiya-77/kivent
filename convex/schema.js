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
    }).index("by_token", ["tokenIdentifier"])
})