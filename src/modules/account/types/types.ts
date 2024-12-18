export type TAccount_ID = {
    accountId: number;
};

export type TOptionsWhereIntegrationInstall = {
    offset: number;
    limit: number;
};

export type TUpdateAccount = TAccount_ID & {
    accessToken: string | null;
    refreshToken: string | null;
    isInstalled?: boolean;
};
