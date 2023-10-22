import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TOGGLE_BACKGROUND_DEFAULT_COLOR, ToggleBackgroundDirective } from './toggle-background.directive';

@Component({
  template: `
    <h1 appToggleBackground="yellow">Yellow</h1>
    <h2 appToggleBackground>Default</h2>
    <input #box [appToggleBackground]="box.value" value="cyan"/>`
})
class TestComponent {}

describe('ToggleBackgroundDirective', () => {
  let testBed: TestBed;
  let fixture: ComponentFixture<TestComponent>;
  let des: DebugElement[];

  const suite = (expectedDefaultColor: string) => {
    it('sets element\'s background color', () => {
      expect(des[0].styles['backgroundColor']).toBe('yellow');
      expect(des[1].styles['backgroundColor']).toBe(expectedDefaultColor);
      expect(des[2].styles['backgroundColor']).toBe('cyan');
    });

    xit('should bind INPUT\'s value to value element\'s background color', () => {
      const input = des[2].nativeElement as HTMLInputElement;

      expect(input.style.backgroundColor).toBe('cyan');

      input.value = 'green';
      input.dispatchEvent(new Event('input'));

      fixture.detectChanges();

      expect(input.style.backgroundColor).toBe('green');

      input.value = 'blue';
      input.dispatchEvent(new Event('input'));

      fixture.detectChanges();

      expect(input.style.backgroundColor).toBe('blue');

      input.value = '';
      input.dispatchEvent(new Event('input'));

      fixture.detectChanges();

      expect(input.style.backgroundColor).toBe(expectedDefaultColor);
    });

    it('toggles element\'s background color upon click', () => {
      des[0].nativeElement.click();
      des[1].nativeElement.click();
      des[2].nativeElement.click();
      fixture.detectChanges();

      expect(des[0].styles['backgroundColor']).toBe('');
      expect(des[1].styles['backgroundColor']).toBe('');
      expect(des[2].styles['backgroundColor']).toBe('');

      des[0].nativeElement.click();
      des[1].nativeElement.click();
      des[2].nativeElement.click();
      fixture.detectChanges();

      expect(des[0].styles['backgroundColor']).toBe('yellow');
      expect(des[1].styles['backgroundColor']).toBe(expectedDefaultColor);
      expect(des[2].styles['backgroundColor']).toBe('cyan');
    });
  };

  const setup = (providers?: unknown[]) => {
    testBed = TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [ToggleBackgroundDirective],
      providers: providers
    });

    fixture = testBed.createComponent(TestComponent);

    fixture.detectChanges();

    des = fixture.debugElement.queryAll(By.directive(ToggleBackgroundDirective));
  };

  describe('when not configured via its default color provider', () => {
    beforeEach(() => {
      setup();
    });

    suite('red');
  });

  describe('when configured via its default color provider', () => {
    const color = 'rgb(2, 98, 90)';

    beforeEach(() => {
      setup([{ provide: TOGGLE_BACKGROUND_DEFAULT_COLOR, useValue: color }]);
    });

    suite(color);
  });
});
