import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface ResponseDTO {
  transactions: Transaction[];
  balance: Balance;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();
    const income = transactions
      .filter(transaction => transaction.type === 'income')
      .reduce((accumlator, transaction) => accumlator + transaction.value, 0);

    const outcome = transactions
      .filter(transaction => transaction.type === 'outcome')
      .reduce((accumlator, transaction) => accumlator + transaction.value, 0);

    return {
      income,
      outcome,
      total: income - outcome,
    };
  }

  public async listAll(): Promise<ResponseDTO> {
    const transactions = await this.find();
    const balance = await this.getBalance();
    return {
      transactions,
      balance,
    };
  }
}

export default TransactionsRepository;
