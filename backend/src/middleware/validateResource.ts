// a curried function that takes the schema we created with Zod and validates
// a request against that schema
// so when we get to our controller, we know that the body is exactly what we expect

import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';

const validateResource =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (e: any) {
      // if our schema can not be parsed
      return res.status(400).send(e.errors); // TODO is this errors or error?
    }
  };

export default validateResource;
