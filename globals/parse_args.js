/*
 used to easily parse args
 0 is first arg after !{command}
*/
module.exports =
{
    check_length(argList, length) {
        return argList.length == length;
    },
};