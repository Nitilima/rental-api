import { prisma } from '../../lib/prisma'
import { AppError } from '../../common/errors/app-error'
import { CreateRentalInput, ListRentalQuery } from './rentalSchema'

// include padrão para não repetir em todo lugar
const rentalInclude = {
    customer: { select: { id: true, name: true, email: true } },
    copy: {
        include: {
            movie: { select: { id: true, title: true, poster: true } },
        },
    },
}

export class RentalService {

    async findAll(query: ListRentalQuery) {
        const { page, limit, customerId, copyId, status } = query
        const skip = (page - 1) * limit
        const where = {
            ...(customerId && { customerId }),
            ...(copyId && { copyId }),
            ...(status && { status }),
        }

        const [data, total] = await Promise.all([
            prisma.rental.findMany({ where, skip, take: limit, orderBy: { rentedAt: 'desc' }, include: rentalInclude }),
            prisma.rental.count({ where }),
        ])

        return {
            data,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        }
    }

    async findById(id: string) {
        const item = await prisma.rental.findUnique({ where: { id }, include: rentalInclude })
        if (!item) throw new AppError('Aluguel não encontrado', 404)
        return item
    }

    async findOverdue() {
        // marca como OVERDUE os que passaram do prazo e não foram devolvidos
        await prisma.rental.updateMany({
            where: {
                status: 'ACTIVE',
                dueDate: { lt: new Date() },
            },
            data: { status: 'OVERDUE' },
        })

        return prisma.rental.findMany({
            where: { status: 'OVERDUE' },
            orderBy: { dueDate: 'asc' },
            include: rentalInclude,
        })
    }

    async create(data: CreateRentalInput) {
        // verifica se o cliente existe
        const customer = await prisma.customer.findUnique({ where: { id: data.customerId } })
        if (!customer) throw new AppError('Cliente não encontrado', 404)

        // verifica se a cópia existe
        const copy = await prisma.copy.findUnique({ where: { id: data.copyId } })
        if (!copy) throw new AppError('Cópia não encontrada', 404)

        // verifica se a cópia já está alugada
        const copiaAlugada = await prisma.rental.findFirst({
            where: { copyId: data.copyId, status: 'ACTIVE' },
        })
        if (copiaAlugada) throw new AppError('Esta cópia já está alugada', 400)

        // verifica se a dueDate é no futuro
        if (data.dueDate <= new Date()) {
            throw new AppError('A data limite deve ser no futuro', 400)
        }

        return prisma.rental.create({ data, include: rentalInclude })
    }

    async return(id: string) {
        const rental = await this.findById(id)

        if (rental.status === 'RETURNED') {
            throw new AppError('Este aluguel já foi devolvido', 400)
        }

        return prisma.rental.update({
            where: { id },
            data: {
                returnedAt: new Date(),
                status: 'RETURNED',
            },
            include: rentalInclude,
        })
    }
}
