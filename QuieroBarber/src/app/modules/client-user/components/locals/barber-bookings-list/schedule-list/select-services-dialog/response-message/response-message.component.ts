import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-response-message',
  templateUrl: './response-message.component.html',
  styleUrls: ['./response-message.component.scss'],
})
export class ResponseMessageComponent implements OnInit {
  @Input() success:boolean

  constructor() { }

  ngOnInit() {}

}
