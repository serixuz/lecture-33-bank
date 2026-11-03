'use strict';

// 1.1 Account Class

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

// 1.2 Savings Account

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

  // 1.3 Polymorphism
  transfer(toAccount, amount) {
    if (amount > 1 && this.withdraw(amount)) {
      toAccount.deposit(amount - 1);
    }
  }
}

// 1.4 Bank Class

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

// Testing

const acc = new Account('123', 1000);

acc.deposit(500);
acc.withdraw(200);

console.log(acc.getBalance());

const savings = new SavingsAccount('456', 5000, 0.03);
const checking = new CheckingAccount('789', 1000, 10);

savings.addInterest();

console.log(savings.getBalance());

savings.transfer(checking, 1000);
checking.transfer(savings, 100);

console.log(savings.getBalance());
console.log(checking.getBalance());

const bank = new Bank();

bank.addAccount(savings);
bank.addAccount(checking);

bank.processMonthly();

console.log(bank.getTotalBalance());
