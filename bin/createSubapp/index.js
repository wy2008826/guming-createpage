#!  /usr/bin/env node
const fs = require('fs');
const path = require('path');
const os = require('os')
const Inquirer = require('inquirer');
const program = require('commander');
const chalk = require('chalk');
const ejs = require('ejs');
const Rx = require('rxjs');
const cwd = process.cwd();
const exec = require('child_process').exec;

console.log(exec);

program
    .version('0.1.0')
    .option('-C, --chdir <path>', 'change the working directory')
    .option('-c, --config <path>', 'set config path. defaults to ./deploy.conf')
    .option('-T, --no-tests', 'ignore test hook');

//初始化生成微前端子项目
program
    .command('init [projectname]')
    .description('初始化微前端子项目')
    .option("-s, --setup_mode [mode]", "Which setup mode to use")
    .action(function (projectname, options) {
        const reg = /^[a-zA-Z]{4}$/g;
        if(!reg.test(projectname)){
            console.log('项目名称只能包含4位以上大小写字母');
            return;
        }
        exec(`git clone http://47.96.116.145:8765/wangyu/book-subapp-project-template.git`)
    });

// program
//     .command('setup [env]')
//     .description('run setup commands for all envs')
//     .option("-s, --setup_mode [mode]", "Which setup mode to use")
//     .action(function (env, options) {
//         const mode = options.setup_mode || "normal";
//         env = env || 'all';
//         console.log('setup for %s env(s) with %s mode', env, mode);
//     });

program
    .command('exec <cmd>')
    .alias('ex')
    .description('execute the given remote cmd')
    .option("-e, --exec_mode <mode>", "Which exec mode to use")
    .action(function (cmd, options) {
        console.log('exec "%s" using %s mode', cmd, options.exec_mode);
    }).on('--help', function () {
    console.log('');
    console.log('Examples:');
    console.log('');
    console.log('  $ deploy exec sequential');
    console.log('  $ deploy exec async');
});

program
    .command('*')
    .action(function (env) {
        console.log('deploying "%s"', env);
    });

program.parse(process.argv);
