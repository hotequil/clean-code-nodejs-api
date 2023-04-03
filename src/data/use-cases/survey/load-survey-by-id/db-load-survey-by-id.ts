import { LoadSurveyById, LoadSurveyByIdRepository } from "./db-load-survey-by-id-protocols";
import { ObjectId } from "mongodb";

export class DbLoadSurveyById implements LoadSurveyById{
    constructor(private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository){}

    async loadById(id: string | ObjectId): Promise<LoadSurveyById.Result>{
        return await this.loadSurveyByIdRepository.loadById(id)
    }
}
