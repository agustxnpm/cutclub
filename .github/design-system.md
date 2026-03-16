# Design System — App SaaS de Gestión de Barberías

**Versión:** 1.0  
**Enfoque:** Minimalismo funcional + Dark Barber Style  
**Objetivo:** Aplicación ultra clara, rápida y 100% mobile-first para uso del barbero entre cortes.

---

## 1. Principios de Diseño

### 1.1 Simplicidad Radical
La interfaz debe eliminar cualquier elemento innecesario. El barbero debe poder buscar cliente, registrar corte y ver fidelidad en máximo 2 o 3 acciones.

### 1.2 Mobile First
Toda la UI se diseña primero para pantallas móviles. Ancho base de diseño: **360px**.

### 1.3 Acciones Claras
Los elementos interactivos deben ser grandes, fáciles de tocar y claramente distinguibles.

### 1.4 Velocidad Visual
El usuario debe entender cada pantalla en menos de 1 segundo.

---

## 2. Layout y Responsividad

### Breakpoints

| Nombre | Ancho   |
|--------|---------|
| xs     | 320px   |
| sm     | 360px   |
| md     | 390px   |
| lg     | 768px   |
| xl     | 1024px  |

El diseño principal está optimizado para el rango de **360px – 430px**.

---

## 3. Paleta de Colores

Estética inspirada en barberías modernas con un enfoque oscuro y premium.

### Colores Base

| Token                      | Valor     |
|----------------------------|-----------|
| `--color-background`       | `#0F0F0F` |
| `--color-surface`          | `#1B1B1B` |
| `--color-border`           | `#2C2C2C` |
| `--color-text-primary`     | `#F5F5F5` |
| `--color-text-secondary`   | `#A1A1A1` |

### Color de Marca

| Token              | Valor     | Descripción                                    |
|--------------------|-----------|------------------------------------------------|
| `--color-primary`  | `#0048B3` | Representa la barbería clásica y sensación premium |

### Colores de Estado

| Token              | Valor     |
|--------------------|-----------|
| `--color-success`  | `#4CAF50` |
| `--color-warning`  | `#F59E0B` |
| `--color-error`    | `#EF4444` |
| `--color-info`     | `#3B82F6` |

---

## 4. Tipografía

Se prioriza legibilidad y claridad bajo condiciones de mucha luz o rapidez.

- **Primaria:** Inter
- **Alternativas:** Manrope, SF Pro

### Escala Tipográfica

| Token          | Tamaño |
|----------------|--------|
| `--font-h1`    | 24px   |
| `--font-h2`    | 20px   |
| `--font-h3`    | 18px   |
| `--font-body`  | 16px   |
| `--font-small` | 14px   |

### Reglas
- Nunca usar texto menor a **14px**.
- Inputs y botones deben tener un mínimo de **16px** para evitar zoom automático en iOS.

---

## 5. Espaciado

Sistema basado en múltiplos de 4.

| Token        | Valor |
|--------------|-------|
| `--space-1`  | 4px   |
| `--space-2`  | 8px   |
| `--space-3`  | 12px  |
| `--space-4`  | 16px  |
| `--space-5`  | 20px  |
| `--space-6`  | 24px  |
| `--space-7`  | 32px  |

### Uso

| Contexto             | Espaciado |
|----------------------|-----------|
| Elementos cercanos   | 8px       |
| Entre componentes    | 16px      |
| Entre secciones      | 24px      |

---

## 6. Bordes

| Token           | Valor |
|-----------------|-------|
| `--radius-sm`   | 6px   |
| `--radius-md`   | 10px  |
| `--radius-lg`   | 14px  |
| `--radius-xl`   | 18px  |

| Elemento | Radius |
|----------|--------|
| Inputs   | md     |
| Botones  | md     |
| Cards    | lg     |
| Modales  | xl     |

---

## 7. Sombras

Estilo minimalista con sombras suaves para dar profundidad al modo oscuro.

| Token          | Valor                            |
|----------------|----------------------------------|
| `--shadow-sm`  | `0 2px 6px rgba(0,0,0,0.2)`     |
| `--shadow-md`  | `0 4px 12px rgba(0,0,0,0.3)`    |
| `--shadow-lg`  | `0 8px 20px rgba(0,0,0,0.35)`   |

| Elemento                | Sombra |
|-------------------------|--------|
| Cards                   | sm     |
| Modales                 | md     |
| Componentes destacados  | lg     |

---

## 8. Botones

Los botones deben ser grandes y fáciles de presionar con una mano.

- **Dimensiones:** Altura 48px, Padding lateral 20px, Radius 12px.
- **Botón Primario:** Fondo `var(--color-primary)`, texto negro.
- **Botón Secundario:** Fondo transparente, borde `1px var(--color-border)`, texto `var(--color-text-primary)`.
- **Botón Destructivo:** Fondo `var(--color-error)`, texto blanco.

---

## 9. Inputs

Optimizados para entrada de datos rápida.

- **Altura:** 48px.
- **Estilo:** Fondo `var(--color-surface)`, borde `1px var(--color-border)`.
- **Focus:** Borde cambia a `var(--color-primary)`.

---

## 10. Cards

Agrupan información clave del cliente o servicio.

- **Fondo:** `var(--color-surface)`.
- **Borde:** `1px var(--color-border)`.
- **Radius:** 14px.

---

## 11. Componente: Card de Cliente

**Contenido:** Nombre, Teléfono, Progreso de fidelidad, Último corte.

Ejemplo:

```
Juan Perez  >  📞 280456789
Cortes: ● ● ● ○
```

---

## 12. Componente: Contador de Fidelidad

- **Representación visual:** `● ● ● ○` o `3 / 4 cortes`.
- **Activo:** `var(--color-primary)`.
- **Inactivo:** `var(--color-border)`.

---

## 13. Animaciones

Rápidas y sutiles (**120ms – 200ms**) con curva `ease-out`.

- **Botones:** Escala a `0.97` al presionar.
- **Aparición:** Opacidad `0 → 1` y desplazamiento vertical de 10px.
- **Éxito:** Brillo y escala leve al desbloquear beneficio (300ms).

---

## 14. Navegación

Estructura simple:

1. Buscar Clientes
2. Perfil Cliente
3. Registrar Corte
4. Beneficios

---

## 15. Regla UX Crítica

Registrar un corte debe requerir: **máximo 2 taps**.  
Flujo: Buscar cliente → seleccionar cliente → registrar corte.

---

## 16. Accesibilidad

- Contraste **WCAG AA**.
- Touch targets mínimo **44px**.
- Texto base **16px**.

---

## 17. Iconografía

Estilo **outline simple** (Lucide, Heroicons).

---

## 18. Feedback Visual

Acción inmediata mediante **Toasts** de éxito o error (ej. "✔ Corte registrado"). Duración: **2s**.

---

## 19. Componentes Base

`Button`, `Input`, `Card`, `SearchBar`, `ClienteCard`, `LoyaltyIndicator`, `Toast`, `Modal`.

---

## 20. Regla Final del Sistema

Si una pantalla necesita más de **5 elementos interactivos**, el diseño debe simplificarse. La app debe sentirse rápida, clara, profesional y fácil de usar entre cortes.