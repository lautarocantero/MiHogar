export type Locale = 'es' | 'en'

export type Dictionary = Record<string, string>

/** Cada namespace define las mismas claves en ambos idiomas. */
export type LocaleNamespace<TKeys extends string = string> = Record<Locale, Record<TKeys, string>>

export type TranslateParams = Record<string, string | number>

export type TranslateFn = (key: string, params?: TranslateParams) => string
