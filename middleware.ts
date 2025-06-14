import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    // 获取当前请求的路径名
    const pathname = request.nextUrl.pathname;

    // 如果是根路径，重定向到中文版本
    if (pathname === '/') {
        return NextResponse.redirect(new URL('/zh', request.url));
    }

    // 其他路径正常处理
    return NextResponse.next();
}

export const config = {
    // 配置中间件匹配的路径
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}; 
