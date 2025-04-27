# list of all APIs


# authRouter
 POST /signup
 POST /login
 POST /logout

# profileRouter
 GET /profile/view
 PATCH /profile/edit
 PATCH /profile/password


 status:  interested,ignored, 
                pending
          accepted, rejected


# connectionRequestRouter
POST /request/send/interested/:userId
POST /request/send/ignored/:userId

POST /request/review/accepted/:requestId
POST /request/review/rejected/:requestId


# userRouter
GET /connections
GET /requests/received
GET /feed 