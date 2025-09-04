import { a, defineData } from "@aws-amplify/backend";

// define o schema backend
export const schema = a.schema({
  UserProfile: a
    .model({
      email: a.email().required(),
      name: a.string().required(),
      role: a.enum(["admin", "manager", "user", "viewer"]),
      department: a.string(),
      isActive: a.boolean().default(true),
      lastLogin: a.datetime(),
      preferences: a.json(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.group("admin").to(["read", "create", "update", "delete"]),
      allow.group("manager").to(["read", "update"]),
    ]),

  Todo: a
    .model({
      content: a.string(),
      completed: a.boolean().default(false),
      priority: a.enum(["low", "medium", "high"]),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.group("admin").to(["read", "create", "update", "delete"]),
    ]),
});

// Tipo para uso no frontend e backend
export type Schema = typeof schema;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
