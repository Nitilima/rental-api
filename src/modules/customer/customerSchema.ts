import { z } from "zod";
import { PaginationSchema, PaginatedResponse } from "../../common/types/pagination";

export const CustomerParamsSchema = z.object({
    id: z.string().uuid({ message: 'ID inválido' }),
})

// create
export const CreateCustomerSchema = z.object({
    name: z.string({ required_error: 'nome é obrigatório' }).min(1).max(255),
    email: z.string({ required_error: 'email é obrigatório' }).min(5).max(255),
    phone: z.string().min(5).max(255),
    keycloakId: z.string().uuid().optional(),
})

// update
export const UpdateCustomerSchema = z.object({
    name: z.string().min(1).max(255),
    phone: z.string().min(5).max(255),
})

// filter
export const ListCustomerQuerySchema = PaginationSchema.extend({
    name: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
})

export const CustomerResponseSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    phone: z.string().nullable(),
    keycloakId: z.string().uuid().nullish(),
    createdAt: z.date(),
    updatedAt: z.date(),
})

export const PaginatedCustomerResponseSchema = z.object({
    data: z.array(CustomerResponseSchema),
    meta: z.object({
        total: z.number(),
        page: z.number(),
        limit: z.number(),
        totalPages: z.number(),
    }),
})

export type CreateCustomerInput = z.infer<typeof CreateCustomerSchema>
export type UpdateCustomerInput = z.infer<typeof UpdateCustomerSchema>
export type ListCustomerQuery = z.infer<typeof ListCustomerQuerySchema>
export type CustomerResponse = z.infer<typeof CustomerResponseSchema>
export type PaginatedCustomerResponse = PaginatedResponse<CustomerResponse>
