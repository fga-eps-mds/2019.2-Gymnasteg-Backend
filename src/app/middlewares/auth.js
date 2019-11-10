import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';

export default ({
  onlyNeedsValidTokens,
  isCoordinatorRoute,
  authenticationErrorMessage,
}) => {
  return async (req, res, next) => {
    const authHeader = req.headers.authentication;

    if (!authHeader) {
      return res.status(401).send('Token não fornecido.');
    }

    const [, token] = authHeader.split(' ');

    try {
      const decoded = await promisify(jwt.verify)(token, authConfig.secret);

      if (
        !onlyNeedsValidTokens &&
        ((isCoordinatorRoute && !decoded.coord) ||
          (!isCoordinatorRoute && decoded.coord))
      ) {
        return res.status(401).send(authenticationErrorMessage);
      }

      req.userId = decoded.id;
      return next();
    } catch (erro) {
      return res.status(401).send('Token inválido.');
    }
  };
};
