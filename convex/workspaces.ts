import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { auth } from './auth';

/**
 * The `generateCode` function creates a random alphanumeric code of length 6.
 * @returns A randomly generated code consisting of 6 characters, which can include numbers (0-9) and
 * lowercase letters (a-z).
 */
const generateCode = () => {
  const code = Array.from(
    { length: 6 },
    () => '0123456789abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 36)]
  ).join('');
  return code;
};

/* The `join` function is a mutation operation that allows a user to join a workspace by providing a
join code. Here's a breakdown of what the function does: */
export const join = mutation({
  args: {
    joinCode: v.string(),
    workspaceId: v.id('workspaces'),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);

    if (!userId) {
      throw new Error('Unauthorized');
    }
    const workspace = await ctx.db.get(args.workspaceId);

    if (!workspace) {
      throw new Error('Workspace not found');
    }
    if (workspace.joinCode !== args.joinCode.toLowerCase()) {
      throw new Error('Invalid join code');
    }
    const existingMember = await ctx.db
      .query('members')
      .withIndex('by_workspace_id_user_id', (q) =>
        q.eq('workspaceId', args.workspaceId).eq('userId', userId)
      )
      .unique();

    if (existingMember) {
      throw new Error('User is already a member of this workspace');
    }

    await ctx.db.insert('members', {
      userId,
      workspaceId: workspace._id,
      role: 'member',
    });
    return workspace._id;
  },
});

/* This `newJoinCode` function is a mutation operation that generates a new join code for a workspace.
Here's a breakdown of what the function does: */
export const newJoinCode = mutation({
  args: {
    workspaceId: v.id('workspaces'),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);

    if (!userId) {
      throw new Error('Unauthorized');
    }
    const member = await ctx.db
      .query('members')
      .withIndex('by_workspace_id_user_id', (q) =>
        q.eq('workspaceId', args.workspaceId).eq('userId', userId)
      )
      .unique();

    if (!member || member.role !== 'admin') {
      throw new Error('Unauthorized');
    }

    const joinCode = generateCode();

    await ctx.db.patch(args.workspaceId, {
      joinCode,
    });

    return args.workspaceId;
  },
});

/* The `create` function is a mutation operation that creates a new workspace. Here's a breakdown of
what the function does: */
export const create = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);

    if (!userId) {
      throw new Error('Unauthorized');
    }

    //TODO: Create a proper method later
    const joinCode = generateCode();

    const workspaceId = await ctx.db.insert('workspaces', {
      name: args.name,
      userId,
      joinCode,
    });

    await ctx.db.insert('members', {
      userId,
      workspaceId,
      role: 'admin',
    });

    await ctx.db.insert('channels', {
      name: 'general',
      workspaceId,
    });
    return workspaceId;
  },
});

/* This `get` function is a query operation that retrieves workspaces based on the current user's
`userId`. Here's a breakdown of what the function does: */
export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);

    if (!userId) {
      return [];
    }

    const members = await ctx.db
      .query('members')
      .withIndex('by_user_id', (q) => q.eq('userId', userId))
      .collect();

    const workspaceIds = members.map((member) => member.workspaceId);

    const workspaces = [];

    for (const workspaceId of workspaceIds) {
      const workspace = await ctx.db.get(workspaceId);

      if (workspace) {
        workspaces.push(workspace);
      }
    }

    return workspaces;
  },
});

/* The `getInfoById` function is a query operation that retrieves information about a workspace based
on the provided `id`. Here is a breakdown of what the function does: */
export const getInfoById = query({
  args: { id: v.id('workspaces') },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);

    if (!userId) {
      return null;
    }
    const member = await ctx.db
      .query('members')
      .withIndex('by_workspace_id_user_id', (q) =>
        q.eq('workspaceId', args.id).eq('userId', userId)
      )
      .unique();

    const workspace = await ctx.db.get(args.id);

    return {
      name: workspace?.name,
      isMember: !!member,
    };
  },
});

/* The `getById` function is a query operation that retrieves information about a workspace based on
the provided `id`. Here's a breakdown of what the function does: */
export const getById = query({
  args: { id: v.id('workspaces') },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);

    if (!userId) {
      throw new Error('Unauthorized');
    }

    const member = await ctx.db
      .query('members')
      .withIndex('by_workspace_id_user_id', (q) =>
        q.eq('workspaceId', args.id).eq('userId', userId)
      )
      .unique();

    if (!member) {
      return null;
    }
    return await ctx.db.get(args.id);
  },
});

/* The `update` function is a mutation operation that allows updating the name of a workspace. Here's a
breakdown of what the function does: */
export const update = mutation({
  args: {
    id: v.id('workspaces'),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);

    if (!userId) {
      throw new Error('Unauthorized');
    }

    const member = await ctx.db
      .query('members')
      .withIndex('by_workspace_id_user_id', (q) =>
        q.eq('workspaceId', args.id).eq('userId', userId)
      )
      .unique();

    if (!member || member.role !== 'admin') {
      throw new Error('Unauthorized');
    }
    await ctx.db.patch(args.id, {
      name: args.name,
    });
    return args.id;
  },
});

/* The `remove` function is a mutation operation that allows for the removal of a workspace. Here's a
breakdown of what the function does: */
export const remove = mutation({
  args: {
    id: v.id('workspaces'),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);

    if (!userId) {
      throw new Error('Unauthorized');
    }

    const member = await ctx.db
      .query('members')
      .withIndex('by_workspace_id_user_id', (q) =>
        q.eq('workspaceId', args.id).eq('userId', userId)
      )
      .unique();

    if (!member || member.role !== 'admin') {
      throw new Error('Unauthorized');
    }

    const [members, channels, conversations, messages, reactions] = await Promise.all([
      ctx.db
        .query('members')
        .withIndex('by_workspace_id', (q) => q.eq('workspaceId', args.id))
        .collect(),
      ctx.db
        .query('channels')
        .withIndex('by_workspace_id', (q) => q.eq('workspaceId', args.id))
        .collect(),
      ctx.db
        .query('conversations')
        .withIndex('by_workspace_id', (q) => q.eq('workspaceId', args.id))
        .collect(),
      ctx.db
        .query('messages')
        .withIndex('by_workspace_id', (q) => q.eq('workspaceId', args.id))
        .collect(),        
      ctx.db
        .query('reactions')
        .withIndex('by_workspace_id', (q) => q.eq('workspaceId', args.id))
        .collect(),        

    ]);

    for (const member of members) {
      await ctx.db.delete(member._id);
    }
    for (const channel of channels) {
      await ctx.db.delete(channel._id);
    }
    for (const conversation of conversations) {
      await ctx.db.delete(conversation._id);
    }
    for (const message of messages) {
      await ctx.db.delete(message._id);
    }
    for (const reaction of reactions) {
      await ctx.db.delete(reaction._id);
    }

    await ctx.db.delete(args.id);

    return args.id;
  },
});
