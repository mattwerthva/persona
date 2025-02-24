const fs = require('fs');
const swaggerJsdoc = require('swagger-jsdoc');

// Read the contents of the package.json file
function readPackageJson(){
    const packageJson = fs.readFileSync('./package.json');
    const packageData = JSON.parse(packageJson);
    return packageData;
}

const packageData = readPackageJson();

// const x = require('../')
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: `${packageData.name} API`,
      description: `${packageData.name} service`,
      version: packageData.version,
    },
  },
  apis: [
    './app/routes/*.js',
    './app/swagger/schema-specs.yaml'
  ]
};

// generate open api spec from jsdoc comments
const specs = swaggerJsdoc(options);

// Write the Swagger definition to a file on disk
fs.writeFileSync('./app/swagger/swagger.json', JSON.stringify(specs, null, 2));