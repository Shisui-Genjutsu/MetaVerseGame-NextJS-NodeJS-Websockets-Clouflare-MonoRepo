import swaggerJSDoc from "swagger-jsdoc";
import type { SwaggerDefinition, Options } from "swagger-jsdoc";

const serverUrl = process.env.SERVER_URL || "http://localhost:3000/api/v1";

const swaggerDefinition: SwaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "MetaVerse HTTP API",
        version: "1.0.0",
        description: "HTTP API for authentication and world management in MetaVerse.",
    },
    servers: [
        {
            url: serverUrl,
            description: "Local development server",
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            },
        },
        schemas: {
            SignupRequest: {
                type: "object",
                required: ["username", "password", "type"],
                properties: {
                    username: { type: "string" },
                    password: { type: "string", format: "password" },
                    type: { type: "string", enum: ["admin", "user"] },
                },
            },
            SigninRequest: {
                type: "object",
                required: ["username", "password"],
                properties: {
                    username: { type: "string" },
                    password: { type: "string", format: "password" },
                },
            },
            AuthSuccessResponse: {
                type: "object",
                properties: {
                    token: { type: "string", description: "JWT token" },
                    message: { type: "string" },
                },
            },
            GenericMessageResponse: {
                type: "object",
                properties: {
                    message: { type: "string" },
                },
            },
        },
    },
    paths: {
        "/sign-up": {
            post: {
                summary: "Create a new user account",
                tags: ["Auth"],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/SignupRequest",
                            },
                        },
                    },
                },
                responses: {
                    "201": {
                        description: "User created successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/GenericMessageResponse",
                                },
                            },
                        },
                    },
                    "400": {
                        description: "Validation failed",
                    },
                    "500": {
                        description: "Internal server error",
                    },
                },
            },
        },
        "/sign-in": {
            post: {
                summary: "Authenticate a user and issue a JWT",
                tags: ["Auth"],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/SigninRequest",
                            },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "User signed in successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/AuthSuccessResponse",
                                },
                            },
                        },
                    },
                    "401": {
                        description: "Invalid credentials",
                    },
                    "403": {
                        description: "Validation failed",
                    },
                    "404": {
                        description: "User not found",
                    },
                    "500": {
                        description: "Internal server error",
                    },
                },
            },
        },
    },
};

const options: Options = {
    definition: swaggerDefinition,
    apis: [],
};

export const swaggerSpec = swaggerJSDoc(options);

