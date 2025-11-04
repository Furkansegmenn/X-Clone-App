 export const protectRoute = (req, res, next) => {
    try {
        const auth = req.auth();
        if(!auth || !auth.isAuthenticated){
            return res.status(401).json({error:"Unauthorized, you must be logged in"});
        }
        next();
    } catch (error) {
        return res.status(401).json({error:"Unauthorized, you must be logged in"});
    }
};