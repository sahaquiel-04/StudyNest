import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemInterfacePage } from './item.interface.page';

describe('ItemInterfacePage', () => {
  let component: ItemInterfacePage;
  let fixture: ComponentFixture<ItemInterfacePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemInterfacePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
