import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'ebt-inquiry-info',
  templateUrl: './ebt-inquiry-info.component.html',
  styleUrls: ['./ebt-inquiry-info.component.scss']
})
export class EbtInquiryInfoComponent implements OnInit, OnDestroy {
  public message: string;

  constructor(
    public dialogRef: MatDialogRef<EbtInquiryInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }
}
