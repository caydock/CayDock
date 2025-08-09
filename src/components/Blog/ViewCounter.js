"use client";
import React, { useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js'

// 检查环境变量是否存在
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 只有在环境变量存在时才创建Supabase客户端
const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

const ViewCounter = ({ slug, noCount = false, showCount = true }) => {
  const [views, setViews] = useState(0);

  useEffect(() => {
    // 如果没有Supabase配置，跳过视图计数
    if (!supabase) {
      console.warn("Supabase not configured. View counting is disabled.");
      return;
    }

    const incrementView = async () => {
      try {
        let { error } = await supabase.rpc("increment", {
          slug_text:slug ,
        });

        if (error){
            console.error("Error incrementing view count inside try block:", error)
        };
        
      } catch (error) {
        console.error(
          "An error occurred while incrementing the view count:",
          error
        );
      }
    };

    if(!noCount){
        incrementView();
    }
  }, [slug, noCount]);

  useEffect(() => {
    // 如果没有Supabase配置，跳过获取视图数
    if (!supabase) {
      return;
    }

    const getViews = async () => {
      try {
        let { data, error } = await supabase
  .from('views')
  .select('count')
  .match({slug: slug})
  .single()

        if (error){
            console.error("Error incrementing view count inside try block:", error)
        };


        setViews(data ? data.count : 0)
        
      } catch (error) {
        console.error(
          "An error occurred while incrementing the view count:",
          error
        );
      }
    };

        getViews();
  }, [slug]);

  // 如果没有Supabase配置，不显示视图计数
  if (!supabase) {
    return null;
  }

  if (showCount) {
    return <div>{views} views</div>;
  } else {
    return null;
  }
};

export default ViewCounter;
