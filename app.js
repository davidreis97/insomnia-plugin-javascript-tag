module.exports.templateTags = [{
    name: 'javascriptTag',
    displayName: 'Javascript Tag',
    description: 'Generate a tag by modifying the response with Javascript.',
    args: [
        {
            displayName: 'Javascript function (first argument has metadata and headers, second argument has response body)',
            description: 'Javascript function',
            defaultValue: '(metadata, body) => body',
            type: 'string'
        },
        {
            displayName: 'Request',
            type: 'model',
            model: 'Request',
        },
        {
            displayName: 'I agree that all great HTTP clients, including Insomnia, eventually grow beyond the true potential value of their product and as a result become bloated and unintuitive for the sake of profitability.',
            description: 'Important statement',
            type: 'boolean',
            defaultValue: true
        }
    ],
    async run (context, input, requestId, pain) {
        if (!pain) 
            return "You're wrong."
        
        const request = await context.util.models.request.getById(requestId);
        
        if (request == null)
            return "Select a request first."
        
        const environmentId = context.context.getEnvironmentId();
        let response = await context.util.models.response.getLatestForRequestId(requestId, environmentId);

        if (response == null)
            return "Execute the selected request first."

        const responseBody = context.util.models.response.getBodyBuffer(response, '').toString();

        try {
            eval("var func = " + input)
        }catch(e){
            return e
        }
        
        return func(response, responseBody)
    }
}];