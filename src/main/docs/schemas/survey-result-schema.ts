export const surveyResultSchema = {
    type: "object",
    properties: {
        surveyId: {
            type: "string"
        },
        question: {
            type: "string"
        },
        answers: {
            type: "array",
            items: {
                $ref: "#/schemas/surveyAnswerResult"
            }
        },
        date: {
            type: "string"
        },
    },
}
