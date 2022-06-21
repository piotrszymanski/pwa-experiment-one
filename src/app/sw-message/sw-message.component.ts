import { Component, HostBinding, HostListener, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { timer } from 'rxjs';

@Component({
  selector: 'app-sw-message',
  templateUrl: './sw-message.component.html',
  styleUrls: ['./sw-message.component.scss'],
})
export class SwMessageComponent implements OnInit {
  @HostBinding('class') class = 'hidden';

  message = '';

  private readonly queue: string[] = [];

  constructor(private readonly updates: SwUpdate) {}

  ngOnInit(): void {
    this.updates.versionUpdates.subscribe((evt) => {
      switch (evt.type) {
        case 'VERSION_DETECTED':
          this.showMessage(
            `Downloading latest app version: ${evt.version.hash}`
          );
          return;
        case 'VERSION_READY':
          this.showMessage(
            `Refresh to see the latest app - version ${evt.latestVersion.hash}`
          );
          return;
        case 'VERSION_INSTALLATION_FAILED':
          this.showMessage(
            `Failed to install app version: ${evt.version.hash}`
          );
          return;
      }
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

  // The following two host listeners can detect when the network status changes.

  @HostListener('window:online', ['$event'])
  handleOnline(): void {
    this.showMessage('You are now on-line.');
  }

  @HostListener('window:offline', ['$event'])
  handleOffline(): void {
    this.showMessage('You are now off-line.');
  }

  showMessage(message: string): void {
    this.queue.push(message);

    if (this.queue.length === 1) {
      this.nextMessage();
    }
  }

  private nextMessage(): void {
    // Show the message.
    this.message = this.queue[0];
    this.class = '';

    // Wait before hiding the message.
    timer(2000).subscribe(() => {
      // Hide the message.
      this.class = 'hidden';

      // If there are any more messages in the queue, wait a bit before showing the next one.
      this.queue.shift();
      if (this.queue.length > 0) {
        timer(1000).subscribe(() => this.nextMessage());
      }
    });
  }
}
