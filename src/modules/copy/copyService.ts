import { prisma } from '../../lib/prisma'
import { AppError } from '../../common/errors/app-error'
import { CreateCopyInput, ListCopyQuery, UpdateCopyInput } from './copySchema'

export class CopyService {

    async findAll(query: ListCopyQuery) {
        const { page, limit, movieId } = query
        const skip = (page - 1) * limit
        const where = {
            ...(movieId && { movieId }),
        }

        const [data, total] = await Promise.all([
            prisma.copy.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' }, include: { movie: true } }),
            prisma.copy.count({ where }),
        ])

        return {
            data,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        }
    }

    async findById(id: string) {
        const item = await prisma.copy.findUnique({ where: { id }, include: { movie: true } })
        if (!item) throw new AppError('Cópia não encontrada', 404)
        return item
    }

    async create(data: CreateCopyInput) {
        // verifica se o filme existe
        const movie = await prisma.movie.findUnique({ where: { id: data.movieId } })
        if (!movie) throw new AppError('Filme não encontrado', 404)

        return prisma.copy.create({ data, include: { movie: true } })
    }

    async update(id: string, data: UpdateCopyInput) {
        await this.findById(id)

        if (data.movieId) {
            const movie = await prisma.movie.findUnique({ where: { id: data.movieId } })
            if (!movie) throw new AppError('Filme não encontrado', 404)
        }

        return prisma.copy.update({ where: { id }, data, include: { movie: true } })
    }

    async remove(id: string) {
        await this.findById(id)

        // impede deletar cópia que está alugada
        const alugadaAtiva = await prisma.rental.findFirst({
            where: { copyId: id, status: 'ACTIVE' },
        })
        if (alugadaAtiva) throw new AppError('Não é possível remover uma cópia que está alugada', 400)

        await prisma.copy.delete({ where: { id } })
    }
}
