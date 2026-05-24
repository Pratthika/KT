import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common'; // 1. Import this
import { FormsModule } from '@angular/forms';
import { PayslippdfService } from '../../core/services/payslippdf.service';

@Component({
  selector: 'app-payslippdf',
  templateUrl: './payslippdf.component.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./payslippdf.component.css'],
})
export class PayslippdfComponent implements OnInit {
  pdfUrl: SafeResourceUrl | null = null;
  base64Pdf = '';
  loading = true;
  error = '';

  constructor(
    private auth: AuthService,
    private pdfService: PayslippdfService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const pernr = this.auth.getPernr();
    this.pdfService.getPayslipPdf(pernr).subscribe({
      next: (res) => {
        this.base64Pdf = res.pdf;
        const objectUrl = this.pdfService.getPdfObjectUrl(res.pdf);
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(objectUrl);
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load PDF. Please try again.';
        this.loading = false;
      },
    });
  }

  download(): void {
    if (this.base64Pdf) {
      this.pdfService.downloadPdf(this.base64Pdf, `payslip_${this.auth.getPernr()}.pdf`);
    }
  }
}