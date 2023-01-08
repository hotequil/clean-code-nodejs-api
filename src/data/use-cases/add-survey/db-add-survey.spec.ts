import { DbAddSurvey } from "./db-add-survey";
import { AddSurveyModel, AddSurveyRepository } from "./db-add-survey-protocols";

let db: DbAddSurvey
let addSurveyRepositoryStub: AddSurveyRepository

const makeAddSurveyModel = (): AddSurveyModel => ({
    question: "question",
    answers: [
        { image: "image", answer: "answer" },
        { image: "image", answer: "answer" },
        { image: "image", answer: "answer" },
    ]
})

class AddSurveyRepositoryStub implements AddSurveyRepository{
    async add(model: AddSurveyModel): Promise<null>{
        console.log(model)

        return await new Promise(resolve => resolve(null))
    }
}

describe(DbAddSurvey.name, () => {
    beforeEach(() => {
        addSurveyRepositoryStub = new AddSurveyRepositoryStub()
        db = new DbAddSurvey(addSurveyRepositoryStub)
    })

    it("Should call AddSurveyRepository with correct values", async () => {
        const repositorySpy = jest.spyOn(addSurveyRepositoryStub, "add")
        const model = makeAddSurveyModel()

        await db.add(model)

        expect(repositorySpy).toHaveBeenCalledWith(model)
    })

    it("Should throw if AddSurveyRepository throws", async () => {
        jest.spyOn(addSurveyRepositoryStub, "add")
            .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

        const promise = db.add(makeAddSurveyModel())

        await expect(promise).rejects.toThrow()
    })
})
