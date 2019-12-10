
const chalkMsg = require('./chalkMsg');

module.exports = [
    // {
    //     type:'expand',
    //     name:'type',
    //     message:chalkMsg.inputMsg('请选择你要创建的页面类型'),
    //     default:'l',
    //     choices:[
    //         {
    //             key: 'l',
    //             name: '列表页',
    //             value: 'list'
    //         },
    //         {
    //             key: 'm',
    //             name: '多Tab列表页',
    //             value: 'multi-list'
    //         }
    //     ]
    // },
    {
        type:'list',
        name:'type',
        message:chalkMsg.inputMsg('请选择你要创建的页面类型'),
        default:'list',
        choices:[
            {
                name: '列表页',
                value: 'list'
            },
            {
                name: '详情页（只用来查看，不可编辑）',
                value: 'detail'
            },
            {
                name: '新增或者编辑页',
                value: 'edit'
            }
        ]
    },
    {
        type:'checkbox',
        name:'list-filter-types',
        message:chalkMsg.inputMsg('请选择列表筛选项中包含的输入框类型'),
        default:['Input','Select'],
        choices:[
            'Input','Select','Cascader','RangePicker','TreeSelect'
        ],
        when:(prevVal)=>{
            return prevVal.type === 'list';
        }
    },
    {
        type:'confirm',//  boolean  二选一
        name:'nextPage',
        message:chalkMsg.inputMsg('是否配置下一个页面类型，（多个类型会转换为tab切换页面）'),
        // when:(prevValue)=>{ // 决定当前选项是否需要让用户处理 相当于 if 判断
        //     return new Promise((resolve,reject)=>{
        //         console.log('when prevValue:',prevValue);
        //         resolve(true);
        //     })

        // },
    },
]
