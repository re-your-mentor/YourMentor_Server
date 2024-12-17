const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.join = async (req, res) => {
  const { email, nick, password } = req.body;
  try {
    const exUser = await User.findOne({ where: { email } });
    if (exUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }
    const hash = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      email,
      nick,
      password: hash,
    });
    
    // JWT 발급
    const token = jwt.sign(
      { id: newUser.id, nick: newUser.nick },
      process.env.JWT_SECRET,
      { expiresIn: '1h', issuer: 'your-app-name' }
    );
    
    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        id: newUser.id,
        email: newUser.email,
        nick: newUser.nick,
      },
      token,  // 토큰을 함께 반환
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ 
        success: false,
        message: error.message ,
        stack: error.stack
      });
  }
};

exports.login = (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.status(401).json({ success: false, message: info.message });
    }

    // JWT 토큰 발급
    const token = jwt.sign(
      { id: user.id, nick: user.nick },
      process.env.JWT_SECRET,
      { expiresIn: '1h', issuer: 'your-app-name' }
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        nick: user.nick,
      },
      token,  // 로그인 성공 시 토큰 반환
    });
  })(req, res, next);
};


exports.logout = (req, res) => {
  req.logout(() => {
    return res.status(200).json({ success: true, message: 'Logout successful' });
  });
};
