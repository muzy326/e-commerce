// // import { Injectable } from '@angular/core';
// // import { CanActivate, Router } from '@angular/router';
// // import { AdminService } from '../services/admin.service';

// // @Injectable({
// //   providedIn: 'root'
// // })
// // export class AdminGuard implements CanActivate {
// //   constructor(private adminService: AdminService, private router: Router) {}

// //   canActivate(): boolean {
// //     if (this.adminService.isAdmin()) return true;
// //     this.router.navigate(['/login']);
// //     return false;
// //   }
// // }
// import { Injectable } from "@angular/core";
// import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
// import { AuthService } from "../services/auth.service";


// @Injectable()

// export class AdminGuard implements CanActivate {
//     constructor(private _router: Router, private _authService: AuthService) { }
//     canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
//         if (this._authService.token && this._authService.role === 'Admin') {
//             return true;
//         }
//         else {
//             this._router.navigate(['/un-authorized']);
//             return false;
//         }
//     }
// }
