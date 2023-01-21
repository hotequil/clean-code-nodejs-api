import { DbLoadSurveyById, LoadSurveyByIdRepository } from "./db-load-survey-by-id-protocols";
import * as MockDate from "mockdate";
import { mockLoadSurveyByIdRepository, mockSurveyModel, throwError } from "@/utils/tests";

let dbLoadSurveyById: DbLoadSurveyById
let loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
const ID = "id"

describe(DbLoadSurveyById.name, () => {
    beforeAll(() => MockDate.set(new Date()))
    afterAll(() => MockDate.reset())

    beforeEach(() => {
        loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository(ID)
        dbLoadSurveyById = new DbLoadSurveyById(loadSurveyByIdRepositoryStub)
    })

    it("Should call LoadSurveyByIdRepository with correct values", async () => {
        const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, "loadById")

        await dbLoadSurveyById.loadById(ID)

        expect(loadByIdSpy).toBeCalledWith(ID)
    })

    it("Should return survey when loadById was called with success", async () => {
        const survey = await dbLoadSurveyById.loadById(ID)

        expect(survey).toEqual(mockSurveyModel(ID))
    })

    it("Should throw if LoadSurveyByIdRepository throws", async () => {
        jest.spyOn(loadSurveyByIdRepositoryStub, "loadById").mockImplementationOnce(throwError)

        const promise = dbLoadSurveyById.loadById(ID)

        await expect(promise).rejects.toThrow()
    })
})
