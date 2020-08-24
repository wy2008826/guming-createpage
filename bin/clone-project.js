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
const Tip = require('../lib/chalkMsg.js');
const deleteFolder = require('../lib/deleteFolder.js');

const chalkMsg = require('../lib/chalkMsg.js')
const spinner_clone = ora('拉取代码中...')
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



const isWindows = os.type() === 'Windows_NT';

console.log('os.type():',os.type(),isWindows);


const createInputs = (config,result)=>{
    return new Promise((resolve,reject)=>{
        let prompts = new Rx.Subject()
        Inquirer.prompt(prompts).then((data)=>{
            resolve({
                ...result,
                ...data
            });
        });
        (config||[]).map(_=>prompts.next(_));
        prompts.complete();
    });
}

const projectConfig = {
    'book-guming':'/root/book-guming.git',//门店宝B端
    'm-guming':'/root/m-guming.git',//门店宝C端
}

// 是否立即启动项目
let startProject = ()=> createInputs([ {
    type:'list',
    name:'startProjectNow',
    message:chalkMsg.inputMsg('是否立即启动项目'),
    default:'book-guming',
    choices:[
        {
            name: '现在启动项目',
            value: true
        },
        {
            name: '稍后启动',
            value: false
        }
    ]
}]);


//初始化生成微前端子项目
program
    .command('clone [projectname]')
    .description('拉取前端项目1')
    .alias('get')
    .option("-s, --setup_mode [mode]", "Which setup mode to use")
    .action(async function  (projectname, options) {

        console.log('projectname:',projectname);

        // 项目配置
        createInputs([ {
            type:'list',
            name:'projectName',
            message:chalkMsg.inputMsg('请选择要拉取的项目'),
            default:'book-guming',
            choices:[
                {
                    name: '门店宝B端 book-guming',
                    value: 'book-guming'
                },
                {
                    name: '门店宝C端 m-guming',
                    value: 'm-guming'
                }
            ]
        }]).then(async (data)=>{
            //为同类页面添加序号 便于生成对应模板数据
            let  {
                projectName
            }= data;

            let projectDir = 'c://front-projects';//项目默认存放目录

            if(isWindows){//windows系统放在 c盘目录 的 front-projects目录下
                projectDir = "c://front-projects";
            }else{//其他系统
                projectDir = "/front-projects";
            }

            let isExist = fs.existsSync(projectDir);
            if(!isExist){ fs.mkdirSync(projectDir); }
            if(fs.existsSync(`${projectDir}/${projectName}`)){
                console.log(`项目 ${projectName}已存在于  ${projectDir}/${projectName}`);
                startProject().then(async (data)=>{
                    const {
                        startProjectNow
                    } = data;
                    if(startProjectNow){
                        await execCmd(`cd ${projectDir} ${isWindows ? '& c:':''} & npm start`);
                    }

                });
                return ;
            }
            spinner_clone.start();
            let cloneResult = await execCmd(`cd ${projectDir} ${isWindows ? '& c:':''} & git clone http://wangyu:wy1479285@47.96.116.145:8765${projectConfig[projectName]}`);
            spinner_clone.stop();
            console.log('项目拉取成功！',cloneResult);


            spinner_Install.start();
            let npmInstall = await execCmd(`cd ${projectDir} ${isWindows ? '& c:':''} & npm i`);
            spinner_Install.stop();
            Tip.success('项目生成成功！');
            return new Promise().resolve({})
        });



        // const projectDir = path.resolve(process.cwd(),`./${projectname}/`);
        // const reg = /^[a-zA-Z]{4,}$/;
        //
        // const isExist = fs.existsSync(projectDir);
        // if(isExist){
        //     Tip.error(`${projectname} 项目名称已存在 请重新修改项目名称！`);
        //     return ;
        // }
        //
        // if (!reg.test(projectname)) {
        //     Tip.error('项目名称只能包含4位以上大小写字母');
        //     return;
        // }
        // spinner_clone.start();
        // let cloneResult = await execCmd(`git clone http://47.96.116.145:8765/wangyu/book-subapp-project-template.git ${projectname}`);
        // spinner_clone.stop();
        //
        // if(cloneResult){
        //
        //     //删除 项目中的 git仓库文件
        //     deleteFolder(path.resolve(process.cwd(),`./${projectname}/`,`.git`));
        //     spinner_clone.stop();
        //
        //     //修改项目名称
        //     let projectConfig = fs.readFileSync(path.resolve(projectDir,'./webpack.project.config.js'),'utf-8');
        //     projectConfig = projectConfig.replace(/contract/g,projectname);
        //     fs.writeFileSync(path.resolve(projectDir,'./webpack.project.config.js'),projectConfig);
        //
        //     spinner_Install.start();
        //     let npmInstall = await execCmd(`cd ${projectname} && cnpm i`);
        //     spinner_Install.stop();
        //     Tip.success('项目生成成功！');
        //
        // }
    });


//如果没有参数，则直接调用帮助命令
program.parse(process.argv);
if (!program.args.length) {
    program.help()
}
