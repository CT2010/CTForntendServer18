// add-data.component.ts
// xem lại phần xử lý thêm data, mục tiêu là dựa trên địa điểm + lat + long để lấy dữ liệu về
// Sau khi lấy về sẽ hiển thị trên form
// 6/3: đã hoàn thành lấy dữ liệu 1 địa điểm và hiển thị dữ liệu

import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { NgForm } from '@angular/forms';

// bổ sung lưu lib lưu file
// import { saveAs } from 'file-saver';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-add-data',
  templateUrl: './add-data.component.html',
  styleUrls: ['./add-data.component.css'],
})
export class AddDataComponent {

  formDataFields: any[] = [
    {id: 'name', name: 'name',label: 'Tên địa điểm',value: '',required: true,},
    {id: 'latitude',name: 'latitude',label: 'Latitude',value: '',required: true,},
    {id: 'longitude',name: 'longitude',label: 'Longitude',value: '',required: true,},
    {id: 'timestamp',name: 'timestamp',label: 'Thời gian (mm/dd/yyyy)',value: '',required: true,},
    {id: 'temperature',name: 'temperature',label: 'Nhiệt độ',value: '',required: true,},
    {id: 'humidity',name: 'humidity',label: 'Độ ẩm',value: '',required: true,},
    {id: 'uvIndex',name: 'uvIndex',label: 'Tia UV',value: '',required: true,},
  ];
  formDataFields1: any[] = [
    {id: 'name', name: 'name',label: 'Tên địa điểm',value: '',required: true,},
    {id: 'latitude',name: 'latitude',label: 'Latitude',value: '',required: true,},
    {id: 'longitude',name: 'longitude',label: 'Longitude',value: '',required: true,},
    {id: 'timestamp',name: 'timestamp',label: 'Thời gian (mm/dd/yyyy)',value: '',required: true,},
    {id: 'temperature',name: 'temperature',label: 'Nhiệt độ',value: '',required: true,},
    {id: 'humidity',name: 'humidity',label: 'Độ ẩm',value: '',required: true,},
    {id: 'uvIndex',name: 'uvIndex',label: 'Tia UV',value: '',required: true,},
  ];
  
  formDataFields3: any[] = [
    {
      id: 'name',
      name: 'name',
      label: 'Tên địa điểm',
      value: '',
      required: true,
    },
    {
      id: 'latitude',
      name: 'latitude',
      label: 'Latitude',
      value: '',
      required: true,
    },
    {
      id: 'longitude',
      name: 'longitude',
      label: 'Longitude',
      value: '',
      required: true,
    },
  ];
  timestamp!: string;

  updateTimestamp(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target && target.value) {
      this.timestamp = target.value;
    }
  }
  name: string = '';
  latitude: number = 0;
  longitude: number = 0;
  temperature: number | undefined;
  humidity: number | undefined;
  uvIndex: number | undefined;
  addedData: any;
  LocationData: any;
  showLink: boolean = false; // dùng để hiển thị đường link down load file dữ liệu

  // event: Event;

  constructor(private http: HttpClient, private authService: AuthService) {}

  addData(FormData: NgForm) {
    const date = new Date(FormData.value.timestamp); // như vậy hàm sẽ định dạng theo tháng - ngày - năm
    const visData = {
      name: FormData.value.name,
      latitude: FormData.value.latitude,
      longitude: FormData.value.longitude,
      data: [
        {
          timestamp: date, //new Date(),
          sensors: {
            temperature: FormData.value.temperature,
            humidity: FormData.value.humidity,
            uvIndex: FormData.value.uvIndex,
          },
        },
      ],
    };
    // this.addedData = visData;
    console.log('dữ liệu gửi từ form trước khi gọi api: ', visData);
    this.authService.addData(visData).subscribe({
      next: (Response) => {
        alert('Dữ liệu trả về từ Node: ' + JSON.stringify(Response));
        // console.log("dữ liệu gửi đi sau khi gọi api: ", visData )
      },
      error: (error) => {
        alert('Dữ liệu trả về từ Node: ' + JSON.stringify(error));
      },
    });
  }
  getAllLoc(_t37: NgForm) {
    this.authService.getAllLoc().subscribe({
      next: (response) => {
        this.LocationData = response;
        this.LocationData = JSON.stringify(this.LocationData);
        this.LocationData = JSON.parse(this.LocationData);
        // Khi có dữ liệu, hiển thị đường link
        this.showLink = true;

        // phần code sau để thử nghiệm dữ liệu trả về
        let processedData = this.LocationData.map(
          (item: {
            _id: string;
            name: string;
            latitude: number;
            longitude: number;
          }) => {
            return {
              id: item._id,
              name: item.name,
              latitude: item.latitude,
              longitude: item.longitude,
            };
          }
        );
        alert('Dữ liệu trả về từ Node: ' + this.LocationData[0].name);
        // Kiểm tra xem mảng LocationData có phần tử hay không
        if (this.LocationData && this.LocationData.length > 0) {
          // Tạo nội dung CSV
          const csvContent = this.convertToCSV(this.LocationData);

          // Tạo một đối tượng Blob từ nội dung CSV
          const blob = new Blob([csvContent], { type: 'text/csv' });

          // Tạo một đường link tạm thời để tải xuống file
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);

          // Đặt tên file cho đường link
          link.download = 'data.csv';

          // Kích hoạt sự kiện click để tải xuống file
          link.click();
        } else {
          // Xử lý trường hợp mảng không có phần tử
          alert('Dữ liệu trả về từ Node không có phần tử.');
        }
      },
      error: (error) => {
        console.error('Error adding data:', error);
        const errorMessage = error.error.message;
        alert('Dữ liệu trả về từ Node: ' + JSON.stringify(errorMessage));
      },
    });
  }

  downloadCSV(event: Event) {
    event.preventDefault(); // Ngăn chặn chuyển hướng đến trang khác
    if (this.LocationData && this.LocationData.length > 0) {
      const csvContent = this.convertToCSV(this.LocationData);
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);

      // Tạo một đường link tạm thời để hiển thị trên trang web
      const link = document.createElement('a');
      link.href = url;
      link.download = 'data.csv';
      document.body.appendChild(link);

      // Khi người dùng click vào đường link, họ sẽ tải xuống file
      link.click();

      // Xóa đường link sau khi tải xuống hoàn tất
      document.body.removeChild(link);
    } else {
      alert('Dữ liệu trả về từ Node không có phần tử.');
    }
  }

  // Phương thức chuyển đổi dữ liệu thành chuỗi CSV
  convertToCSV(data: any[]): string {
    const header = Object.keys(data[0]).join(',');
    const body = data.map((obj) => Object.values(obj).join(',')).join('\n');
    return `${header}\n${body}`;
  }
  // Xử lý việc chọn file thêm dữ liệu từ file csv
  onFileSelected($event: Event) {}

  /**
   * Retrieves all data from the server and performs necessary operations.
   * @param _t71 - The NgForm object.
   */
  getAllData(_t71: NgForm) {
    this.authService.getAllData().subscribe((data) => {
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'data.json';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    });
  }
  // Lấy toàn bộ dữ liệu theo địa điểm
  getOneData(Form4: NgForm) {
    const visData = {
      name: Form4.value.name,
      latitude: Form4.value.latitude,
      longitude: Form4.value.longitude,
    };
    this.authService
      .getOneData(Form4.value.name, Form4.value.latitude, Form4.value.longitude)
      .subscribe((data) => {
        const blob = new Blob([JSON.stringify(data, null, 2)], {
          type: 'application/json',
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.json';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      });
  }
  //cập nhập dữ liệu đã có thành dữ liệu mới thêm vào
  updateData(FormData: NgForm) {
      // const date = new Date(FormData.value.timestamp); // như vậy hàm sẽ định dạng theo tháng - ngày - năm
      console.log("Ngày tháng:", FormData.value.timestamp)
      let a = this.kiemTraDinhDangNgay(FormData.value.timestamp)
      if (a === 0) {
        // Continue with the code
        console.log(
          'Định dạng ngày tháng năm phải là mm/dd/yyyy. Vui lòng nhập lại'
        );
        alert('Định dạng ngày tháng năm phải là mm/dd/yyyy. Vui lòng nhập lại')
        return;
      } else if (a === 1) {
        console.log('Hợp lệ');
        // sau khi ktra ngày nhập đúng thì xử lý tiếp
        const date = this.formatTimestamp(FormData.value.timestamp);
        console.log('Ngày tháng đã chuyển đổi:', date);
        const visData = {
          name: FormData.value.name,
          latitude: FormData.value.latitude,
          longitude: FormData.value.longitude,
          data: [
            {
              timestamp: date, //new Date(),
              sensors: {
                temperature: FormData.value.temperature,
                humidity: FormData.value.humidity,
                uvIndex: FormData.value.uvIndex,
              },
            },
          ],
        };
        console.log("Dữ liệu gửi đi:", visData)
        this.authService.updateData(visData).subscribe({
          next: (Response) => {
            alert('Dữ liệu trả về từ Node: ' + JSON.stringify(Response));
            // console.log("dữ liệu gửi đi sau khi gọi api: ", visData )
          },
          error: (error) => {
            alert('Dữ liệu trả về từ Node: ' + JSON.stringify(error));
          },
        });

        return;
      } else if (a === 2) {
        alert('Ngày nhập vào không hợp lệ. Vui lòng nhập lại')
        console.log('Ngày nhập vào không hợp lệ. Vui lòng nhập lại');
        return;
      } 
      // const date = this.formatTimestamp(FormData.value.timestamp)
      // console.log("Ngày tháng đã chuyển đổi:", date)
      return
      // const visData = {
      //   name: FormData.value.name,
      //   latitude: FormData.value.latitude,
      //   longitude: FormData.value.longitude,
      //   data: [
      //     {
      //       timestamp: date, //new Date(),
      //       sensors: {
      //         temperature: FormData.value.temperature,
      //         humidity: FormData.value.humidity,
      //         uvIndex: FormData.value.uvIndex,
      //       },
      //     },
      //   ],
      // };
      // console.log("Dữ liệu gửi đi:", visData)
      // // return
      // this.authService.updateData(visData).subscribe({
      //   next: (Response) => {
      //     alert('Dữ liệu trả về từ Node: ' + JSON.stringify(Response));
      //     // console.log("dữ liệu gửi đi sau khi gọi api: ", visData )
      //   },
      //   error: (error) => {
      //     alert('Dữ liệu trả về từ Node: ' + JSON.stringify(error));
      //   },
      // });
  }

  /**
   * Formats a timestamp string in the format "mm/dd/yyyy" into ISO 8601 format.
   * @param dateString - The timestamp string to format.
   * @returns The formatted date string in ISO 8601 format.
   */
  formatTimestamp(dateString: string) {
    // Split the input date string "mm/dd/yyyy" into components
    const parts = dateString.split('/');
    const date = new Date(Date.UTC(Number(parts[2]), Number(parts[0]) - 1, Number(parts[1])));

    // Return the formatted date string in ISO 8601 format
    return date.toISOString();
  }
  /**
   * Kiểm tra định dạng và tính hợp lệ của ngày tháng.
   * @param ngayNhapVao - Chuỗi đại diện cho ngày tháng (mm/dd/yyyy).
   * @returns Một thông báo về tính hợp lệ của ngày tháng.
   */
  kiemTraDinhDangNgay(ngayNhapVao: string) {
    // Kiểm tra định dạng mm/dd/yyyy
    const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/(19|20)\d\d$/; // yêu cầu phải nhập 00/00/0000
    const regex1 =/^(0?[1-9]|1[0-2])\/(0?[1-9]|[12][0-9]|3[01])\/(19|20)\d\d$/; // cho phép nhập tắt 1 chữ số
    
    // Kiểm tra định dạng
    if (!regex1.test(ngayNhapVao)) {
      return 0; //"Định dạng ngày tháng năm phải là mm/dd/yyyy. Vui lòng nhập lại.";
    }
    
    // Kiểm tra tính hợp lệ của ngày
    const [thang, ngay, nam] = ngayNhapVao.split('/').map(Number);
    const ngayDuocTao = new Date(nam, thang - 1, ngay);
    if (ngayDuocTao.getFullYear() !== nam || ngayDuocTao.getMonth() + 1 !== thang || ngayDuocTao.getDate() !== ngay) {
      return 2 //"Ngày nhập vào không hợp lệ. Vui lòng nhập lại.";
    }
    
    return 1 //"Ngày hợp lệ.";
  }

}
