type Query = object[]

export class QueryBuilderHelper {
    private readonly query: Query = []

    match(data: object): QueryBuilderHelper{
        this.query.push({ $match: data })

        return this
    }

    group(data: object): QueryBuilderHelper{
        this.query.push({ $group: data })

        return this
    }

    unwind(data: object): QueryBuilderHelper{
        this.query.push({ $unwind: data })

        return this
    }

    lookup(data: object): QueryBuilderHelper{
        this.query.push({ $lookup: data })

        return this
    }

    addFields(data: object): QueryBuilderHelper{
        this.query.push({ $addFields: data })

        return this
    }

    project(data: object): QueryBuilderHelper{
        this.query.push({ $project: data })

        return this
    }

    build(): Query{
        return this.query
    }
}
