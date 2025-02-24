import { SelectQueryBuilder } from 'typeorm';
import { PaginationDto } from '../modal/pagination.dto';

export const paginate = async <T>(
  queryBuilder: SelectQueryBuilder<T>,
  paginationDto: PaginationDto
) => {
  const { offset, limit } = paginationDto;

  const [data, total] = await queryBuilder
    .skip((offset - 1) * limit)
    .take(limit)
    .getManyAndCount();

  return {
    data,
    total,
    offset,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};
