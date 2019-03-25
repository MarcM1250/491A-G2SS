# CECS 491 Spring-Fall 2019 Senior Project

This is a web app running on node.js that facilitates the transfer of KML files between unclassified and classified sources.

## Currently in Progress
Application prototype and test specification.

## Completed
- [x] Requirement Specification Documentation
  - [x] Executive Summary
  - [x] Stakeholder Model
  - [x] Goal Model
  - [x] System Vision
  - [x] Usage Model: Use Cases
  - [x] Detailed Requirements
- [x] Design Specification Documentation
    - [x] Abstract
    - [x] Architecture Overview
    - [x] Entity-Relationship Diagram and Description
    - [x] Activity Diagram and Description
    - [x] Message Sequence Chart and Description
    - [x] State Diagram and Description
    - [x] Class Diagram(s) and Description
    - [x] Mock-ups of horizontal and vertical prototype

## Dependencies

* [Angular](https://angular.io/)
* [node.js](https://nodejs.org/en/)
* [MongoDB](https://www.mongodb.com/)

To Run
------

    npm start

## Request & Response Examples

### API Resources
#### User
  - [GET /users]
  - [POST /users/signup]
  - [POST /users/login]
  - [Delete /users/[username]]
#### Upload
  - [GET /uploads]
  - [GET /uploads/[uploadId]]
  - [POST /users/login]
  - [Delete /uploads/[uploadId]]
#### Download
  - [GET /downloads]
  - [GET /downloads/[username]]
  - [POST /downloads]

### GET /users

Example: http://localhost:3000/users

Request Headers:

    {
        Authorization : Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIzIiwidXNlcklkIjoiNWM5OTNjYjNiMTJmN2QwZmEwMzk2YjI3IiwiaWF0IjoxNTUzNTQ2NDI4LCJleHAiOjE1NTM1ODI0Mjh9.bRMUlazB21ZJTy5Z-JGwiBrzrm2yiRHMvJbxUq6vhK8 
    }

Response Body:

    {
    "users": [
        {
            "_id": "5c993d8a0f4c3a1728ff993c",
            "username": "user1",
            "password": "$2b$10$Pbc/Wxl5Hic6GQlHGvFj4.LFHcwcHEo27yhCVVyHjsciCih4Lb.mK",
            "__v": 0
        }
    ]
    }

### POST /users/signup

Example: http://localhost:3000/users/signup

Request Body:

    {
	    "username":"user2",
	    "password":"pass"
    }

Response Body:

    {
        "message": "User created"
    }

### POST /user/login

Example: http://localhost:3000/users/login

Request Body:

    {
	    "username":"user2",
	    "password":"pass"
    }

Request Body:

    {
        "message": "Authentication successful",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIxIiwidXNlcklkIjoiNWM5OTNkOGEwZjRjM2ExNzI4ZmY5OTNjIiwiaWF0IjoxNTUzNTQ2Njc4LCJleHAiOjE1NTM1ODI2Nzh9.2qI3aUUNxLzmIu1Z9hZkmRnXcfvMADUuyAbC-XYy4Lw"
    }   

### DELETE /user/[username]

Example: http://localhost:3000/users/ping

Response Body:

    {
        "message": "User deleted"
    }

### GET /uploads

Example: http://localhost:3000/uploads

Request Headers:

    {
        Authorization : Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIzIiwidXNlcklkIjoiNWM5OTNjYjNiMTJmN2QwZmEwMzk2YjI3IiwiaWF0IjoxNTUzNTQ2NDI4LCJleHAiOjE1NTM1ODI0Mjh9.bRMUlazB21ZJTy5Z-JGwiBrzrm2yiRHMvJbxUq6vhK8 
    }

Response Body:

    {
        {
        "uploads": [
            {
                "_id": "5c993cf1b12f7d0fa0396b2a",
                "upload_by": "user3",
                "subject": "Verion 1",
                "description": "Example Version 1",
                "files_id": "5c993cf1b12f7d0fa0396b28"
            }
        ]
    }
    }

### POST /uploads

Example: http://localhost:3000/uploads

Request Headers:

    {
        Authorization : Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIzIiwidXNlcklkIjoiNWM5OTNjYjNiMTJmN2QwZmEwMzk2YjI3IiwiaWF0IjoxNTUzNTQ2NDI4LCJleHAiOjE1NTM1ODI0Mjh9.bRMUlazB21ZJTy5Z-JGwiBrzrm2yiRHMvJbxUq6vhK8 
    }

Request Body:

    {
        subject: Version 1
        desription: Example Version 1
        file: Caption.PNG
    }

Response Body:

    {
        "message": "Created upload successfully",
        "createdUpload": {
            "subject": "Verion 1",
            "upload_by": "user3",
            "description": "Example Version 1",
            "_id": "5c9941700f4c3a1728ff9940",
            "files_id": "5c9941700f4c3a1728ff993e"
        }
    }

### DELETE /upload/[uploadId]

Example: http://localhost:3000/uploads/:uploadId

Request Headers:

    {
        Authorization : Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIzIiwidXNlcklkIjoiNWM5OTNjYjNiMTJmN2QwZmEwMzk2YjI3IiwiaWF0IjoxNTUzNTQ2NDI4LCJleHAiOjE1NTM1ODI0Mjh9.bRMUlazB21ZJTy5Z-JGwiBrzrm2yiRHMvJbxUq6vhK8 
    }

Response Body:

    {
        "message": "Delete successfully"
    }


### GET /downloads

Example: http://localhost:3000/downloads

Request Headers:

    {
        Authorization : Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIzIiwidXNlcklkIjoiNWM5OTNjYjNiMTJmN2QwZmEwMzk2YjI3IiwiaWF0IjoxNTUzNTQ2NDI4LCJleHAiOjE1NTM1ODI0Mjh9.bRMUlazB21ZJTy5Z-JGwiBrzrm2yiRHMvJbxUq6vhK8 
    }

Response Body:

    {
        "download": [
            {
                "_id": "5c993cfab12f7d0fa0396b2b",
                "upload_id": "5c993cf1b12f7d0fa0396b2a",
                "download_by": "user3",
                "download_date": "2019-03-25T20:41:30.951Z",
                "__v": 0
            }
        ]
    }

### GET /downloads:

Example: http://localhost:3000/downloads/:username

Response Body:

    {
        "download": [
            {
                "_id": "5c993cfab12f7d0fa0396b2b",
                "upload_id": "5c993cf1b12f7d0fa0396b2a",
                "download_by": "user3",
                "download_date": "2019-03-25T20:41:30.951Z",
                "__v": 0
            },
            {
                "_id": "5c99435fe5cb7c1c38dc02e6",
                "upload_id": "5c993cf1b12f7d0fa0396b2a",
                "download_by": "user3",
                "download_date": "2019-03-25T21:08:47.388Z",
                "__v": 0
            }
        ]
    }