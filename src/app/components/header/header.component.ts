import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    // RouterOutlet,
    // RouterLink,
    CommonModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  isLogin: boolean;
  loggedInUser: string | null;

  constructor(private authService: AuthService, private router: Router) {
    this.loggedInUser = this.authService.getLoggedInUser();
    this.isLogin = this.authService.checklogin();
  }
  ngOnInit(): void {
    // Subscribe to user changes if necessary
    // For example, if the user can log in/out while the app is running
    this.authService.loginStatusChanged.subscribe((isLogin: boolean) => {
      // Cập nhật biến isLogin cục bộ
      this.isLogin = isLogin;
    });
    this.authService.userChange.subscribe((username) => {
      this.loggedInUser = username;
    });
  }
  logout() {
    this.authService.logout();
    this.isLogin = false;
    this.loggedInUser = null;
    // sessionStorage.clear;
    // location.reload;
    // location.origin;
    // this.router.navigate(['/guest']);

    location.assign('http://localhost:4200/guest'); // xử lý được trường hợp không quay về các trang và xóa lệnh header
  }

  //Phần vieww bên trong
  isSidebarVisible: boolean = true;
  showLabel: boolean = false;
  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
    // location.assign('http://localhost:4200/login');
  }
  navigateToAbout() {
    this.router.navigate(['/about']);
    // location.assign('http://localhost:4200/about');
  }
  navigateToHome() {
    this.router.navigate(['/guest']);
    // location.assign('http://localhost:4200/guest');
  }
}
