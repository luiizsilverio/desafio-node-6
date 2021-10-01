import 'reflect-metadata'
import { AppError } from '../shared/errors/AppError'
import { CreateUserUseCase } from "../modules/users/useCases/createUser/CreateUserUseCase"
import { InMemoryUsersRepository } from "../modules/users/repositories/in-memory/InMemoryUsersRepository"

let createUserUseCase: CreateUserUseCase
let usersRepository: InMemoryUsersRepository

describe("Create user", () => {

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(usersRepository)
  })

  it("should be able to create a new user", async() => {
    const user = {
      name: "pablo",
      email: "p.vittar@gmail.com",
      password: "1234"
    }

    await createUserUseCase.execute({
      name: user.name,
      email: user.email,
      password: user.password
    })

    const newUser = await usersRepository.findByEmail(user.email)

    expect(newUser).toHaveProperty("id")
  })

  it("should not be able to create another user with the same e-mail", async() => {
    const user = {
      name: "pablo",
      email: "p.vittar@gmail.com",
      password: "1234"
    }

    expect(async () => {
      await createUserUseCase.execute({
        name: user.name,
        email: user.email,
        password: user.password
      })

      await createUserUseCase.execute({
        name: user.name,
        email: user.email,
        password: user.password
      })
    }).rejects.toBeInstanceOf(AppError)
  })

})
