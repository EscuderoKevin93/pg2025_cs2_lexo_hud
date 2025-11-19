# Guía para crear Panels y Keybinds

## Panel.json

El archivo `panel.json` define los paneles de configuración que aparecen en LHM para el HUD.

### Estructura básica:

```json
{
  "panels": [
    {
      "label": "Nombre del Panel",
      "name": "nombre_del_panel",
      "inputs": [
        {
          "type": "text",
          "name": "nombre_campo",
          "label": "Etiqueta del campo"
        },
        {
          "type": "action",
          "name": "nombre_accion",
          "values": [
            {
              "name": "show",
              "label": "Mostrar"
            },
            {
              "name": "hide",
              "label": "Ocultar"
            }
          ]
        }
      ]
    }
  ],
  "variantsv2": [
    {
      "group": { "en": "Nombre del Grupo" },
      "groupVariants": [
        {
          "url": "nombre-variante",
          "label": { "en": "Nombre de la Variante" },
          "description": { "en": "Descripción de la variante" }
        }
      ]
    }
  ]
}
```

### Tipos de inputs disponibles:

- **"text"**: Campo de texto
  ```json
  {
    "type": "text",
    "name": "campo_texto",
    "label": "Etiqueta"
  }
  ```

- **"checkbox"**: Checkbox (true/false)
  ```json
  {
    "type": "checkbox",
    "name": "campo_checkbox",
    "label": "Etiqueta"
  }
  ```

- **"select"**: Lista desplegable
  ```json
  {
    "type": "select",
    "name": "campo_select",
    "label": "Etiqueta",
    "values": [
      {
        "label": "Opción 1",
        "name": "opcion1"
      },
      {
        "label": "Opción 2",
        "name": "opcion2"
      }
    ]
  }
  ```

- **"image"**: Selector de imagen
  ```json
  {
    "type": "image",
    "name": "campo_imagen",
    "label": "Etiqueta"
  }
  ```

- **"action"**: Botón de acción
  ```json
  {
    "type": "action",
    "name": "nombre_accion",
    "values": [
      {
        "name": "valor1",
        "label": "Etiqueta 1"
      },
      {
        "name": "valor2",
        "label": "Etiqueta 2"
      }
    ]
  }
  ```

- **"match"**: Selector de partida
  ```json
  {
    "type": "match",
    "name": "campo_match",
    "label": "Seleccionar partida"
  }
  ```

- **"player"**: Selector de jugador
  ```json
  {
    "type": "player",
    "name": "campo_player",
    "label": "Seleccionar jugador"
  }
  ```

### Uso en el código:

- **Leer configuración**: `useConfig('nombre_del_panel')`
- **Escuchar cambios**: `useOnConfigChange('nombre_del_panel', (data) => { ... })`
- **Escuchar acciones**: `useAction('nombre_accion', (value) => { ... })`

### Variantes (variantsv2):

Las variantes definen overlays adicionales que aparecen en el panel de LHM. Cuando un usuario selecciona una variante, la URL cambia y el código debe detectar la variante activa usando:

```typescript
const variant = query.get("variant") || "default";
```

## Keybinds.json

El archivo `keybinds.json` define los atajos de teclado que pueden activar acciones en el HUD.

### Estructura básica:

```json
[
  {
    "bind": "Alt+C",
    "action": "nombre_accion"
  },
  {
    "bind": "Alt+V",
    "action": "otra_accion"
  }
]
```

### Formato de teclas:

- Usa el formato estándar: `"Ctrl+Shift+Key"`, `"Alt+Key"`, `"Key"`
- Ejemplos: `"Alt+C"`, `"Ctrl+Shift+F"`, `"F5"`

### Uso en el código:

Las acciones definidas en keybinds se ejecutan automáticamente cuando se presiona la combinación de teclas. Usa `useAction()` en los componentes para escuchar estas acciones.

## Notas importantes:

1. Los cambios en `panel.json` y `keybinds.json` se compilan automáticamente a TypeScript durante el build.
2. Los archivos generados están en `src/API/contexts/panel.ts` y `src/API/contexts/keybinds.ts`.
3. Las variantes deben coincidir con las definidas en `hud.json` en el array `"variants"`.

