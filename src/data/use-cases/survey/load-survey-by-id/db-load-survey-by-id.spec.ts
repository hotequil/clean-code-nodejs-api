import { SurveyModel, DbLoadSurveyById, LoadSurveyByIdRepository } from "./db-load-survey-by-id-protocols";
import * as MockDate from "mockdate";
import { throwError } from "@/utils/tests";

let dbLoadSurveyById: DbLoadSurveyById
let loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
const ID = "id"

const makeFakeSurvey = (): SurveyModel => ({
    id: ID,
    question: "question",
    answers: [{ answer: "answer", image: "image" }],
    date: new Date(),
})

class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository{
    async loadById(id: string | Object): Promise<SurveyModel | null>{
        console.log(id)

        return await new Promise(resolve => resolve(makeFakeSurvey()))
    }
}

describe(DbLoadSurveyById.name, () => {
    beforeAll(() => MockDate.set(new Date()))
    afterAll(() => MockDate.reset())

    beforeEach(() => {
        loadSurveyByIdRepositoryStub = new LoadSurveyByIdRepositoryStub()
        dbLoadSurveyById = new DbLoadSurveyById(loadSurveyByIdRepositoryStub)
    })

    it("Should call LoadSurveyByIdRepository with correct values", async () => {
        const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, "loadById")

        await dbLoadSurveyById.loadById(ID)

        expect(loadByIdSpy).toBeCalledWith(ID)
    })

    it("Should return survey when loadById was called with success", async () => {
        const survey = await dbLoadSurveyById.loadById(ID)

        expect(survey).toEqual(makeFakeSurvey())
    })

    it("Should throw if LoadSurveyByIdRepository throws", async () => {
        jest.spyOn(loadSurveyByIdRepositoryStub, "loadById").mockImplementationOnce(throwError)

        const promise = dbLoadSurveyById.loadById(ID)

        await expect(promise).rejects.toThrow()
    })
})
