import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderSaComponent } from './header-sa.component';

describe('HeaderSaComponent', () => {
  let component: HeaderSaComponent;
  let fixture: ComponentFixture<HeaderSaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderSaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderSaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
