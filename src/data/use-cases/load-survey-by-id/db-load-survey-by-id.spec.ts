import { LoadSurveyByIdRepository } from "@/data/protocols/db/survey/load-survey-by-id-repository";
import { DbLoadSurveyById } from "@/data/use-cases/load-survey-by-id/db-load-survey-by-id";
import { SurveyModel } from "@/domain/models/survey";
import * as MockDate from "mockdate";

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
    async loadById(id: string): Promise<SurveyModel | null>{
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
})
