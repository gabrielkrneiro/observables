import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  Observable,
  Subscription,
  tap,
} from 'rxjs';

class HeightAndWidth {
  constructor(public height: number, public width: number) {}
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'observables';

  public showAdditionalFields = false;
  public form: FormGroup;

  public height: number = 0;
  public width: number = 0;

  @ViewChild('formElement', { static: true })
  public formElement: ElementRef<HTMLFormElement>;

  // nao precisa pq a abordagem lá é diferente
  private subscription: Subscription;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.doDivHeightChange(this.getHeightAndWidthObject());
  }

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({});
  }

  ngAfterViewInit() {
    this.setupHeightMutationObserver();
    this.doDivHeightChange(this.getHeightAndWidthObject());
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getHeightAndWidthObject(): HeightAndWidth {
    const { offsetHeight: currentHeight, offsetWidth: currentWidth } =
      this.formElement.nativeElement;
    const newValues = new HeightAndWidth(currentHeight, currentWidth);
    return newValues;
  }

  setupHeightMutationObserver() {
    const observerable$ = new Observable<HeightAndWidth>((observer) => {
      const elementObserver = new MutationObserver(() => {
        observer.next(this.getHeightAndWidthObject());
      });

      elementObserver.observe(this.formElement.nativeElement, {
        attributes: true,
        childList: true,
        subtree: true,
      });
    });

    this.subscription = observerable$
      .pipe(debounceTime(0), distinctUntilChanged())
      .subscribe((newValues) => {
        this.doDivHeightChange(newValues);
      });
  }

  public doDivHeightChange(newValues: HeightAndWidth) {
    const main = document.querySelector('.section__form');
    if (main) {
      main.scrollTop = main.clientHeight;
    }

    this.height = newValues.height;
    this.width = newValues.width;
  }

  public buttonClicked() {
    this.showAdditionalFields = !this.showAdditionalFields;

    // const previousHeight = this.formElement.nativeElement.offsetHeight;

    // setTimeout(() => {
    //   const currentHeight = this.formElement.nativeElement.offsetHeight;

    //   console.log('previousHeight', previousHeight);
    //   console.log('currentHeight', currentHeight);
    // }, 0);
  }
}
