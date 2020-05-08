#!  /usr/bin/env node
const fs = require('fs');
const path = require('path');
const os = require('os')
const Inquirer = require('inquirer');
const commander = require('commander');
const chalk = require('chalk');
const ejs = require('ejs');
const Rx = require('rxjs');
const cwd =process.cwd();


// 设置命令的help参数
commander.version(require('../../package.json').version);

commander
    .command("name")
    .description('生成一个子项目')
    .parse(process.argv)
    .action(()=>{
        console.log(213213);
    });

