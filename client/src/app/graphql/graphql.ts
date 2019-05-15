export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type _AddRoleUsersPayload = {
  from?: Maybe<Role>;
  to?: Maybe<User>;
};

export type _AddUserRolesPayload = {
  from?: Maybe<Role>;
  to?: Maybe<User>;
};

export type _Neo4jDate = {
  year?: Maybe<Scalars["Int"]>;
  month?: Maybe<Scalars["Int"]>;
  day?: Maybe<Scalars["Int"]>;
  formatted?: Maybe<Scalars["String"]>;
};

export type _Neo4jDateInput = {
  year?: Maybe<Scalars["Int"]>;
  month?: Maybe<Scalars["Int"]>;
  day?: Maybe<Scalars["Int"]>;
  formatted?: Maybe<Scalars["String"]>;
};

export type _Neo4jDateTime = {
  year?: Maybe<Scalars["Int"]>;
  month?: Maybe<Scalars["Int"]>;
  day?: Maybe<Scalars["Int"]>;
  hour?: Maybe<Scalars["Int"]>;
  minute?: Maybe<Scalars["Int"]>;
  second?: Maybe<Scalars["Int"]>;
  millisecond?: Maybe<Scalars["Int"]>;
  microsecond?: Maybe<Scalars["Int"]>;
  nanosecond?: Maybe<Scalars["Int"]>;
  timezone?: Maybe<Scalars["String"]>;
  formatted?: Maybe<Scalars["String"]>;
};

export type _Neo4jDateTimeInput = {
  year?: Maybe<Scalars["Int"]>;
  month?: Maybe<Scalars["Int"]>;
  day?: Maybe<Scalars["Int"]>;
  hour?: Maybe<Scalars["Int"]>;
  minute?: Maybe<Scalars["Int"]>;
  second?: Maybe<Scalars["Int"]>;
  millisecond?: Maybe<Scalars["Int"]>;
  microsecond?: Maybe<Scalars["Int"]>;
  nanosecond?: Maybe<Scalars["Int"]>;
  timezone?: Maybe<Scalars["String"]>;
  formatted?: Maybe<Scalars["String"]>;
};

export type _Neo4jLocalDateTime = {
  year?: Maybe<Scalars["Int"]>;
  month?: Maybe<Scalars["Int"]>;
  day?: Maybe<Scalars["Int"]>;
  hour?: Maybe<Scalars["Int"]>;
  minute?: Maybe<Scalars["Int"]>;
  second?: Maybe<Scalars["Int"]>;
  millisecond?: Maybe<Scalars["Int"]>;
  microsecond?: Maybe<Scalars["Int"]>;
  nanosecond?: Maybe<Scalars["Int"]>;
  formatted?: Maybe<Scalars["String"]>;
};

export type _Neo4jLocalDateTimeInput = {
  year?: Maybe<Scalars["Int"]>;
  month?: Maybe<Scalars["Int"]>;
  day?: Maybe<Scalars["Int"]>;
  hour?: Maybe<Scalars["Int"]>;
  minute?: Maybe<Scalars["Int"]>;
  second?: Maybe<Scalars["Int"]>;
  millisecond?: Maybe<Scalars["Int"]>;
  microsecond?: Maybe<Scalars["Int"]>;
  nanosecond?: Maybe<Scalars["Int"]>;
  formatted?: Maybe<Scalars["String"]>;
};

export type _Neo4jLocalTime = {
  hour?: Maybe<Scalars["Int"]>;
  minute?: Maybe<Scalars["Int"]>;
  second?: Maybe<Scalars["Int"]>;
  millisecond?: Maybe<Scalars["Int"]>;
  microsecond?: Maybe<Scalars["Int"]>;
  nanosecond?: Maybe<Scalars["Int"]>;
  formatted?: Maybe<Scalars["String"]>;
};

export type _Neo4jLocalTimeInput = {
  hour?: Maybe<Scalars["Int"]>;
  minute?: Maybe<Scalars["Int"]>;
  second?: Maybe<Scalars["Int"]>;
  millisecond?: Maybe<Scalars["Int"]>;
  microsecond?: Maybe<Scalars["Int"]>;
  nanosecond?: Maybe<Scalars["Int"]>;
  formatted?: Maybe<Scalars["String"]>;
};

export type _Neo4jTime = {
  hour?: Maybe<Scalars["Int"]>;
  minute?: Maybe<Scalars["Int"]>;
  second?: Maybe<Scalars["Int"]>;
  millisecond?: Maybe<Scalars["Int"]>;
  microsecond?: Maybe<Scalars["Int"]>;
  nanosecond?: Maybe<Scalars["Int"]>;
  timezone?: Maybe<Scalars["String"]>;
  formatted?: Maybe<Scalars["String"]>;
};

export type _Neo4jTimeInput = {
  hour?: Maybe<Scalars["Int"]>;
  minute?: Maybe<Scalars["Int"]>;
  second?: Maybe<Scalars["Int"]>;
  nanosecond?: Maybe<Scalars["Int"]>;
  millisecond?: Maybe<Scalars["Int"]>;
  microsecond?: Maybe<Scalars["Int"]>;
  timezone?: Maybe<Scalars["String"]>;
  formatted?: Maybe<Scalars["String"]>;
};

export enum _RelationDirections {
  In = "IN",
  Out = "OUT"
}

export type _RemoveRoleUsersPayload = {
  from?: Maybe<Role>;
  to?: Maybe<User>;
};

export type _RemoveUserRolesPayload = {
  from?: Maybe<Role>;
  to?: Maybe<User>;
};

export type _RoleFilter = {
  AND?: Maybe<Array<Maybe<_RoleFilter>>>;
  OR?: Maybe<Array<Maybe<_RoleFilter>>>;
  name?: Maybe<Scalars["String"]>;
  name_not?: Maybe<Scalars["String"]>;
  name_in?: Maybe<Array<Scalars["String"]>>;
  name_not_in?: Maybe<Array<Scalars["String"]>>;
  name_contains?: Maybe<Scalars["String"]>;
  name_not_contains?: Maybe<Scalars["String"]>;
  name_starts_with?: Maybe<Scalars["String"]>;
  name_not_starts_with?: Maybe<Scalars["String"]>;
  name_ends_with?: Maybe<Scalars["String"]>;
  name_not_ends_with?: Maybe<Scalars["String"]>;
  ring?: Maybe<Scalars["Int"]>;
  ring_not?: Maybe<Scalars["Int"]>;
  ring_in?: Maybe<Array<Scalars["Int"]>>;
  ring_not_in?: Maybe<Array<Scalars["Int"]>>;
  ring_lt?: Maybe<Scalars["Int"]>;
  ring_lte?: Maybe<Scalars["Int"]>;
  ring_gt?: Maybe<Scalars["Int"]>;
  ring_gte?: Maybe<Scalars["Int"]>;
  users?: Maybe<_UserFilter>;
  users_not?: Maybe<_UserFilter>;
  users_in?: Maybe<Array<_UserFilter>>;
  users_not_in?: Maybe<Array<_UserFilter>>;
  users_some?: Maybe<_UserFilter>;
  users_none?: Maybe<_UserFilter>;
  users_single?: Maybe<_UserFilter>;
  users_every?: Maybe<_UserFilter>;
};

export type _RoleInput = {
  name: Scalars["String"];
};

export enum _RoleOrdering {
  IdAsc = "_id_asc",
  IdDesc = "_id_desc",
  NameAsc = "name_asc",
  NameDesc = "name_desc",
  RingAsc = "ring_asc",
  RingDesc = "ring_desc"
}

export type _UserFilter = {
  AND?: Maybe<Array<Maybe<_UserFilter>>>;
  OR?: Maybe<Array<Maybe<_UserFilter>>>;
  email?: Maybe<Scalars["String"]>;
  email_not?: Maybe<Scalars["String"]>;
  email_in?: Maybe<Array<Scalars["String"]>>;
  email_not_in?: Maybe<Array<Scalars["String"]>>;
  email_contains?: Maybe<Scalars["String"]>;
  email_not_contains?: Maybe<Scalars["String"]>;
  email_starts_with?: Maybe<Scalars["String"]>;
  email_not_starts_with?: Maybe<Scalars["String"]>;
  email_ends_with?: Maybe<Scalars["String"]>;
  email_not_ends_with?: Maybe<Scalars["String"]>;
  name?: Maybe<Scalars["String"]>;
  name_not?: Maybe<Scalars["String"]>;
  name_in?: Maybe<Array<Scalars["String"]>>;
  name_not_in?: Maybe<Array<Scalars["String"]>>;
  name_contains?: Maybe<Scalars["String"]>;
  name_not_contains?: Maybe<Scalars["String"]>;
  name_starts_with?: Maybe<Scalars["String"]>;
  name_not_starts_with?: Maybe<Scalars["String"]>;
  name_ends_with?: Maybe<Scalars["String"]>;
  name_not_ends_with?: Maybe<Scalars["String"]>;
  password?: Maybe<Scalars["String"]>;
  password_not?: Maybe<Scalars["String"]>;
  password_in?: Maybe<Array<Scalars["String"]>>;
  password_not_in?: Maybe<Array<Scalars["String"]>>;
  password_contains?: Maybe<Scalars["String"]>;
  password_not_contains?: Maybe<Scalars["String"]>;
  password_starts_with?: Maybe<Scalars["String"]>;
  password_not_starts_with?: Maybe<Scalars["String"]>;
  password_ends_with?: Maybe<Scalars["String"]>;
  password_not_ends_with?: Maybe<Scalars["String"]>;
  roles?: Maybe<_RoleFilter>;
  roles_not?: Maybe<_RoleFilter>;
  roles_in?: Maybe<Array<_RoleFilter>>;
  roles_not_in?: Maybe<Array<_RoleFilter>>;
  roles_some?: Maybe<_RoleFilter>;
  roles_none?: Maybe<_RoleFilter>;
  roles_single?: Maybe<_RoleFilter>;
  roles_every?: Maybe<_RoleFilter>;
};

export type _UserInput = {
  email: Scalars["String"];
};

export enum _UserOrdering {
  IdAsc = "_id_asc",
  IdDesc = "_id_desc",
  EmailAsc = "email_asc",
  EmailDesc = "email_desc",
  NameAsc = "name_asc",
  NameDesc = "name_desc",
  PasswordAsc = "password_asc",
  PasswordDesc = "password_desc"
}

export type Mutation = {
  CreateRole?: Maybe<Role>;
  UpdateRole?: Maybe<Role>;
  DeleteRole?: Maybe<Role>;
  AddRoleUsers?: Maybe<_AddRoleUsersPayload>;
  RemoveRoleUsers?: Maybe<_RemoveRoleUsersPayload>;
  CreateUser?: Maybe<User>;
  UpdateUser?: Maybe<User>;
  DeleteUser?: Maybe<User>;
  AddUserRoles?: Maybe<_AddUserRolesPayload>;
  RemoveUserRoles?: Maybe<_RemoveUserRolesPayload>;
};

export type MutationCreateRoleArgs = {
  name: Scalars["String"];
  ring: Scalars["Int"];
};

export type MutationUpdateRoleArgs = {
  name: Scalars["String"];
  ring?: Maybe<Scalars["Int"]>;
};

export type MutationDeleteRoleArgs = {
  name: Scalars["String"];
};

export type MutationAddRoleUsersArgs = {
  from: _RoleInput;
  to: _UserInput;
};

export type MutationRemoveRoleUsersArgs = {
  from: _RoleInput;
  to: _UserInput;
};

export type MutationCreateUserArgs = {
  email: Scalars["String"];
  name?: Maybe<Scalars["String"]>;
  password?: Maybe<Scalars["String"]>;
};

export type MutationUpdateUserArgs = {
  email: Scalars["String"];
  name?: Maybe<Scalars["String"]>;
  password?: Maybe<Scalars["String"]>;
};

export type MutationDeleteUserArgs = {
  email: Scalars["String"];
};

export type MutationAddUserRolesArgs = {
  from: _RoleInput;
  to: _UserInput;
};

export type MutationRemoveUserRolesArgs = {
  from: _RoleInput;
  to: _UserInput;
};

export type Query = {
  Role?: Maybe<Array<Maybe<Role>>>;
  User?: Maybe<Array<Maybe<User>>>;
};

export type QueryRoleArgs = {
  _id?: Maybe<Scalars["String"]>;
  name?: Maybe<Scalars["String"]>;
  ring?: Maybe<Scalars["Int"]>;
  first?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<Array<Maybe<_RoleOrdering>>>;
  filter?: Maybe<_RoleFilter>;
};

export type QueryUserArgs = {
  _id?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
  name?: Maybe<Scalars["String"]>;
  password?: Maybe<Scalars["String"]>;
  first?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<Array<Maybe<_UserOrdering>>>;
  filter?: Maybe<_UserFilter>;
};

export type Role = {
  _id?: Maybe<Scalars["String"]>;
  name: Scalars["String"];
  ring: Scalars["Int"];
  users?: Maybe<Array<Maybe<User>>>;
};

export type RoleUsersArgs = {
  first?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<Array<Maybe<_UserOrdering>>>;
  filter?: Maybe<_UserFilter>;
};

export type User = {
  _id?: Maybe<Scalars["String"]>;
  email: Scalars["String"];
  name?: Maybe<Scalars["String"]>;
  password?: Maybe<Scalars["String"]>;
  roles: Array<Maybe<Role>>;
};

export type UserRolesArgs = {
  first?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<Array<Maybe<_RoleOrdering>>>;
  filter?: Maybe<_RoleFilter>;
};
export type BaseReadRolesQueryVariables = {};

export type BaseReadRolesQuery = { __typename?: "Query" } & {
  Role: Maybe<
    Array<Maybe<{ __typename?: "Role" } & Pick<Role, "name" | "ring">>>
  >;
};

export type BaseCreateRoleMutationVariables = {
  name: Scalars["String"];
  ring: Scalars["Int"];
};

export type BaseCreateRoleMutation = { __typename?: "Mutation" } & {
  CreateRole: Maybe<{ __typename?: "Role" } & Pick<Role, "name" | "ring">>;
};

export type BaseUpdateRoleMutationVariables = {
  name: Scalars["String"];
  ring?: Maybe<Scalars["Int"]>;
};

export type BaseUpdateRoleMutation = { __typename?: "Mutation" } & {
  UpdateRole: Maybe<{ __typename?: "Role" } & Pick<Role, "name" | "ring">>;
};

export type BaseDeleteRoleMutationVariables = {
  name: Scalars["String"];
};

export type BaseDeleteRoleMutation = { __typename?: "Mutation" } & {
  DeleteRole: Maybe<{ __typename?: "Role" } & Pick<Role, "name" | "ring">>;
};

import gql from "graphql-tag";
import { Injectable } from "@angular/core";
import * as Apollo from "apollo-angular";

export const BaseReadRolesDocument = gql`
  query BaseReadRoles {
    Role {
      name
      ring
    }
  }
`;

@Injectable({
  providedIn: "root"
})
export class BaseReadRolesGQL extends Apollo.Query<
  BaseReadRolesQuery,
  BaseReadRolesQueryVariables
> {
  document = BaseReadRolesDocument;
}
export const BaseCreateRoleDocument = gql`
  mutation BaseCreateRole($name: String!, $ring: Int!) {
    CreateRole(name: $name, ring: $ring) {
      name
      ring
    }
  }
`;

@Injectable({
  providedIn: "root"
})
export class BaseCreateRoleGQL extends Apollo.Mutation<
  BaseCreateRoleMutation,
  BaseCreateRoleMutationVariables
> {
  document = BaseCreateRoleDocument;
}
export const BaseUpdateRoleDocument = gql`
  mutation BaseUpdateRole($name: String!, $ring: Int) {
    UpdateRole(name: $name, ring: $ring) {
      name
      ring
    }
  }
`;

@Injectable({
  providedIn: "root"
})
export class BaseUpdateRoleGQL extends Apollo.Mutation<
  BaseUpdateRoleMutation,
  BaseUpdateRoleMutationVariables
> {
  document = BaseUpdateRoleDocument;
}
export const BaseDeleteRoleDocument = gql`
  mutation BaseDeleteRole($name: String!) {
    DeleteRole(name: $name) {
      name
      ring
    }
  }
`;

@Injectable({
  providedIn: "root"
})
export class BaseDeleteRoleGQL extends Apollo.Mutation<
  BaseDeleteRoleMutation,
  BaseDeleteRoleMutationVariables
> {
  document = BaseDeleteRoleDocument;
}
