import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
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
  public height: number = 0;
  public width: number = 0;

  private subscription: Subscription;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.doDivHeightChange(this.getHeightAndWidthObject());
  }

  constructor(
    private wrappedElement: ElementRef<HTMLFormElement> // private renderer: Renderer2
  ) {
    // renderer.setStyle(wrappedElement.nativeElement, 'backgroundColor', 'gray');
  }

  ngAfterViewInit() {
    this.setupHeightMutationObserver();
    this.doDivHeightChange(this.getHeightAndWidthObject());
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private getHeightAndWidthObject(): HeightAndWidth {
    const { offsetHeight: currentHeight, offsetWidth: currentWidth } =
      this.wrappedElement.nativeElement;
    const newValues = new HeightAndWidth(currentHeight, currentWidth);
    return newValues;
  }

  private setupHeightMutationObserver() {
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

  private doDivHeightChange(newValues: HeightAndWidth) {
    // necessary make it more generally
    // const main = document.querySelector('.section__form');
    const main = this.wrappedElement.nativeElement.parentElement;
    if (main) {
      main.scrollTop = main.clientHeight;
    }

    this.height = newValues.height;
    this.width = newValues.width;
  }
}
