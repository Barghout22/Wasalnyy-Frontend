import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChooseRegisterComponent } from "./components/reg-option/reg-option";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ChooseRegisterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Wasalnyy-Frontend');
}
