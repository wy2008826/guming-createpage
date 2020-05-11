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
const ora =  require('ora');
const Tip = require('../../lib/chalkMsg.js');
const deleteFolder = require('../../lib/deleteFolder.js');

const spinner_clone = ora('拉取模板代码中...')
const spinner_Install = ora('npm包安装中...')


//执行命令行代码
const execCmd = (cmdText)=> new Promise((resolve,reject)=>{
    exec(cmdText,(error)=>{
        if(error){
            reject(error)
        }else{
            resolve(true)
        }
        // resolve(error ? false : true)
    })
});

program
    .version('0.1.0')
    // .option('-C, --chdir <path>', 'change the working directory')


//初始化生成微前端子项目
program
    .command('init [projectname]')
    .description('初始化微前端子项目')
    .alias('it')
    .option("-s, --setup_mode [mode]", "Which setup mode to use")
    .action(async function  (projectname, options) {
        const projectDir = path.resolve(process.cwd(),`./${projectname}/`);
        const reg = /^[a-zA-Z]{4,}$/;

        const isExist = fs.existsSync(projectDir);
        if(isExist){
            Tip.error(`${projectname} 项目名称已存在 请重新修改项目名称！`);
            return ;
        }

        if (!reg.test(projectname)) {
            Tip.error('项目名称只能包含4位以上大小写字母');
            return;
        }
        spinner_clone.start();
        let cloneResult = await execCmd(`git clone http://47.96.116.145:8765/wangyu/book-subapp-project-template.git ${projectname}`);
        spinner_clone.stop();

        if(cloneResult){

            //删除 项目中的 git仓库文件
            deleteFolder(path.resolve(process.cwd(),`./${projectname}/`,`.git`));
            spinner_clone.stop();

            //修改项目名称
            let projectConfig = fs.readFileSync(path.resolve(projectDir,'./webpack.project.config.js'),'utf-8');
            projectConfig = projectConfig.replace(/contract/g,projectname);
            fs.writeFileSync(path.resolve(projectDir,'./webpack.project.config.js'),projectConfig);

            spinner_Install.start();
            let npmInstall = await execCmd(`cd ${projectname} && cnpm i`);
            spinner_Install.stop();
            Tip.success('项目生成成功！');

        }
    });


//如果没有参数，则直接调用帮助命令
program.parse(process.argv);
if (!program.args.length) {
    program.help()
}
