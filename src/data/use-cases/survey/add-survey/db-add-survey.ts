import { AddSurveyRepository, AddSurvey } from "./db-add-survey-protocols";

export class DbAddSurvey implements AddSurvey{
    constructor(private readonly addSurveyRepository: AddSurveyRepository) {}

    async add(model: AddSurvey.Params): Promise<AddSurvey.Result>{
        await this.addSurveyRepository.add(model)

        return null
    }
}
