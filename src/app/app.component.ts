import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'observables';

  public showAdditionalFields = false;
  public form: FormGroup;

  @ViewChild('formElement', { static: true })
  public formEl: ElementRef<HTMLFormElement>;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({});
  }

  public buttonClicked() {
    this.showAdditionalFields = !this.showAdditionalFields;
  }
}
