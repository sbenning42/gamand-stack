import { neo4jgraphql } from 'neo4j-graphql-js';
import GraphQLJSON from 'graphql-type-json';

/**
 * - You can override auto-generated resolvers here
 * - You can define your own
 * 
 * - You may use `exclude` properties of neo4j-graphql-js `config`'s object
 *   to disable auto-generating resolvers for some `type`s.
 */

/**
 * Helper function for returning `null` if Request has no { name: `admin` } role
 */
const ifAdmin = (parent: any, args: any, ctx: any, infos: any) => ctx.auth.isAdmin(ctx.req, ctx.res)
    .then((isAdmin: boolean) => isAdmin ? neo4jgraphql(parent, args, ctx, infos) : null);

export const resolvers = {
    JSON: GraphQLJSON,
    Mutation: {
        CreateUser: (parent: any, args: any, ctx: any, infos: any) => ifAdmin(parent, args, ctx, infos),
        UpdateUser: (parent: any, args: any, ctx: any, infos: any) => ifAdmin(parent, args, ctx, infos),
        DeleteUser: (parent: any, args: any, ctx: any, infos: any) => ifAdmin(parent, args, ctx, infos),
        AddUserRoles: (parent: any, args: any, ctx: any, infos: any) => ifAdmin(parent, args, ctx, infos),
        RemoveUserRoles: (parent: any, args: any, ctx: any, infos: any) => ifAdmin(parent, args, ctx, infos),
        CreateRole: (parent: any, args: any, ctx: any, infos: any) => ifAdmin(parent, args, ctx, infos),
        UpdateRole: (parent: any, args: any, ctx: any, infos: any) => ifAdmin(parent, args, ctx, infos),
        DeleteRole: (parent: any, args: any, ctx: any, infos: any) => ifAdmin(parent, args, ctx, infos),
        AddRoleUsers: (parent: any, args: any, ctx: any, infos: any) => ifAdmin(parent, args, ctx, infos),
        RemoveRoleUsers: (parent: any, args: any, ctx: any, infos: any) => ifAdmin(parent, args, ctx, infos),
    }
};

