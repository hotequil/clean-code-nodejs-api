import { SaveSurveyResult, SaveSurveyResultParams, SaveSurveyResultRepository, SurveyResultModel } from "./db-save-survey-result-protocols";
import { LoadSurveyResultRepository } from "@/data/protocols/db/survey-result/load-survey-result-repository";

export class DbSaveSurveyResult implements SaveSurveyResult{
    constructor(
        private readonly saveSurveyResultRepository: SaveSurveyResultRepository,
        private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
    ){}

    async save(data: SaveSurveyResultParams): Promise<SurveyResultModel | null>{
        await this.saveSurveyResultRepository.save(data)

        return await this.loadSurveyResultRepository.loadBySurveyId(data.surveyId, data.accountId)
    }
}
