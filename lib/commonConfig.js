const chalkMsg = require('./chalkMsg');

module.exports =[
    {
        type:'confirm',
        name:'simple',
        message:chalkMsg.inputMsg('是否开启简单模式（简单模式:不需要回调函数自行封装子组件）'),
    }
    // {
    //     type:'editor',
    //     name:'comments',
    //     message:chalkMsg.inputMsg('请输入页面注释'),
    // }
]
