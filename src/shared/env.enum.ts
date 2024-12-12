export const enum envOther {
    Bearer = 'Bearer',
}

export const enum envError {
    Error_Account_Not_Found = 'Аккаунт с переданным accountId не был найден',
    Error_For_Post_Access_Refresh_Tokens = 'Ошибка при запросе при получении access token и refresh token',
    Error_For_Get_Account_Data = 'Ошибка при запросе при получении данных аккаунта',
}

export const enum envPath {
    Path_For_Access_Token = '/oauth2/access_token',
    Path_For_Account_Data = '/api/v4/account',
}

export const enum envGrantType {
    Authorization_Code = 'authorization_code',
    Refresh_Token = 'refresh_token',
}
