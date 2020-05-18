import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';

interface RequestDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

interface ResponseDTO {
  id: string;
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: RequestDTO): Promise<ResponseDTO> {
    const categoryRepository = getRepository(Category);
    const transactionRepository = getCustomRepository(TransactionRepository);

    const currentBalance = await transactionRepository.getBalance();

    if (type === 'outcome' && currentBalance.total - value < 0) {
      throw new AppError("you can't withdraw money you don't have", 400);
    }

    let transactionCategory = await categoryRepository.findOne({
      where: { title: category },
    });

    if (!transactionCategory) {
      transactionCategory = categoryRepository.create({
        title: category,
      });

      await categoryRepository.save(transactionCategory);
    }

    const transaction = transactionRepository.create({
      title,
      type,
      value,
      category_id: transactionCategory.id,
    });

    await transactionRepository.save(transaction);

    return {
      id: transaction.id,
      title: transaction.title,
      value: transaction.value,
      type: transaction.type,
      category: transactionCategory.title,
    };
  }
}

export default CreateTransactionService;
