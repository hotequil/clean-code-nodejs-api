import {
    SurveyResultModel,
    LoadSurveyResult,
    LoadSurveyResultRepository,
    LoadSurveyByIdRepository,
    SurveyModel,
    SurveyAnswersResultModel
} from "./db-load-survey-result-protocols";

export class DbLoadSurveyResult implements LoadSurveyResult{
    constructor(
        private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
        private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository,
    ){}

    async load(surveyId: string): Promise<SurveyResultModel | null> {
        const surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(surveyId)

        if(surveyResult) return surveyResult

        const { question, answers, date, id } = await this.loadSurveyByIdRepository.loadById(surveyId) as SurveyModel
        const newAnswers: SurveyAnswersResultModel = answers.map(answer => ({ ...answer, count: 0, percent: 0 }))

        return { question, answers: newAnswers, date, surveyId: id }
    }
}
