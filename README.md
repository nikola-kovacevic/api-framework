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
   - [x] Daily log file rotation
3. Cache service
   - [x] Cache manager
   - [x] Redis store
   - [x] Cache service
4. MongoDB connection
   - [x] Implements Mongoose connection
   - [ ] Listeners for connect and disconnect events
   - [x] Logging on development environment
5. Provided Docker images
   - [x] MongoDB
   - [x] Redis
   - [x] Node.js
6. Request & Response Interceptors
   - [ ] Measure execution time with Performance API
   - [ ] Automated logging of events
   - [ ] Distributed tracing via correlation
7. User management
   - [ ] JWT token assignment
   - [ ] Authentication and authorization guards
   - [ ] Password encryption
   - [ ] CRUD operations
8. Log inspection
   - [ ] Filter and read logs
   - [ ] Archive logs
   - [ ] Retention
9. Administrative application management
   - [ ] Manually clear cache
   - [ ] Manually connect to Redis
   - [ ] Manually disconnect from Redis
10. Mail service
    - [ ] Mailgun connection
    - [ ] Email templates (i.e. activation, system message, password reset)
11. Translate service
    - [ ] Get's the translation from DB / or file
    - [ ] Returns default language translation if none found

## USED ENVIRONMENT VARIABLES

Core API needs following environment variables to function properly.

| **ENVIRONMENT VARIABLE** | Type   | EXPLANATION                              |
| ------------------------ | ------ | ---------------------------------------- |
| **MONGO_URL**            | String | database URL                             |
| **MONGO_DB_NAME**        | String | database name                            |
| **MONGO_PASSWORD**       | String | database password                        |
| **MONGO_USER**           | String | database user                            |
| **APP_NAME**             | String | application name                         |
| **REDIS_HOST**           | String | Redis host                               |
| **REDIS_PORT**           | Number | Redis port                               |
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
