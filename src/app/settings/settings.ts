import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsService, SettingsState } from './settings-service';

@Component({
    selector: 'app-settings',
    imports: [CommonModule, FormsModule],
    templateUrl: './settings.html',
    styleUrl: './settings.css',
})
export class SettingsComponent {
    availableCurrencies = ['USD', 'INR', 'EUR', 'GBP', 'JPY'];
    availableLanguages = ['en-US', 'en-GB', 'hi-IN', 'fr-FR'];
    themeOptions: Array<'light' | 'dark'> = ['light', 'dark'];

    state: SettingsState;
    originalState: SettingsState;
    showNotification = false;
    notificationMessage = '';

    constructor(public settings: SettingsService) {
        this.state = this.settings.getSettings();
        this.originalState = { ...this.state };
    }

    applySettings() {
        this.settings.update(this.state);
        this.originalState = { ...this.state };
        this.showNotification = true;
        this.notificationMessage = '✅ Settings saved successfully!';
        setTimeout(() => {
            this.showNotification = false;
        }, 3000);
    }

    resetSettings() {
        this.state = { ...this.originalState };
        this.showNotification = true;
        this.notificationMessage = '🔄 Settings reset to last saved.';
        setTimeout(() => {
            this.showNotification = false;
        }, 3000);
    }

    resetToDefaults() {
        if (confirm('Are you sure you want to reset all settings to defaults?')) {
            const defaults: SettingsState = {
                language: 'en-US',
                theme: 'dark',
                icon: '💰',
                currency: 'INR',
                conversionBase: 'INR',
            };
            this.state = defaults;
            this.originalState = { ...defaults };
            this.applySettings();
            this.notificationMessage = '🔃 All settings reset to defaults!';
        }
    }

    hasChanges(): boolean {
        return JSON.stringify(this.state) !== JSON.stringify(this.originalState);
    }
}
