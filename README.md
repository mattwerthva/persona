# NodeJs Persona Service
This is the Persona service extended from a basic node.js boilerplate.  It has initial endpoints to create and retrieve a Persona from postgress storage.

### Setup
```
    git clone git@github.com:mattwerthva/persona.git
    cd persona
    nvm use 18.20.5
    npm install
```

### copy .env.sample into .env.  Reconfigure if desired.
```
    cp .env.local .env
```

### Run service + postgres in Docker
```
    # service + postgres
    npm run start

    # access http://localhost:8000/
    
    # optional - stop docker
    npm run stop
```

### Debug service in Node + postgres in Docker 
```
    npm run debug

    # access http://localhost:8000/
    
    # optional - stop docker
    npm run stop
```

### Run integration tests in node with postgres in docker
```
   npm run test
```


### Re-Generate OpenApi docs from route specs
```
    npm run docs
```

### View OpenApi documentation and test API endpoints
   * Run service per above
   * http://localhost:8000/swagger in a browser
   * Click Authorize button in upper right, then enter _any string_ for 'authorization' header
   * expand endpoint sections and 'Try it out', fill in data, execute 


