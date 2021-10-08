import 'reflect-metadata'
import { AppError } from '../shared/errors/AppError'
import { CreateStatementUseCase } from "../modules/statements/useCases/createStatement/CreateStatementUseCase"
import { InMemoryStatementsRepository } from "../modules/statements/repositories/in-memory/InMemoryStatementsRepository"
import { InMemoryUsersRepository } from "../modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../modules/users/useCases/createUser/CreateUserUseCase";
import { GetStatementOperationUseCase } from "../modules/statements/useCases/getStatementOperation/GetStatementOperationUseCase"

let createStatementUseCase: CreateStatementUseCase
let statementsRepository: InMemoryStatementsRepository
let getStatementUseCase: GetStatementOperationUseCase

let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer'
}

describe("Get statement", () => {

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(usersRepository)
    statementsRepository = new InMemoryStatementsRepository()
    createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository)
    getStatementUseCase = new GetStatementOperationUseCase(usersRepository, statementsRepository)
  })

  it("should be able to get a statement", async() => {
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

    const depStatement = await createStatementUseCase.execute(deposito);

    const statement_id = depStatement.id as string

    const statement = await getStatementUseCase.execute({ user_id, statement_id })

    expect(statement).toHaveProperty("id", statement.id);
    expect(statement.amount).toBe(120);
  })

  it("Should not be able get an invalid statement", async () => {
    expect(async () => {
      const user = {
        name: "pablo",
        email: "p.vittar@gmail.com",
        password: "1234"
      };

      const { id } = await createUserUseCase.execute(user)
      const user_id = id as string

      const statement_id = "12345";

      await getStatementUseCase.execute({ user_id, statement_id });

    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should not be able get a statement from an invalid account", async () => {
    expect(async () => {
      const user_id = "12345";
      const statement_id = "12345";

      await getStatementUseCase.execute({ user_id, statement_id });

    }).rejects.toBeInstanceOf(AppError);
  });
})
