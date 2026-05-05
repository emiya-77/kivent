import { v } from "convex/values";
import { internal } from "./_generated/api";
import { mutation, query } from "./_generated/server";

export const store = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    // console.log("Identity Object:", JSON.stringify(identity, null, 2));

    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }

    // 1. Force extraction of the name from all possible sources
    // We check customClaims because that's where Clerk puts dashboard template data
    const name = identity.name || identity.customClaims?.name || "Anonymous";
    const email = identity.email || identity.customClaims?.email || "";

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (user !== null) {
      if (user.name !== name) {
        await ctx.db.patch(user._id, {
          name,
          updatedAt: Date.now(),
        });
      }
      return user._id;
    }

    // 2. Use the local variable 'name' so it's guaranteed to be a string
    return await ctx.db.insert("users", {
      name: name,
      tokenIdentifier: identity.tokenIdentifier,
      email: email,
      imageUrl: identity.pictureUrl || identity.customClaims?.picture || "",
      hasCompletedOnboarding: false,
      freeEventsCreated: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});


export const getCurrentUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called getCurrentUser without authentication present");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }
})


export const completeOnboarding = mutation({
  args: {
    location: v.object({
      city: v.string(),
      state: v.optional(v.string()),
      country: v.string(),
    }),
    interests: v.array(v.string()), // Min 3 categories
  },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(internal.users.getCurrentUser)

    await ctx.db.patch(user._id, {
      location: args.location,
      interests: args.interests,
      hasCompletedOnboarding: true,
      updatedAt: Date.now(),
    });

    return user._id;
  }
})