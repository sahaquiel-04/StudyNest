import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClassInterfacePage } from './class.interface.page';

describe('ClassInterfacePage', () => {
  let component: ClassInterfacePage;
  let fixture: ComponentFixture<ClassInterfacePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassInterfacePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
