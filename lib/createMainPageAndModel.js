const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const ejs = require('ejs');
const cwd =process.cwd();
const chalkMsg = require('./chalkMsg');


module.exports = (data)=>{

    const distFiles = [];

    const answers = {
        ...data
    }
    //页面
    const pageTtemplate = fs.readFileSync(path.resolve(cwd,'./src/createPage/EjsTmp/PageTemplate.ejs'),'utf-8');
    let pageResult = ejs.render(pageTtemplate, answers);

    let pageFileDir = path.resolve(cwd,`./src/routes/_template/template.js`)
    distFiles.push(pageFileDir);
    fs.writeFileSync(pageFileDir,pageResult,'utf-8')

    //model
    const modelTtemplate = fs.readFileSync(path.resolve(cwd,'./src/createPage/EjsTmp/PageListModel.ejs'),'utf-8')
    let modelResult = ejs.render(modelTtemplate, answers);
    const modelFileDir = path.resolve(cwd,`./src/models/_template/template.js`);
    distFiles.push(modelFileDir);
    fs.writeFileSync(modelFileDir,modelResult,'utf-8');


    //生成编辑页面
    (answers.pages || []).map((page,i)=>{
        const {
            type,
            typeIndex
        } = page;

        if(type === 'edit'){
            const pageTtemplate = fs.readFileSync(path.resolve(cwd,'./src/createPage/EjsTmp/AddOrEditPage.js'),'utf-8');
            let pageResult = ejs.render(pageTtemplate, answers);
            let pageName= `AddOrEditPage${typeIndex===0?'':typeIndex}`;
            let UtilPageDir = path.resolve(cwd,`./src/routes/_template/${pageName}.js`);
            distFiles.push(UtilPageDir);
            fs.writeFileSync(UtilPageDir,pageResult,'utf-8');
        }
    });


    const allFiles= fs.readdirSync(path.resolve(cwd,'./src/routes/_template'));
    (allFiles||[]).map((fileName)=>{
        let filePathName = path.resolve(cwd,`./src/routes/_template/${fileName}`);
        let needDrop = distFiles.indexOf(filePathName)<0
        if(needDrop){
            console.log(chalk.red(`\n无用文件删除：${filePathName}`));
            fs.unlink(filePathName,(error)=>{
                if(error){
                    console.log(`${filePathName}删除失败！`);
                }
            })
        }
    });


    console.log(chalkMsg.inputMsg(`\n\nmodel 和页面已经生成并分别放置于 src/models/template  src/routes/template 目录下 \n根据model配置，在config.js中添加接口配置 \n,配置router`));

    process.exit(1)
}
