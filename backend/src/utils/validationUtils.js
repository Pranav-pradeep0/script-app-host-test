module.exports = {
  validateEmail: (email) =>
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      email,
    ),
  //   At least one uppercase letter.
  //   At least one lowercase letter.
  //   At least one digit.
  //   At least one special character from the set @$!%*?&.
  //   A minimum length of 8 characters.
  validatePassword: (password) =>
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      password,
    ),
  validateName: (name) => /^[a-zA-Z]+$/.test(name),
  validateHTML: (input) => /<("[^"]*"|'[^']*'|[^'">])*>/.test(input),
};
