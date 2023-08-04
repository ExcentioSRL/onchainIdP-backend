import { ApiProperty } from "@nestjs/swagger";

export class PlatformInput {
    @ApiProperty({ description: "name", example: "nome" })
    public readonly name: string;

    @ApiProperty({ description: "redirectUrl", example: "https://pippo.com" })
    public readonly redirectUrl: string;
}

export class PlatformIdInput {
    @ApiProperty({ description: "_id", example: "id" })
    public readonly _id: string;
}

export class PlatformUpdateInput extends PlatformInput {
    @ApiProperty({ description: "_id", example: "id" })
    public readonly _id: string;
}