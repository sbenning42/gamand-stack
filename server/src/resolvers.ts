import { neo4jgraphql } from 'neo4j-graphql-js';

/**
 * Helper function for applying isAdmin middleware on `resolvers` level
 */
const executeIfAdmin = (parent: any, args: any, ctx: any, infos: any) => ctx.auth.isAdmin(ctx.req, ctx.res)
    .then(isAdmin => isAdmin ? neo4jgraphql(parent, args, ctx, infos) : null);

export const resolvers = {
    Mutation: {
        CreateUser: (parent: any, args: any, ctx: any, infos: any) => executeIfAdmin(parent, args, ctx, infos),
        UpdateUser: (parent: any, args: any, ctx: any, infos: any) => executeIfAdmin(parent, args, ctx, infos),
        DeleteUser: (parent: any, args: any, ctx: any, infos: any) => executeIfAdmin(parent, args, ctx, infos),
        AddUserRoles: (parent: any, args: any, ctx: any, infos: any) => executeIfAdmin(parent, args, ctx, infos),
        RemoveUserRoles: (parent: any, args: any, ctx: any, infos: any) => executeIfAdmin(parent, args, ctx, infos),
        CreateRole: (parent: any, args: any, ctx: any, infos: any) => executeIfAdmin(parent, args, ctx, infos),
        UpdateRole: (parent: any, args: any, ctx: any, infos: any) => executeIfAdmin(parent, args, ctx, infos),
        DeleteRole: (parent: any, args: any, ctx: any, infos: any) => executeIfAdmin(parent, args, ctx, infos),
        AddRoleUsers: (parent: any, args: any, ctx: any, infos: any) => executeIfAdmin(parent, args, ctx, infos),
        RemoveRoleUsers: (parent: any, args: any, ctx: any, infos: any) => executeIfAdmin(parent, args, ctx, infos),
    }
};

