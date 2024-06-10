# User Story 6: Tests

## Note

This story relates to the authorisation elements of other user stories, so I have not created an additional routing diagram.

## User Story

- As a user
- I want read/write access to my data to be protected by authentication
- So that I can record data confidently without fear of it being misused

## User Service

- [x] US6-1: It should call findById on User with correct argument
- [x] US6-2: It should throw HTTPError with status of 500 is findById rejects
- [x] US6-3: It should return undefined if findById resolves with undefined
- [x] US6-4: It should return user if findById resolves with user doc

## Auth Controller

- [x] AC6-1: It should respond with status code of 401 if no req.cookie.jwt
- [x] AC6-2: It should call jwt.verify with correct arguments
- [x] AC6-3: It should respond with a status code of 500 if verify rejects
- [x] AC6-4: It should call getUserById on User Service with correct id if verify resolves
- [ ] AC6-5: It should respond with status code of 500 if User Service rejects
- [ ] AC6-6: It should respond with status code of 401 if User Service returns undefined
- [ ] AC6-7: It should attach user to request object us User Service resolves
- [ ] AC6-8: It should call next if User Service resolves
