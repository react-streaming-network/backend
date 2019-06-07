module.exports = function(error){
    switch(error.errno){
        case 19:
            return{
                message: "Bad request due to SQL constraint.",
                sqlError: error.errno
            }
    }
}