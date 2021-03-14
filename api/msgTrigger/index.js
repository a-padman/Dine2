module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    
    var body = req.body;
    var phone1 = body.phone1;
    var phone2 = body.phone2;
    var address = body.address;
    var restaurantName = body.name;

    var txtMessage = "Thanks for using Dine the Distance! Here's the address to go to " + restaurantName + ": " + address;
    
    //send directions

    context.bindings.message = {
        body : txtMessage,
        to: phone1 
    };
    context.bindings.message2 = {
        body : txtMessage,
        to: phone2 
    };
}

