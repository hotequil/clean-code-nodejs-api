export const serverErrorComponent = {
    description: "Problem server",
    content: {
        "application/json": {
            schema: {
                $ref: "#/schemas/error"
            }
        }
    }
}
