export enum LoginLanguageCode {
  EN = 'en',
  RU = 'ru',
  SR = 'sr',
}

export const LOGIN_LANGUAGES: {
  code: LoginLanguageCode;
  label: string;
}[] = [
  { code: LoginLanguageCode.EN, label: 'English' },
  { code: LoginLanguageCode.RU, label: 'Русский' },
  { code: LoginLanguageCode.SR, label: 'Srpski' },
];
