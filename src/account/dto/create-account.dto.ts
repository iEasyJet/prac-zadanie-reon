import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateAccountDto {
    @IsNumber()
    public readonly accountId: number;

    @IsString()
    public readonly subdomain: string;

    @IsString()
    public readonly accessToken: string;

    @IsString()
    public readonly refreshToken: string;

    @IsBoolean()
    public readonly isInstalled: boolean;

    @IsString()
    public readonly integration_id: string;
}
