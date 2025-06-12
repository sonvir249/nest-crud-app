import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Delete,
  Param,
  Put,
  HttpException,
  HttpStatus,
  UseFilters,
  ParseIntPipe,
  UsePipes,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { CatsService } from './cats.service';
import { Cat } from './interfaces/cat.interface';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { createCatSchema } from './cat-schema';
import { Roles } from '../common/decorators/roles.decorator';
import { LoggingInterceptor } from './logging.intercepter';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('cats')
@UseGuards(RolesGuard)
@UseFilters(new HttpExceptionFilter())
@UseInterceptors(LoggingInterceptor)
export class CatsController {
  constructor(private catsService: CatsService) {}

  @Get()
  async findAll(
    @Query('age') age: number,
    @Query('breed') breed: string,
  ): Promise<Cat[]> {
    try {
      return this.catsService.findAll();
    } catch (error) {
      throw new HttpException(
        {
          status: 'Forbidden',
          error: 'Some custom error message',
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  @Post()
  @Roles(['admin'])
  @UsePipes(new ZodValidationPipe(createCatSchema))
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }

  @Put(':id')
  update(@Param('id') id: string) {
    return `This action updates a #${id} cat`;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `This action removes a #${id} cat`;
  }
}
