---
name: 'spec'
description: 'Discovery del repo + entrevista acotada + spec revisado por un agente independiente, antes de tocar código.'
argument-hint: 'Idea informal de la feature, o referencia a un ítem de docs/pending.md'
user-invocable: true
disable-model-invocation: false
---

## Entrada del usuario

```text
$ARGUMENTS
```

Puede ser una idea informal en una línea, o una referencia a un bug/pendiente de
`docs/pending.md` o `docs/audit-crud-gaps.md`.

## Principio

**No se implementa sin entendimiento compartido.** Antes de escribir código tiene que existir un
documento que diga qué se construye, qué queda afuera, qué datos toca y qué sigue abierto — y ese
documento tiene que ser validado **contra el código real** por un agente que no participó en
escribirlo (`/spec-review`, ejecutado automáticamente al final de este flujo).

Todo lo que este flujo "sabe" cae en una de cuatro cajas, y nada sube de caja al pasar al
documento:

| Categoría         | Qué es                                          | Requisito para entrar                                  |
| ----------------- | ----------------------------------------------- | ------------------------------------------------------ |
| **KNOWN**         | Está en el código y se verificó                 | `archivo:línea` abierto y leído                        |
| **ASSUMPTION**    | Se infirió y podría estar mal                   | Decir de dónde se infirió                              |
| **OPEN QUESTION** | El código no puede responderlo: es una decisión | Por qué no la contesta y qué cambia según la respuesta |
| **NO MEDIDO**     | No se pudo revisar                              | El motivo y el comando/acción que lo cierra            |

Dos reglas finas:

- **La ausencia de evidencia nunca es KNOWN.** "No encontré ruta 404" es un dato sobre la
  búsqueda, no sobre el código. Va a NO MEDIDO con qué se buscó y cómo.
- **NO MEDIDO no es comodín.** Si la respuesta estaba a un grep de distancia, es discovery flojo.

No le preguntes al usuario nada que el árbol del repo pueda responder. Primero discovery,
después preguntas. Una cita sin verificar (sin haber abierto el archivo) no entra al spec.

## Fase 1 — Vinculación

- Si `$ARGUMENTS` referencia claramente un ítem de `docs/pending.md` o
  `docs/audit-crud-gaps.md`, tomalo como tal y no preguntes nada.
- Si no, una sola pregunta con `AskUserQuestion`: ¿esto sale de un pendiente ya anotado, o es
  trabajo suelto?
- Calculá `<NNN>`: el siguiente número de 3 dígitos libre en `specs/` (si no existe el
  directorio, es `001`). Elegí un `<slug>` corto en kebab-case a partir de la idea.
- Anotá (no creés) la convención de rama: `<NNN>-feature/<slug>`, la misma que usa
  `001-feature/solve-details` y la constitución del proyecto (`.specify/memory/constitution.md`).

## Fase 2 — Discovery del código

**Cero preguntas en esta fase.** Leé, en este orden:

1. `.specify/memory/constitution.md` — principios y restricciones vigentes.
2. `docs/pending.md` y `docs/audit-crud-gaps.md` — contexto del bug/pendiente si aplica.
3. `specs/*/spec.md` existentes — precedentes de specs ya escritos.
4. El módulo de feature más parecido en `src/modules/<feature>/` (componentes, hooks, lógica de
   dominio) y su slice en `src/store/<feature>/` (¿usa `createEntityAdapter`? ver Principio III).
5. `src/validation/*` — patrón de validación vigente (Zod/Yup + react-hook-form) para el tipo de
   dato que toca la feature.
6. Si toca IPC: `shared/ipcChannels.ts` y el handler correspondiente en `electron/main/`.
7. Si toca el vault: `shared/vaultEnvelope.types.ts` y dónde se lee/escribe ese tipo.
8. `src/components/shared/` — qué componentes compartidos (`FormSectionHeader`, `LeafButton`,
   etc.) aplican, para no reimplementar variantes ad hoc (Principio IV).

Devolvé las cuatro tablas de la sección "Principio". Apuntá a 8-10 filas con cita en la tabla
KNOWN para una feature mediana — es la base de todo lo que sigue; si algo ahí está mal, el spec
entero hereda el error. Si notás algo raro mientras leés, corregilo en el momento antes de seguir.

## Fase 3 — Entrevista

Cada pregunta candidata pasa dos filtros antes de hacerse:

1. ¿El código ya la responde? Si sí, no es pregunta: es discovery incompleto — volvé a la Fase 2.
2. ¿Dos respuestas distintas producen specs distintos? Si no, no pregunta: asumí lo más probable
   y anotalo como supuesto (§5 del spec).

Usá `AskUserQuestion`, hasta 4 preguntas por ronda, **máximo 2 rondas en total**. Las opciones
salen del repo (no de un catálogo genérico): si hay un patrón vigente, es una opción y decís
dónde se usa (`archivo:línea`). Cada opción explica qué se gana y qué se paga.

Lo que no preguntes no desaparece: queda escrito como supuesto en §5. Lo que se pregunte y no se
resuelva queda en "Preguntas abiertas" (§6) — no se fuerza una respuesta para que el documento
quede prolijo.

Si la sesión no puede recibir respuesta interactiva, no te quedes esperando: escribí las
preguntas con sus opciones directamente en §6 del spec y seguí.

## Fase 4 — Spec

Escribí `specs/<NNN>-<slug>/spec.md`. Si ya existe, **no lo pises**: mostrá qué cambiaría y
preguntá si continuar.

Frontmatter:

```yaml
---
feature: <NNN>-<slug>
pendiente: <ítem de docs/pending.md citado, o "trabajo suelto">
rama: <NNN>-feature/<slug>
fecha: <YYYY-MM-DD>
estado: borrador
---
```

Estructura (8 secciones, en este orden):

| §   | Sección                | Nota                                                                                                    |
| --- | ---------------------- | ------------------------------------------------------------------------------------------------------- |
| 1   | Qué es                 | En una pantalla. Si no entra, el alcance está mal cortado.                                              |
| 2   | Alcance                | **Dentro** y **Fuera** (obligatorio). Sin "fuera" no se acotó nada.                                     |
| 3   | Cómo debería funcionar | Flujos desde quien usa la app, no cómo se implementa.                                                   |
| 4   | Datos                  | Slices, tipos del vault, canales IPC afectados; "no aplica" si no toca datos.                           |
| 5   | Supuestos              | Cada uno con qué pasa si es falso.                                                                      |
| 6   | Preguntas abiertas     | Qué bloquea cada una.                                                                                   |
| 7   | Acceptance criteria    | Verificables: qué se corre (`yarn typecheck`, `yarn lint`, un flujo en `yarn dev`) y qué tiene que dar. |
| 8   | Contexto medido        | Los KNOWN con `archivo:línea`, y el NO MEDIDO tal cual quedó.                                           |

**Regla que no se negocia:** un supuesto se marca **donde se usa**, no sólo donde se declara.
Cada sección que depende de un supuesto arranca con:

> ⚠ Depende del supuesto N (§5). Si se decide lo contrario, esta sección cambia entera.

Al terminar, escribí (o actualizá) `.specify/feature.json` con:

```json
{ "feature_directory": "specs/<NNN>-<slug>" }
```

para que `/speckit-plan` (una vez el spec pase la revisión) tome esta feature sin preguntar.

## Fase 5 — Revisión independiente

Invocá la skill `spec-review` pasándole **sólo la ruta** `specs/<NNN>-<slug>/spec.md`. No le
pases el resumen de la entrevista, ni justificaciones, ni "ojo que esto ya lo decidimos": esa
omisión es lo que hace que la revisión sea independiente.

Mostrale al usuario el veredicto que devuelva esa skill y el siguiente paso correspondiente.
