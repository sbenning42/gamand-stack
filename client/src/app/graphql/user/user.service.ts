import { Injectable } from '@angular/core';
import {
  BaseReadUsersGQL, BaseCreateUserGQL, BaseUpdateUserGQL, BaseDeleteUserGQL, BaseAddRoleUsersGQL, BaseRemoveRoleUsersGQL,
} from '../graphql';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private baseReadUsers: BaseReadUsersGQL,
    private baseCreateUser: BaseCreateUserGQL,
    private baseAddRoleUsers: BaseAddRoleUsersGQL,
    private baseRemoveRoleUsers: BaseRemoveRoleUsersGQL,
    private baseUpdateUser: BaseUpdateUserGQL,
    private baseDeleteUser: BaseDeleteUserGQL,
  ) { }


  baseRead() {
    return this.baseReadUsers.watch().valueChanges.pipe(
      map(({ data: { User } }) => User)
    );
  }

  baseCreate(name: string, email: string) {
    return this.baseCreateUser.mutate({ name, email }).pipe(
      map(({ data: { CreateUser, AddRoleUsers } }) => CreateUser)
    );
  }

  baseAdd(name: string, email: string) {
    return this.baseAddRoleUsers.mutate({ from: { name }, to: { email } }).pipe(
      map(({ data: { AddRoleUsers } }) => AddRoleUsers)
    );
  }

  baseRemove(name: string, email: string) {
    return this.baseRemoveRoleUsers.mutate({ from: { name }, to: { email } }).pipe(
      map(({ data: { RemoveRoleUsers } }) => RemoveRoleUsers)
    );
  }

  baseUpdate(email: string, name?: string) {
    return this.baseUpdateUser.mutate({ name, email }).pipe(
      map(({ data: { UpdateUser } }) => UpdateUser)
    );
  }

  baseDelete(email: string) {
    return this.baseDeleteUser.mutate({ email }).pipe(
      map(({ data: { DeleteUser } }) => DeleteUser)
    );
  }

}
