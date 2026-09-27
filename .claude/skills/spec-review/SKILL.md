---
name: 'spec-review'
description: 'Lanza el agente independiente spec-reviewer contra un spec, y guarda su veredicto.'
argument-hint: 'Ruta a specs/<NNN>-<slug>/spec.md (opcional)'
user-invocable: true
disable-model-invocation: false
---

## Entrada del usuario

```text
$ARGUMENTS
```

## Qué hace

1. **Resolver la ruta del spec.**
   - Si `$ARGUMENTS` trae una ruta, usala.
   - Si no, buscá `specs/*/spec.md`. Si hay uno solo, usalo. Si hay varios, preguntá cuál con
     `AskUserQuestion`.

2. **Lanzar el subagente `spec-reviewer`** (definido en `.claude/agents/spec-reviewer.md`) con
   el Agent tool, pasándole en el prompt **únicamente la ruta del spec**. No agregues resumen de
   la entrevista que lo originó, ni las respuestas del usuario, ni justificaciones tipo "esto ya
   se decidió así". Si el agente que llama a esta skill tiene esa información en contexto, de
   todos modos no la traslades al prompt del subagente — la independencia depende de que arranque
   limpio y sólo lea el árbol.

3. **Guardar el resultado tal cual** en `specs/<NNN>-<slug>/spec-review.md`, al lado del spec
   revisado. Sobrescribe la revisión anterior si existía (la evolución entre rondas la registra
   el historial `vN` en el encabezado del spec, no el archivo de revisión).

4. **Mostrar el veredicto y el siguiente paso**, según lo que devolvió el subagente:

   | Veredicto          | Qué significa                                       | Siguiente paso                                                                                                          |
   | ------------------ | --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
   | **PASS**           | El spec se puede ejecutar como está.                | Seguir con `/speckit-plan`.                                                                                             |
   | **BLOCKED**        | Algo invalida el diseño o el contrato.              | Corregir el spec, anotar una entrada `vN` nueva en su encabezado con qué cambió, y correr `/spec-review` otra vez.      |
   | **NEEDS-DECISION** | El spec no está mal: falta que alguien decida algo. | **No correr otra ronda.** El usuario (o quien corresponda) toma la decisión, se anota en el spec como `vN`, y se sigue. |

5. **Chequeo de convergencia**: si el spec ya tiene 2+ entradas `vN` en el encabezado, mirá si lo
   que cambió en la última ronda es más chico que en la anterior. Si cada ronda mueve cosas del
   mismo tamaño (el spec "gira en falso"), decilo explícitamente y sugerí cortar y pasar a
   `/speckit-plan` con lo que quede abierto anotado en §6, en vez de seguir puliendo.

## Cuándo correrla sola

También se puede invocar directo sobre un spec escrito a mano o ya corregido, sin pasar por
`/spec`: `/spec-review specs/<NNN>-<slug>/spec.md`. Funciona mejor si el spec sigue las 8
secciones de `/spec` y cita `archivo:línea`.
