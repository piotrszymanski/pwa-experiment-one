import { Component, HostBinding, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-sw-message',
  templateUrl: './sw-message.component.html',
  styleUrls: ['./sw-message.component.scss'],
})
export class SwMessageComponent implements OnInit {
  @HostBinding('class') class = 'hidden';

  message = '';

  private readonly stop$ = new Subject<any>();

  constructor(private readonly updates: SwUpdate) {}

  ngOnInit(): void {
    // This event seems to never fire?
    this.updates.activated.subscribe((evt) => {
      this.showMessage(
        `Refresh to see the latest app - version ${evt.current.hash}`
      );
    });

    this.updates.available.subscribe((evt) => {
      this.showMessage(`Downloading latest app version: ${evt.available.hash}`);
    });

    if (this.updates.isEnabled) {
      this.showMessage(`The service worker is enabled!`);
    } else {
      this.showMessage(`The service worker is NOT enabled.`);
    }

    this.updates.unrecoverable.subscribe((evt) => {
      this.showMessage(
        `An unrecoverable error was encountered. Please refresh the app.`
      );
    });
  }

  showMessage(message: string): void {
    // Abort the fadeout of the previous message.
    this.stop$.next();

    this.message = message;
    this.class = '';

    timer(2000)
      .pipe(takeUntil(this.stop$))
      .subscribe(() => {
        this.class = 'hidden';
      });
  }
}
