import { prisma } from '../../lib/prisma'
import { AppError } from '../../common/errors/app-error'
import { CreateDirectorInput, ListDirectorQuery, UpdateDirectorInput } from './directorSchema'

export class DirectorService {

    async findAll(query: ListDirectorQuery) {
        const { page, limit, name } = query
        const skip = (page - 1) * limit
        const where = name ? { name: { contains: name, mode: 'insensitive' as const } } : {}

        const [data, total] = await Promise.all([
            prisma.director.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' }, include: { movies: true } }),
            prisma.director.count({ where }),
        ])

        return {
            data,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        }
    }

    async findById(id: string) {
        const item = await prisma.director.findUnique({ where: { id }, include: { movies: true } })
        if (!item) throw new AppError('Diretor não encontrado', 404)
        return item
    }

    async create(data: CreateDirectorInput) {
        return prisma.director.create({ data, include: { movies: true } })
    }

    async update(id: string, data: UpdateDirectorInput) {
        await this.findById(id)
        return prisma.director.update({ where: { id }, data, include: { movies: true } })
    }

    async remove(id: string) {
        await this.findById(id)
        const moviesCount = await prisma.movie.count({ where: { directorId: id } })
        if (moviesCount > 0) {
            throw new AppError('Não é possível excluir um diretor que possui filmes', 400)
        }
        await prisma.director.delete({ where: { id } })
    }
}
