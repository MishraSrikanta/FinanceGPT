import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginService } from '../login-service';
import { SettingsService } from '../settings/settings-service';
import { SettingsComponent } from '../settings/settings';
import { APIEndpoint, APIservie } from '../api-service';
import { AlertService } from '../alert-service';

interface Expense {
  parentId: string;
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  description: string;
}

interface Income {
  parentId: string;
  id: string;
  title: string;
  amount: number;
  source: string;
  date: string;
  description: string;
}

interface Tax {
  id: number;
  type: string;
  rate: number;
  amount: number;
  note: string;
}

interface Plan {
  parentId: string;
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  incrementMonthly: number;
  dateCreated: string;
  category: string;
}

interface AIMessage {
  text: string;
  isUser: boolean;
}

@Component({
  selector: 'app-welcome',
  imports: [CommonModule, FormsModule, SettingsComponent],
  templateUrl: './welcome.html',
  styleUrl: './welcome.css',
})
export class Welcome implements OnInit {
  // UI State
  activeTab = 'dashboard';
  sidebarOpen = false;

  // Expenses
  expenses: Expense[] = [];
  newExpense: Expense = {
    parentId: '',
    id: '0',
    title: '',
    amount: 0,
    category: 'Food',
    date: '',
    description: '',
  };
  showExpenseForm = false;

  // incomes: Income[] = [
  //   { id: 1, title: 'Salary', amount: 3200, source: 'Salary', date: '2024-05-01', description: 'Monthly paycheck' },
  //   { id: 2, title: 'Freelance Project', amount: 550, source: 'Freelance', date: '2024-05-10', description: 'Website design' },
  // ];
  incomes: Income[] = [];
  newIncome: Income = {
    parentId: '',
    id: '',
    title: '',
    amount: 0,
    source: 'Salary',
    date: '',
    description: '',
  };
  showIncomeForm = false;
  incomeSources = ['Salary', 'Freelance', 'Investments', 'Business', 'Other'];

  // Taxes
  taxes: Tax[] = [
    {
      id: 1,
      type: 'Income Tax',
      rate: 20,
      amount: 500,
      note: 'Monthly income tax',
    },
    {
      id: 2,
      type: 'Sales Tax',
      rate: 8,
      amount: 120,
      note: 'Quarterly sales tax',
    },
    {
      id: 3,
      type: 'Property Tax',
      rate: 1.2,
      amount: 300,
      note: 'Annual property tax',
    },
  ];
  newTax: Tax = { id: 0, type: '', rate: 0, amount: 0, note: '' };
  showTaxForm = false;

  // Plans
  plans: Plan[] = [];
  newPlan: Plan = {
    parentId: '',
    id: '',
    name: '',
    targetAmount: 0,
    currentAmount: 0,
    incrementMonthly: 0,
    dateCreated: '',
    category: '',
  };
  showPlanForm = false;
  editingPlanId: number | null = null;
  planDepositAmounts: Record<number, number> = {};

  // AI Assistant
  aiMessages: AIMessage[] = [];
  aiInput = '';

  // Categories
  expenseCategories = [
    'Food',
    'Transport',
    'Entertainment',
    'Utilities',
    'Health',
    'Shopping',
    'Other',
  ];
  planCategories = [
    'Vehicle',
    'Travel',
    'Education',
    'Home',
    'Entertainment',
    'Savings',
    'Other',
  ];
  taxTypes = [
    'Income Tax',
    'Sales Tax',
    'Property Tax',
    'Capital Gains Tax',
    'Other',
  ];

  constructor(
    private loginService: LoginService,
    private settingsService: SettingsService,
    private apiService: APIservie,
    private alertService: AlertService,
  ) {}

  ngOnInit() {
    this.getIncomeDataFromAPI();
    this.getExpensesDataFromAPI();
    this.getPlanOrGoalDataFromAPI();
    this.settingsService.loadSettings();
  }

  formatCurrency(value: number | string) {
    const num = typeof value === 'string' ? parseFloat(value || '0') : value;
    return this.settingsService.formatCurrency(Number(num || 0));
  }

  // ========== UI METHODS ==========
  setActiveTab(tab: string) {
    this.activeTab = tab;
    this.sidebarOpen = false;
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  //#region ========== EXPENSE METHODS ==========
  addExpense() {
    if (
      this.newExpense.title &&
      this.newExpense.amount &&
      this.newExpense.date
    ) {
      debugger;
      this.newExpense.id =
        this.expenses?.length > 0
          ? `${Math.max(...this.expenses.map((i) => +i.id), 0) + 1}`
          : '1';
      this.addExpensesDataFromAPI();
      this.newExpense = {
        parentId: '',
        id: '0',
        title: '',
        amount: 0,
        category: 'Food',
        date: '',
        description: '',
      };
      this.showExpenseForm = false;
    }
  }

  async addExpensesDataFromAPI() {
    if (!this.newExpense) {
      this.alertService.showAlert(
        'Please fill all expense fields first.',
        'error',
      );
      return;
    }

    const parentId = this.loginService.getUseruniqueId();
    const data = {
      parentId: parentId,
      id: this.newExpense.id,
      title: this.newExpense.title,
      amount: this.newExpense.amount,
      category: this.newExpense.category,
      date: this.newExpense.date,
      description: this.newExpense.description,
    };

    try {
      const response = await fetch(
        this.apiService.getAPIUrl(APIEndpoint.ADD_EXPENSE),
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        },
      );

      const result = await response.json();
      if (result) {
        const newExpensesData: Expense = {
          parentId: parentId,
          id: data.id,
          title: data.title,
          amount: data.amount,
          date: data.date,
          category: data.category,
          description: data.description,
        };
        this.expenses.push(newExpensesData);
      }
    } catch (error) {
      this.alertService.showAlert(
        'Expenses update failed. Please check your connection.',
        'error',
      );
      console.error(error);
    }
  }

  async getExpensesDataFromAPI() {
    const parentId = this.loginService.getUseruniqueId();
    if (!parentId) {
      this.alertService.showAlert(
        'No user account was found for this session.',
        'error',
      );
      return;
    }

    try {
      const response = await fetch(
        this.apiService.getAPIUrl(APIEndpoint.GET_EXPENSE),
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ parentId: parentId }),
        },
      );

      const results = await response.json();

      if (results?.expenses?.length > 0) {
        for (const result of results.expenses) {
          if (result) {
            const data: Expense = {
              parentId: result.parentId,
              id: result.userId,
              amount: result.amount,
              date: result.date,
              category: result.category,
              title: result.title,
              description: result.description,
            };
            this.alertService.showAlert(
              result.message || 'Expense added successfully.',
              'success',
            );
            this.expenses.push(data);
          }
        }
      }
    } catch (error) {
      this.alertService.showAlert(
        'Expense data could not be loaded. Please check your connection.',
        'error',
      );
      console.error(error);
    }
  }

  async deleteExpensesDataFromAPI(parentId: string, userId: string) {
    if (!parentId) {
      this.alertService.showAlert(
        'No user account was found for this session.',
        'error',
      );
      return;
    }
    try {
      const response = await fetch(
        this.apiService.getAPIUrl(APIEndpoint.DELETE_EXPENSE),
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ parentId: parentId, userId: userId }),
        },
      );

      const results = await response.json();
      if (results) {
        this.expenses = this.expenses.filter((i) => i.id !== userId);
        this.alertService.showAlert('Expense deletion successfully', 'success');
      }
    } catch {
      this.alertService.showAlert(
        'Expense deletion failed. Please check your connection.',
        'error',
      );
    }
  }

  deleteExpense(id: string) {
    const data = this.expenses.find((i) => i.id === id);
    if (data) {
      this.deleteExpensesDataFromAPI(data.parentId, data.id);
    }
  }

  getTotalExpenses() {
    return this.expenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2);
  }

  getExpensesByCategory(category: string) {
    return this.expenses
      .filter((e) => e.category === category)
      .reduce((sum, e) => sum + e.amount, 0)
      .toFixed(2);
  }
  //#endregion

  //#region ========== TAX METHODS ==========
  addTax() {
    if (this.newTax.type && this.newTax.rate && this.newTax.amount) {
      this.newTax.id = Math.max(...this.taxes.map((t) => t.id), 0) + 1;
      this.taxes.push({ ...this.newTax });
      this.newTax = { id: 0, type: '', rate: 0, amount: 0, note: '' };
      this.showTaxForm = false;
    }
  }

  deleteTax(id: number) {
    this.taxes = this.taxes.filter((t) => t.id !== id);
  }

  getTotalTaxes() {
    return this.taxes.reduce((sum, t) => sum + t.amount, 0).toFixed(2);
  }

  calculateTaxAmount(rate: number, baseAmount: number) {
    return ((baseAmount * rate) / 100).toFixed(2);
  }
  //#endregion

  //#region ========== PLAN & GOALS METHODS ==========
  resetPlanForm() {
    this.newPlan = {
      parentId: '',
      id: '',
      name: '',
      targetAmount: 0,
      currentAmount: 0,
      incrementMonthly: 0,
      dateCreated: '',
      category: '',
    };
    this.editingPlanId = null;
  }

  startEditPlan(plan: Plan) {
    this.newPlan = { ...plan };
    this.editingPlanId = +plan.id;
    this.showPlanForm = true;
  }

  savePlan() {
    if (!this.newPlan.name || !this.newPlan.targetAmount) {
      return;
    }

    if (this.newPlan.targetAmount === this.newPlan.currentAmount) {
      return;
    }

    if (this.editingPlanId) {
      debugger;
      const planToBeUpdated = this.plans.find(
        (x) => +x.id === this.editingPlanId,
      );
      if (planToBeUpdated) {
        const updatedPlan = {
          ...planToBeUpdated,
          ...this.newPlan,
        };
        this.updatePlanOrGoalDataFromAPI(
          planToBeUpdated?.parentId,
          planToBeUpdated?.id,
          updatedPlan,
        );
      }
    } else {
      this.newPlan.id = `${Math.max(...this.plans.map((p) => +p.id), 0) + 1}`;
      this.addPlanOrGoalDataFromAPI();
    }

    this.resetPlanForm();
    this.showPlanForm = false;
  }

  cancelPlanForm() {
    this.resetPlanForm();
    this.showPlanForm = false;
  }

  addMoneyToPlan(plan: Plan) {
    const amount = Number(this.planDepositAmounts[+plan.id] || 0);

    if (amount <= 0) {
      return;
    }

    plan.currentAmount = Math.min(
      plan.currentAmount + amount,
      plan.targetAmount,
    );

    this.updatePlanOrGoalDataFromAPI(plan?.parentId, plan?.id, plan);
    this.planDepositAmounts[+plan.id] = 0;
  }

  addPlan() {
    this.savePlan();
  }

  deletePlan(id: string) {
    const data = this.plans.find((p) => p.id === id);
    if (data) {
      this.deletePlanOrGoalDataFromAPI(data.parentId, data.id);
    }
  }

  updatePlanProgress(plan: Plan, newAmount: number) {
    if (newAmount <= plan.targetAmount) {
      plan.currentAmount = newAmount;
    }
  }

  getPlanProgress(plan: Plan) {
    return ((plan.currentAmount / plan.targetAmount) * 100).toFixed(0);
  }

  getTotalSavingsGoal() {
    return this.plans.reduce((sum, p) => sum + p.targetAmount, 0).toFixed(2);
  }

  getTotalSaved() {
    return this.plans.reduce((sum, p) => sum + p.currentAmount, 0).toFixed(2);
  }

  async addPlanOrGoalDataFromAPI() {
    if (!this.newPlan) {
      this.alertService.showAlert(
        'Please fill all expense fields first.',
        'error',
      );
      return;
    }

    const parentId = this.loginService.getUseruniqueId();
    const data = {
      parentId: parentId,
      userId: this.newPlan.id,
      name: this.newPlan.name,
      targetAmount: this.newPlan.targetAmount,
      currentAmount: this.newPlan.currentAmount,
      incrementMonthly: this.newPlan.incrementMonthly,
      dateCreated: this.newPlan.dateCreated,
      category: this.newPlan.category,
    };

    try {
      const response = await fetch(
        this.apiService.getAPIUrl(APIEndpoint.ADD_GOAL),
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        },
      );

      const result = await response.json();
      if (result) {
        const newExpensesData: Plan = {
          parentId: parentId,
          id: data.userId,
          name: data.name,
          targetAmount: data.targetAmount,
          currentAmount: data.currentAmount,
          incrementMonthly: data.incrementMonthly,
          dateCreated: data.dateCreated,
          category: data.category,
        };
        this.plans.push(newExpensesData);
      }
    } catch (error) {
      this.alertService.showAlert(
        'Goal-Plan update failed. Please check your connection.',
        'error',
      );
      console.error(error);
    }
  }

  async getPlanOrGoalDataFromAPI() {
    const parentId = this.loginService.getUseruniqueId();
    if (!parentId) {
      this.alertService.showAlert(
        'No user account was found for this session.',
        'error',
      );
      return;
    }

    try {
      const response = await fetch(
        this.apiService.getAPIUrl(APIEndpoint.GET_GOAL),
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ parentId: parentId }),
        },
      );

      const results = await response.json();

      if (results?.goals?.length > 0) {
        for (const result of results.goals) {
          if (result) {
            const data: Plan = {
              parentId: result.parentId,
              id: result.userId,
              name: result.name,
              targetAmount: result.targetAmount,
              currentAmount: result.currentAmount,
              incrementMonthly: result.incrementMonthly,
              dateCreated: result.dateCreated,
              category: result.category,
            };
            this.alertService.showAlert(
              result.message || 'Goal-Plan added successfully.',
              'success',
            );
            this.plans.push(data);
          }
        }
      }
    } catch (error) {
      this.alertService.showAlert(
        'Goal-Plan data could not be loaded. Please check your connection.',
        'error',
      );
      console.error(error);
    }
  }

  async deletePlanOrGoalDataFromAPI(parentId: string, userId: string) {
    if (!parentId) {
      this.alertService.showAlert(
        'No user account was found for this session.',
        'error',
      );
      return;
    }
    try {
      const response = await fetch(
        this.apiService.getAPIUrl(APIEndpoint.DELETE_GOAL),
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ parentId: parentId, userId: userId }),
        },
      );

      const results = await response.json();
      if (results) {
        this.plans = this.plans.filter((i) => i.id !== userId);
        this.alertService.showAlert(
          'Goal-Plan deletion successfully',
          'success',
        );
      }
    } catch {
      this.alertService.showAlert(
        'Goal-Plan deletion failed. Please check your connection.',
        'error',
      );
    }
  }

  async updatePlanOrGoalDataFromAPI(
    parentId: string,
    userId: string,
    updatedPlanData: Plan,
  ) {
    if (!parentId || !userId || !updatedPlanData) {
      this.alertService.showAlert(
        'No user account was found for this session.',
        'error',
      );
      return;
    }
    try {
      const response = await fetch(
        this.apiService.getAPIUrl(APIEndpoint.UPDATE_GOAL),
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            parentId: parentId,
            userId: userId,
            updatedPlanData,
          }),
        },
      );

      const results = await response.json();
      if (results) {
        this.plans = this.plans.map((plan) =>
          +plan.id === +userId ? { ...plan, ...updatedPlanData } : plan,
        );
        this.alertService.showAlert(
          'Goal-Plan Updation successfully',
          'success',
        );
      }
    } catch {
      this.alertService.showAlert(
        'Goal-Plan Updation failed. Please check your connection.',
        'error',
      );
    }
  }
  //#endregion

  //#region ========== AI ASSISTANT METHODS ==========
  sendAiMessage() {
    if (!this.aiInput.trim()) return;

    // Add user message
    this.aiMessages.push({ text: this.aiInput, isUser: true });

    // Generate AI response
    const response = this.generateAIResponse(this.aiInput);
    setTimeout(() => {
      this.aiMessages.push({ text: response, isUser: false });
    }, 500);

    this.aiInput = '';
  }

  generateAIResponse(input: string): string {
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes('analyze') || lowerInput.includes('spending')) {
      const total = parseFloat(this.getTotalExpenses());
      const food = parseFloat(this.getExpensesByCategory('Food'));
      return `📊 Analysis: You spent ${this.settingsService.formatCurrency(total)} this month. Food expenses: ${this.settingsService.formatCurrency(food)} (${((food / total) * 100).toFixed(1)}%). Consider reducing dining out.`;
    }

    if (lowerInput.includes('save') || lowerInput.includes('savings')) {
      const saved = parseFloat(this.getTotalSaved());
      const goal = parseFloat(this.getTotalSavingsGoal());
      return `💰 Savings Status: You've saved ${this.settingsService.formatCurrency(saved)} of your ${this.settingsService.formatCurrency(goal)} goal (${((saved / goal) * 100).toFixed(1)}% complete). Keep up the great work!`;
    }

    if (lowerInput.includes('tax')) {
      const tax = parseFloat(this.getTotalTaxes());
      return `📈 Tax Summary: Total taxes: ${this.settingsService.formatCurrency(tax)}. Consider consulting a tax advisor for optimization strategies.`;
    }

    if (lowerInput.includes('overspend') || lowerInput.includes('where')) {
      return `⚠️ Overspending Alert: Food and Entertainment are your top spending categories. Try the 50/30/20 budget rule.`;
    }

    if (lowerInput.includes('afford') || lowerInput.includes('can i')) {
      return `🤔 Affordability Check: Based on your savings rate, you could afford your goals with proper planning. Set monthly targets!`;
    }

    return `✅ Got it! I understand you're asking about: "${input}". Would you like specific advice on expenses, taxes, or savings goals?`;
  }
  //#endregion

  //#region ========== DASHBOARD SUMMARY METHODS ==========
  getTotalIncome() {
    return this.incomes
      .reduce((sum, income) => sum + income.amount, 0)
      .toFixed(2);
  }

  getTotalBalance() {
    return (
      parseFloat(this.getTotalIncome()) -
      parseFloat(this.getTotalExpenses()) -
      parseFloat(this.getTotalTaxes())
    ).toFixed(2);
  }

  getNetAmount() {
    return (
      parseFloat(this.getTotalSaved()) - parseFloat(this.getTotalExpenses())
    ).toFixed(2);
  }
  //#endregion

  //#region ========== AUTH METHODS ==========
  getUsername() {
    return this.loginService.getUsername();
  }

  logout() {
    this.alertService.showLoading('Signing you out...');

    setTimeout(() => {
      this.loginService.clearToken();
      this.loginService.setIsAuthenticated(false);
      this.loginService.setUsername('');
      this.loginService.setCurrentView('login');
      this.alertService.hideLoading();
      this.alertService.showAlert('You have been signed out securely.', 'info');
    }, 450);
  }

  async addIncome() {
    if (this.newIncome.title && this.newIncome.amount && this.newIncome.date) {
      this.newIncome.id = `${Math.max(...this.incomes.map((i) => +i.id), 0) + 1}`;
      await this.addIncomeDataAPI();

      this.newIncome = {
        parentId: '',
        id: '',
        title: '',
        amount: 0,
        source: 'Salary',
        date: '',
        description: '',
      };

      this.showIncomeForm = false;
    }
  }

  async deleteIncome(id: string) {
    const data = this.incomes.find((i) => i.id === id);
    if (data) {
      await this.deleteIncomeDataAPI(data.parentId, data.id);
    }
  }

  async getIncomeDataFromAPI() {
    await this.getAndUpdateIncomeDataAPI();
  }

  async addIncomeDataAPI() {
    if (!this.newIncome) {
      this.alertService.showAlert(
        'Please fill all income fields first.',
        'error',
      );
      return;
    }

    const data = {
      parentId: this.loginService.getUseruniqueId(),
      userId: this.newIncome.id,
      title: this.newIncome.title,
      amount: this.newIncome.amount,
      source: this.newIncome.source,
      date: this.newIncome.date,
      description: this.newIncome.description,
    };

    try {
      const response = await fetch(
        this.apiService.getAPIUrl(APIEndpoint.ADD_INCOME),
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        },
      );

      const result = await response.json();
      this.alertService.showAlert(
        result.message || 'Income added successfully.',
        'success',
      );
      const newIncomeData: Income = {
        parentId: this.loginService.getUseruniqueId(),
        id: this.newIncome.id,
        title: this.newIncome.title,
        amount: this.newIncome.amount,
        source: this.newIncome.source,
        date: this.newIncome.date,
        description: this.newIncome.description,
      };
      this.incomes.push(newIncomeData);
    } catch (error) {
      this.alertService.showAlert(
        'Income submission failed. Please check your connection.',
        'error',
      );
      console.error(error);
    }
  }

  async getAndUpdateIncomeDataAPI() {
    const parentId = this.loginService.getUseruniqueId();
    if (!parentId) {
      this.alertService.showAlert(
        'No user account was found for this session.',
        'error',
      );
      return;
    }

    try {
      const response = await fetch(
        this.apiService.getAPIUrl(APIEndpoint.GET_INCOME),
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: parentId }),
        },
      );

      const results = await response.json();
      console.log(results);

      if (results?.incomes?.length > 0) {
        for (const result of results.incomes) {
          if (result) {
            const data: Income = {
              parentId: result.parentId,
              id: result.userId,
              amount: result.amount,
              date: result.date,
              source: result.source,
              title: result.title,
              description: result.description,
            };
            this.incomes.push(data);
          }
        }
      }
    } catch (error) {
      this.alertService.showAlert(
        'Income data could not be loaded. Please check your connection.',
        'error',
      );
      console.error(error);
    }
  }

  async deleteIncomeDataAPI(parentId: string, userId: string) {
    if (!parentId) {
      this.alertService.showAlert(
        'No user account was found for this session.',
        'error',
      );
      return;
    }
    try {
      const response = await fetch(
        this.apiService.getAPIUrl(APIEndpoint.DELETE_INCOME),
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ parentId: parentId, userId: userId }),
        },
      );

      const results = await response.json();
      if (results) {
        this.incomes = this.incomes.filter((i) => i.id !== userId);
        this.alertService.showAlert('Income deletion successfully', 'success');
      }
    } catch {
      this.alertService.showAlert(
        'Income deletion failed. Please check your connection.',
        'error',
      );
    }
  }
  //#endregion
}
