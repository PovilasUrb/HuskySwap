import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button'; // Import p-button module
import { DropdownModule } from 'primeng/dropdown'; // Import p-dropdown module
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngForm

@Component({
    selector: 'app-create-swap',
    standalone: true,
    templateUrl: './create-swap.component.html',
    imports: [ButtonModule, DropdownModule, CardModule, FormsModule],
    styleUrls: ['./create-swap.component.css']
})
export class CreateSwapComponent {
    // Property to store the selected class to offer
    offerClass: string | null = null;
  
    // Property to store the selected class to request
    requestClass: string | null = null;
  
    // Class options for the dropdowns
    classOptions: { label: string, value: string }[] = [
      { label: 'Math 101', value: 'Math 101' },
      { label: 'CS 101', value: 'CS 101' },
      { label: 'History 101', value: 'History 101' },
      // Add more classes as needed
    ];
  
    // Method to handle form submission (can be expanded to include form logic)
    onSubmit(): void {
      console.log('Offer Class:', this.offerClass);
      console.log('Request Class:', this.requestClass);
      // Additional submission logic can be added here
    }
}
