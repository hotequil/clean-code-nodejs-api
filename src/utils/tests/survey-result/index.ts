import { SurveyAnswersResultModel, SurveyResultModel } from "@/domain/models/survey-result";
import { SaveSurveyResult, SaveSurveyResultParams } from "@/domain/use-cases/survey-result/save-survey-result";
import { SaveSurveyResultRepository } from "@/data/protocols/db/survey-result/save-survey-result-repository";
import { LoadSurveyResultRepository } from "@/data/protocols/db/survey-result/load-survey-result-repository";

export const mockSurveyResultModel = (surveyId: string): SurveyResultModel => ({
    surveyId,
    question: "question",
    answers: [
        {
            answer: "answer",
            count: 1,
            percent: 50
        },
        {
            image: "image",
            answer: "other-answer",
            count: 10,
            percent: 80
        }
    ],
    date: new Date(),
})

export const mockSaveSurveyResultParams = (): SaveSurveyResultParams => ({
    surveyId: "surveyId",
    accountId: "accountId",
    answer: "answer",
    date: new Date(),
})

export const mockSaveSurveyResultRepository = (question: string, answers: SurveyAnswersResultModel): SaveSurveyResultRepository => {
    class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository{
        async save(data: SaveSurveyResultParams): Promise<SurveyResultModel | null>{
            const { surveyId, date } = data

            return { surveyId, date, question, answers }
        }
    }

    return new SaveSurveyResultRepositoryStub()
}

export const mockSaveSurveyResult = (surveyId: string): SaveSurveyResult => {
    class SaveSurveyResultStub implements SaveSurveyResult{
        async save(params: SaveSurveyResultParams): Promise<SurveyResultModel | null> {
            console.log(params)

            return mockSurveyResultModel(surveyId);
        }
    }

    return new SaveSurveyResultStub()
}

export const mockLoadSurveyResultRepository = (): LoadSurveyResultRepository => {
    class LoadSurveyResultRepositoryStub implements LoadSurveyResultRepository{
        async loadBySurveyId(surveyId: string): Promise<SurveyResultModel | null>{
            return mockSurveyResultModel(surveyId);
        }
    }

    return new LoadSurveyResultRepositoryStub()
}
