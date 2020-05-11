const chalk = require('chalk');
const log = console.log;

module.exports ={
    inputMsg:_=>chalk.red(_),
    error:_=>log( chalk.red(_) ),
    success:_=>log( chalk.green(_) ),
}
