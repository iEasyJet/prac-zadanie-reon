/* eslint-disable @typescript-eslint/no-duplicate-enum-values */
export const enum envOther {
    Bearer = 'Bearer',
}

export const enum envError {
    Error_Account_Not_Found = 'Аккаунт с переданным accountId не был найден',
    Error_For_Post_Access_Refresh_Tokens = 'Ошибка при запросе при получении access token и refresh token',
    Error_For_Get_Account_Data = 'Ошибка при запросе при получении данных аккаунта',
    Error_For_Get_Custom_Fields = 'Ошибка при запросе при получении кастомных полей',
    Error_For_Post_Custom_Fields = 'Ошибка при запросе при создании кастомных полей',
    Error_For_Delete_Custom_Fields = 'Ошибка при запросе при удалении кастомных полей',
}

export enum envPath {
    Path_For_Access_Token = '/oauth2/access_token',
    Path_For_Account_Data = '/api/v4/account',
    Path_For_Contacts_Custom_Fields = '/api/v4/contacts/custom_fields',
    Path_For_Leads_Custom_Fields = '/api/v4/leads/custom_fields',
    Contacts = '/api/v4/contacts/custom_fields',
    Leads = '/api/v4/leads/custom_fields',
}

export const enum envGrantType {
    Authorization_Code = 'authorization_code',
    Refresh_Token = 'refresh_token',
}

export enum envCustomFieldContact {
    BirthDay = 'Дата рождения',
    Age = 'Возраст',
    LaserFacialRejection = 'Лазерное омоложение лица',
    UltrasonicLifting = 'Ультразвуковой лифтинг',
    LaserRemovalOfBloodVessels = 'Лазерное удаление сосудов',
    CorrectionOfFacialWrinkles = 'Коррекция мимических морщин',
    LaserHairRemoval = 'Лазерная эпиляция',
}

export enum envCustomFieldTypeContact {
    BirthDay = 'date',
    Age = 'numeric',
    LaserFacialRejection = 'numeric',
    UltrasonicLifting = 'numeric',
    LaserRemovalOfBloodVessels = 'numeric',
    CorrectionOfFacialWrinkles = 'numeric',
    LaserHairRemoval = 'numeric',
}

export enum envCustomFieldLead {
    Services = 'Услуги',
}

export enum envCustomFieldTypeLead {
    Services = 'multiselect',
}

export enum envServicesMultiSelect {
    LaserFacialRejection = 'Лазерное омоложение лица',
    UltrasonicLifting = 'Ультразвуковой лифтинг',
    LaserRemovalOfBloodVessels = 'Лазерное удаление сосудов',
    CorrectionOfFacialWrinkles = 'Коррекция мимических морщин',
    LaserHairRemoval = 'Лазерная эпиляция',
}

export enum envEntityType {
    Contacts = 'Contacts',
    Leads = 'Leads',
}
