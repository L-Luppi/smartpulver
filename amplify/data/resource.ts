import {type ClientSchema, a, defineData, defineFunction, secret} from "@aws-amplify/backend";

// 1. Define your MySQL connector function
//export const mysqlConnector = defineFunction({
//    environment: {
//        SQL_CONNECTION_STRING: secret('SQL_CONNECTION_STRING')
//    },
//});

// Schema imported with ampx generate schema-from-database
// Check Amplify Gen 2 doc for SQL_CONNECTION_STRING
//import { schema as generatedSqlSchema } from './schema.sql';

// Add a global authorization rule
//const smartpulverSchema = generatedSqlSchema.authorization(allow => allow.guest())

//smartpulverSchema.models.agrofit_produto.authorization(allow => allow.publicApiKey().to(['read']));

// Schema for DynamoDB tables managed by Amplify
const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
    })
    .authorization((allow) => [allow.owner()]),
});


// Use the a.combine() operator to stitch together the models backed by DynamoDB
// and the models backed by Postgres or MySQL databases.
//const combinedSchema = a.combine([schema, smartpulverSchema]);

export type Schema = ClientSchema<typeof schema >;

export const data = defineData({
  schema: schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    // API Key is used for a.allow.public() rules
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});