import { prisma } from '../../lib/prisma'
import { AppError } from '../../common/errors/app-error'
import { CreateMoviesInput, ListMoviesQuery, UpdateMoviesInput } from './moviesSchema'

export class MoviesService {

    async findAll(query: ListMoviesQuery) {
        const { page, limit, name, genre, year } = query
        const skip = (page - 1) * limit
        const where = {
            ...(name && { title: { contains: name, mode: 'insensitive' as const } }),
            ...(genre && { genre }),
            ...(year && { year }),
        }

        const [data, total] = await Promise.all([
            prisma.movie.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' }, include: { director: true } }),
            prisma.movie.count({ where }),
        ])

        return {
            data,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        }
    }

    async findById(id: string) {
        const item = await prisma.movie.findUnique({ where: { id }, include: { director: true } })
        if (!item) throw new AppError('Filme não encontrado', 404)
        return item
    }

    async create(data: CreateMoviesInput) {
        return prisma.movie.create({ data, include: { director: true } })
    }

    async update(id: string, data: UpdateMoviesInput) {
        await this.findById(id)
        return prisma.movie.update({ where: { id }, data, include: { director: true } })
    }

    async remove(id: string) {
        await this.findById(id)
        await prisma.movie.delete({ where: { id } })
    }
}
