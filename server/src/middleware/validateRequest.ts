// server/src/middleware/validateRequest.ts
import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError, z } from 'zod';

/**
 * Middleware para validar el cuerpo de la solicitud (req.body) usando un esquema Zod.
 * Si la validación es exitosa, los datos parseados (con defaults aplicados por Zod)
 * reemplazarán a req.body.
 * Si la validación falla, responde con un error 400.
 *
 * @param schema El esquema Zod (debe ser un z.object()) para validar req.body.
 */
export const validateRequestBody = (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Formatear los errores de Zod para una respuesta clara
        const formattedErrors = error.errors.map(err => ({
          field: err.path.join('.'), // err.path es un array de strings (nombres de campos) y/o números (índices de array)
          message: err.message,
        }));
        return res.status(400).json({
          message: 'Error de validación en el cuerpo de la solicitud.',
          errors: formattedErrors,
        });
      }
      // Para otros errores inesperados durante la validación (aunque raro con Zod puro)
      console.error("Error inesperado durante la validación de la solicitud:", error);
      return res.status(500).json({ message: 'Error interno del servidor durante la validación.' });
    }
  };

/**
 * Middleware para validar los parámetros de consulta (req.query) usando un esquema Zod.
 * Si la validación es exitosa, req.query será reemplazado por los datos parseados.
 *
 * @param schema El esquema Zod (debe ser un z.object()) para validar req.query.
 */
export const validateRequestQuery = (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // req.query es un objeto de strings. Zod con z.coerce lo manejará para convertir a números, etc.
      req.query = await schema.parseAsync(req.query);
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        return res.status(400).json({
          message: 'Error de validación en los parámetros de consulta.',
          errors: formattedErrors,
        });
      }
      console.error("Error inesperado durante la validación de query params:", error);
      return res.status(500).json({ message: 'Error interno del servidor durante la validación de query params.' });
    }
  };


/**
 * Middleware más general para validar req.body, req.query y req.params.
 * El esquema debe tener una forma como: z.object({ body: ..., query: ..., params: ... })
 *
 * @param schema Un esquema Zod que define las validaciones para body, query, y/o params.
 */
export const validateRequest = (schema: z.ZodObject<{
    body?: AnyZodObject;
    query?: AnyZodObject;
    params?: AnyZodObject;
  }>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      // Reasignar las partes validadas y posiblemente transformadas
      if (parsed.body) req.body = parsed.body;
      if (parsed.query) req.query = parsed.query as any; // req.query es Query de express, necesita casting
      if (parsed.params) req.params = parsed.params;

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message,
        }));
        return res.status(400).json({
          message: 'Error de validación de entrada.',
          errors: formattedErrors,
        });
      }
      console.error("Error inesperado durante la validación de la solicitud (general):", error);
      return res.status(500).json({ message: 'Error interno del servidor durante la validación (general).' });
    }
};
