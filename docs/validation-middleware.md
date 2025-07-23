# Composable validation middleware

Ce projet utilise un middleware Express fonctionnel pour valider les fichiers téléversés avant le parsing.
L'approche par composition évite l'héritage de classes : chaque règle est une fonction `FileValidatorFn` appliquée séquentiellement.

```ts
// apps/api/src/middlewares/file-validation.middleware.ts
export type FileValidatorFn = (file: Express.Multer.File) => void;
export const composeValidators =
  (...fns: FileValidatorFn[]) =>
  (file: Express.Multer.File) =>
    fns.forEach((fn) => fn(file));
```

Le middleware est instancié dans `LogAnalysisModule` :

```ts
const validate = composeValidators((file) =>
  this.validationService.validate(file),
);
consumer
  .apply(createFileValidationMiddleware(validate))
  .forRoutes(LogAnalysisController, UploadController);
```

On peut ainsi chaîner d'autres validations simplement en ajoutant des fonctions dans `composeValidators`.
