import { CheckSurveyById, CheckSurveyByIdRepository } from "./db-check-survey-by-id-protocols";
import { ObjectId } from "mongodb";

export class DbCheckSurveyById implements CheckSurveyById{
    constructor(private readonly checkSurveyByIdRepository: CheckSurveyByIdRepository){}

    async checkById(id: string | ObjectId): Promise<CheckSurveyById.Result>{
        return await this.checkSurveyByIdRepository.checkById(id)
    }
}
