import { NextResponse } from 'next/server'

export function sendSuccess(message: string = 'Success', data: any = null, statusCode: number = 200): NextResponse {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
    },
    { status: statusCode }
  )
}

export function sendError(message: string = 'Error', statusCode: number = 400, errors: any = null): NextResponse {
  return NextResponse.json(
    {
      success: false,
      message,
      ...(errors && { errors }),
    },
    { status: statusCode }
  )
}
