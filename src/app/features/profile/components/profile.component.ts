import { Component, OnInit } from '@angular/core';
import { DebugService } from '@core/services/debug.service';
import { DebugMethod } from '@core/decorators/debug.decorator';

@Component({
  selector: 'app-profile',
  template: '...',
})
export class ProfileComponent implements OnInit {
  constructor(private debugService: DebugService) {}

  ngOnInit() {
    this.debugService.logComponent('ProfileComponent', 'OnInit');
    this.loadProfile();
  }

  @DebugMethod()
  async loadProfile() {
    this.debugService.logMethod('ProfileComponent', 'loadProfile');
    // Your profile loading logic
  }

  @DebugMethod()
  updateProfile(data: any) {
    this.debugService.logMethod('ProfileComponent', 'updateProfile', [data]);
    // Your profile update logic
  }
}
