# NodeGmailer

1. First run npm i in the main directory.
1. Then run the server using npm run server.
1. Use postman or any other client to call the api.
1. The first api that should be called is http://localhost:5000/api/geturl  (A post request) this will return a url which should be openned the browser to get the access token. 
1. The second to call is http://localhost:5000/api/sendToken  (A post request). With the call a json with the token should be provided. This will store a token.json file in the backend in the config folder which will be used for the next api. 
1. To send an email call http://localhost:5000/api/sendEmail  (A post request) with the parameters as shown in the screenshot folder.
