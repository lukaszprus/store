import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SorterComponent, Sorting } from './sorter.component';

@Component({
  template: '<app-sorter [byOptions]="sorterByOptions" [(sorting)]="sorting"></app-sorter>'
})
class TestHostComponent {
  sorting: Sorting | undefined;

  sorterByOptions = [
    { value: 'price', label: 'Price' },
    { value: 'rating', label: 'Rating' },
    { value: 'stock', label: 'Stock' }
  ];
}

describe('SorterComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;
  let sorterComponent: SorterComponent;
  let sortingBy: HTMLSelectElement;
  let sortingType: HTMLSelectElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SorterComponent],
      declarations: [TestHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    sorterComponent = fixture.debugElement.query(By.directive(SorterComponent)).componentInstance;

    sortingBy = fixture.nativeElement.querySelector('[data-test-id="sortingBy"]');
    sortingType = fixture.nativeElement.querySelector('[data-test-id="sortingType"]');

    fixture.detectChanges();
  });

  it('emits changes in sorting', () => {
    sortingBy.value = sortingBy.options[2].value;
    sortingBy.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(hostComponent.sorting?.by).toBe('rating');

    sortingBy.value = sortingBy.options[0].value;
    sortingBy.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(hostComponent.sorting?.by).toBe('');

    expect(hostComponent.sorting?.type).toBe('');

    sortingType.value = sortingType.options[2].value;
    sortingType.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(hostComponent.sorting?.type).toBe('desc');

    sortingType.value = sortingType.options[1].value;
    sortingType.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(hostComponent.sorting?.type).toBe('asc');
  });

  it('updates sorting when inputs change', () => {
    expect(sorterComponent.sorting).toBeUndefined();
    expect(sortingBy.selectedOptions[0].label).toBe('');
    expect(sortingType.selectedOptions[0].label).toBe('');

    hostComponent.sorting = { by: 'price', type: 'asc' };
    fixture.detectChanges();

    expect(sortingBy.selectedOptions[0].label).toBe('Price');
    expect(sortingType.selectedOptions[0].label).toBe('Ascending');

    hostComponent.sorting = { by: 'price', type: 'desc' };
    fixture.detectChanges();

    expect(sortingBy.selectedOptions[0].label).toBe('Price');
    expect(sortingType.selectedOptions[0].label).toBe('Descending');

    hostComponent.sorting = undefined;
    fixture.detectChanges();

    expect(sortingBy.selectedOptions[0].label).toBe('');
    expect(sortingType.selectedOptions[0].label).toBe('');
  });
});

