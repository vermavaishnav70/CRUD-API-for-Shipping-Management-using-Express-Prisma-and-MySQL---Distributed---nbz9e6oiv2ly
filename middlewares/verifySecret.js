require('dotenv').config();
const verifyToken = (req, res, next) => {
    const secretKey = process.env.JWT_SECRET;
    const token = req.headers.shipping_secret_key;
    if (!token || token !== secretKey) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
};
module.exports = verifyToken;