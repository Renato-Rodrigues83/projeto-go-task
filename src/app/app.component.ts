import { Component } from '@angular/core';
import { HeaderComponent } from "./components/header/header.component";
import { MainContentComponent } from "./components/main-content/main-content.component";

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, MainContentComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent { }

