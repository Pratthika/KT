import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common'; // Good practice to include

@Component({
  selector: 'app-dashboard-card',
  standalone: true, // ADD THIS
  imports: [CommonModule],
  templateUrl: './dashboard-card.component.html',
  styleUrls: ['./dashboard-card.component.css'],
})
export class DashboardCardComponent {
  @Input() title = '';
  @Input() value: string | number = '';
  @Input() subtitle = '';
  @Input() icon = '';
  @Input() color: 'primary' | 'accent' | 'success' | 'warning' = 'primary';
}