import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebSocketsChatComponent } from './web-sockets-chat.component';

describe('ChatComponent', () => {
  let component: WebSocketsChatComponent;
  let fixture: ComponentFixture<WebSocketsChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebSocketsChatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebSocketsChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
