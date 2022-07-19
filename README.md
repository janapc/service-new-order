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

| Service                | Description                                       | Consumer X Producer |
| ---------------------- | ------------------------------------------------- | ------------------- |
| service-email          | This microservice send a e-mail                   | true X false        |
| service-fraud-detector | This microservice verify if the order is an fraud | true X true         |
| service-http-ecommerce | This microservice create new order by API         | false X true        |
| service-log            | This microservice manager all logs of services    | true X false        |
| service-new-order      | This microservice simule new orders               | false X true        |
| service-users          | This microservice create new users in database    | true X false        |

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
❯ npm run service:fraudDetector

## run service of email
❯ npm run service:email

## run service of log
❯ npm run service:log

## run service of api
❯ npm run service:http-ecommerce

## run service of users
❯ npm run service:users

## run new order
❯ npm run service:new-order

```

## 🚀 Technologies

- nodejs
- javascript
- apache-kafka
- typescript
- docker

<div align="center">

Made by Janapc 🤘 [Get in touch!](https://www.linkedin.com/in/janaina-pedrina/)

</div>
