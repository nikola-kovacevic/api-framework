# API skeleton structure for SaaS projects

## PROVIDED FUNCTIONALITY

1. Winston logs
   - [x] Console transport
   - [x] File transport
   - [ ] DB transport
   - [x] Correlation for distributed tracking
2. Morgan logs for HTTP tracking
   - [x] Implements Morgan
   - [x] Writes to file
   - [ ] Daily log file rotation
3. Cache service
   - [ ] Redis connection
   - [ ] Cache mechanism
4. MongoDB connection
   - [x] Implements Mongoose connection
   - [ ] Listeners for connect and disconnect events
   - [ ] Logging on development environment
5. Provided Docker images
   - [ ] MongoDB
   - [ ] Redis
   - [ ] Node.js
6. Request & Response Interceptors
   - [ ] Measure execution time with Performance API
   - [ ] Automated logging of events
   - [ ] Distributed tracing via correlation

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
