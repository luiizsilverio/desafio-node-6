import 'reflect-metadata'
import { AppError } from '../shared/errors/AppError'
import { CreateStatementUseCase } from "../modules/statements/useCases/createStatement/CreateStatementUseCase"
import { InMemoryStatementsRepository } from "../modules/statements/repositories/in-memory/InMemoryStatementsRepository"
import { InMemoryUsersRepository } from "../modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../modules/users/useCases/createUser/CreateUserUseCase";
import { GetBalanceUseCase } from "../modules/statements/useCases/getBalance/GetBalanceUseCase"

let createStatementUseCase: CreateStatementUseCase
let statementsRepository: InMemoryStatementsRepository
let getBalanceUseCase: GetBalanceUseCase

let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer'
}

describe("Get balance", () => {

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(usersRepository)
    statementsRepository = new InMemoryStatementsRepository()
    createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository)
    getBalanceUseCase = new GetBalanceUseCase(statementsRepository, usersRepository)
  })

  it("should be able to get the balance", async() => {
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
      amount: 120
    };

    await createStatementUseCase.execute(deposito);
    await createStatementUseCase.execute(deposito);

    const balance = await getBalanceUseCase.execute({ user_id })

    console.log(balance)
    expect(balance).toHaveProperty("balance", 120 * 2);
    expect(balance).toHaveProperty("statement");
    expect(balance.statement.length).toBe(2);
  })

  it("Should not be able get the balance from an invalid account", async () => {
    expect(async () => {
      const user_id = "12345";

      await getBalanceUseCase.execute({ user_id });

    }).rejects.toBeInstanceOf(AppError);
  });
})
