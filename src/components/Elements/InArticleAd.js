"use client";
import React, { useEffect } from 'react';

const InArticleAd = () => {
  // 加载AdSense脚本
  useEffect(() => {
    const loadAdSense = () => {
      if (typeof window !== 'undefined' && !window.adsbygoogle) {
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2011896129037768';
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
      }
    };

    loadAdSense();
  }, []);

  // 初始化广告
  useEffect(() => {
    const initAd = () => {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        try {
          // 确保容器有宽度
          const adElement = document.querySelector('.adsbygoogle');
          if (adElement && adElement.offsetWidth > 0) {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
          } else {
            console.log('AdSense container not ready, retrying...');
            // 如果容器还没准备好，再等一会儿
            setTimeout(initAd, 500);
          }
        } catch (e) {
          console.log('AdSense error:', e);
        }
      }
    };

    // 延迟初始化以确保脚本已加载和DOM渲染完成
    const timer = setTimeout(initAd, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="my-8 w-full">      
      <div className="w-full max-w-4xl mx-auto">
        <ins 
          className="adsbygoogle"
          style={{
            display: 'block',
            textAlign: 'center',
            width: '100%',
            maxWidth: '100%'
          }}
          data-ad-layout="in-article"
          data-ad-format="fluid"
          data-ad-client="ca-pub-2011896129037768"
          data-ad-slot="7995132017"
        >
        </ins>
      </div>
    </div>
  );
};

export default InArticleAd;
