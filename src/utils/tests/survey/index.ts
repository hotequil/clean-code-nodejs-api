import { AddSurveyRepository } from "@/data/protocols/db/survey/add-survey-repository";
import { AddSurveyParams } from "@/domain/use-cases/survey/add-survey";
import { LoadSurveyByIdRepository } from "@/data/protocols/db/survey/load-survey-by-id-repository";
import { SurveyModel, SurveysModel } from "@/domain/models/survey";
import { LoadSurveysRepository } from "@/data/protocols/db/survey/load-surveys-repository";

export const mockSurveyModel = (id = "id", answer = "answer"): SurveyModel => ({
    id,
    question: "question",
    answers: [{ answer: "answer", image: "image" }, { answer, image: "image" }],
    date: new Date(),
})

export const mockSurveysModel = (): SurveysModel => [
    {
        id: "id",
        question: "question",
        answers: [{ answer: "answer", image: "image" }],
        date: new Date(),
    }
]

export const mockAddSurveyRepository = (): AddSurveyRepository => {
    class AddSurveyRepositoryStub implements AddSurveyRepository{
        async add(model: AddSurveyParams): Promise<null>{
            console.log(model)

            return await new Promise(resolve => resolve(null))
        }
    }

    return new AddSurveyRepositoryStub()
}

export const mockLoadSurveyByIdRepository = (surveyId: string): LoadSurveyByIdRepository => {
    class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository{
        async loadById(id: string | Object): Promise<SurveyModel | null>{
            console.log(id)

            return await new Promise(resolve => resolve(mockSurveyModel(surveyId)))
        }
    }

    return new LoadSurveyByIdRepositoryStub()
}

export const mockLoadSurveysRepository = (): LoadSurveysRepository => {
    class LoadSurveysRepositoryStub implements LoadSurveysRepository{
        async loadAll(): Promise<SurveysModel>{
            return await new Promise(resolve => resolve(mockSurveysModel()))
        }
    }

    return new LoadSurveysRepositoryStub()
}
