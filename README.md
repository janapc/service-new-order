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

These services process a new order. How in an e-commerce when a new order has to be processed. We need logs, submit an email, and verify if not have fraud.All this using the apache-Kafka to orchestrator.

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
