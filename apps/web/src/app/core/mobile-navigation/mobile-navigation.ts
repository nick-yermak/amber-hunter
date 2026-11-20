import { Component } from '@angular/core';
import { PrimaryNavigation } from '../primary-navigation/primary-navigation';

@Component({
  selector: 'app-mobile-navigation',
  imports: [PrimaryNavigation],
  host: { class: 'sticky bottom-0 z-10 block md:hidden' },
  template: `
    <div
      class="border-t border-divider bg-surface pt-2
             pb-[max(0.5rem,env(safe-area-inset-bottom))]
             ps-[max(1rem,env(safe-area-inset-left))] pe-[max(1rem,env(safe-area-inset-right))]"
    >
      <app-primary-navigation />
    </div>
  `,
})
export class MobileNavigation {}
