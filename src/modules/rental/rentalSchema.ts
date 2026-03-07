import { z } from 'zod'
import { PaginationSchema, PaginatedResponse } from '../../common/types/pagination'
import { RentalStatus } from '@prisma/client'

export const RentalStatusSchema = z.enum(Object.values(RentalStatus) as [RentalStatus, ...RentalStatus[]])

export const RentalParamsSchema = z.object({
    id: z.string().uuid({ message: 'ID inválido' }),
})

export const CreateRentalSchema = z.object({
    customerId: z.string().uuid({ message: 'Customer ID inválido' }),
    copyId: z.string().uuid({ message: 'Copy ID inválido' }),
    dueDate: z.coerce.date({ required_error: 'Data limite é obrigatória' }),
})

export const ListRentalQuerySchema = PaginationSchema.extend({
    customerId: z.string().uuid().optional(),
    copyId: z.string().uuid().optional(),
    status: RentalStatusSchema.optional(),
})

export const RentalResponseSchema = z.object({
    id: z.string(),
    rentedAt: z.date(),
    dueDate: z.date(),
    returnedAt: z.date().nullable(),
    status: RentalStatusSchema,
    customer: z.object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
    }),
    copy: z.object({
        id: z.string(),
        movie: z.object({
            id: z.string(),
            title: z.string(),
            poster: z.string().nullable(),
        }),
    }),
    createdAt: z.date(),
    updatedAt: z.date(),
})

export const PaginatedRentalResponseSchema = z.object({
    data: z.array(RentalResponseSchema),
    meta: z.object({
        total: z.number(),
        page: z.number(),
        limit: z.number(),
        totalPages: z.number(),
    }),
})

export type CreateRentalInput = z.infer<typeof CreateRentalSchema>
export type ListRentalQuery = z.infer<typeof ListRentalQuerySchema>
export type RentalResponse = z.infer<typeof RentalResponseSchema>
export type PaginatedRentalResponse = PaginatedResponse<RentalResponse>
