
const jwt = require('jsonwebtoken');

const userAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'Missing or invalid Authorization header'
        });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, 'realestateapp', (err, decodedToken) => {
        if (err) {
            console.log('JWT ERROR:', err.name, err.message);

            return res.status(401).json({
                message: 'Invalid or expired token',
                error: err.name
            });
        }

        console.log('DECODED TOKEN:', decodedToken);

        req.userId = decodedToken.userId;
        next();
    });
};


const adminAuth = (req,res,next) => {
    try{
        //console.log(req.headers)
        const token = req.headers["authorization"].split(' ')[1];
        jwt.verify(token,'realestateapp',(err,decodedToken)=> {            
            if(decodedToken && decodedToken.role===1){
                req.userId = decodedToken.userId
                next()
            }else {
                res.status(401).json({message:'unauthorized admin...'})
            }

        })
    }catch(error){
        console.log("Error is", error);
        res.status(401).json({message:'unauthorized admin'})
    }
}

module.exports={userAuth, adminAuth}