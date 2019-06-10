module.exports = function(error){
    switch(error.errno){
        case 19:
            return{
                message: "Bad request.",
                sqlError: error.errno
            }
    }
}