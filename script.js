'use strict';

'use strict';

class Account {
  #balance;
  #accountNumber;

  constructor(accountNumber, balance) {
    this.#accountNumber = accountNumber;
    this.#balance = balance;
  }

  deposit(amount) {
    if (amount > 0) {
      this.#balance += amount;
    }
  }

  withdraw(amount) {
    if (amount > 0 && amount <= this.#balance) {
      this.#balance -= amount;
      return true;
    }

    return false;
  }

  getBalance() {
    return this.#balance;
  }

  transfer(toAccount, amount) {
    if (this.withdraw(amount)) {
      toAccount.deposit(amount);
    }
  }
}

class SavingsAccount extends Account {
  constructor(accountNumber, balance, interestRate) {
    super(accountNumber, balance);
    this.interestRate = interestRate;
  }

  addInterest() {
    let interest = this.getBalance() * this.interestRate;
    this.deposit(interest);
  }

  // 1.3 Polymorphism
  transfer(toAccount, amount) {
    if (this.withdraw(amount)) {
      let fee = amount * 0.02;
      toAccount.deposit(amount - fee);
    }
  }
}

class CheckingAccount extends Account {
  constructor(accountNumber, balance, monthlyFee) {
    super(accountNumber, balance);
    this.monthlyFee = monthlyFee;
  }

  deductMonthlyFee() {
    this.withdraw(this.monthlyFee);
  }

  transfer(toAccount, amount) {
    if (amount > 1 && this.withdraw(amount)) {
      toAccount.deposit(amount - 1);
    }
  }
}

class Bank {
  constructor() {
    this.accounts = [];
  }

  addAccount(account) {
    this.accounts.push(account);
  }

  processMonthly() {
    this.accounts.forEach((account) => {
      if (account instanceof SavingsAccount) {
        account.addInterest();
      }

      if (account instanceof CheckingAccount) {
        account.deductMonthlyFee();
      }
    });
  }

  getTotalBalance() {
    let total = 0;

    this.accounts.forEach((account) => {
      total += account.getBalance();
    });

    return total;
  }
}

const acc = new Account('123', 1000);

acc.deposit(500);
acc.withdraw(200);

console.log(acc.getBalance()); // 1300

const savings = new SavingsAccount('456', 5000, 0.03);
const checking = new CheckingAccount('789', 1000, 10);

savings.addInterest();

console.log(savings.getBalance()); // 5150

savings.transfer(checking, 1000);
checking.transfer(savings, 100);

console.log(savings.getBalance()); // 4249
console.log(checking.getBalance()); // 1880

const bank = new Bank();

bank.addAccount(savings);
bank.addAccount(checking);

bank.processMonthly();

console.log(bank.getTotalBalance()); // 6246.47

const money = new Intl.NumberFormat('ka-GE', { style: 'currency', currency: 'GEL' });

function renderBalances() {
  document.getElementById('total-balance').textContent = money.format(bank.getTotalBalance());
  document.getElementById('savings-balance').textContent = money.format(savings.getBalance());
  document.getElementById('checking-balance').textContent = money.format(checking.getBalance());
}

document.getElementById('operation-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const input = document.getElementById('amount');
  const amount = Number(input.value);
  const account = document.getElementById('account').value === 'savings' ? savings : checking;
  const message = document.getElementById('message');
  if (!Number.isFinite(amount) || amount <= 0) {
    message.textContent = 'შეიყვანეთ ნულზე მეტი თანხა.';
    return;
  }
  if (event.submitter?.value === 'withdraw') {
    if (!account.withdraw(amount)) {
      message.textContent = 'ანგარიშზე საკმარისი თანხა არ არის.';
      return;
    }
    message.textContent = `გატანილია ${money.format(amount)}.`;
  } else {
    account.deposit(amount);
    message.textContent = `ანგარიში შეივსო ${money.format(amount)}-ით.`;
  }
  input.value = '';
  renderBalances();
});

renderBalances();
