import { ApiProperty } from '@nestjs/swagger';

export class CreatePlatformDTO {
    @ApiProperty({
        description: 'Nome piattaforma',
        default: '',
    })
    name: string;

    @ApiProperty({
        description: 'Link di redirect',
        default: '',
    })
    redirectUrl: string;

    @ApiProperty({
        description: 'Immagine',
        default: '',
    })
    pathImage: string;

    @ApiProperty({
        description: 'Descrizione',
        default: '',
    })
    description: string;
}
