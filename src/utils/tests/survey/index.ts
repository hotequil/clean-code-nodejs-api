import { type AddSurveyRepository } from "@/data/protocols/db/survey/add-survey-repository";
import { type AddSurvey } from "@/domain/use-cases/survey/add-survey";
import { type LoadSurveyByIdRepository } from "@/data/protocols/db/survey/load-survey-by-id-repository";
import { type SurveyModel, type SurveysModel } from "@/domain/models/survey";
import { type LoadSurveysRepository } from "@/data/protocols/db/survey/load-surveys-repository";
import { type LoadSurveys } from "@/domain/use-cases/survey/load-surveys";
import { type LoadAnswersBySurvey } from "@/domain/use-cases/survey/load-answers-by-survey";
import { type ObjectId } from "mongodb";
import { type CheckSurveyById } from "@/domain/use-cases/survey/check-survey-by-id";
import { type CheckSurveyByIdRepository } from "@/data/protocols/db/survey/check-survey-by-id-repository";

export const mockSurveyModel = (id = "id", answer = "answer"): SurveyModel => ({
    id,
    question: "question",
    answers: [{ answer: "answer" }, { answer, image: "image" }],
    date: new Date()
})

export const mockSurveysModel = (): SurveysModel => [
    {
        id: "id",
        question: "question",
        answers: [{ answer: "answer", image: "image" }],
        date: new Date()
    }
]

export const mockAddSurveyParams = (answer = "answer", otherAnswer = "other-answer"): AddSurvey.Params => ({
    question: "question",
    answers: [
        { answer },
        { image: "image", answer: otherAnswer }
    ],
    date: new Date()
})

export const mockAnswers = (surveyId?: string, answer?: string): string[] => mockSurveyModel(surveyId, answer).answers.map(({ answer }) => answer)

export const mockAddSurveyRepository = (): AddSurveyRepository => {
    class AddSurveyRepositoryStub implements AddSurveyRepository {
        async add(model: AddSurveyRepository.Params): Promise<AddSurveyRepository.Result> {
            console.log(model)

            return null
        }
    }

    return new AddSurveyRepositoryStub()
}

export const mockLoadSurveyByIdRepository = (surveyId: string, answer?: string): LoadSurveyByIdRepository => {
    class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
        async loadById(id: string | ObjectId): Promise<LoadSurveyByIdRepository.Result> {
            console.log(id)

            return mockSurveyModel(surveyId, answer)
        }
    }

    return new LoadSurveyByIdRepositoryStub()
}

export const mockCheckSurveyByIdRepository = (): CheckSurveyByIdRepository => {
    class CheckSurveyByIdRepositoryStub implements CheckSurveyByIdRepository {
        async checkById(id: string | ObjectId): Promise<CheckSurveyByIdRepository.Result> {
            console.log(id)

            return true
        }
    }

    return new CheckSurveyByIdRepositoryStub()
}

export const mockLoadSurveysRepository = (): LoadSurveysRepository => {
    class LoadSurveysRepositoryStub implements LoadSurveysRepository {
        async loadAll(accountId: string | ObjectId): Promise<SurveysModel> {
            console.log(accountId)

            return mockSurveysModel()
        }
    }

    return new LoadSurveysRepositoryStub()
}

export const mockLoadSurveys = (): LoadSurveys => {
    class LoadSurveysStub implements LoadSurveys {
        async load(accountId: string): Promise<LoadSurveys.Result> {
            console.log(accountId)

            return mockSurveysModel()
        }
    }

    return new LoadSurveysStub()
}

export const mockAddSurvey = (): AddSurvey => {
    class AddSurveyStub implements AddSurvey {
        async add(params: AddSurvey.Params): Promise<AddSurvey.Result> {
            console.log(params)

            return null
        }
    }

    return new AddSurveyStub()
}

export const mockLoadAnswersBySurvey = (surveyId?: string, answer?: string): LoadAnswersBySurvey => {
    class LoadAnswersBySurveyStub implements LoadAnswersBySurvey {
        async loadAnswers(id: string | ObjectId): Promise<LoadAnswersBySurvey.Result> {
            console.log(id)

            return mockAnswers(surveyId, answer)
        }
    }

    return new LoadAnswersBySurveyStub()
}

export const mockCheckSurveyById = (): CheckSurveyById => {
    class CheckSurveyByIdStub implements CheckSurveyById {
        async checkById(id: string | ObjectId): Promise<CheckSurveyById.Result> {
            console.log(id)

            return true
        }
    }

    return new CheckSurveyByIdStub()
}
