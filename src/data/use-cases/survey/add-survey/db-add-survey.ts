import { AddSurveyRepository, AddSurvey, AddSurveyParams } from "./db-add-survey-protocols";

export class DbAddSurvey implements AddSurvey{
    constructor(private readonly addSurveyRepository: AddSurveyRepository) {}

    async add(model: AddSurveyParams): Promise<null>{
        await this.addSurveyRepository.add(model)

        return null
    }
}
