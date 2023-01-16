export type HttpResponse<T = any> = {
    statusCode: number
    body: T
};

export type HttpRequest<T = any, K = any, F = any> = {
    body?: T
    params?: K
    headers?: F
};
