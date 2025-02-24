# NodeJs Boiler Service
This is the Replica Persona server derived from a basic node.js boilerplate

### Setup
```
    git clone git@github.com:mattwerthva/persona.git
    cd persona
    nvm use 18.20.5
    npm install
```

### Run Postgres in docker-compose
```
    docker-compose up -d
```

### copy .env.sample into .env.  Reconfigure if desired.
```
    mv .env.sample .env
```

### Run service locally
```
    npm run start
```

### Generate OpenApi docs
```
    npm run docs
```

### View OpenApi endpoint documentation
```
   http://localhost:8000/swagger
```

### Run integration tests
```
   npm run test
```