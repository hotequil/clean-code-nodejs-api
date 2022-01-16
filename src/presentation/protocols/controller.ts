import { HttpRequest, HttpResponse } from "./http";

export interface Controller{
    handle: (body: HttpRequest) => HttpResponse
}