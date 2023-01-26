export const forbiddenComponent = {
    description: "Can't access",
    content: {
        "application/json": {
            schema: {
                $ref: "#/schemas/error"
            }
        }
    }
}
