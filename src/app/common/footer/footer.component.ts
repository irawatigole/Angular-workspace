import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.sass']
})
export class FooterComponent implements OnInit {
  copyright: any;

  constructor() { }

  ngOnInit(): void {
    const d = new Date();
    this.copyright = d.getFullYear();
  }

}
