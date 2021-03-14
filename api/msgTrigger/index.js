module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const name = (req.query.name || (req.body && req.body.name));
    const responseMessage = name
        ? "Hello, " + name + ". This HTTP triggered function executed successfully."
        : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };
    //set up twilio account 
    context.bindings.message = {
        body : "Hi, here's a message",
        to: "" //phone num1 here
    };
    context.bindings.message2 = {
        body : "Hi, here's message2",
        to: "" //phone num2 here
    };
}

