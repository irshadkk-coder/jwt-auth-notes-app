import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()


const protect = (req, res, next) => {

    try {

        const token = req.cookies.accessToken;

        if (!token) {
            return res.status(401).json({
                message: "No access token"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.userId = decoded.id;

        next();

    } catch (error) {

        return res.status(401).json({
            message: "Invalid or expired token"
        });

    }

};

export default protect;