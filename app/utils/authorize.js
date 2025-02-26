

function authorize(role){
    return async (req, res, next) => {
        try { 
            
            // TODO - check auth header and auth logic

            const auth = req.headers.authorization;

            if(!auth){
                return res.status(403).send('Missing authorization.');
            }

            return next();
        } catch (error) {
            return res.status(error.status || 500).send(error.message);
        }
    };
}

module.exports = authorize;