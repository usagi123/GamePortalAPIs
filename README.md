# GamePortalAPIs

These are APIs for a game portal.

If you want to run locally

Run `npm install` to install all required packages

Run `npm start` to start running.

Access at `localhost:3000`

Else, the API is running at `https://gameportalapi.herokuapp.com`

APIs will return JSON as a response.

The database is running at mongodb atlas.

---

**Managing Game Entities** `/games`

**List all games**

Request URL: `https://gameportalapi.herokuapp.com/games`

Request type: `GET`

**List one game**

Request URL: `https://gameportalapi.herokuapp.com/games/:gameId`

Request type: `GET`

**Create a new game entity**

Request URL: `https://gameportalapi.herokuapp.com/games`

Request type: `POST`

Request body:
```
{
    "title": "String",
    "firstLoginBonusCoin": "String",
    "firstLoginBonusStar": "String"
}
```

**Edit game details**

Request URL: `https://gameportalapi.herokuapp.com/games/:gameId`

Request type: `PATCH`

Request body:
```
[
    {
        "propName": "FIELD_TO_EDIT",
        "value": "VALUE_TO_EDIT"
    }
]
```

**Remove a game entity**

Request URL: `https://gameportalapi.herokuapp.com/games/:gameId`

Request type: `DELETE`

---

**Managing Event Entities** `events`

**List all events**

Request URL: `https://gameportalapi.herokuapp.com/events`

Request type: `GET`

**List one event**

Request URL: `https://gameportalapi.herokuapp.com/events/:eventId`

Request type: `GET`

**List all current and upcoming events from one game**

An API to know all the game information and upcoming events.

Request URL: `https://gameportalapi.herokuapp.com/events/onegameallevents/:gameId`

Request type: `GET`

**Create a new event entity**

Request URL: `https://gameportalapi.herokuapp.com/events`

Request type: `POST`

Request body:
```
{
    "title": "String",
    "eventStart": "String",
    "eventEnd": "String",
    "starReward": "Number",
    "gameId": "String"
}
```
The `eventStart` and `eventEnd` fields are input as HH:mm:ss DD-MM-YYYY UTC +0 format but keep as unix time stamp in the system.

**Edit event details**

Request URL: `https://gameportalapi.herokuapp.com/events/:eventId`

Request type: `PATCH`

Request body:
```
[
    {
        "propName": "FIELD_TO_EDIT",
        "value": "VALUE_TO_EDIT"
    }
]
```

**Remove a event entity**

Request URL: `https://gameportalapi.herokuapp.com/events/:eventId`

Request type: `DELETE`

---

**Managing Profile Entities** `/profiles`

**List all profiles**

Request URL: `https://gameportalapi.herokuapp.com/profiles`

Request type: `GET`

**List one profile**

Request URL: `https://gameportalapi.herokuapp.com/profiles/:profileId`

Request type: `GET`

**List one profile informations for a specific game**

An API to get a player’s information in a specific game.

Request URL: `https://gameportalapi.herokuapp.com/profiles/profileforspecificgame/:gameId/:profileId`

Request type: `GET`

**Create a new profile entity**

Request URL: `https://gameportalapi.herokuapp.com/profiles`

Request type: `POST`

Request body:
```
{
    "fullName": "String",
    "recentLogin": "String", 
    "profileCoins": "Number",
    "profileStars": "Number",
    "gameId": ["String","String","..."]
}
```
The `recentLogin` field is input as HH:mm:ss DD-MM-YYYY UTC +0 format but keeps as unix time stamp in the system.


**Edit a profile detail**

Request URL: `https://gameportalapi.herokuapp.com/profiles/:profileId`

Request type: `PATCH`

Request body:
```
[
    {
        "propName": "FIELD_TO_EDIT",
        "value": "VALUE_TO_EDIT"
    }
]
```

**Edit a profile detail from a specific game**

An API to update a player’s information in a specific game. It's the same as get a player's info in a specific game, just with different request method.

Request URL: `https://gameportalapi.herokuapp.com/profileforspecificgame/:gameId/:profileId`

Request type: `PATCH`

Request body:
```
[
    {
        "propName": "FIELD_TO_EDIT",
        "value": "VALUE_TO_EDIT"
    }
]
```

**Player get reward from an event**

An API to get rewards from players when the event completes.

Request URL: `https://gameportalapi.herokuapp.com/getEventRewards/:profileId/:eventId`

Request type: `PATCH`

No request body is needed

**Remove a profile entity**

Request URL: `https://gameportalapi.herokuapp.com/profiles/:profileId`

Request type: `DELETE`