import { SurveyResultModel } from "@/domain/models/survey-result";
import { SaveSurveyResult, SaveSurveyResultParams } from "@/domain/use-cases/survey-result/save-survey-result";
import { SaveSurveyResultRepository } from "@/data/protocols/db/survey-result/save-survey-result-repository";
import { LoadSurveyResultRepository } from "@/data/protocols/db/survey-result/load-survey-result-repository";
import { ObjectId } from "mongodb";
import { LoadSurveyResult } from "@/domain/use-cases/survey-result/load-survey-result";

export const mockSurveyResultModel = (
    surveyId: string | ObjectId,
    reset?: boolean,
    secondIsCurrentAccountAnswer?: boolean
): SurveyResultModel => {
    const value = reset ? 0 : null

    if(secondIsCurrentAccountAnswer !== false) secondIsCurrentAccountAnswer = true

    return {
        surveyId,
        question: "question",
        answers: [
            {
                answer: "answer",
                count: value ?? 1,
                percent: value ?? 50,
                isCurrentAccountAnswer: false,
            },
            {
                image: "image",
                answer: "other-answer",
                count: value ?? 10,
                percent: value ?? 80,
                isCurrentAccountAnswer: secondIsCurrentAccountAnswer,
            }
        ],
        date: new Date(),
    }
}

export const mockSaveSurveyResultParams = (
    surveyId: string | ObjectId = "surveyId",
    accountId: string | ObjectId = "accountId",
    answer = "answer"
): SaveSurveyResultParams => ({
    surveyId,
    accountId,
    answer,
    date: new Date(),
})

export const mockSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
    class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository{
        async save(data: SaveSurveyResultParams): Promise<void>{
            console.log(data)
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
        async loadBySurveyId(surveyId: string | ObjectId, accountId: string | ObjectId): Promise<LoadSurveyResultRepository.Result>{
            console.log(accountId)

            return mockSurveyResultModel(surveyId);
        }
    }

    return new LoadSurveyResultRepositoryStub()
}

export const mockLoadSurveyResult = (): LoadSurveyResult => {
    class LoadSurveyResultStub implements LoadSurveyResult{
        async load(surveyId: string, accountId: string): Promise<LoadSurveyResult.Result>{
            console.log(accountId)

            return mockSurveyResultModel(surveyId)
        }
    }

    return new LoadSurveyResultStub()
}
