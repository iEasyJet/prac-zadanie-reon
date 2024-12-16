export const Endpoints = {
    Global: 'v1',
    Ping: 'ping',
    Account: {
        Root: 'account',
        Install: true,
        Uninstall: false,
    },
    AmoApi: {
        Root: 'amo-api',
        Endpoint: {
            Amo_Integration: 'amo-integration',
            Add: 'add',
            Delete: 'delete',
        },
        Path: {
            Access_Token: '/oauth2/access_token',
            Account_Data: '/api/v4/account',
            Contacts_Custom_Fields: '/api/v4/contacts/custom_fields',
            Leads_Custom_Fields: '/api/v4/leads/custom_fields',
        },
        GrantType: {
            Authorization_Code: 'authorization_code',
            Refresh_Token: 'refresh_token',
        },
        EntityType: {
            Lead: 'lead',
            Contact: 'contact',
        },
        CustomFields: {
            Contact: {
                Fields: [
                    { name: 'Дата рождения', type: 'date' },
                    { name: 'Возраст', type: 'numeric' },
                    { name: 'Лазерное омоложение лица', type: 'numeric' },
                    { name: 'Ультразвуковой лифтинг', type: 'numeric' },
                    { name: 'Лазерное удаление сосудов', type: 'numeric' },
                    { name: 'Коррекция мимических морщин', type: 'numeric' },
                    { name: 'Лазерная эпиляция', type: 'numeric' },
                ],
            },
            Lead: {
                Fields: [
                    {
                        name: 'Услуги',
                        type: 'multiselect',
                        items: [
                            'Лазерное омоложение лица',
                            'Ультразвуковой лифтинг',
                            'Лазерное удаление сосудов',
                            'Коррекция мимических морщин',
                            'Лазерная эпиляция',
                        ],
                    },
                ],
            },
        },
    },
};
