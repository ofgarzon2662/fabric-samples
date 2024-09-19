import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Post,
    Put,
    UseInterceptors,
  } from '@nestjs/common';

import { AssetService } from './asset.service';
import { AssetEntity } from './asset.entity';
import { plainToInstance } from 'class-transformer';
import { AssetDto } from './asset.dto';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptors';

@Controller('members')
@UseInterceptors(BusinessErrorsInterceptor)

export class AssetController {
  constructor(private readonly socioService: SocioService) {}

    // Obtener todos los socios
    @Get()
    async findAll(): Promise<SocioEntity[]> {
        return this.socioService.findAll();
  }

    // Obtener un socio por id
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<SocioEntity> {
        return this.socioService.findOne(id);
    }

    // Crear un socio
    @Post()
    async create(@Body() socioDto: SocioDto) {
        const socio: SocioEntity = plainToInstance(SocioEntity, socioDto);
        return await this.socioService.create(socio);
    }

    // Actualizar un socio

    @Put(':socioId')
    async update(
    @Param('socioId') socioId: string,
    @Body() @Body() socioDto: SocioDto) {
        const socio: SocioEntity = plainToInstance(SocioEntity, socioDto);
        return await this.socioService.update(socioId, socio);
  }

  // Eliminar un socio

  @Delete(':socioId')
  @HttpCode(204)
  async delte(@Param('socioId') socioId: string) {
    return this.socioService.delete(socioId);
  }

}
