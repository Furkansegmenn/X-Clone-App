import { getAuth } from '@clerk/express';

export const protectRoute = (req, res, next) => {
    try {
        const { userId } = getAuth(req);

        
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized, you must be logged in" });
        }

        next();
    } catch (error) {
        return res.status(401).json({ error: "Unauthorized, you must be logged in" });
    }
};