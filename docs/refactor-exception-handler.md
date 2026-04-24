Quiero refactorizar un GlobalExceptionHandler en una API REST hecha con Spring Boot.

Actualmente tengo múltiples métodos anotados con @ExceptionHandler, uno por cada excepción de dominio (por ejemplo: ClienteNoEncontradoException, ClienteYaExisteException, BeneficioNoDisponibleException, etc.), y todos retornan un ResponseEntity con un Map simple del tipo {"error": mensaje}.

Necesito que refactorices esto siguiendo buenas prácticas de diseño y clean code:

1. Crear una jerarquía de excepciones basada en una clase abstracta BusinessException que:

   * Extienda RuntimeException
   * Contenga un HttpStatus asociado a cada excepción
   * Permita centralizar el status HTTP en cada excepción concreta

2. Modificar todas las excepciones actuales para que extiendan de BusinessException y definan su propio HttpStatus (por ejemplo: NOT_FOUND, BAD_REQUEST, CONFLICT, etc.)

3. Reemplazar el GlobalExceptionHandler actual por uno mucho más simple que:

   * Tenga un único @ExceptionHandler para BusinessException
   * Construya la respuesta HTTP usando el status definido en la excepción

4. Reemplazar el uso de Map<String, String> por un DTO de respuesta de error (por ejemplo ErrorResponse) que incluya:

   * mensaje de error
   * código de error opcional
   * timestamp
   * (opcional) path de la request

5. Mantener el código limpio, legible y fácil de extender

6. Incluir ejemplos completos de:

   * La clase BusinessException
   * Al menos 2 excepciones concretas refactorizadas
   * El nuevo GlobalExceptionHandler
   * El DTO ErrorResponse

7. (Opcional pero deseable) Agregar manejo genérico para Exception.class para errores no controlados (500)

Quiero el código final listo para usar, no solo explicaciones.
