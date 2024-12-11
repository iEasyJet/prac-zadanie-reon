export type TResponseWhenInstallWebHook = {
    code: string;
    referer: string;
    platform: string;
    client_id: string;
    from_widget: string;
};

export type TGetTokens = {
    code?: string;
    referer: string;
    client_id: string;
    refresh_token?: string;
};

export type TResponseWhenUnInstallWebHook = {
    client_uuid: string;
    account_id: string;
    signature: string;
};

export type TResponseWithTokens = {
    token_type: string;
    expires_in: number;
    access_token: string;
    refresh_token: string;
};

export type TResponseAccountData = {
    id: number;
    name: string;
    subdomain: string;
    current_user_id: number;
    country: string;
    customers_mode: string;
    is_unsorted_on: boolean;
    is_loss_reason_enabled: boolean;
    is_helpbot_enabled: boolean;
    is_technical_account: boolean;
    contact_name_display_order: number;
};
