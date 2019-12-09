
const path = require('path');
const fs= require('fs')
const cwd =process.cwd();

module.exports = ()=>{
    //确保该命令在项目目录中运行
    const canUseProjects = ['goodme-book'];
    const packageDir = path.resolve(cwd,'./package.json');

    const packageFileIsExists = fs.existsSync(packageDir);

    let isValied =true;
    if(packageFileIsExists){
        const packageFile = fs.readFileSync(packageDir,'utf-8');
        const projectName = JSON.parse(packageFile).name;
        if(canUseProjects.indexOf(projectName) <0){
            console.log(`请在以下项目中使用该命令：${canUseProjects.join('、')}`);
            isValied = false;
        }
    }else{
        console.log(`请在以下项目中使用该命令：${canUseProjects.join('、')}`);
        isValied = false;
    }

    return isValied
}
