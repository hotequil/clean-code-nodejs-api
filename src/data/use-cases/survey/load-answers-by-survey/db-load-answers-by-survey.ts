import { LoadAnswersBySurvey, LoadAnswersBySurveyRepository } from "./db-load-answers-by-survey-protocols";
import { ObjectId } from "mongodb";

export class DbLoadAnswersBySurvey implements LoadAnswersBySurvey{
    constructor(private readonly loadAnswersBySurveyRepository: LoadAnswersBySurveyRepository){}

    async loadAnswers(id: string | ObjectId): Promise<LoadAnswersBySurvey.Result>{
        return await this.loadAnswersBySurveyRepository.loadAnswers(id)
    }
}
