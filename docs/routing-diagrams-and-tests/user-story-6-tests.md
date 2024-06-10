# User Story 6: Tests

## Note

This story relates to the authorisation elements of other user stories, so I have not created an additional routing diagram.

## User Story

- As a user
- I want read/write access to my data to be protected by authentication
- So that I can record data confidently without fear of it being misused

## User Service

- [x] US6-1: Should call findById on User with correct argument
- [ ] US6-2: Should throw HTTPError with status of 500 is findById rejects
- [ ] US6-3: Should return null if findById resolves with undefined
- [ ] US6-4: Should return user if findById resolves with user doc

## Auth Controller

- [ ] AC6-1: Should respond with status code of 401 if no req.cookie.jwt
- [ ] AC6-2: Should call jwt.verify with correct arguments
- [ ] AC6-3: Should status code of 500 if verify rejects
- [ ] AC6-4: Should call getUserById on User Service with correct id if verify resolves
- [ ] AC6-5: Should respond with status code of 500 if User Service rejects
- [ ] AC6-6: Should respond with status code of 401 if User Service returns null
- [ ] AC6-7: Should attach user to request object us User Service resolves
- [ ] AC6-8: Should call next if User Service resolves
