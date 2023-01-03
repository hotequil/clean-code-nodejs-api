import { AddSurveyRepository, AddSurvey, AddSurveyModel } from "./db-add-survey-protocols";

export class DbAddSurvey implements AddSurvey{
    constructor(private readonly addSurveyRepository: AddSurveyRepository) {}

    async add(model: AddSurveyModel): Promise<null>{
        await this.addSurveyRepository.add(model)

        return await new Promise(resolve => resolve(null))
    }
}
