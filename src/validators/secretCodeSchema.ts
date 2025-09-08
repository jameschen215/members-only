import { checkSchema } from 'express-validator';

export const secretCodeSchema = checkSchema({
  secret_code: {
    in: ['body'],
    isString: true,
    notEmpty: {
      errorMessage: 'Secret code is required',
    },
    custom: {
      options: (value) => {
        if (value !== process.env.SECRET_CODE) {
          throw new Error('Incorrect secret code');
        }
        return true;
      },
    },
  },
});
