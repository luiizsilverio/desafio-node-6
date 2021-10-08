import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateStatementUseCase } from './CreateStatementUseCase';

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer'
}

export class CreateStatementController {
  async execute(request: Request, response: Response): Promise<Response> {
    const { id: user_id } = request.user;
    const { amount, description } = request.body;
    const { user_to } = request.params

    const createStatement = container.resolve(CreateStatementUseCase);

    const rotaSplit = request.originalUrl.split('/')

    let type: OperationType

    if (rotaSplit.includes("transfers")) {
      type = OperationType.TRANSFER
    }
    else if (rotaSplit.includes("deposit")) {
      type = OperationType.DEPOSIT
    }
    else {
      type = OperationType.WITHDRAW
    }

    if (type === OperationType.TRANSFER) {

      const saida = await createStatement.execute({
        user_id,
        type: OperationType.WITHDRAW,
        amount: amount,
        description
      });

      const statement = await createStatement.execute({
        user_id: user_to,
        type,
        amount,
        description,
        sender_id: user_id
      });

      return response.status(201).json(statement);
    }

    const statement = await createStatement.execute({
      user_id,
      type,
      amount,
      description,
    });

    return response.status(201).json(statement);
  }
}
