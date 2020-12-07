#!/usr/bin/env node

const inquirer = require("inquirer");
const shell = require("shelljs");


const askQuestions = () => {
  const questions = [
    {
      name: "FILENAME",
      type: "input",
      message: "请输入项目名称?"
    },
    {
      type: "list",
      name: "EXTENSION",
      message: "选择模版类型?",
      choices: ["ts", "js"],
      filter: function (val) {
        return val;
      }
    }
  ];
  return inquirer.prompt(questions);
};

const createFile = require('../lib/init');

const run = async () => {
  // ask questions
  const answers = await askQuestions();
  const { FILENAME, EXTENSION } = answers;
  createFile(FILENAME, EXTENSION)
};

run();