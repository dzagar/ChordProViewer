/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ChordEditorService } from './chord-editor.service';

describe('Service: ChordEditor', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChordEditorService]
    });
  });

  it('should ...', inject([ChordEditorService], (service: ChordEditorService) => {
    expect(service).toBeTruthy();
  }));
});
