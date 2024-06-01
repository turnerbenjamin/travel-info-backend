# User Story 1: Routing Diagram and Tests

## User Story

- As a user
- I want to be able to save a location to my favourites
- So that I can use these in the travel app

## Routing Diagram

![User story 1 Routing diagram](./images/user-story-1-routing-diagram.PNG)

## Tests

### Location Service (LS)

- [x] LS1-1: It should call findOne on the Location model with the correct coordinate identifier as an argument
- [x] LS1-2: It should return the correct location where a location with the same coordinates as those supplied is already in the collection
- [ ] LS1-3: It should throw an error if findOne fails
- [ ] LS1-4: It should call create with the correctly formatted location details on the Location model if findOne returns null
- [ ] LS1-5: It should return a new location document with the correct properties where a location with the supplied coordinates was not already in the collection
- [ ] LS1-6: It should throw an error if create throws an error

### User Service (US)

- [ ] US1-1: It should add the location to the favourite locations property on the user document (this will be attached to request object during authentication)
- [ ] US1-2: It should call save on the updated user document
- [ ] US1-3: It should return the updated user document
- [ ] US1-4: It should throw an error where save fails
- [ ] US1-5: It should throw an error where the user document is not attached to the request object

### User Controller (UC)

- [ ] UC1-1: It should call add location on location service with the correct location details
- [ ] UC1-2: It should send a 500 response if the location service throws an error
- [ ] UC1-3: - [ ] UC1: It should call add favourite location on user service object with the location document returned from the location service
- [ ] UC1-4: It should send a 500 response if the user service throws an error
- [ ] UC1-5: It should send a 201 response if add favourite location resolves
- [ ] UC1-6: It should return the updated favourite locations of the user as an array
