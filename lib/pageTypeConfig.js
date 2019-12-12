
const chalkMsg = require('./chalkMsg');
const chalk = require('chalk');

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
            {name:'输入框 ： Input', value:'Input' },
            {name:'下拉框 ： Select', value:'Select' },
            {name:'级联选择 ： Cascader', value:'Cascader' },
            {name:'日期范围 ：RangePicker', value:'RangePicker' },
            {name:'树状结构选择 ： TreeSelect', value:'TreeSelect' }
        ],
        when:(prevVal)=>{
            return prevVal.type === 'list';
        }
    },
    {
        type:'checkbox',
        name:'list-table-rowOperations',
        message:chalkMsg.inputMsg('请选择列表最后一列包含的操作项（如：删除、查看、上架、下架、编辑等）'),
        default:['detail','delete'],
        choices:[
            { name: `查看按钮 ${chalk.blue('⊙‍')}`, value: 'detail' },
            { name: `删除按钮 ${chalk.red('✘')}`, value: 'delete' },
            { name: `编辑按钮 ${chalk.green('✐')}`, value: 'edit' },
            { name: `上架按钮 ${chalk.yellow('↑')}`, value: 'up' },
            { name: `下架按钮 ${chalk.yellow('↓')}`, value: 'down' },
            { name: `同步按钮 ${chalk.blue('↻')}`, value: 'refresh' },
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
