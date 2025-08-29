import { NextResponse } from 'next/server';

// 简单的内存存储，生产环境应该使用数据库
const views = new Map();

export async function POST(request, { params }) {
  const { slug } = params;
  
  try {
    // 获取当前浏览量
    const currentViews = views.get(slug) || 0;
    const newViews = currentViews + 1;
    
    // 更新浏览量
    views.set(slug, newViews);
    
    return NextResponse.json({ views: newViews });
  } catch (error) {
    console.error('Error updating view count:', error);
    return NextResponse.json({ error: 'Failed to update view count' }, { status: 500 });
  }
}

export async function GET(request, { params }) {
  const { slug } = params;
  
  try {
    const currentViews = views.get(slug) || 0;
    return NextResponse.json({ views: currentViews });
  } catch (error) {
    console.error('Error getting view count:', error);
    return NextResponse.json({ error: 'Failed to get view count' }, { status: 500 });
  }
}
