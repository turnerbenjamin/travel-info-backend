# User Story 3: Routing Diagram and Tests

## User Story

- As a user
- I want to be able to remove a location from my favourites
- So that I can keep my collection of favourite locations up to date

## Routing Diagram

![User story 3 Routing diagram](./images/user-story-3-routing-diagram.PNG)

## Tests

### Favourited Location Service (FLS)

- [x] FLS3-1: It should call findOneAndDelete on the FavouritedLocation model with the correct arguments
- [x] FLS3-2: It should return undefined where a deleted doc is returned
- [x] FLS3-3: It should throw HTTPError with status of 404 where no deleted doc is returned
- [x] FLS3-4: It should throw an error where findByIdAndDelete fails
- [x] FLS3-5: It should throw an error where passed id is undefined

### User Controller (UC)

- [x] UC3-1: It should call deleteById on the Favourited Location service with the correct id
- [x] UC3-2: It should send a 500 response if the Favourited Location service rejects
- [x] UC3-3: It should send a 404 response if deleteById throws a HTTPError with a status code of 404
- [x] UC3-4: It should send a 204 response if deleteById resolves
- [x] UC3-5: It should have an undefined response body where successful
- [x] UC3-6: It should send a 500 response if req.user is null

### Integration Tests (INT)

- [x] INT3-1: It should respond with a 204 status code with valid request
- [x] INT3-2: It should have removed the favourite where successful
- [x] INT3-3: It should have an empty response body where successful
- [ ] INT3-4: It should return 500 status code where error thrown
- [ ] INT3-5: It should return 404 status code where document not found
- [ ] INT3-6: It should return 404 status code where user is not the owner of a document in the database
