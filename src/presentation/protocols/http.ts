export type HttpResponse<T = any> = {
    body: T
    statusCode: number
};

export type HttpRequest<T = any, K = any, F = any> = {
    body?: T
    params?: K
    headers?: F
    accountId?: string
};
