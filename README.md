# API skeleton structure for SaaS projects

## PROVIDED FUNCTIONALITY

1. Winston logs
   1. Console transport
   2. File transport
   3. DB transport
   4. Correlation for distributed tracking
2. Morgan logs for HTTP tracking
3. Cache service
4. MongoDB connection
   1. Listeners for connect and disconnect events
   2. Logging on development environment
5. Provided Docker images
   1. MongoDB
   2. Redis
   3. Node.js
6. Request & Response Interceptors
   1. Measure execution time with Performance API
   2. Automated logging of events
   3. Distributed tracing via correlation

## USED ENVIRONMENT VARIABLES

Core API needs following environment variables to function properly.

| **ENVIRONMENT VARIABLE** | Type   | EXPLANATION                              |
| ------------------------ | ------ | ---------------------------------------- |
| **MONGO_URL**            | String | database URL                             |
| **MONGO_DB_NAME**        | String | database name                            |
| **MONGO_PASSWORD**       | String | database password                        |
| **MONGO_USER**           | String | database user                            |
| **APP_NAME**             | String | application name                         |
| **CACHE_TTL**            | Number | Cache time to live, specified in seconds |
| **ENCRYPTION_KEY**       | String | Encryption key                           |
| **CONTACT_EMAIL**        | String | Contact email                            |
| **MG_API_KEY**           | String | Mailgun API key                          |
| **MG_DOMAIN**            | String | Mailgun domain                           |
| **RECAPTCHA_KEY**        | String | Google recaptcha key                     |
| **JWT_PRIVATE_KEY**      | String | JWT private key                          |
| **FRONTEND_URL**         | String | Frontend URL                             |
| **NODE_ENV**             | String | Node.js environment                      |
| **PORT**                 | String | Application port                         |
