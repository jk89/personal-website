import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'quote-with-author',
  templateUrl: './quote-with-author.component.html',
  styleUrls: ['./quote-with-author.component.scss'],
})
export class QuoteWithAuthorComponent implements OnInit {

  @Input("author") author: string = "Author";
  @Input("quote") quote:string = "Quote";

  constructor() { }

  ngOnInit() {}

}
