import { getRepository, getCustomRepository } from 'typeorm';
import TransactionRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';

interface FormattedTransaction {
  id: string;
  title: string;
  type: string;
  value: number;
  category: Category | undefined;
  created_at: Date;
  updated_at: Date;
}

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface ResponseDTO {
  transactions: FormattedTransaction[] | undefined;
  balance: Balance;
}

class ListTransactionService {
  public async execute(): Promise<ResponseDTO> {
    const categoryRepository = getRepository(Category);
    const transactionRepository = getCustomRepository(TransactionRepository);
    const all_transactions = await transactionRepository.find();
    const all_categories = await categoryRepository.find();
    const formatted_transactions: FormattedTransaction[] = all_transactions.map(
      transaction => ({
        id: transaction.id,
        title: transaction.title,
        type: transaction.type,
        value: transaction.value,
        category: all_categories.find(
          category => category.id === transaction.category_id,
        ),
        created_at: transaction.created_at,
        updated_at: transaction.updated_at,
      }),
    );

    const balance = await transactionRepository.getBalance();

    return { transactions: formatted_transactions, balance };
  }
}

export default ListTransactionService;
