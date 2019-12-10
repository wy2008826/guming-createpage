
const fs = require('fs');
const path = require('path');
const cwd =process.cwd();
const chalkMsg = require('./chalkMsg');
module.exports =[
    {
        type:'input',//用户输入 string
        name:'modelName',
        message:chalkMsg.inputMsg('请输入model名称(大小写字母组成，大写字母开头，长度不低于3)：'),
        validate:(val,prevValue,...rest)=>{ // 校验用户输入 不合格的话 需要重新输入
            return new Promise(async (resolve,reject)=>{
                let nameReg = /^[A-Z][A-Za-z]+$/g;

                //校验系统中是否已经有相同的model
                const hasModels = [];//系统中已经存在的model

                function myReadfileSync(MyUrl) {
                    const files= fs.readdirSync(MyUrl);
                    files.forEach(file => {
                        //拼接获取绝对路径，fs.stat(绝对路径,回调函数)
                        let fPath = path.join(MyUrl, file);
                        const stat = fs.statSync(fPath)
                        // console.log(fPath);
                        if (stat.isDirectory() === true){
                            myReadfileSync(fPath)
                        }else{
                            const source = fs.readFileSync(fPath,'utf-8');
                            const nameSpaceReg1= /namespace\s*\=\s*[\'\"]([a-zA-Z0-9]+)[\'\"][\s\n]*\;?/g;
                            const nameSpaceReg2= /namespace\s*\:\s*[\'\"]([a-zA-Z0-9]+)[\'\"][\s\n]*\,/g;

                            [nameSpaceReg1,nameSpaceReg2].map((reg)=>{
                                if(source.match(reg)){
                                    source.replace(reg,function (all,modelName,...rest) {
                                        // console.log('modelName1:',modelName);
                                        hasModels.push(modelName);
                                    })
                                }
                            })
                        }
                    })
                }

                myReadfileSync(path.resolve(cwd,'./src/models'));
                if(!nameReg.test(val)){
                    console.log(' 格式不正确');
                    resolve(false);
                }
                if( hasModels.indexOf(val)>-1){
                    console.log(' ：该model名称已存在，请更换其他名称');
                    resolve(false);
                }
                resolve(true)
            })
        },
    }
]
