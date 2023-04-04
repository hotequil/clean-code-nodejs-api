import { LoadAnswersBySurvey, LoadSurveyByIdRepository } from "./db-load-answers-by-survey-protocols";
import { ObjectId } from "mongodb";

export class DbLoadAnswersBySurvey implements LoadAnswersBySurvey{
    constructor(private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository){}

    async loadAnswers(id: string | ObjectId): Promise<LoadAnswersBySurvey.Result>{
        const survey = await this.loadSurveyByIdRepository.loadById(id)
        const answers = survey?.answers ?? []

        return answers.map(({ answer }) => answer)
    }
}
