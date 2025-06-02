import jwt from 'jsonwebtoken';

export const generateToken = (user, res) => {
   
   const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1h'});  // 

   // Set the token in the cookie
   res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000 //1 hour days
   });
};