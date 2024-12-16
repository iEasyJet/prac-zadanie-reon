import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateAccountDTO {
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
}
