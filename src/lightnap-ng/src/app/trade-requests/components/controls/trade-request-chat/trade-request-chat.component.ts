import { CommonModule } from "@angular/common";
import { Component, DestroyRef, inject, input, OnChanges, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { TimerService } from "@core";
import { IdentityService } from "@identity";
import { ButtonModule } from "primeng/button";
import { InputGroupModule } from "primeng/inputgroup";
import { InputTextareaModule } from "primeng/inputtextarea";
import { CreateChatMessageRequest } from "src/app/trade-requests/models/request/create-chat-message-request";
import { ChatMessage } from "src/app/trade-requests/models/response/chat-message";
import { TradeRequestService } from "src/app/trade-requests/services/trade-request.service";

@Component({
  standalone: true,
  templateUrl: "./trade-request-chat.component.html",
  selector: "trade-request-chat",
  imports: [CommonModule, ButtonModule, InputTextareaModule, ReactiveFormsModule, InputGroupModule],
})
export class TradeRequestChatComponent implements OnChanges, OnInit {
  #identityService = inject(IdentityService);
  #formBuilder = inject(FormBuilder);
  #timer = inject(TimerService);
  #destroyRef = inject(DestroyRef);
  #tradeRequestService = inject(TradeRequestService);
  #sinceMessageId = 0;
  readonly tradeRequestId = input<number>(undefined);
  readonly userId = this.#identityService.userId;
  chatEnabled = false;
  chatMessages: ChatMessage[] = [];
  form = this.#formBuilder.group({
    content: this.#formBuilder.control("", [Validators.required]),
  });

  ngOnInit(): void {
    this.#timer
      .watchTimer$(2 * 1000)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: () => this.refreshChat(),
      });
  }

  ngOnChanges() {
    this.refreshChat();
  }

  refreshChat() {
    this.#tradeRequestService.getChatMessages(this.tradeRequestId(), this.#sinceMessageId).subscribe({
      next: chatMessages => {
        this.chatMessages.push(...chatMessages);
        if (chatMessages.length > 0) {
          this.#sinceMessageId = chatMessages[chatMessages.length - 1].id;
        }
      },
    });
    this.#tradeRequestService.getMyTradeClassUserInfo(this.tradeRequestId()).subscribe({
      next: tradeClassUserInfos => {
        switch (tradeClassUserInfos.status) {
          case "Accepted":
          case "Pending":
            this.chatEnabled = true;
            break;
          default:
            this.chatEnabled = false;
            break;
        }
      },
    });
  }

  sendMessage() {
    this.#tradeRequestService.createChatMessage(this.tradeRequestId(), <CreateChatMessageRequest>this.form.value).subscribe({
      next: () => {
        this.form.reset();
        this.refreshChat();
      },
    });
  }
}
