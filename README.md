<div align="center">
  <h1>Service New Order 📦</h1>
  <img alt="Last commit" src="https://img.shields.io/github/last-commit/janapc/service-new-order"/>
  <img alt="Language top" src="https://img.shields.io/github/languages/top/janapc/service-new-order"/>
  <img alt="Repo size" src="https://img.shields.io/github/repo-size/janapc/service-new-order"/>

<a href="#-project">Project</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
<a href="#-requirement">Requirement</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
<a href="#-install">Install</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
<a href="#-technologies">Technologies</a>

</div>

## 💎 Project

These services process a new order. How in an e-commerce when a new order has to be processed. We need make several process to
that this order reaches the client.All this using the apache-Kafka to orchestrator the messages.

Some of services using:

| Service                 | Description                                                                                  | Consumer / Producer |
| ----------------------- | -------------------------------------------------------------------------------------------- | ------------------- |
| service-email           | This microservice send a e-mail                                                              | ✅ / ❌             |
| service-email-new-order | This microservice consumer new order and assembles the email to be sent                      | ✅ / ✅             |
| service-fraud-detector  | This microservice verify if the order is an fraud                                            | ✅ / ✅             |
| service-http-ecommerce  | This microservice create new order by API and generate all reports                           | ❌ / ✅             |
| service-log             | This microservice manager all logs of services                                               | ✅ / ❌             |
| service-new-order       | This microservice simule new orders                                                          | ❌ / ✅             |
| service-users           | This microservice create new users in database and send message to all the users of database | ✅ / ✅             |
| service-reading-report  | This microservice generate reading report                                                    | ✅ / ❌             |

Common between services:

- common-database: This project contains the handler of the database using Sqlite.
- common-kafka: This project contains the handler of the Kafka that can create consumers and create producer.
- common-logs: This project contains the handler of the Logs to format the messages.

## 📜 Requirement

To run this project your need to have:

- Docker [Docker](https://www.docker.com/)
- Nodejs [Nodejs](https://nodejs.org/en/)

## ⬇️ Install

```sh
## install dependences
❯ npm i

## run local with docker to up apache-kafka
❯ docker-compose up -d

## run service of fraud detector
❯ npm run service:fraud-detector

## run service of email
❯ npm run service:email

## run service of email-new-order
❯ npm run service:email-new-order

## run service of log
❯ npm run service:log

## run service of api
❯ npm run service:http-ecommerce

## run service of users
❯ npm run service:create-user

## run new order
❯ npm run service:new-order

## run batch send message
❯ npm run service:batch-send-message

## run reading report
❯ npm run service:reading-report
```

## 🚀 Technologies

- nodejs
- javascript
- apache-kafka
- typescript
- docker
- sqlite

<div align="center">

Made by Janapc 🤘 [Get in touch!](https://www.linkedin.com/in/janaina-pedrina/)

</div>
