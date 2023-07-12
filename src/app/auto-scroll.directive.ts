import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  Renderer2,
} from '@angular/core';
import {
  debounceTime,
  distinctUntilChanged,
  Observable,
  Subscription,
} from 'rxjs';

class HeightAndWidth {
  constructor(public height: number, public width: number) {}
}

@Directive({
  selector: '[autoScroll]',
})
export class AutoScrollDirective {
  @Input('autoScroll') wrappedElement: ElementRef<HTMLFormElement>;

  public height: number = 0;
  public width: number = 0;

  private subscription: Subscription;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.doDivHeightChange(this.getHeightAndWidthObject());
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
      this.wrappedElement.nativeElement;
    const newValues = new HeightAndWidth(currentHeight, currentWidth);
    return newValues;
  }

  setupHeightMutationObserver() {
    const observerable$ = new Observable<HeightAndWidth>((observer) => {
      const elementObserver = new MutationObserver(() => {
        observer.next(this.getHeightAndWidthObject());
      });

      elementObserver.observe(this.wrappedElement.nativeElement, {
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
}
