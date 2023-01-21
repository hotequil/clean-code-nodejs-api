import { SurveyResultModel } from "@/domain/models/survey-result";
import { SaveSurveyResult, SaveSurveyResultParams } from "@/domain/use-cases/survey-result/save-survey-result";
import { SaveSurveyResultRepository } from "@/data/protocols/db/survey-result/save-survey-result-repository";

export const mockSurveyResultModel = (surveyId: string, accountId: string, answer: string): SurveyResultModel => ({
    id: "id",
    surveyId,
    accountId,
    answer,
    date: new Date(),
})

export const mockSaveSurveyResultParams = (): SaveSurveyResultParams => ({
    surveyId: "surveyId",
    accountId: "accountId",
    answer: "answer",
    date: new Date(),
})

export const mockSaveSurveyResultRepository = (id: string): SaveSurveyResultRepository => {
    class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository{
        async save(data: SaveSurveyResultParams): Promise<SurveyResultModel | null>{
            return await new Promise(resolve => resolve({ ...data, id }))
        }
    }

    return new SaveSurveyResultRepositoryStub()
}

export const mockSaveSurveyResult = (surveyId: string, accountId: string, answer: string): SaveSurveyResult => {
    class SaveSurveyResultStub implements SaveSurveyResult{
        async save(params: SaveSurveyResultParams): Promise<SurveyResultModel | null> {
            console.log(params)

            return await new Promise(resolve => resolve(mockSurveyResultModel(surveyId, accountId, answer)));
        }
    }

    return new SaveSurveyResultStub()
}
