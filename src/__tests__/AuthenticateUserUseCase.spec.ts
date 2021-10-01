import 'reflect-metadata';
import { AppError } from '../shared/errors/AppError'
import { ICreateUserDTO } from "../modules/users/useCases/createUser/ICreateUserDTO"
import { AuthenticateUserUseCase } from "../modules/users/useCases/authenticateUser/AuthenticateUserUseCase"
import { CreateUserUseCase } from "../modules/users/useCases/createUser/CreateUserUseCase"
import { InMemoryUsersRepository } from "../modules/users/repositories/in-memory/InMemoryUsersRepository"

let authenticateUserUseCase: AuthenticateUserUseCase
let usersRepositoryInMemory: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase

describe("Authenticate user", () => {

  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory)
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory)
  })

  it('should be able to authenticate the user', async () => {
    const user: ICreateUserDTO = {
      email: "luiiz.silverio@gmail.com",
      password: "1234",
      name: "luiiz"
    }

    await createUserUseCase.execute(user)

    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    })

    expect(result).toHaveProperty("token")
  })

  it('should not be able to authenticate a non-existent user', async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: 'errado@test.com',
        password: '1234'
      })
    }).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to authenticate with incorrect password', async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: "luiiz2",
        email: "luiiz2.silverio@gmail.com",
        password: "1234"
      }

      await createUserUseCase.execute(user)

      await authenticateUserUseCase.execute({
        email: user.email,
        password: "senhaErrada"
      })

    }).rejects.toBeInstanceOf(AppError)
  })

})
