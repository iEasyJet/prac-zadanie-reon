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
            WebHook: 'webhook',
            Add_Contact: 'add-contact',
            Update_Contact: 'update-contact',
            Add_Lead: 'add-lead',
            Update_Lead: 'update-lead',
        },
        Path: {
            Access_Token: '/oauth2/access_token',
            Account_Data: '/api/v4/account',
            Contacts_Custom_Fields: '/api/v4/contacts/custom_fields',
            Leads_Custom_Fields: '/api/v4/leads/custom_fields',
            WebHooks: '/api/v4/webhooks',
        },
        GrantType: {
            Authorization_Code: 'authorization_code',
            Refresh_Token: 'refresh_token',
        },
        EntityType: {
            Lead: 'lead',
            Contact: 'contact',
        },
        WebHookEvents: {
            add_contact: 'add_contact',
            update_contact: 'update_contact',
            add_lead: 'add_lead',
            update_lead: 'update_lead',
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
