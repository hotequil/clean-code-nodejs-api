export const unauthorizedComponent = {
    description: "Incorrect credentials",
    content: {
        "application/json": {
            schema: {
                $ref: "#/schemas/error"
            }
        }
    }
}
