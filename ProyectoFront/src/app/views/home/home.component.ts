import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {


  constructor(public service: DataService){}

  public getResponse(): void {
    this.service.getResponse().subscribe((response: any) => {
      console.log(response);
    })
  }

  public ngOnInit():void{
    this.getResponse();
  }
}
