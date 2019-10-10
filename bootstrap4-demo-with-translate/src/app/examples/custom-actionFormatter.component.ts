import { Component} from '@angular/core';

@Component({
  template: `<div id="{{dropDownId}}" class="dropdown pointer" style="position:relative; z-index:12000;">
  <a href class="dropdown-toggle" id="{{dropDownMenuId}}"
   data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
    Action
    <span class="caret"></span>
  </a>
  <ul class="dropdown-menu">
    <span class="dropdown-item text-primary" >{{dataContext.title}}</span>
    <div class="dropdown-divider"></div>
    <a class="dropdown-item pointer" >action1</a>
    <a class="dropdown-item pointer">action2</a>
    <div class="dropdown-divider"></div>
    <a class="dropdown-item text-danger" (click)="parent.deleteCell(row)">Delete Row</a>
  </ul></div>`

})
export class CustomActionFormatterComponent{

  parent: any;
  row: number;
  dataContext : any
  dropDownId  = 'myDrop';
  dropDownMenuId = 'dropdownMenu1';
 
}
