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

const isUsingInValiedProject = require('../lib/isUsingInValiedProject.js');
const modelNameInputConfig = require('../lib/modelNameInputConfig');
const pageTypeConfig = require('../lib/pageTypeConfig');
const commonConfig = require('../lib/commonConfig');
const chalkMsg = require('../lib/chalkMsg');
const createMainPageAndModel = require('../lib/createMainPageAndModel');

commander
    .version(require('../package.json').version)
    // .option('-p, --peppers', 'Add peppers')
    .parse(process.argv);


// 收集用户交互输入

/**
 * @param type:
 * input ; 用户自行输入
 * confirm：用户确认 yes／no
 * list：单选
 * rawlist：给出选项，用户输入选择的索引
 * expand： 单选  但是职让用户选择语义化的内容，相当于选择alias，
 * checkbox：多选,
 * password：密码
 * editor:开启vim 可以自行编辑大段内容；
 *
 * **/


//确保该命令在项目目录中运行
if(!isUsingInValiedProject()){
    return false;
}


const createInputs = (config,result)=>{
    return new Promise((resolve,reject)=>{
        let prompts = new Rx.Subject()
        Inquirer.prompt(prompts).then((data)=>{
            if(config === pageTypeConfig){
                result.pages = result.pages || []
                result.pages.push(data)
                resolve(data.nextPage ? createInputs( pageTypeConfig ,result) : result);
            }else{
                resolve({
                    ...result,
                    ...data
                });
            }
        });
        (config||[]).map(_=>prompts.next(_));
        prompts.complete();
    });
}


const start = (startData = {})=>{
    createInputs(modelNameInputConfig,startData).then((data)=>{// 输入modelName后，进入生成页面配置
        return createInputs(pageTypeConfig,data)
    }).then((data)=>{// 生成公共参数
        return createInputs(commonConfig,data)
    }).then((data)=>{//editor会导致后面的命令行中断 页面注释在最后环节执行
        return createInputs([
            {
                type:'editor',
                name:'comments',
                message:chalkMsg.inputMsg('请输入页面注释'),
            }
        ],data);
    }).then((data)=>{
        //为同类页面添加序号 便于生成对应模板数据
        const pagesType = {};
        (data.pages||[]).map((page,i)=>{
            const {
                type
            } = page;
            if(pagesType[type] === undefined){
                pagesType[type] = 0
            }else{
                pagesType[type] = pagesType[type]+1;
            }
            page.typeIndex = pagesType[type]
        });


        console.log(chalk.red('\n页面配置参数如下:\n'),chalk.blue(JSON.stringify(data,null,2)));

        createMainPageAndModel(data);//根据输入的配置项 读取模板文件 生成页面
    });
}


start({
    timeStamp:getNow(),
    user:{
        time:getNow(),
        hostname:os.hostname()
    }
});


function getNow() {
    const d= new Date();
    const year= d.getFullYear();
    const month = d.getMonth()+1;
    const date= d.getDate();
    const hour = d.getHours()
    const minutes = d.getMinutes()
    const s = d.getSeconds();
    const full = _=>_<10?'0'+_:_;

    return `${year}-${month}-${date} ${full(hour)}:${full(minutes)}:${full(s)}`
}
