import { Directive, HostBinding, HostListener, Inject, InjectionToken, Input, Optional } from '@angular/core';

export const TOGGLE_BACKGROUND_DEFAULT_COLOR = new InjectionToken<string>('Toggle Background Default Color');

@Directive({
  selector: '[appToggleBackground]',
  standalone: true
})
export class ToggleBackgroundDirective {
  private hasBackground = true;
  readonly defaultColor: string;

  @Input('appToggleBackground') color: string | undefined;

  @HostBinding('style.background-color') get bgColor() {
    return this.hasBackground ? (this.color || this.defaultColor) : '';
  }

  @HostListener('click') toggleBackground() {
    this.hasBackground = !this.hasBackground;
  }

  constructor(@Optional() @Inject(TOGGLE_BACKGROUND_DEFAULT_COLOR) defaultColor: string | null) {
    this.defaultColor = defaultColor || 'red';
  }
}
