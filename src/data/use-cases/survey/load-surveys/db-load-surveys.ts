import { LoadSurveys, SurveysModel, LoadSurveysRepository } from "./db-load-surveys-protocols";

export class DbLoadSurveys implements LoadSurveys{
    constructor(private readonly loadSurveysRepository: LoadSurveysRepository){}

    async load(): Promise<SurveysModel> {
        return await this.loadSurveysRepository.loadAll();
    }
}
