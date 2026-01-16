# API ENDPOINTS DEVELOPMENT RULES

This project uses TSOA to build express routes and generate OpenAPI documentation

## ERROR HANDLING

### PARAMETERS VALIDATION

#### TSOA Validation Errors

If simple enough, validation can be handled by TSOA either using typing inside controller's methods or using explicit @pattern in jsdoc.
This will throw a ValidateError defined by TSOA and is hardly customizable.

#### Custom Errors

If you want full control of the validation rules or if the rule is complex, you must create your own Error and throw it from any controller's method.
All thrown errors will be catch in the Express ErrorMiddleware. In this file you'll notice that ValidateError is already handled and this is the recommandation setup from TSOA team.
We also have a default/guard at the end of the file which returns a 500 Interval Server Error for any Error not programmaticaly handled.
Any custom error should be checked and handled in between those two blocks.
Any custom error should set the proper response status and return the generic error message and if needed the cause (cf [Error: cause](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause))

```ts
// src/middlewares/ErrorMiddleware.ts
if (error instanceof CustomError) {
    res.status(400).json({
        message: error.message,
        ...error.cause
     });
}

// src/interfaces/http/my-controller.http.ts
try {
    // logic here
} catch (e) {
    // any error from your domain that you want to catch
    if (e instanceof DomainInternalError) {
        throw new CustomError(e)
    }
}

// src/interfaces/http/@errors/CustomError.ts
export class CustomError extends Error {
    constructor(public cause: { ... }) {
        super("Custom Error Message", { cause })
    }
}
```
