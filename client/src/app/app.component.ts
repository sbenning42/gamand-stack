import { Component } from '@angular/core';
import { RoleService } from './graphql/role/role.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  roles$: Observable<any[]> = this.roleService.baseRead();
  constructor(private roleService: RoleService) {

  }
}
