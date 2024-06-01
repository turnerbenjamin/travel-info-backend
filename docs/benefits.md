# Benefits of backend services

## Introduction

The Travel Info app has been running for a few weeks. This application has been successful; however, the functionality may be improved by adding backend services. The purpose of this document is to explain the benefits of adding backend services to this application for DFCorp and its customers.

## Problems backend services can solve

Customer feedback indicates that users would like the application to be more personalised to them. This introduces several challenges that may be resolved by adding backend services. We will cover a few of these here:

- Data persistence and security
- API key security

### Data persistence and security

To introduce personalisation, the application needs some way of storing data. For example, we may store UI preferences, avatars, hotel reviews etc. It is possible to do this without backend services, for instance, using local storage or cookies. But these methods have limitations and security issues:

- There may be limits on the amount of data that can be stored
- Data may not be synchronized across devices and browsers
- Data is not kept securely

A backend service solves these problems. Data can be persisted using a database and served to the browser by the backend. This means that data is synchronised as it is not stored locally. We can also keep the data secure by placing restrictions on access to users that the server has authenticated.

### API key security

Currently, the application is using several external APIs for weather and map data. Access to these APIs is controlled through API keys.

These API Keys may be easily accessed as they must be stored in the Javascript which is then delivered to users. This can increase costs for the business as API pricing is generally based on usage.

A backend service solves this problem. By proxying these API requests through the backend services, we can keep the API keys secure on the backend server.

## Benefits backend services may bring to the users

We have seen that backend services will allow us to securely store user data. This data can allow us to enhance the functionality of the application.

In the first release, we plan to introduce functionality that allows users to store their favourite locations using the backend services. As noted, this will mean that these locations can be accessed from any device they choose to use.

In later releases we may include additional features. Such as, functionality to allow users to plan trips or record experiences from trips completed. Users may wish to make their trip experiences publicly accessible from the application, this would only be possible with backend services.

## Benefits backend services may bring to DFCorp

As noted above, the current application is unable to keep API keys secure. The backend services will resolve this. In addition, we will cover two additional benefits for DF Corp:

- Customer retention
- Customer interaction

### Customer retention

By adding backend services, the functionality of the application may be greatly improved. This will increase the competitiveness of the application and its usefulness to users. In addition, users wanting to utilise functionality powered by user data will need to register for an account. This may increase the user’s ties to DFCorp. Accordingly, the introduction of backend services may increase customer loyalty and retention.

### Customer interaction

User registration will give DFCorp access to user data such as email addresses. Subject to user consent, this data can be used to send communications to users. Such communications may keep the customer engaged with DFCorp and inform them of any promotions.
