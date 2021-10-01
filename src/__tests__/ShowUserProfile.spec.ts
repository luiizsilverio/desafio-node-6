import 'reflect-metadata'
import { AppError } from '../shared/errors/AppError'
import { ShowUserProfileUseCase } from "../modules/users/useCases/showUserProfile/ShowUserProfileUseCase"
import { InMemoryUsersRepository } from "../modules/users/repositories/in-memory/InMemoryUsersRepository"

let showUserUseCase: ShowUserProfileUseCase
let usersRepository: InMemoryUsersRepository

describe("Show user profile", () => {

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    showUserUseCase = new ShowUserProfileUseCase(usersRepository)
  })

  it("should be able to show the user", async() => {
    const user = await usersRepository.create({
      name: "pablo",
      email: "p.vittar@gmail.com",
      password: "1234"
    })

    const user_id = user.id as string
    const shownUser = await showUserUseCase.execute(user_id)

    expect(shownUser).toEqual(user)
  })

  it("should not be able to show an unexisting user", async() => {
    expect(async () => {
      const result = await showUserUseCase.execute("12345");
  }).rejects.toBeInstanceOf(AppError);
  })

})
