'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface Use3DEffectProps {
  intensity?: number
  perspective?: number
  smooth?: number
}

export function use3DEffect<T extends HTMLElement>({
  intensity = 20,
  perspective = 500,
  smooth = 0.1,
}: Use3DEffectProps = {}) {
  const elementRef = useRef<T>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    let bounds = element.getBoundingClientRect()

    const calculateBounds = () => {
      bounds = element.getBoundingClientRect()
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!element) return

      const mouseX = e.clientX
      const mouseY = e.clientY

      // 计算鼠标相对元素中心的位置
      const centerX = bounds.left + bounds.width / 2
      const centerY = bounds.top + bounds.height / 2
      const percentX = (mouseX - centerX) / (bounds.width / 2)
      const percentY = (mouseY - centerY) / (bounds.height / 2)

      // 计算目标旋转角度
      const targetRotateX = -percentY * intensity
      const targetRotateY = percentX * intensity

      // 使用 GSAP 实现平滑过渡
      gsap.to(element, {
        rotationX: targetRotateX,
        rotationY: targetRotateY,
        transformPerspective: perspective,
        duration: smooth,
        ease: 'power2.out',
      })
    }

    const handleMouseLeave = () => {
      if (!element) return

      // 鼠标离开时回到原始位置
      gsap.to(element, {
        rotationX: 0,
        rotationY: 0,
        duration: 0.5,
        ease: 'power2.out',
      })
    }

    window.addEventListener('resize', calculateBounds)
    window.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('resize', calculateBounds)
      window.removeEventListener('mousemove', handleMouseMove)
      element?.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [intensity, perspective, smooth])

  return elementRef
} 