const db = require('../db');
const personaModel = db.Persona;
const fetch = require('node-fetch');


class PersonaService{

    /**
     * Create a persona
     */
    static async create(persona){
        return personaModel.create(persona)
            .then((result) => {
                
                // amend with weather data
                const persona = result.toJSON();
                return this.amendWeather(persona);
            })
            .catch((error) => {
                if(error.name === 'SequelizeUniqueConstraintError'){
                    const err = new Error(`Error creating persona.  Id ${persona.id} is not unique.`)
                    err.status = 400;
                    throw err;
                }

                const err = new Error(`Error creating persona.  msg: ${error.message}`)
                err.status = 500;
                throw err;
            })
    }


    /**
     * Get persona buy Id
     */
    static async getById(id){

        return personaModel.findByPk(id)
            .then((result) => {
                if(!result){
                    const error = new Error(`Id ${id} was not found.`);
                    error.status = 404;
                    throw error;
                }
                
                // amend with weather data
                const persona = result.toJSON();
                return this.amendWeather(persona);
            })
            .catch((error) => {
                if(error.status){
                    throw error;
                }

                const err = new Error(`Error getting Persona.  msg: ${error.message}`)
                err.status = 500;
                throw err;
            })
    }

    // get weather from ext api
    // Grok assisted code.  I asked "write js to fetch city, state, current_tempurature from api.weather.gov"
    static async amendWeather(persona){

        try {
            // Step 1: Get the forecast URL from the /points endpoint
            const locUrl = `https://api.weather.gov/points/${persona.latitude},${persona.longitude}`;
            const locResponse = await fetch(locUrl, {
            headers: {
                'User-Agent': 'YourAppName (your.email@example.com)' // Required by api.weather.gov
            }
            });
        
            if (!locResponse.ok) {
                throw new Error(`Loc fetch failed: ${locResponse.status}`);
            }
        
            const locData = await locResponse.json();
            
            // Extract city and state from properties.relativeLocation
            const city = locData.properties.relativeLocation.properties.city;
            const state = locData.properties.relativeLocation.properties.state;
        
            // Get the forecast URL
            const forecastUrl = locData.properties.forecastHourly;
            if (!forecastUrl) {
                throw new Error('No hourly forecast URL found');
            }
        
            // Step 2: Fetch the hourly forecast data
            const forecastResponse = await fetch(forecastUrl, {
            headers: {
                'User-Agent': 'YourAppName (your.email@example.com)'
            }
            });
        
            if (!forecastResponse.ok) {
                throw new Error(`Forecast fetch failed: ${forecastResponse.status}`);
            }
        
            const forecastData = await forecastResponse.json();
            
            // Step 3: Get the current temperature (first entry in hourly forecast)
            const currentTemperature = forecastData.properties.periods[0].temperature;
        
            // Return the data
            persona.city = city;
            persona.state = state;
            persona.current_tempurature = currentTemperature;
            return persona;
        
        } catch (error) {
            console.error('Error fetching weather:', error.message);

            // handle weather not avail gracefully
            persona.city = 'weather data unavailable';
            persona.state = 'weather data unavailable';
            persona.current_tempurature = -1;
            return persona;
        }
    }
}

module.exports = PersonaService;