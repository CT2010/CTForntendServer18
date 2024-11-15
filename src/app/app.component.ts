// app.components.ts

import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { AuthService } from './services/auth.service';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { DashboardComponent } from './components/dashboard/dashboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    CommonModule,
    HeaderComponent,
    FooterComponent,
    FormsModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  Logout: any;
  navigateToLogout() {
    this.authService.logout();
    this.isLogin = false;
    // this.loggedInUser = null;
    // sessionStorage.clear;
    // location.reload;
    // location.origin;
    // this.router.navigate(['/guest']);

    location.assign('/'); // xử lý được trường hợp không quay về các trang và xóa lệnh header
  }
  title = 'ang18';
  //Phần vieww bên trong
  isSidebarVisible: boolean = true;
  showLabel: boolean = false;
  isLogin: boolean = false;

  constructor(private authService: AuthService) {}
  ngOnInit(): void {
    // Đăng ký theo dõi sự kiện thay đổi trạng thái đăng nhập
    this.authService.loginStatusChanged.subscribe((isLogin: boolean) => {
      // Cập nhật biến isLogin cục bộ
      this.isLogin = isLogin;

      // Thực hiện điều gì đó khi trạng thái đăng nhập thay đổi, ví dụ: tải lại dữ liệu
      if (isLogin != true) {
        this.loadData();
      }
    });
  }
  private loadData() {
    this.authService.loginStatusChanged.subscribe((isLogin: boolean) => {
      // Cập nhật biến isLogin cục bộ
      this.isLogin = isLogin;
    });
  }

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }
}
