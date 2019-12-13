const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const ejs = require('ejs');
const cwd =process.cwd();
const chalkMsg = require('./chalkMsg');


module.exports = (data)=>{

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
}
