// guestview.components.ts

import { HttpClient } from '@angular/common/http';
import { Component, AfterViewInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import * as d3 from 'd3';

declare let L: any; // Khai báo biến L từ thư viện Leaflet
// Khai báo định dạng data hiển thị trên bản đồ
interface MarkerData {
  name: string;
  lat: number;
  lng: number;
}
interface SensorData {
  name: string; // Tên của cảm biến
  value: number; // Giá trị dữ liệu từ cảm biến
}
interface DataPoint {
  timestamp: Date | string; // Đối tượng Date hoặc chuỗi đại diện cho thời gian
  sensors: SensorData[]; // Mảng chứa dữ liệu từ các cảm biến
}
interface DataChart {
  timestamp: Date | string;
  value: number; // Giá trị dữ liệu từ cảm biến
}

@Component({
  selector: 'app-guestview',
  // standalone: true,
  // imports: [],
  templateUrl: './guestview.component.html',
  styleUrl: './guestview.component.css',
})
export class GuestviewComponent implements AfterViewInit {
  currentPage: number = 0; // Trang hiện tại, bắt đầu từ 0
  itemsPerPage: number = 18; // Số lượng điểm dữ liệu trên mỗi trang
  totalPages: number = 0; // Tổng số trang, sẽ được tính toán
lineChartVisible: any = false;

  // Nút chỉnh slide dữ liệu biểu đồ hiển thị
  navigate(direction: string) {
    if (direction === 'next' && this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.drawChartForCurrentPage();
    } else if (direction === 'prev' && this.currentPage > 0) {
      this.currentPage--;
      this.drawChartForCurrentPage();
    }
  }

  years: number[] = [2022, 2023, 2024];
  selectedYear: number = new Date().getFullYear();

  onYearChange($event: Event) {
    const selectElement = $event.target as HTMLSelectElement;
    this.selectedYear = Number(selectElement.value);
    // this.createChart02(this.selectedYear);
  }
  // selectedYear: number = new Date().getFullYear(); // Năm mặc định là năm hiện tại - sử dụng cho biểu đồ
  LocationData: any;
  OnClickData: any;
  showLink: boolean = false; // dùng để hiển thị đường link down load file dữ liệu
  addedData: any;
  markerData: MarkerData[] = [
    { name: 'Huflit-01', lat: 10.779128980496425, lng: 106.66667808566008 },
    { name: 'Địa điểm 2', lat: 10.9231, lng: 106.9297 },
    { name: 'NodeMCU', lat: 10.768875727633148, lng: 106.66684231611457 },
    // Thêm các địa điểm khác ở đây...
  ];

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngAfterViewInit(): void {
    this.authService.getAllLoc().subscribe({
      next: (response) => {
        console.log(this.LocationData);
        this.LocationData = response;
      },
      error: (error) => {
        console.error('Error adding data:', error);
        const errorMessage = error.error.message;
        alert('Dữ liệu trả về từ Node: ' + JSON.stringify(errorMessage));
      },
    });

    if (window.hasOwnProperty('L')) {
      // Kiểm tra xem biến L đã tồn tại chưa

      const map = L.map('map').setView([10.8231, 106.6297], 13); // vị trí thành phố hồ chí minh

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);
      // Tạo biểu tượng vị trí
      const locationIcon = L.icon({
        iconUrl: '../../../assets/leaflet/images/marker-icon.png', // Đường dẫn đến biểu tượng vị trí
        iconSize: [25, 41], // Kích thước của biểu tượng
        iconAnchor: [12, 41], // Vị trí neo của biểu tượng, theo tọa độ (x, y)
        popupAnchor: [1, -34], // Vị trí neo của Popup, theo tọa độ (x, y)
      });
      this.markerData.forEach((data) => {
        const marker = L.marker([data.lat, data.lng], { icon: locationIcon })
          .addTo(map)
          .bindPopup(
            `<b>${data.name}</b><br>Latitude: ${data.lat}<br>Longitude: ${data.lng}`
          );

        // bổ sung xử lý sự kiện click vào biểu tượng với hàm handleMarkerClick
        marker.on('click', () => {
          this.handleMarkerClick(data);
        });
      });
    } else {
      console.error('Leaflet library not loaded.'); // Thông báo nếu thư viện Leaflet chưa được tải
    }
  }
  // hàm xử lý sự kiện click vào biểu tượng vị trí sẽ hiển thị nội dung thông tin vị trí vào dưới bảng đồ
  handleMarkerClick(data: MarkerData): void {
    console.log('Marker clicked:', data);
    this.OnClickData = []; // Xóa dữ liệu cũ của biểu đồ trước khi vẽ biểu đồ mới
    d3.select('#chart-container svg').remove();

    this.authService.getOneLocation(data.name, data.lat, data.lng).subscribe({
      next: (response) => {
        console.log('Response:', response);
        this.OnClickData = response;
        const processedData = response.data.map((item: any) => ({
          timestamp: item.timestamp,
          sensor: item.sensors,
        }));
        console.log('Processed Data:', processedData);
        this.OnClickData = this.convertData(processedData);
        this.processData(this.OnClickData);

        // this.createChart01(this.OnClickData);
        // this.createChart02(processedData);

        // TODO: Xử lý dữ liệu được xử lý từ D3.js
      },
      error: (error) => {
        console.error('Error:', error);
        // TODO: Handle the error
      },
    }); // Pass the required arguments to the getOneLocation() method
  }

  private createChart02(DataChart: DataPoint[]): void {
    console.log('Dữ liệu được truyền vào: ', DataChart);

    // Convert data truyền vào thành đúng dạng vẽ biểu đồ
    // const data = this.convertData(DataChart);
    const data = DataChart;
    // const processedData = data.map(d => {
    //   const sensorValue = d.sensors.find(sensor => sensor.name === name)?.value || 0;
    //   return { date: new Date(d.timestamp), value: sensorValue };
    // }).filter(d => d.date.getFullYear() === yearview);
    // console.log('Dữ liệu sau khi chuyển: ', data);

    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = 1400 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3
      .select('#chart-container')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    const y = d3.scaleLinear().domain([0, 100]).range([height, 0]);

    const defaultExtent: [Date, Date] = [
      new Date(2024, 0, 1),
      new Date(2024, 12, 31),
    ]; // Giả sử giá trị mặc định

    const x = d3
      .scaleTime()
      .domain(
        (d3.extent(data, (d: DataPoint) => new Date(d.timestamp)) as [Date,Date]) || defaultExtent)
      .range([0, width]);

    DrawLine('humidity', 'steelblue', 'steelblue', this.selectedYear);
    DrawLine('temperature', 'green', 'green', this.selectedYear);
    DrawLine('uvIndex', 'red', 'red', this.selectedYear);

    // Vẽ trục x và y

    const xAxis = d3
      .axisBottom(x)
      .tickSize(0) // Bỏ dấu gạch
      .tickFormat(() => ''); // Bỏ nhãn
      // .tickFormat((domainValue: Date | any, index: number) => {
      //   // Giả định domainValue là Date hoặc number, sử dụng kiểm tra runtime để xác định kiểu
      //   if (domainValue instanceof Date) {
      //     return d3.timeFormat('%d-%m-%Y')(domainValue);
      //   }
      //   // Trả về chuỗi rỗng hoặc xử lý khác cho giá trị number
        // return '';
    
    svg.append('g')
      .attr('transform', `translate(0, ${height})`) // Đặt vị trí của trục x ở dưới cùng của SVG
      .call(xAxis);
 
    const yAxis = d3.axisLeft(y);
    svg
      .append('g')
      .attr('transform', `translate(-10, 0)`) // Di chuyển trục y về bên trái
      .call(yAxis);

    /**
     * Draws a line chart for a specific sensor.
     *
     * @param name - The name of the sensor.
     * @param colorLine - The color of the line.
     * @param colorText - The color of the text.
     * @param yearview - The year to filter the data.
     */
    function DrawLine(
      name: string,
      colorLine: string,
      colorText: string,
      yearview: number
    ) {
      // Lọc dữ liệu chỉ trong năm được chỉ định
      const yearData = data.filter(
        (d) => new Date(d.timestamp).getFullYear() === yearview
      );

      const line = d3
        .line<DataPoint>()
        .x((d: DataPoint) => x(new Date(d.timestamp)))
        .y((d: DataPoint) => {
          const sensorValue = d.sensors.find(
            (sensor: { name: string; value: number }) => sensor.name === name
          )?.value;
          return y(sensorValue ?? 0);
        });
// thêm nhãn
const legendData = [
  { color: 'red', label: 'Chỉ số tia UV' },
  { color: 'blue', label: 'Chỉ số nhiệt độ - Temperate' },
  { color: 'green', label: 'Chỉ số độ ẩm - Humidity' }
];
const legend = svg.append('g')
  .attr('class', 'legend')
  .attr('transform', `translate(${width - 200}, 20)`); // Điều chỉnh vị trí của chú giải
  legendData.forEach((item, index) => {
    // Thêm hình dạng cho chú giải (ở đây là hình chữ nhật)
    legend.append('rect')
      .attr('x', 0)
      .attr('y', index * 20) // Điều chỉnh khoảng cách giữa các mục
      .attr('width', 10)
      .attr('height', 10)
      .style('fill', item.color); // Sử dụng màu sắc từ dữ liệu chú giải
    
    // Thêm nhãn cho mỗi mục chú giải
    legend.append('text')
      .attr('x', 20) // Điều chỉnh vị trí nhãn so với hình dạng
      .attr('y', index * 20 + 10) // Đảm bảo nhãn cân đối với hình dạng
      .text(item.label) // Sử dụng nhãn từ dữ liệu chú giải
      .style('font-size', '12px')
      .attr('text-anchor', 'start')
      .style('fill', item.color); // Có thể thay đổi màu chữ nếu muốn
  });


      svg
        .append('path')
        .datum(yearData)
        .attr('fill', 'none')
        .attr('stroke', colorLine)
        .attr('stroke-width', 1.5)
        .attr('transform', `translate(10, 0)`) // Di chuyển trục y về bên trái
        .attr('d', line);
      // Hiển thị tên của cảm biến
      data.forEach((d: DataPoint) => {
        const sensorValue = d.sensors.find(
          (sensor) => sensor.name === name
        )!.value;
        // Vẽ vòng tròn trên điểm dữ liệu
        svg
          .append('circle')
          .attr('cx', x(new Date(d.timestamp)))
          .attr('cy', y(sensorValue))
          .attr('r', 5)
          .attr('transform', `translate(10, 0)`) // Di chuyển trục y về bên trái
          .attr('fill', colorText);

        // Hiển thị nội dung text của điểm dữ liệu
        svg
          .append('text')
          .attr('x', x(new Date(d.timestamp)))
          .attr('y', y(sensorValue) - 10)
          .text(sensorValue.toString())
          .attr('text-anchor', 'middle')
          .attr('transform', `translate(10, 0)`) // Di chuyển trục y về bên trái
          .attr('fill', colorText);

        // Hiển thị ngày tháng năm
        const formatDate = d3.timeFormat('%d-%m-%Y');
        svg
          .append('text')
          .attr('x', x(new Date(d.timestamp)))
          .attr('y', height + 20)
          .text(formatDate(new Date(d.timestamp)))
          .attr('text-anchor', 'middle')
          .attr('fill', 'black')
          .attr('transform', `translate(-10, 0)`) // Di chuyển trục y về bên trái
          .attr('font-size', '10px');
      });
    }
  }

  // Hàm chuyển dữ liệu nhận về từ API sang dạng để vẽ biểu đồ.
  private convertData(data: any[]): any[] {
    const convertedData = data.map((item) => {
      const timestamp = item.timestamp;
      let sensors: { name: string; value: number }[] = [];
      if (item.sensor && typeof item.sensor === 'object') {
        sensors = Object.keys(item.sensor).map((key) => {
          const name = key;
          const value = item.sensor[key];
          return { name, value };
        });
      }
      return { timestamp, sensors };
    });
    return convertedData;
  }
  // Hàm này được gọi khi dữ liệu được lấy về từ API
  processData(data: DataPoint[]) {
    this.totalPages = Math.ceil(data.length / this.itemsPerPage);
    this.drawChartForCurrentPage();
  }

  // Hàm vẽ biểu đồ cho trang hiện tại
  drawChartForCurrentPage() {
    d3.select('#chart-container').selectAll('*').remove();
    this.lineChartVisible = true;

    const startIndex = this.currentPage * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const currentPageData = this.OnClickData.slice(startIndex, endIndex);

    // Vẽ biểu đồ sử dụng currentPageData
    this.createChart02(currentPageData);
    console.log('du liệu draw:', currentPageData);
  }
}
