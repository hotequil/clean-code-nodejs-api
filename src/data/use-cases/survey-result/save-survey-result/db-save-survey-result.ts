import { type SaveSurveyResult, type SaveSurveyResultRepository } from "./db-save-survey-result-protocols";
import { type LoadSurveyResultRepository } from "@/data/protocols/db/survey-result/load-survey-result-repository";

export class DbSaveSurveyResult implements SaveSurveyResult {
    constructor(
        private readonly saveSurveyResultRepository: SaveSurveyResultRepository,
        private readonly loadSurveyResultRepository: LoadSurveyResultRepository
    ) {}

    async save(data: SaveSurveyResult.Params): Promise<SaveSurveyResult.Result> {
        await this.saveSurveyResultRepository.save(data)

        return await this.loadSurveyResultRepository.loadBySurveyId(data.surveyId, data.accountId)
    }
}
