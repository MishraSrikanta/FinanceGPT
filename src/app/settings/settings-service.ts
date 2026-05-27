import { Injectable } from '@angular/core';

export interface SettingsState {
    language: string;
    theme: 'light' | 'dark';
    icon: string;
    currency: string; // ISO code like 'USD', 'INR'
    conversionBase: string; // base currency for stored amounts (assumed USD)
}

@Injectable({ providedIn: 'root' })
export class SettingsService {
    private storageKey = 'finflow_settings_v1';
    private state: SettingsState = {
        language: 'en-US',
        theme: 'light',
        icon: '💰',
        currency: 'USD',
        conversionBase: 'USD',
    };

    // Offline fallback rates (base: USD)
    private rates: { [code: string]: number } = {
        INR: 1,
        USD: 0.012,   // 1 INR ≈ 0.012 USD
        EUR: 0.011,
        GBP: 0.0096,
        JPY: 1.85

    };

    constructor() {
        this.loadSettings();
    }

    loadSettings() {
        try {
            const raw = localStorage.getItem(this.storageKey);
            if (raw) this.state = JSON.parse(raw);
        } catch (e) {
            console.warn('Could not load settings, using defaults.', e);
        }
    }

    saveSettings() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.state));
        } catch (e) {
            console.warn('Could not save settings.', e);
        }
    }

    getSettings(): SettingsState {
        return this.state;
    }

    update(patch: Partial<SettingsState>) {
        this.state = { ...this.state, ...patch };
        this.saveSettings();
    }

    setCurrency(code: string) {
        this.state.currency = code;
        this.saveSettings();
    }

    getCurrency(): string {
        return this.state.currency;
    }

    // Format an amount (stored in base currency) into target currency string
    formatCurrency(amountInBase: number): string {
        const target = this.getCurrency();
        const rate = this.rates[target] ?? 1;
        const converted = amountInBase * rate;

        try {
            return new Intl.NumberFormat(this.state.language, {
                style: 'currency',
                currency: target,
                maximumFractionDigits: 2,
            }).format(converted);
        } catch (e) {
            return `${target} ${converted.toFixed(2)}`;
        }
    }

    // Expose symbol for use in templates when needed
    getCurrencySymbol(): string {
        const target = this.getCurrency();
        try {
            return (0).toLocaleString(this.state.language, {
                style: 'currency',
                currency: target,
                maximumFractionDigits: 0,
            }).replace(/0/g, '').trim();
        } catch (e) {
            return target;
        }
    }
}
