import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenAiChatComponent } from './open-ai-chat.component';

describe('OpenAiChatComponent', () => {
  let component: OpenAiChatComponent;
  let fixture: ComponentFixture<OpenAiChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenAiChatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenAiChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
