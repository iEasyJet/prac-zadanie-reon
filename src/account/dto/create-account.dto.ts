import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateAccountDto {
    @IsNumber()
    readonly accountId: number;

    @IsString()
    readonly subdomain: string;

    @IsString()
    readonly accessToken: string;

    @IsString()
    readonly refreshToken: string;

    @IsBoolean()
    readonly isInstalled: boolean;

    @IsString()
    readonly integration_id: string;
}
