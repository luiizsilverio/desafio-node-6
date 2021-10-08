import 'reflect-metadata'
import { AppError } from '../shared/errors/AppError'
import { CreateStatementUseCase } from "../modules/statements/useCases/createStatement/CreateStatementUseCase"
import { InMemoryStatementsRepository } from "../modules/statements/repositories/in-memory/InMemoryStatementsRepository"
import { InMemoryUsersRepository } from "../modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../modules/users/useCases/createUser/CreateUserUseCase";

let createStatementUseCase: CreateStatementUseCase
let statementsRepository: InMemoryStatementsRepository

let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer'
}

describe("Create statement", () => {

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(usersRepository)
    statementsRepository = new InMemoryStatementsRepository()
    createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository)
  })

  it("should be able to make a deposit", async() => {
    const user = {
      name: "pablo",
      email: "p.vittar@gmail.com",
      password: "1234"
    }

    const { id } = await createUserUseCase.execute(user)
    const user_id = id as string

    const deposito = {
      user_id,
      type: "deposit" as OperationType,
      description: "Salário",
      amount: 120
    };

    const statement = await createStatementUseCase.execute(deposito);

    expect(statement).toHaveProperty("id", statement.id);
    expect(statement.amount).toBe(120);
  })

  it("should be able to make a withdrawal", async() => {
    const user = {
      name: "pablo",
      email: "p.vittar@gmail.com",
      password: "1234"
    }

    const { id } = await createUserUseCase.execute(user)
    const user_id = id as string

    const deposito = {
      user_id,
      type: "deposit" as OperationType,
      description: "Freela",
      amount: 70
    };

    await createStatementUseCase.execute(deposito);

    const saque = {
      user_id,
      type: "withdraw" as OperationType,
      description: "Barzinho",
      amount: 70
    };

    const statement = await createStatementUseCase.execute(saque);

    expect(statement).toHaveProperty("id", statement.id);
    expect(statement.amount).toBe(70);
  })

  it("should not be able to make a withdrawal on an account with insufficient funds", async() => {
    const user = {
      name: "pablo",
      email: "p.vittar@gmail.com",
      password: "1234"
    }

    const { id } = await createUserUseCase.execute(user)
    const user_id = id as string

    const statement = {
      user_id,
      type: "withdraw" as OperationType,
      description: "Barzinho",
      amount: 70
    };

    expect(async () => {
      await createStatementUseCase.execute(statement);

    }).rejects.toBeInstanceOf(AppError)
  })

  it("Should not be able to withdraw from an unexistent account", async () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: '12345',
        type: "withdraw" as OperationType,
        amount: 1000,
        description: "Saque",
      });
    }).rejects.toBeInstanceOf(AppError);
  });
})
