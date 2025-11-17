import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
  
  const authHeader = req.header('Authorization');

  
  if (!authHeader) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  
  const tokenParts = authHeader.split(' ');
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Token is not valid (must be Bearer token)' });
  }

  const token = tokenParts[1];

  try {
   
    const decoded = jwt.verify(token, JWT_SECRET);
    
    
    req.user = decoded.user;
    
   
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export default authMiddleware;