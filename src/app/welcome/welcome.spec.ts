import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Welcome } from './welcome';

describe('Welcome', () => {
  let component: Welcome;
  let fixture: ComponentFixture<Welcome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Welcome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Welcome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update an existing goal when saving edits', () => {
    const plan = component.plans[0];

    component.startEditPlan(plan);
    component.newPlan.name = 'Bike Purchase Updated';
    component.newPlan.targetAmount = 6500;
    component.newPlan.currentAmount = 3200;
    component.savePlan();

    const updatedPlan = component.plans.find((item) => item.id === plan.id);

    expect(updatedPlan?.name).toBe('Bike Purchase Updated');
    expect(updatedPlan?.targetAmount).toBe(6500);
    expect(updatedPlan?.currentAmount).toBe(3200);
  });
});
