import { PartialType } from '@nestjs/mapped-types';
import {  UpdateUserDto } from './update-user.dto';

export class UpdateUserDto_Old extends PartialType(UpdateUserDto) {}
