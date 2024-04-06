// add-new.component.ts
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NonNullAssert } from '@angular/compiler';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-add-new',

  templateUrl: './add-new.component.html',
  styleUrl: './add-new.component.css',
})
export class AddNewComponent {
  name!: string;
  latitude!: number;
  longitude!: number;
  registrationError: boolean = false;
  deleteError: boolean = false;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {} // Inject HttpClient

  addnewLocation(myForm: NgForm) {
    if (!this.name || !this.latitude || !this.longitude) {
      // Hiển thị cảnh báo nếu các trường dữ liệu cần thiết không được điền đầy đủ
      alert("Vui lòng điền đầy đủ thông tin vị trí.");
      return; // Dừng hàm nếu dữ liệu không hợp lệ
    }
    // Create an object with the data to send
    const visData = {
      name: this.name,
      latitude: this.latitude,
      longitude: this.longitude,
    };
    console.log('name:', this.name);
    console.log('lat:', this.latitude);
    console.log('long:', this.longitude);
    // Call the registration method from your AuthService
    this.authService.registerLocation(visData).subscribe({
      next: (res: any) => {
        // Chuyển hướng đến một route mới sau khi đăng ký thành công
        // this.router.navigate(['/addnew']);
        // Đặt trạng thái lỗi đăng ký về false
        this.registrationError = false;
        // Hiển thị thông báo thành công trên màn hình
        const resMessage = res.message;
        alert(
          `Đăng ký vị trí thành công! Thông tin trả về từ máy chủ: ${JSON.stringify(
            resMessage
          )}`
        );
        // Đặt lại các trường dữ liệu về giá trị trống
        myForm.resetForm();
      },
      error: (error: any) => {
        // Explicitly define the type for the 'error' parameter
        console.error('Registration error:', error);
        // Lấy phần message từ đối tượng lỗi
        const errorMessage = error.error.message;
        this.registrationError = true;
        alert(`Lỗi trả về từ máy chủ: ${JSON.stringify(errorMessage)}`);
      },
    });
  }
  // Xóa vị trí có tên trong trường name
  deleteLocation(myForm: NgForm) {
    // Create an object with the data to send
    const visData = {
      name: this.name,
      latitude: this.latitude, // không sử dụng
      longitude: this.longitude, //không sử dụng
    };
    console.log('Tên vị trí yêu cầu xóa (name):', this.name);
    this.authService
      .deleteLocation(this.name, visData.latitude, this.longitude)
      .subscribe({
        next: (res: any) => {
          // Đặt trạng thái lỗi đăng ký về false
          this.deleteError = false;
          // Hiển thị thông báo thành công trên màn hình
          const resMessage = res.message;
          alert(
            `Xóa vị trí thành công! Thông tin trả về từ máy chủ: ${JSON.stringify(
              resMessage
            )}`
          );
          // Đặt lại các trường dữ liệu về giá trị trống
          myForm.resetForm();
        },
        error: (error: any) => {
          // Explicitly define the type for the 'error' parameter
          console.error('Delete error:', error);
          // Lấy phần message từ đối tượng lỗi
          const errorMessage = error.error.message;
          this.deleteError = true;
          alert(`Lỗi trả về từ máy chủ: ${JSON.stringify(errorMessage)}`);
        },
      });
  }

  // Thêm địa điểm theo danh sách csv nhập vào từ máy tính
  addAllLocation(_t7: NgForm) {}

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      alert('Upload file thành công');
      this.uploadCSV(file);
    }
  }

  uploadCSV(file: File) {
    // Khởi tạo một mảng để lưu trữ dữ liệu từ tệp CSV
    const csvDataArray: any[] = [];
    //đọc file csv và hiển thị ra màn hình
    // Sử dụng FileReader để đọc nội dung của file CSV
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result; // Nội dung của file CSV

      // Hiển thị nội dung trên trang web
      const displayElement = document.getElementById('csv-content');
      if (displayElement) {
        displayElement.innerText = content as string;
      }

      // Log nội dung vào console
      console.log('Nội dung content:', content);

      // Tách nội dung của file CSV thành các dòng
      const lines = (content as string).split('\n');

      // Lặp qua từng dòng trong file CSV
      lines.forEach((line, index) => {
        // Bỏ qua dòng tiêu đề (nếu có)
        if (index !== 0) {
          // Tách dữ liệu của từng dòng thành các phần tử
          const parts = line.split(',');

          // Lấy các giá trị từ các phần tử tách được
          if (parts.length >= 3) {
            // Lấy các giá trị từ các phần tử tách được
            const name = parts[0].trim();
            const latitude = parseFloat(parts[1].trim());
            const longitude = parseFloat(parts[2].trim());

            // Tạo một đối tượng đại diện cho dữ liệu từ dòng CSV hiện tại
            const locationData = {
              name,
              latitude,
              longitude,
            };

            // Thêm đối tượng vào mảng
            csvDataArray.push(locationData);
          }
        }
      });

      // Log nội dung mảng lưu vào console
      console.log('Nội dung csvDataArray: ', csvDataArray);

      // Hiển thị từng thành phần của mảng csvDataArray trên console
      csvDataArray.forEach((item, index) => {
        // nơi đây xử lý lệnh đăng ký từng vị trí có trong file csv
        const visData = {
          name: item.name,
          latitude: item.latitude, 
          longitude: item.longitude, 
        };
        this.authService.registerLocation(visData).subscribe({
          next: (res: any) => {
            this.registrationError = false;
            // Hiển thị thông báo thành công trên màn hình
            const resMessage = res.message;
            alert(`Đăng ký vị trí thành công! Thông tin trả về từ máy chủ: ${JSON.stringify(resMessage)}`);
          },
          error: (error: any) => {
            // Explicitly define the type for the 'error' parameter
            console.error('Registration error:', error);
            // Lấy phần message từ đối tượng lỗi
            const errorMessage = error.error.message;
            this.registrationError = true;
            alert(`Lỗi trả về từ máy chủ: ${JSON.stringify(errorMessage)}`);
          },
        });

        
        console.log(`Phần tử ${index}: `, item);
      });
    };

    // Đọc file CSV
    reader.readAsText(file);
  }
}
