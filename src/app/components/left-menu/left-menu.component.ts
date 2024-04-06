// tạm thời không sử dụng - sử dụng trực tiếp trên app component
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';

@Component({
  selector: 'app-left-menu',
  // standalone: true,
  // imports: [],

  templateUrl: './left-menu.component.html',
  styleUrl: './left-menu.component.css',
  animations: [
    trigger('myAnimation', [
      // ... các cấu hình animation khác
      // Ví dụ: một animation đơn giản là chuyển động từ trái sang phải
      state('open', style({
        transform: 'translateX(0)',
      })),
      state('closed', style({
        transform: 'translateX(-100%)',
      })),
      transition('open <=> closed', [
        animate('0.5s'),
      ]),
    ]),
  ],
})
export class LeftMenuComponent {
  opened: boolean = true; // Thay đổi giá trị theo ý muốn của bạn
  events: string[] = [];
  
  toggleMenu() {
    this.opened = !this.opened;
  }
}
