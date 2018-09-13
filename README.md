# ApportaTeen

This porject consist on a web platform for ApportaTeen, where they will manage all the information of the event and participants.

## Table of contents

* [Client Details](#client-details)
* [Environment URLS](#environment-urls)
* [Team](#team)
* [Management tool](#management-tools)
* [Setup the project](#setup-the-project)
* [Deployment](#deployment)
* [Serve the application](#serve-the-application)


### Client Details

| Name               | Email                       | Role           |
| ------------------ | --------------------------- | -------------- |
| Sonia Tijerina     | sonia.tijerina@csoftmty.org | Product Owner  |


### Environment URLS

* **Production** - [TBD](TBD)
* **Development** - [TBD](TBD)

### Team

| Name           | Email             | Role        |
| -------------- | ----------------- | ----------- |
| Yarely Mercado Garza | yarelymercado@gmail.com | Scrum Master |
| Iram Díaz Reyes | idr.diaz96@gmail.com | Development |
| Luis Felipe Salazar | sv.luisfelipe@gmail.com | Development |
| Carlos Eduardo Serret Heredia | carloserret@gmail.com | Development |

### Management tools

You should ask for access to this tools if you don't have it already:

* [Github repo](https://github.com/ProyectoIntegrador2018/apportateen)
* [Backlog](https://docs.google.com/document/d/1VrD6q7z3sr_nNzeSrYWXCyfuEPh0Yz-tjYvb0573hRA/edit?usp=sharing)
* [Heroku](TBD)
* [Documentation](https://docs.google.com/document/d/1lyQvN8jqlc2UtqYgUsuG1r2eXLr7EXPhyKpIRXoXXGQ/edit?usp=sharing)

## Development

### Setup the project

Install [Node.js and npm](https://nodejs.org/en/download/) if they are not already on your machine.

Install Angular
```bash
$ npm install -g @angular/cli
```

After installing please you can follow this simple steps:

1. Clone this repository into your local machine

```bash
$ git clone https://github.com/ProyectoIntegrador2018/apportateen.git
```

### Deployment

Intall [Heroku](https://devcenter.heroku.com/articles/heroku-cli) if you haven't installed it yet.

[Create a Heroku account](https://signup.heroku.com) if you don't have one already.

1. Log in to your Heroku account on the command shell, with your email and password of your account.

```bash
$ heroku login
Enter your Heroku credentials.
Email: user@example.com
Password:
```

2. Go to the api directory, and install the dependencies.

``` bash
$ cd apportateen/apportateen_api
$ npm install
```

2. Create an app on Heroku.

``` bash
$ heroku create
```

3. Deploy the code

``` bash
$ git push heroku master
```

4. Run the app locally

``` bash
$ heroku local
```

To stop the app from running locally, in the CLI, press `Ctrl`+`C` to exit.

### Serve the application

1. Go to the app directory and install the dependencies: 

``` bash
$ cd apportateen/apportateen_app
$ npm install
```

2. Now launch the application

``` bash
$ ng serve --open
```

The `ng serve` command launches the server, watches your files, and rebuilds the app as you make changes to those files.
Using the `--open` (or just `-o`) option will automatically open your browser on http://localhost:4200/.
To stop the app from running locally, in the CLI, press `Ctrl`+`C` to exit.


