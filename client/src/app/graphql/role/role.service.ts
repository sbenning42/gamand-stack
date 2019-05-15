import { Injectable } from '@angular/core';
import { BaseReadRolesGQL, BaseCreateRoleGQL, BaseUpdateRoleGQL, BaseDeleteRoleGQL } from '../graphql';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(
    private baseReadRoles: BaseReadRolesGQL,
    private baseCreateRole: BaseCreateRoleGQL,
    private baseUpdateRole: BaseUpdateRoleGQL,
    private baseDeleteRole: BaseDeleteRoleGQL,
  ) { }

  baseRead() {
    return this.baseReadRoles.watch().valueChanges.pipe(
      map(({ data: { Role } }) => Role)
    );
  }

  baseCreate(name: string, ring: number) {
    return this.baseCreateRole.mutate({ name, ring }).pipe(
      map(({ data: { CreateRole } }) => CreateRole)
    );
  }

  baseUpdate(name: string, ring?: number) {
    return this.baseUpdateRole.mutate({ name, ring }).pipe(
      map(({ data: { UpdateRole } }) => UpdateRole)
    );
  }

  baseDelete(name: string) {
    return this.baseDeleteRole.mutate({ name }).pipe(
      map(({ data: { DeleteRole } }) => DeleteRole)
    );
  }
}
