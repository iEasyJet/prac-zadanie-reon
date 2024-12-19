export enum EnvError {
    PostAccessRefreshTokens = 'Ошибка при запросе при получении access token и refresh token',
    GetAccountData = 'Ошибка при запросе при получении данных аккаунта',
    GetCustomFields = 'Ошибка при запросе при получении кастомных полей',
    PostCustomFields = 'Ошибка при запросе при создании кастомных полей',
    DeleteCustomFields = 'Ошибка при запросе при удалении кастомных полей',
    GetInstallWebHooks = 'Ошибка при запросе при получении списка установленных хуков',
    PostAddWebHooks = 'Ошибка при запросе при добавлении хука',
}
