import { AddSurveyRepository } from "@/data/protocols/db/survey/add-survey-repository";
import { AddSurvey } from "@/domain/use-cases/survey/add-survey";
import { LoadSurveyByIdRepository } from "@/data/protocols/db/survey/load-survey-by-id-repository";
import { SurveyModel, SurveysModel } from "@/domain/models/survey";
import { LoadSurveysRepository } from "@/data/protocols/db/survey/load-surveys-repository";
import { LoadSurveys } from "@/domain/use-cases/survey/load-surveys";
import { LoadSurveyById } from "@/domain/use-cases/survey/load-survey-by-id";
import { ObjectId } from "mongodb";

export const mockSurveyModel = (id = "id", answer = "answer"): SurveyModel => ({
    id,
    question: "question",
    answers: [{ answer: "answer" }, { answer, image: "image" }],
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

export const mockAddSurveyParams = (answer = "answer", otherAnswer = "other-answer"): AddSurvey.Params => ({
    question: "question",
    answers: [
        { answer },
        { image: "image", answer: otherAnswer },
    ],
    date: new Date(),
})

export const mockAddSurveyRepository = (): AddSurveyRepository => {
    class AddSurveyRepositoryStub implements AddSurveyRepository{
        async add(model: AddSurveyRepository.Params): Promise<AddSurveyRepository.Result>{
            console.log(model)

            return null
        }
    }

    return new AddSurveyRepositoryStub()
}

export const mockLoadSurveyByIdRepository = (surveyId: string, answer?: string): LoadSurveyByIdRepository => {
    class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository{
        async loadById(id: string | ObjectId): Promise<LoadSurveyByIdRepository.Result>{
            console.log(id)

            return mockSurveyModel(surveyId, answer)
        }
    }

    return new LoadSurveyByIdRepositoryStub()
}

export const mockLoadSurveysRepository = (): LoadSurveysRepository => {
    class LoadSurveysRepositoryStub implements LoadSurveysRepository{
        async loadAll(accountId: string | ObjectId): Promise<SurveysModel>{
            console.log(accountId)

            return mockSurveysModel()
        }
    }

    return new LoadSurveysRepositoryStub()
}

export const mockLoadSurveys = (): LoadSurveys => {
    class LoadSurveysStub implements LoadSurveys{
        async load(accountId: string): Promise<SurveysModel>{
            console.log(accountId)

            return mockSurveysModel()
        }
    }

    return new LoadSurveysStub()
}

export const mockAddSurvey = (): AddSurvey => {
    class AddSurveyStub implements AddSurvey{
        async add(params: AddSurvey.Params): Promise<AddSurvey.Result>{
            console.log(params)

            return null
        }
    }

    return new AddSurveyStub()
}

export const mockLoadSurveyById = (surveyId: string, answer = "answer"): LoadSurveyById => {
    class LoadSurveyByIdStub implements LoadSurveyById{
        async loadById(id: string | ObjectId): Promise<LoadSurveyById.Result> {
            console.log(id)

            return mockSurveyModel(surveyId, answer)
        }
    }

    return new LoadSurveyByIdStub()
}
