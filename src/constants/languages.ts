export enum LanguageCode {
  EN = 'en',
  RU = 'ru',
  SR = 'sr',
}

export const LANGUAGES: { code: LanguageCode; label: string }[] = [
  { code: LanguageCode.EN, label: 'English' },
  { code: LanguageCode.RU, label: 'Русский' },
  { code: LanguageCode.SR, label: 'Srpski' },
];
