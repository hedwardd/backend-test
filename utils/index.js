const emailRegex = /^[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+$/;
const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/g;

const isValidEmail = (email) => emailRegex.test(email);

const isValidPassword = (password) => passwordRegex.test(password);

module.exports = { isValidEmail, isValidPassword };
