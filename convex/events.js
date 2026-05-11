import { v } from "convex/values"
import { mutation } from "./_generated/server"

export const createEvent = mutation({
    args: {
        title: v.string(),
        description: v.string(),
        category: v.string(),
        tags: v.array(v.string()),

        startDate: v.number(),
        endDate: v.number(),
        timezone: v.string(),

        locationType: v.union(v.literal("physical"), v.literal("online")),
        venue: v.optional(v.string()),
        address: v.optional(v.string()),
        city: v.string(),
        state: v.optional(v.string()),
        country: v.string(),

        capacity: v.number(),
        ticketType: v.union(v.literal("free"), v.literal("paid")),
        ticketPrice: v.optional(v.number()),
        coverImage: v.optional(v.string()),
        themeColor: v.optional(v.string()),
        hasPro: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        try {
            const user = await ctx.runQuery(internal.users.getCurrentUser);

            // server side check: verify event limit for free users
            if (!hasPro && user.freeEventsCreated >= 1) {
                throw new Error(
                    "Free event limit reached. Please upgrade to Pro to create more events."
                )
            }

            const defaultColor = '#c76e00';
            if (!hasPro && args.themeColor && args.themeColor !== defaultColor) {
                throw new Error(
                    "Custom theme colors are a Pro feature. Please upgrade to Pro."
                );
            }
            const themeColor = hasPro ? args.themeColor : defaultColor;

            // Generate slug from title
            const slug = args.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "");

            const eventId = await ctx.db.insert("events", {
                ...args,
                themeColor,
                slug: `${slug}-${Date.now()}`,
                organizerId: user._id,
                organizerName: user.name,
                registrationCount: 0,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            })

            // Update user's free event count
            await ctx.db.patch(user._id, {
                freeEventsCreated: user.freeEventsCreated + 1,
            })

            return eventId;
        } catch (error) {
            throw new Error(`Failed to create event: $(error.message)`);
        }
    }
})

// Get event by slug

// Get events by organizer

// Delete event