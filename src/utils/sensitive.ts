/**
 * Envoltorio para pasarle un secreto (clave del hogar, contraseña) a un thunk sin que
 * quede legible en `action.meta.arg`: Redux DevTools, logs y `JSON.stringify` solo ven
 * `[oculto]`. El valor real vive en un campo privado y se lee con `reveal()`.
 */
export class Sensitive<T> {
  readonly #value: T

  constructor(value: T) {
    this.#value = value
  }

  reveal(): T {
    return this.#value
  }

  toJSON(): string {
    return '[oculto]'
  }

  toString(): string {
    return '[oculto]'
  }
}

export function sensitive<T>(value: T): Sensitive<T> {
  return new Sensitive(value)
}
