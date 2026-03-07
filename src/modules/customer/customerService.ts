import { prisma } from '../../lib/prisma'
import { AppError } from '../../common/errors/app-error'
import { CreateCustomerInput, ListCustomerQuery, UpdateCustomerInput } from './customerSchema'

export class CustomerService {

    async findAll(query: ListCustomerQuery) {
        const { page, limit, name, email, phone } = query
        const skip = (page - 1) * limit
        const where = {
            ...(name && { name: { contains: name, mode: 'insensitive' as const } }),
            ...(email && { email }),
            ...(phone && { phone }),
        }

        const [data, total] = await Promise.all([
            prisma.customer.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
            prisma.customer.count({ where }),
        ])

        return {
            data,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        }
    }

    async findById(id: string) {
        const item = await prisma.customer.findUnique({ where: { id } })
        if (!item) throw new AppError('Usuário não encontrado', 404)
        return item
    }

    async findByKeycloakId(keycloakId: string) {
        const item = await prisma.customer.findFirst({ where: { keycloakId } })
        if (!item) throw new AppError('Usuário não encontrado', 404)
        return item
    }


    async create(data: CreateCustomerInput) {
        return prisma.customer.create({ data })
    }

    async update(id: string, data: UpdateCustomerInput) {
        await this.findById(id)
        return prisma.customer.update({ where: { id }, data })
    }

    async remove(id: string) {
        await this.findById(id)
        await prisma.customer.delete({ where: { id } })
    }
}
