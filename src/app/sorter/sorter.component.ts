import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Subscription } from 'rxjs';

export type Sorting = { by: string; type: 'asc' | 'desc' | ''; };

@Component({
  selector: 'app-sorter',
  templateUrl: './sorter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class SorterComponent implements OnInit, OnDestroy, OnChanges {
  @Input() byOptions!: { value: string; label: string; }[];
  @Input() sorting: Sorting | null | undefined;
  @Output() sortingChange = new EventEmitter<Sorting>();

  private subs: Subscription | undefined;
  sorterForm = new FormGroup({
    by: new FormControl<string>('', { nonNullable: true }),
    type: new FormControl<'asc' | 'desc' | ''>('', { nonNullable: true })
  });

  ngOnChanges(changes: SimpleChanges) {
    if (changes['sorting']) {
      if (this.sorting) {
        this.sorterForm.setValue(this.sorting, { emitEvent: false });
      } else {
        this.sorterForm.reset(undefined, { emitEvent: false });
      }
    }
  }

  ngOnInit() {
    this.subs = this.sorterForm.valueChanges
      .subscribe(value => {
        this.sortingChange.emit(value as Required<typeof value>);
      });
  }

  ngOnDestroy() {
    this.subs && this.subs.unsubscribe();
  }
}
