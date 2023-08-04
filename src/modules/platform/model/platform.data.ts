import { ApiProperty } from "@nestjs/swagger";

export class PlatformData {
    @ApiProperty({ description: "name", example: "nome" })
    public readonly name: string;

    @ApiProperty({ description: "redirectUrl", example: "https://pippo.com" })
    public readonly redirectUrl: string;
}