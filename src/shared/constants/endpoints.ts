export const Endpoints = {
    Global: 'v1',
    Ping: 'ping',
    AmoApi: {
        Root: 'amo-api',
        Endpoint: {
            AmoIntegration: {
                AmoIntegration: 'amo-integration',
                Next: { Add: 'add', Delete: 'delete' },
            },
            WebHook: {
                WebHook: 'webhook',
                Contact: {
                    Contact: 'contact',
                    Next: { Add: 'add', Update: 'update' },
                    Amo: { Add: 'add_contact', Update: 'update_contact' },
                },
                Lead: {
                    Lead: 'lead',
                    Next: {
                        Add: 'add',
                        Update: 'update',
                    },
                    Amo: { Add: 'add_lead', Update: 'update_lead' },
                },
            },
        },
    },
};
