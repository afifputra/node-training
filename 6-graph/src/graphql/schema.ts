import { buildSchema } from "graphql";

const schema = buildSchema(`
    type TestData {
        text: String!
        views: Int!
    }

    type Query {
        hello: TestData!
    }

    schema {
        query: Query
    }
`);

export default schema;
