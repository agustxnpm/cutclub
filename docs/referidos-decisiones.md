# HU 3.2 — Ingreso con Código de Referido
## Decisiones de diseño y flujos pendientes

---

## 1. Implementación actual (MVP)

### Flujo de registro por teléfono
El campo `codigoReferido` es **opcional** en el formulario de registro.

- **Ausente o en blanco:** el registro continúa normalmente, no se crea vínculo.
- **Presente y válido:** se crea un registro `Referido` con `estado = PENDING_VALIDATION`.
- **Presente pero inválido (código no existe):** se lanza `CodigoReferidoInvalidoException` → HTTP 400. El cliente no se registra. Motivo: no contaminar la BD con vínculos huérfanos.

### Estado inicial del referido
El beneficio para el referente (Cliente A) **no se genera automáticamente** al registrarse el referido (Cliente B). El barbero debe validar presencialmente que B es nuevo cliente en su primer corte y cambiar el estado a `APPROVED`. Este flujo de aprobación es una HU futura.

### Archivos creados / modificados

**Domain:**
- `EstadoReferido.java` — Enum: `PENDING_VALIDATION`, `APPROVED`, `REJECTED`
- `Referido.java` — Entidad con factory methods `crearNuevo()` y `reconstruir()`
- `ReferidoRepository.java` — Puerto de salida: `void guardar(Referido)`
- `CodigoReferidoInvalidoException.java`
- `ClienteRepository.java` — Agrega `buscarPorCodigoReferido(String)`

**Application:**
- `RegistrarCuentaClienteUseCase.java` — Recibe `ReferidoRepository` + parámetro `codigoReferido` opcional. Método privado `resolverReferente()` encapsula la lógica de validación.

**Infrastructure:**
- `V7__create_referidos_table.sql` — Tabla `referidos` con FK a `clientes` y `UNIQUE` en `referido_id`
- `ReferidoJpaEntity.java`, `ReferidoJpaRepository.java`, `ReferidoMapper.java`, `ReferidoPostgresAdapter.java`
- `ClienteJpaRepository.java` — Agrega `findByCodigoReferido()`
- `ClientePostgresAdapter.java` — Implementa `buscarPorCodigoReferido()`
- `RegistroClienteAuthRequest.java` — Campo opcional `codigoReferido`
- `AuthClienteController.java` — Pasa el código al use case
- `GlobalExceptionHandler.java` — Maneja `CodigoReferidoInvalidoException` → 400

**Frontend:**
- `clientesApi.ts` — `registroCliente()` acepta `codigoReferido?: string` opcional. Solo se serializa si tiene valor no vacío.
- `AuthClienteScreen.tsx` — Campo "Código de referido (opcional)" visible solo en modo `registro`, antes del campo contraseña. Error 400 con mensaje relativo a "referido" muestra toast específico.

---

## 2. Flujo de invitación por WhatsApp (deep link)

### Cómo funciona
El cliente ya registrado comparte desde su perfil un link del tipo:

```
https://cutclub.app/unirse?ref=TKNOY9
```

Ese link abre la app en el formulario de registro, con el campo `codigoReferido` **pre-llenado** con el valor del query param `ref`.

### Patrón elegido: pre-fill del formulario
- Es simple, auditable y transparente para el usuario.
- El usuario ve el código, puede editarlo, y el flujo es idéntico al registro manual.
- **No** se hace registro automático silencioso: el usuario igual necesita ingresar nombre, teléfono y contraseña.

### Implementación frontend (pendiente)

```ts
// app/src/hooks/useReferralFromUrl.ts
import * as Linking from 'expo-linking';
import { useEffect, useState } from 'react';

export function useReferralFromUrl(): string | null {
  const [codigo, setCodigo] = useState<string | null>(null);

  useEffect(() => {
    Linking.getInitialURL().then((url) => {
      if (!url) return;
      const { queryParams } = Linking.parse(url);
      if (queryParams?.ref && typeof queryParams.ref === 'string') {
        setCodigo(queryParams.ref);
      }
    });
  }, []);

  return codigo;
}
```

En `AuthClienteScreen`, cuando llega un deep link:

```ts
const codigoDesdeUrl = useReferralFromUrl();

useEffect(() => {
  if (codigoDesdeUrl) {
    setCodigoReferido(codigoDesdeUrl);
    setMode('registro');
  }
}, [codigoDesdeUrl]);
```

### Botón de compartir en PerfilClienteScreen (pendiente)

```ts
const mensaje = `Unite a CutClub y arrancá con beneficios desde tu primer corte\nhttps://cutclub.app/unirse?ref=${cliente.codigoReferido}`;
Linking.openURL(`whatsapp://send?text=${encodeURIComponent(mensaje)}`);
```

---

## 3. Flujo Google OAuth2 y código de referido (pendiente)

### El problema
OAuth2 redirige al usuario fuera de la app y de vuelta, perdiendo cualquier estado en memoria. Además, con la UI actual (pantalla de selección de método antes de ver el formulario), **no tiene sentido pedirle el código antes** de que elija Google.

### Solución elegida: modal post-auth (primera vez)
Después de autenticarse con Google por primera vez, se muestra un modal preguntando si el usuario tiene un código de referido.

```
"¿Alguien te invitó al club? Ingresá su código y ambos ganan beneficios."
[ Campo de texto ]   [ Omitir ]   [ Confirmar ]
```

### Condición para mostrar el modal
El backend debe indicar si el usuario es nuevo en la respuesta del callback OAuth:

```json
{ "clienteId": "...", "nombre": "...", "esNuevo": true }
```

- `esNuevo: true` → mostrar modal de código de referido.
- `esNuevo: false` → login normal, sin modal.

### Integración con deep link `?ref=TKNOY9` + flujo Google
Si el usuario llegó por un deep link y elige Google:
1. Guardar el `ref` en `AsyncStorage` antes de lanzar el OAuth flow.
2. Post-OAuth, si hay valor en storage, pre-llenar el modal directamente (no preguntar "¿tenés código?" sino mostrar "Fuiste referido, ¿confirmar?").
3. Limpiar el storage una vez procesado.

### Endpoint backend necesario (pendiente)
Un nuevo endpoint para vincular el referido después del registro:

```
POST /api/v1/clientes/referido
Authorization: Bearer <token>
Body: { "codigoReferido": "TKNOY9" }
```

Requiere un nuevo caso de uso `VincularReferidoUseCase`:
- Verifica que el cliente autenticado no tenga ya un `Referido` registrado (evitar doble vinculación).
- Usa la misma lógica de `resolverReferente()` que `RegistrarCuentaClienteUseCase`.
- Crea el `Referido` con `estado = PENDING_VALIDATION`.

---

## 4. Tabla de convergencia de flujos

| Escenario | Cuándo se vincula | Endpoint | Pre-fill del código |
|---|---|---|---|
| Registro teléfono manual | Durante el registro | `registrar()` existente | Campo de texto en formulario |
| Deep link + teléfono | Durante el registro | `registrar()` existente | `useReferralFromUrl()` pre-llena campo |
| Google OAuth (primera vez) | Post-auth (modal) | `VincularReferidoUseCase` (pendiente) | AsyncStorage si vino de deep link |

La lógica de dominio (`Referido.crearNuevo()`, `resolverReferente()`) es **idéntica** en todos los caminos. Solo cambia el adaptador web que la invoca.

---

## 5. HUs pendientes relacionadas

- **Aprobar referido:** endpoint para que el barbero cambie `estado` de `PENDING_VALIDATION` → `APPROVED` y genere el beneficio para el referente.
- **VincularReferidoUseCase:** para el flujo post-OAuth Google.
- **Botón de compartir WhatsApp** en `PerfilClienteScreen`.
- **`useReferralFromUrl` hook** + configuración de deep links en Expo.
