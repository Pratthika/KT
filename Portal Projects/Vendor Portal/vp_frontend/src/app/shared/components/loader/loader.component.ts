import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loader-wrap" [class.fullscreen]="fullscreen">
      <div class="loader-ring">
        <div></div><div></div><div></div><div></div>
      </div>
      <div class="loader-text" *ngIf="message">{{ message }}</div>
    </div>
  `,
  styles: [`
    .loader-wrap {
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      padding: 48px; gap: 16px;
    }
    .loader-wrap.fullscreen {
      position: fixed; inset: 0;
      background: rgba(247,248,251,0.85);
      backdrop-filter: blur(4px);
      z-index: 999;
    }
    .loader-ring {
      width: 40px; height: 40px;
      position: relative;
    }
    .loader-ring div {
      box-sizing: border-box;
      display: block;
      position: absolute;
      width: 40px; height: 40px;
      border: 3px solid transparent;
      border-top-color: var(--kt-orange);
      border-radius: 50%;
      animation: spin 1s cubic-bezier(0.5,0,0.5,1) infinite;
    }
    .loader-ring div:nth-child(2) { animation-delay: -0.15s; border-top-color: rgba(244,130,30,0.6); }
    .loader-ring div:nth-child(3) { animation-delay: -0.30s; border-top-color: rgba(244,130,30,0.3); }
    .loader-ring div:nth-child(4) { animation-delay: -0.45s; border-top-color: rgba(244,130,30,0.1); }
    @keyframes spin { to { transform: rotate(360deg); } }
    .loader-text { font-size: 13px; color: var(--kt-gray-500); font-weight: 500; }
  `]
})
export class LoaderComponent {
  @Input() message = '';
  @Input() fullscreen = false;
}