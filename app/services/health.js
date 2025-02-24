


class HealthService{

    static async health(){
        try {
            return {
                status: 'Boiler service is healthy.',
                url: process.env.SERVER_URL || 'not set',
                env: process.env.NODE_ENV
              }
              ;
        } catch (error) {
            const err = new Error(`Error in hello.  msg: ${error.message}`)
            err.status = 500;
            throw err;
        }
    }
}

module.exports = HealthService;