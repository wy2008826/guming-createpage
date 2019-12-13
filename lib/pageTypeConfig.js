
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
    //列表页面相关配置
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
    //详情页相关配置
    {
        type:'input',
        name:'detail-card-info-num',
        message:chalkMsg.inputMsg(`请输入页面中包含的 ${chalk.bgRed.white('信息卡片')}数量(不包含列表信息 1-9 的数字 )`),//一般来说不可能出现大于10个card信息的详情页
        default:1,
        when:(prevVal)=>{
            return prevVal.type === 'detail';
        },
        validate:(val)=>{
            const reg= /^[1-9]$/g
            const valied = reg.test(val);
            !valied && console.log(`  ${chalk.red('必须为1-9 的纯数字')}`);
            return valied;
        }
    },
    {
        type:'input',
        name:'detail-card-table-num',
        message:chalkMsg.inputMsg('请输入页面中包含的列表卡片数量：数量代表展示的表格数量(1-9 的数字 )'),//一般来说不可能出现大于10个card信息的详情页
        default:1,
        when:(prevVal)=>{
            return prevVal.type === 'detail';
        },
        validate:(val)=>{
            const reg= /^[1-9]$/g
            const valied = reg.test(val);
            !valied && console.log(`  ${chalk.red('必须为1-9 的纯数字')}`);
            return valied;
        }
    },
    // 表单编辑页相关配置
    {
        type:'input',
        name:'edit-form-group-num',
        message:chalkMsg.inputMsg('请输入页面中表单划分的区块数量(1-9 的数字 )'),//一般来说不可能出现大于10个card信息的详情页
        default:1,
        when:(prevVal)=>{
            return prevVal.type === 'edit';
        },
        validate:(val)=>{
            const reg= /^[1-9]$/g
            const valied = reg.test(val);
            !valied && console.log(`  ${chalk.red('必须为1-9 的纯数字')}`);
            return valied;
        }
    },
    {
        type:'checkbox',
        name:'edit-form-input-types',
        message:chalkMsg.inputMsg('请选择表单页面中包含的输入框类型（如：输入框、下拉框、日期、......）'),
        default:['Input','Select','Cascader','RangePicker','TreeSelect'],
        choices:[
            { name: `输入框`, value: 'Input' },
            { name: `下拉框`, value: 'Select' },
            { name: `级联下拉`, value: 'Cascader' },
            { name: `日期范围`, value: 'RangePicker' },
            { name: `树状下拉`, value: 'TreeSelect' },
        ],
        when:(prevVal)=>{
            return prevVal.type === 'edit';
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
