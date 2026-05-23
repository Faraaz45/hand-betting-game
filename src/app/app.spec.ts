import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('creates the root component with a router outlet', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const html = (fixture.nativeElement as HTMLElement).innerHTML;
    expect(html).toContain('router-outlet');
  });
});
