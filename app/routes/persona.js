const express = require('express');
const router = express.Router();
const _ = require('lodash');
const authorize = require('../utils/authorize');

const PersonaService = require('../services/persona');

/**
* @openapi
* /persona:
*   post:
*     summary: Create a persona
*     description: Create a persona
*     security:
*       - authHeader: []
*     requestBody:
*       description: The persona data to create
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               id:
*                 type: string
*                 description: The unique identifier for the persona
*               firstname:
*                 type: string
*                 description: The first name of the persona
*               lastname:
*                 type: string
*                 description: The last name of the persona
*               interests:
*                 type: array
*                 items:
*                   type: string
*                 description: An array of interests for the persona
*               latitude:
*                 type: number
*                 format: float
*                 description: The latitude coordinate of the persona's location
*               longitude:
*                 type: number
*                 format: float
*                 description: The longitude coordinate of the persona's location
*     responses:
*       5XX:
*         description: Unexpected error.
*       403:
*         description: unauthorized.
*       400:
*         description: Invalid input.  Missing reuired fields.  Id is not unique.
*       200:
*         description: Persona created
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Persona'
*/
router.post('/persona', authorize('some-role'), async (req,res) => {
  const body = req.body;

  if(!validateRequiredFields(res, {
      id: body.id,
      firstname: body.firstname,
      lastname: body.lastname,
      interests: body.interests,
      latitude: body.latitude,
      longitude: body.longitude
    })){
    return;
  }

  return await PersonaService.create(body)
    .then((persona) => {
        return res.status(200).send(persona);
    })
    .catch((error) => {
        return res.status(error.status | 500).send(error.message);
    })
});

/**
* @openapi
* /persona/{id}:
*   get:
*     summary: Get persona by Id
*     description: Get persona by Id
*     parameters:
*       - in: path
*         name: id
*         required: true
*     security:
*       - authHeader: []
*     responses:
*       5XX:
*         description: Unexpected error.
*       400:
*         description: Invalid input.  Missing required id.
*       403:
*         description: unauthorized.
*       404:
*         description: Persona with ID not found.
*       200:
*         description: Persona retrieved
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Persona'
*/
router.get('/persona/:id', authorize('some-role'), async (req,res) => {
  const id = req.params.id;

  if(!validateRequiredFields(res, {
      id
    })){
    return;
  }

  return await PersonaService.getById(id)
    .then((persona) => {
        return res.status(200).send(persona);
    })
    .catch((error) => {
        return res.status(500).send(error.message);
    })
});


function validateRequiredFields(response, params){
  _.forOwn(params, (value, key) => {
    if(!value){
      response.status(400).send({ message: `Missing required ${key} parameter.`});
      return false;
    }
  });
  return true;
}

module.exports = router