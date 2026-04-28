import { v } from "convex/values";
import { query } from "./_generated/server";
import { ar } from "date-fns/locale";

export const getFeatureEvents = query({
    args: {
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const now = Date.now();

        const events = await ctx.db.query("events")
            .withIndex("by_start_date")
            .filter((q) => q.gte(q.field("startDate"), now))
            .order("desc")
            .collect();

        // Sort by registration count for featured events
        const featured = events.sort((a, b) => b.registeredCount - a.registeredCount)
            .slice(0, args.limit ?? 5);

        return featured;
    }
});

export const getEventsByLocation = query({
    args: {
        city: v.optional(v.string()),
        state: v.optional(v.string()),
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const now = Date.now();

        const events = await ctx.db.query("events")
            .withIndex("by_start_date")
            .filter((q) => q.gte(q.field("startDate"), now))
            .collect();

        // Filter by city or state
        if(args.city) {
            events = events.filter(
                (e) => e.city.toLowerCase() === args.city.toLowerCase()
            );
        }else if(args.state) {
            events = events.filter(
                (e) => e.state.toLowerCase() === args.state.toLowerCase()
            );
        }

        return events.slice(0, args.limit ?? 4);
    }
});

export const getPopularEvents = query({
    args: {
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const now = Date.now();

        const events = await ctx.db.query("events")
            .withIndex("by_start_date")
            .filter((q) => q.gte(q.field("startDate"), now))
            .collect();
        
        // Sort by registration count for popular events
        const popular = events.sort((a, b) => b.registrationCount - a.registrationCount)
            .slice(0, args.limit ?? 6);
        
        return popular;
    }
});