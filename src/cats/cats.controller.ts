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
} from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { CatsService } from './cats.service';
import { Cat } from './interfaces/cat.interface';
import { HttpExceptionFilter } from './http-exception.filter';
import { ZodValidationPipe } from './zod-validation.pipe';
import { createCatSchema } from './cat-schema';

@Controller('cats')
@UseFilters(new HttpExceptionFilter())
export class CatsController {
  constructor(private catsService: CatsService) {}
  @Get()
  async findAll(@Query('age') age: number, @Query('breed') breed: string) {
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

  @Get(':id')
  async findOne(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    return this.catsService.findOne(id);
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createCatSchema))
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCatDto: UpdateCatDto) {
    return `This action updates a #${id} cat`;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `This action removes a #${id} cat`;
  }
}
