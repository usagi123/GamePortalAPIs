# GamePortalAPIs

These are APIs for a game portal.

Run `npm install` to install all required packages

Run `npm start` to start running.

APIs will return JSON as response.

---

**MANAGING GAME ENTITIES** `/games`

**List all games**

Request URL: `localhost:3000/games`

Request type: `GET`

**List one game**

Request URL: `localhost:3000/games/gameId`

Request type: `GET`

**Create a new game entity**

Request URL: `localhost:3000`

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

Request URL: `localhost:3000/gameId`

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

Request URL: `localhost:3000/gameId`

Request type: `DELETE`

---
