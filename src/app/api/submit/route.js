export async function POST(request) {
  try {
    const submission = await request.json()
    
    // 验证提交数据
    if (!submission.url) {
      return Response.json({ error: 'URL is required' }, { status: 400 })
    }
    
    // 这里可以添加更多的验证逻辑
    // 比如检查URL格式、防止重复提交等
    
    // 在实际应用中，这里会将数据保存到数据库
    // 现在只是返回成功响应
    console.log('Received submission:', submission)
    
    return Response.json({ 
      success: true, 
      message: 'Submission received successfully',
      id: submission.id || 'temp-' + Date.now()
    })
  } catch (error) {
    return Response.json({ error: 'Failed to process submission' }, { status: 500 })
  }
} 