import { useRef, useCallback } from 'react'

/**
 * 记忆化函数 hook，用于优化性能
 * @param {Function} fn - 需要记忆化的函数
 * @returns {Function} 记忆化后的函数
 */
export function useMemoizedFn(fn) {
	const fnRef = useRef(fn)
	fnRef.current = fn
	
	return useCallback(
		((...args) => {
			return fnRef.current(...args)
		}),
		[]
	)
}

