import { AnyObject } from "../../utils/helpers";

export type HttpResponse<T = any> = {
    statusCode: number
    body: T
};

export type HttpRequest<T = any> = {
    headers?: AnyObject
    body?: T
};
