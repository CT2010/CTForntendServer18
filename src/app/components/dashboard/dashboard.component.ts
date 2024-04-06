// dashboard.component.ts

import { HttpClient } from '@angular/common/http';
import { Component, AfterViewInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
declare let L: any; // Khai báo biến L từ thư viện Leaflet
// Khai báo định dạng data hiển thị trên bản đồ
interface MarkerData {
  name: string;
  lat: number;
  lng: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements AfterViewInit {
  markerData: MarkerData[] = [
    { name: 'Địa điểm 1', lat: 10.8231, lng: 106.6297 },
    // Thêm các địa điểm khác ở đây...
  ];
email: any;
otherInfo: any;
  constructor(private http: HttpClient,
    private authService: AuthService,
    private router: Router) {}

    username = this.authService.getLoggedInUser();

  ngAfterViewInit(): void {
    if (window.hasOwnProperty('L')) {
      // Kiểm tra xem biến L đã tồn tại chưa

      const map = L.map('map').setView([10.8231, 106.6297], 13); // vị trí thành phố hồ chí minh

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      // // Tạo biểu tượng vị trí
      const locationIcon = L.icon({
        iconUrl: '../../../assets/leaflet/images/marker-icon.png', // Đường dẫn đến biểu tượng vị trí
        iconSize: [25, 41], // Kích thước của biểu tượng
        iconAnchor: [12, 41], // Vị trí neo của biểu tượng, theo tọa độ (x, y)
        popupAnchor: [1, -34], // Vị trí neo của Popup, theo tọa độ (x, y)
      });

      // Tạo marker cho mỗi dữ liệu trong markerData
      this.markerData.forEach((data) => {
        const marker = L.marker([data.lat, data.lng], { icon: locationIcon })
          .addTo(map)
          .bindPopup(
            `<b>${data.name}</b><br>Latitude: ${data.lat}<br>Longitude: ${data.lng}`
          );
        // .openPopup();

        // marker.bindPopup(`<b>${data.name}</b><br>Latitude: ${data.lat}<br>Longitude: ${data.lng}`);
      });
    } else {
      console.error('Leaflet library not loaded.'); // Thông báo nếu thư viện Leaflet chưa được tải
    }
  }
}
