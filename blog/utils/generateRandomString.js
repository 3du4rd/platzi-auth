const generateRandomString = function(length){
    let randomString = "";
    const possibleCars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i=0;i<length; i++){
        randomString += possibleCars(
            Math.floor( Math.random() * possibleCars.length)
        );
    }
}

module.exports= generateRandomString;