import { type CheckSurveyByIdRepository, mockCheckSurveyByIdRepository, throwError } from "./db-check-survey-by-id-protocols";
import { DbCheckSurveyById } from "@/data/use-cases/survey/check-survey-by-id/db-check-survey-by-id";

let dbCheckSurveyById: DbCheckSurveyById
let checkSurveyByIdRepositoryStub: CheckSurveyByIdRepository
const id = "id"

describe(DbCheckSurveyById.name, () => {
    beforeEach(() => {
        checkSurveyByIdRepositoryStub = mockCheckSurveyByIdRepository()
        dbCheckSurveyById = new DbCheckSurveyById(checkSurveyByIdRepositoryStub)
    })

    it("Should call CheckSurveyByIdRepository with correct values", async () => {
        const checkByIdSpy = jest.spyOn(checkSurveyByIdRepositoryStub, "checkById")

        await dbCheckSurveyById.checkById(id)

        expect(checkByIdSpy).toBeCalledWith(id)
    })

    it("Should return true when checkById was called with success", async () => {
        const result = await dbCheckSurveyById.checkById(id)

        expect(result).toEqual(true)
    })

    it("Should throw if CheckSurveyByIdRepository throws", async () => {
        jest.spyOn(checkSurveyByIdRepositoryStub, "checkById").mockImplementationOnce(throwError)

        const promise = dbCheckSurveyById.checkById(id)

        await expect(promise).rejects.toThrow()
    })
})
