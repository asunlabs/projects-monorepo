# Motivation

Update Github repository label with this package. This package is useful for developers who would like to keep a consistent labeling style for multiple repositories.

For example, one's repo named javascript-study might have following issue labels.

```
algorithm
framework
web
```

And the one might have python-study as followings.

```
machine learning
numpy
algorithm
framework
web
```

It is a tedius job to recreate issues per repository. This package will solve this painpoint by setting a label template once and re-use it multiple times.

## Install

My-label-setter is deployed to [npmjs](https://www.npmjs.com/). Run below command to install.

```sh
npm i my-label-setter
```

Also, git clone works.

```shell
git clone https://github.com/developerasun/myCodeBox-openSource.git
```

Note that this package is dependent on [Github label sync package](https://github.com/Financial-Times/github-label-sync).

## Run

Go to a directory where you want to generate a template project.

Run below command.

```sh
set-label
```

and then run,

```sh
node app
```

Follow instructions from there. Note that github-label-sync should be installed like terminal suggests.

![dependency](https://user-images.githubusercontent.com/83855174/173190713-26559333-c5cb-42d7-b53a-079a0f0002f4.png)

## Configuration

Configurate as below.

1. Updating label requires your repository permission. Generate your github personal access token [here](https://github.com/settings/tokens/new).
1. Fix a .json label file. Provide a color to label by hex code without prefixed hash. Default label color is black.

```json
    {
    "name": "research",
    "color": "000000",
    "description": "digging out for more details"
    },
```

## Result

If done successfully, terminal will print out like below.

![command-running-result](https://user-images.githubusercontent.com/83855174/173190538-aa44fafe-5dbe-4d5d-b682-c5e91047586d.png)

## Future improvements

- Update labels in several repos with one command

## Creator

- [DeveloperAsun](https://github.com/developerasun)
