
import { NextResponse } from 'next/server'

interface ApiSuccessOptions<T> {
    message: string
    data: T
    status?: number
}

interface ApiErrorOptions {
    message: string
    status?: number
    errors?: unknown
}

export function apiSuccess<T>({
    message,
    data,
    status = 200,
}: ApiSuccessOptions<T>) {
    return NextResponse.json(
        {
            success: true,
            message,
            data,
        },
        { status },
    )
}

export function apiError({
    message,
    status = 400,
    errors = null,
}: ApiErrorOptions) {
    return NextResponse.json(
        {
            success: false,
            message,
            errors,
        },
        { status },
    )
}
