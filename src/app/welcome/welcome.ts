import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginService } from '../login-service';

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
  id: number;
  name: string;
  targetAmount: number;
  currentAmount: number;
  category: string;
  deadline: string;
}

interface AIMessage {
  text: string;
  isUser: boolean;
}

@Component({
  selector: 'app-welcome',
  imports: [CommonModule, FormsModule],
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
  plans: Plan[] = [
    {
      id: 1,
      name: 'Bike Purchase',
      targetAmount: 5000,
      currentAmount: 2500,
      category: 'Vehicle',
      deadline: '2024-12-31',
    },
    {
      id: 2,
      name: 'Car Down Payment',
      targetAmount: 10000,
      currentAmount: 4000,
      category: 'Vehicle',
      deadline: '2025-06-30',
    },
    {
      id: 3,
      name: 'Vacation',
      targetAmount: 3000,
      currentAmount: 1500,
      category: 'Travel',
      deadline: '2024-08-31',
    },
    {
      id: 4,
      name: 'Emergency Fund',
      targetAmount: 5000,
      currentAmount: 2800,
      category: 'Savings',
      deadline: '2025-12-31',
    },
  ];
  newPlan: Plan = {
    id: 0,
    name: '',
    targetAmount: 0,
    currentAmount: 0,
    category: 'Vehicle',
    deadline: '',
  };
  showPlanForm = false;

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

  constructor(private loginService: LoginService) {}

  ngOnInit() {
    this.getIncomeDataFromAPI();
    this.getExpensesDataFromAPI();
  }

  // ========== UI METHODS ==========
  setActiveTab(tab: string) {
    this.activeTab = tab;
    this.sidebarOpen = false;
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  // ========== EXPENSE METHODS ==========
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
      alert('Please fill all fields');
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
        'http://localhost:5000/api/auth/addExpenses',
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
      alert('Expenses error. Please check your connection.');
      console.error(error);
    }
  }

  async getExpensesDataFromAPI() {
    const parentId = this.loginService.getUseruniqueId();
    if (!parentId) {
      alert('No UserId Found');
      return;
    }

    try {
      const response = await fetch(
        'http://localhost:5000/api/auth/getExpenses',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: parentId }),
        },
      );

      const results = await response.json();

      if (results?.expenses?.length > 0) {
        for (const result of results.expenses) {
          if (result) {
            const data: Expense = {
              parentId: result.parentId,
              id: result.id,
              amount: result.amount,
              date: result.date,
              category: result.category,
              title: result.title,
              description: result.description,
            };
            this.expenses.push(data);
          }
        }
      }
    } catch (error) {
      alert('Login error. Please check your connection.');
      console.error(error);
    }
  }

  async deleteExpensesDataFromAPI(parentId: string, userId: string) {
    if (!parentId) {
      alert('No UserId Found');
      return;
    }
    try {
      const response = await fetch(
        'http://localhost:5000/api/auth/deleteExpenses',
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ parentId: parentId, userId: userId }),
        },
      );

      const results = await response.json();
      if (results) {
        this.expenses = this.expenses.filter((i) => i.id !== userId);
      }
    } catch {
      alert('Income Deletion error. Please check your connection.');
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

  // ========== TAX METHODS ==========
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

  // ========== PLAN & GOALS METHODS ==========
  addPlan() {
    if (
      this.newPlan.name &&
      this.newPlan.targetAmount &&
      this.newPlan.deadline
    ) {
      this.newPlan.id = Math.max(...this.plans.map((p) => p.id), 0) + 1;
      this.plans.push({ ...this.newPlan });
      this.newPlan = {
        id: 0,
        name: '',
        targetAmount: 0,
        currentAmount: 0,
        category: 'Vehicle',
        deadline: '',
      };
      this.showPlanForm = false;
    }
  }

  deletePlan(id: number) {
    this.plans = this.plans.filter((p) => p.id !== id);
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

  // ========== AI ASSISTANT METHODS ==========
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
      return `📊 Analysis: You spent $${total} this month. Food expenses: $${food} (${((food / total) * 100).toFixed(1)}%). Consider reducing dining out.`;
    }

    if (lowerInput.includes('save') || lowerInput.includes('savings')) {
      const saved = parseFloat(this.getTotalSaved());
      const goal = parseFloat(this.getTotalSavingsGoal());
      return `💰 Savings Status: You've saved $${saved} of your $${goal} goal (${((saved / goal) * 100).toFixed(1)}% complete). Keep up the great work!`;
    }

    if (lowerInput.includes('tax')) {
      const tax = parseFloat(this.getTotalTaxes());
      return `📈 Tax Summary: Total taxes: $${tax}. Consider consulting a tax advisor for optimization strategies.`;
    }

    if (lowerInput.includes('overspend') || lowerInput.includes('where')) {
      return `⚠️ Overspending Alert: Food and Entertainment are your top spending categories. Try the 50/30/20 budget rule.`;
    }

    if (lowerInput.includes('afford') || lowerInput.includes('can i')) {
      return `🤔 Affordability Check: Based on your savings rate, you could afford your goals with proper planning. Set monthly targets!`;
    }

    return `✅ Got it! I understand you're asking about: "${input}". Would you like specific advice on expenses, taxes, or savings goals?`;
  }

  // ========== DASHBOARD SUMMARY METHODS ==========
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

  // ========== AUTH METHODS ==========
  getUsername() {
    return this.loginService.getUsername();
  }

  logout() {
    this.loginService.clearToken();
    this.loginService.setIsAuthenticated(false);
    this.loginService.setUsername('');
    this.loginService.setCurrentView('login');
  }

  async addIncome() {
    if (this.newIncome.title && this.newIncome.amount && this.newIncome.date) {
      this.newIncome.id = `${Math.max(...this.incomes.map((i) => +i.id), 0) + 1}`;
      await this.addIncomeData();

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
      await this.deleteIncomeData(data.parentId, data.id);
    }
  }

  async getIncomeDataFromAPI() {
    await this.getAndUpdateIncomeData();
  }

  async addIncomeData() {
    if (!this.newIncome) {
      alert('Please fill all fields');
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
      const response = await fetch('http://localhost:5000/api/auth/addIncome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      alert(result.message);
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
      alert('Registration error. Please check your connection.');
      console.error(error);
    }
  }

  async getAndUpdateIncomeData() {
    const parentId = this.loginService.getUseruniqueId();
    if (!parentId) {
      alert('No UserId Found');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/getIncome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: parentId }),
      });

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
      alert('Income Data error. Please check your connection.');
      console.error(error);
    }
  }

  async deleteIncomeData(parentId: string, userId: string) {
    if (!parentId) {
      alert('No UserId Found');
      return;
    }
    try {
      const response = await fetch(
        'http://localhost:5000/api/auth/deleteIncome',
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ parentId: parentId, userId: userId }),
        },
      );

      const results = await response.json();
      if (results) {
        this.incomes = this.incomes.filter((i) => i.id !== userId);
      }
    } catch {
      alert('Income Deletion error. Please check your connection.');
    }
  }
}
