// auth.service.ts
import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';

import { environment } from '../../environments/environment';

// Interface MarkerData cho method lấy data location
interface MarkerData {
  name: string;
  lat: number;
  lng: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token!: string;
  isLogin: boolean = false;
  loginStatusChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  private isAuthenticated: boolean = false;
  private loggedInUser: string | null = null; // Thêm biến để lưu trữ thông tin người dùng
  // Thêm một Subject để thông báo về sự thay đổi trong thông tin người dùng đã đăng nhập
  userChange: Subject<string | null> = new Subject<string | null>();
  
  // định nghĩa đường dẫn trang chủ
  private homeUrl = `${environment.apiUrl}`; // Cập nhật đường dẫn API
  // Đây là api dùng cho đăng ký, gửi nhận dữ liệu
  private visapiUrl = `${environment.apiUrl}/vis`; // Cập nhật đường dẫn API
  // private visapiUrl = 'http://localhost:3000/vis'; // Điều chỉnh đường dẫn API theo ứng dụng của bạn
  // api liên quan dữ liệu vị trí và số liệu hiển thị trên bản đồ
  // method cần : thêm vị trí mới, xóa vị trí, tạo dữ liệu tự động theo vị trí
  // method đã khai báo: registerLocation, deleteLocation

  private apiUrl = `${environment.apiUrl}/acc`; 
  // private apiUrl = 'http://localhost:3000/acc'; // Điều chỉnh đường dẫn API theo ứng dụng của bạn
  // đây là api để check liên quan tài khoản người dùng - user
  // có các method đã khai báo: login, logout, registerUser, getLoggedInUser, checklogin
  // loginStatusChanged: any;

  constructor(private http: HttpClient) {}

  // *************** Begin phần của api VisData ********* //
  // đăng ký Location mới
  registerLocation(userData: any): Observable<any> {
    return this.http.post(`${this.visapiUrl}/register`, userData).pipe(
      tap((response) => {
        // Actions to perform after successful registration
        console.log('Registration successful:', response);
      }),
      catchError((error) => {
        console.error('Registration error:', error);
        throw error;
      })
    );
  }
  // đăng ký location mới  theo file csv
  addAllLocation(formData: FormData): Observable<any> {
    return this.http.post(`${this.visapiUrl}/registerFileCSV`, FormData).pipe(
      tap((response) => {
        // Actions to perform after successful registration
        console.log('Registration successful:', response);
      }),
      catchError((error) => {
        console.error('Registration error:', error);
        throw error;
      })
    );
  }
  // Xóa vị trí đã có
  deleteLocation(
    name: string,
    latitude: number,
    longitude: number
  ): Observable<any> {
    return this.http
      .delete(`${this.visapiUrl}/delLocation/${name}/${latitude}/${longitude}`)
      .pipe(
        tap((response) => {
          // Actions to perform after successful registration
          console.log('Delete successful:', response);
        }),
        catchError((error) => {
          console.error('Delete error:', error);
          throw error;
        })
      );
  }
  // Lấy dữ liệu về từ một vị trí với medthod getOne
  // Phương thức để lấy dữ liệu từ một vị trí cụ thể
  getOneLocation(
    name: string,
    latitude: number,
    longitude: number
  ): Observable<any> {
    return this.http
      .get<any>(`${this.visapiUrl}/getOne/${name}/${latitude}/${longitude}`)
      .pipe(
        tap((response) => {
          console.log('Data received for location:', response);
        }),
        catchError((error) => {
          console.error('Error fetching data for location:', error);
          throw error;
        })
      );
  }

  // Lấy al data từ 1 địa điểm + lat + long
  getOneData(
    name: string,
    latitude: number,
    longitude: number
  ): Observable<any> {
    return this.http
      .get<any>(`${this.visapiUrl}/getOne/${name}/${latitude}/${longitude}`)
      .pipe(
        tap((response) => {
          console.log('Data received for location:', response);
        }),
        catchError((error) => {
          console.error('Error fetching data for location:', error);
          throw error;
        })
      );
  }
  // Phương thức để lấy dữ liệu name, lat, long trong toàn dữ liệu
 // getAllLoc(): Observable<any> {
   // return this.http.get<any[]>(`${this.visapiUrl}/getAllLocation`).pipe(
     // tap((response) => {
       // console.log('Data received for location:', response);
       // this.markerData = response.map((location: any) => ({
        //  name: location.name,
       //   lat: location.lat,
       //   lng: location.lng,
      //  }));
     // }),
    //  catchError((error) => {
    //    console.error('Error fetching data for location:', error);
    //    throw error;
   //   })
   // );
 // }

//ver 0.2
getAllLoc(): Observable<MarkerData[]> {
  return this.http.get<any[]>(`${this.visapiUrl}/getAllLocation`).pipe(
    map((response: any[]) => {
      // Chuyển đổi dữ liệu nhận được từ API thành định dạng MarkerData[]
      console.log('Data rec for location:', response);
      const fixedData = response.map((location:any) => ({
        name: location.name, // Xử lý trường hợp thiếu tên
        lat: parseFloat(location.latitude),          // Xử lý trường hợp thiếu vĩ độ
        lng: parseFloat(location.longitude),          // Xử lý trường hợp thiếu kinh độ
      }));
      console.log('Fixed Data for location:', fixedData);
      return fixedData; // Trả về dữ liệu đã được chuyển đổi
    }),
    catchError((error) => {
      console.error('Error fetching data for location:', error);

      // Tùy chọn: Trả về một giá trị mặc định trong trường hợp lỗi
      const fallbackData: MarkerData[] = [
        { name: 'Default Location', lat: 0, lng: 0 },
      ];
      return of(fallbackData);

      // Hoặc ném lỗi ra ngoài nếu không muốn tiếp tục xử lý
      // throw error;
    })
  );
}



  // Phương thức để lấy toàn bộ dữ liệu
  getAllData(): Observable<any> {
    return this.http.get<any[]>(`${this.visapiUrl}/getAllData`).pipe(
      tap((response) => {
        console.log('Data received for location:', response);
      }),
      catchError((error) => {
        console.error('Error fetching data for location:', error);
        throw error;
      })
    );
  }
  // Phương thức cập nhật dữ liệu theo địa điểm và thời gian - check time không trùng lắp
  addData(FormData: any): Observable<any> {
    return this.http.post<any[]>(`${this.visapiUrl}/upData`, FormData).pipe(
      tap((response) => {
        console.log('Thông tin từ server trả về:', response);
      }),
      catchError((error) => {
        console.error('Error update data for location:', error);
        throw error;
      })
    );
  }

  // Phương thức sửa dữ liệu theo địa điểm và thời gian
  updateData(FormData: any): Observable<any> {
    return this.http.post<any[]>(`${this.visapiUrl}/updateData`, FormData).pipe(
      tap((response) => {
        console.log('Thông tin từ server trả về:', response);
      }),
      catchError((error) => {
        console.error('Error update data for location:', error);
        throw error;
      })
    );
  }

  // phương thức chuyển đổi data nhận được thành dạng yêu cầu: method convertDataLocation()
  // Hàm chuyển đổi dữ liệu vị trí nhận được thành dạng yêu cầu
  convertDataLocation(data: any[]): MarkerData[] {
    return data.map((item) => ({
      name: item.name,
      lat: item.latitude,
      lng: item.longitude,
    }));
  }

  // *************** Bắt đầu phần của api User ********* //
  login(username: string, password: string): Observable<any> {
    const body = { username, password };
    // return this.http.post<LoginResponse>(`${this.apiUrl}/login`, body).pipe(   // sử dụng khi định nghĩa kiểu dữ liệu tra về
    return this.http.post<any>(`${this.apiUrl}/login`, body).pipe(
      tap((response) => {
        if (response.token !== null) {
          this.token = response.token;
          localStorage.setItem('token', this.token);
        }
        // Thực hiện các hành động sau khi đăng nhập thành công
        this.isAuthenticated = true;
        this.loggedInUser = response.username;
        this.userChange.next(this.loggedInUser);
        console.log('kết quả từ authen:', response);
        console.log('Token của user là :', response.usertoken);
        console.log('kết quả từ this.loggedInUser:', this.loggedInUser);
        // xử lý sự kiện login
        this.isLogin = true;
        this.loginStatusChanged.emit(this.isLogin);
      }),
      catchError((error) => {
        console.error('Login error:', error);
        throw error;
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}).pipe(
      tap((response) => {
        // Thực hiện các hành động sau khi đăng xuất
        this.isAuthenticated = false;
        this.isLogin = false;
        this.loginStatusChanged.emit(this.isLogin);
        this.token = '';
        localStorage.removeItem('token');
        location.assign('/');

        // location.assign(this.visapiUrl);
        // window.location.href = `${environment.apiUrl}`; // chuyển về trang guest
      }),
      catchError((error) => {
        console.error('Logout error:', error);
        throw error;
      })
    );
  }
  // đăng ký user mới
  registerUser(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData).pipe(
      tap((response) => {
        // Actions to perform after successful registration
        console.log('Registration successful:', response);
      }),
      catchError((error) => {
        console.error('Registration error:', error);
        throw error;
      })
    );
  }

  // lấy tên người dùng để hiển thị ở nơi khác
  getLoggedInUser(): string | null {
    return this.loggedInUser;
  }
  // kiểm tra đăng nhập chưa
  checklogin(): boolean {
    return this.isAuthenticated;
  }

  // Hàm để gửi yêu cầu HTTP với token đã được thêm vào tiêu đề
  sendAuthenticatedRequest(url: string, data: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    return this.http.post<any>(url, data, { headers });
  }
}
