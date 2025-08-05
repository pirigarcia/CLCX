# CLCX

## Descripción del sistema

Esta es una aplicación web interna desarrollada para Café La Cabaña. Permite a los gerentes de operación, franquicias y usuarios autorizados visualizar las calificaciones de las evaluaciones realizadas a las 16 sucursales y 9 franquicias de la empresa.

### Usuarios y accesos

- **Administrador**
  - Usuario: unknownshoppersmx@gmail.com  / Contraseña: shopper#1 |
  - Puede ver y editar la matriz completa (sucursales y franquicias).
  - Puede activar/desactivar valores de parámetros haciendo clic en las celdas.
- **Gerente de Operación (GOP)**
  - Usuario: gop@cafelacabana.com / Contraseña: acceso123
  - Solo lectura. Puede visualizar únicamente las sucursales.
- **Gerente de Franquicias**
  - Usuario: franquicias@cafelacabana.com / Contraseña: acceso123
  - Solo lectura. Puede visualizar únicamente las franquicias.
- **Usuario DG**
  - Usuario: dg@cafelacabana.com / Contraseña: acceso123
  - Solo lectura. Puede visualizar según permisos asignados.

### Lógica de la matriz

- La matriz se genera dinámicamente usando HTML, CSS y JavaScript puro.
- Las filas corresponden a los parámetros de evaluación reales (con nombre y peso).
- Las columnas corresponden a las sucursales y/o franquicias visibles según el tipo de usuario.
- Solo el admin puede editar la matriz haciendo clic en las celdas (toggle para activar/desactivar valores).
- Los cambios hechos por el admin se guardan en Firebase y son persistentes.
- Los parámetros mostrados en cada columna respetan las exclusiones definidas en `parametros_excluidos.js`.

### Tecnologías usadas

- **Frontend:** HTML, CSS, JavaScript puro (sin frameworks como React)
- **Backend y almacenamiento:** Firebase (autenticación, base de datos, reglas de seguridad)
- **Datos de referencia:**
  - `parametros.js`: parámetros de evaluación y sus pesos
  - `sucursales.js` y `franquicias.js`: lista de sucursales y franquicias
  - `parametros_excluidos.js`: parámetros que no aplican a ciertas sucursales/franquicias

### Ejemplo de credenciales de acceso

- Admin: admin@cafelacabana.com (o el usuario configurado como admin)
- Gerente de Operación: gop@cafelacabana.com / acceso123
- Gerente de Franquicias: franquicias@cafelacabana.com / acceso123
- DG: dg@cafelacabana.com / acceso123

### Notas adicionales

- El sistema está pensado para consulta, monitoreo y control de calidad en sucursales y franquicias.
- La edición de la matriz está protegida y solo accesible para el administrador.
- Cualquier cambio en la lógica de permisos o visualización debe ser documentado en este archivo.
