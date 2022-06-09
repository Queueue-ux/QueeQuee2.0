const fs = require('node:fs');
module.exports =
{
    emit_error(err) {
        const date_obj = new Date();
        const date = ('0' + date_obj.getDate()).slice(-2);
        const month = ('0' + (date_obj.getMonth() + 1)).slice(-2);
        const year = date_obj.getFullYear();
        const hours = date_obj.getHours();
        const minutes = date_obj.getMinutes();
        const seconds = date_obj.getSeconds();
        const error_output = `error at ${month}/${date}/${year} ${hours}:${minutes}:${seconds}\n\t${err}\n\n------------------------------\n\n`;
        fs.appendFile('errorLog.txt', error_output, function(err) {
            if (err) console.log('error appending to error file');
            });
    },
};