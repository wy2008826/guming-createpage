#!  /usr/bin/env node
const fs = require('fs');
const path = require('path');
const os = require('os')
const Inquirer = require('inquirer');
const chalk = require('chalk');
const ejs = require('ejs');
const Rx = require('rxjs');
const cwd =process.cwd();

const isUsingInValiedProject = require('../lib/isUsingInValiedProject.js');
const modelNameInputConfig = require('../lib/modelNameInputConfig');
const pageTypeConfig = require('../lib/pageTypeConfig');
const commonConfig = require('../lib/commonConfig');
const chalkMsg = require('../lib/chalkMsg');



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
        console.log(chalk.red('\n页面配置参数如下:\n'),chalk.blue(JSON.stringify(data,null,2)));
        const answers = {
            ...data
        }
        //页面
        const pageTtemplate = fs.readFileSync(path.resolve(cwd,'./src/createPage/EjsTmp/PageTemplate.ejs'),'utf-8');
        let pageResult = ejs.render(pageTtemplate, answers);
        fs.writeFileSync(path.resolve(cwd,`./src/routes/_template/template.js`),pageResult,'utf-8')

        //model
        const modelTtemplate = fs.readFileSync(path.resolve(cwd,'./src/createPage/EjsTmp/PageListModel.ejs'),'utf-8')
        let modelResult = ejs.render(modelTtemplate, answers);
        fs.writeFileSync(path.resolve(cwd,`./src/models/_template/template.js`),modelResult,'utf-8')


        console.log(chalkMsg.inputMsg(`\n\nmodel 和页面已经生成并分别放置于 src/models/template  src/routes/template 目录下 \n根据model配置，在config.js中添加接口配置 \n,配置router`));

        process.exit(1)
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
