
# css动画

[CSS3 Transitions, Transforms和Animation使用简介与应用展示](https://www.zhangxinxu.com/wordpress/2010/11/css3-transitions-transforms-animation-introduction/)

[CSS3 animation属性中的steps功能符深入介绍](https://www.zhangxinxu.com/wordpress/2018/06/css3-animation-steps-step-start-end/)

## Css Animation 属性笔记

- `animation-name` 需要绑定到选择器的 keyframe 名称
- `animation-duration` 完成动画所花费的时间，以秒或毫秒计
- `animation-timing-function` 规定动画的速度曲线
- `animation-delay` 在动画开始之前的延迟
- `animation-iteration-count` 动画应该播放的次数
- `animation-direction` 是否应该轮流反向播放动画
  - `normal` – 动画在每个周期 向前 播放。换句话说，每次动画循环时，动画都会重置为开始状态并重新开始。这是默认值。  
  - `reverse` – 动画在每个周期 向后 播放。换句话说，每次动画循环时，动画都会重置为结束状态并重新开始。动画步骤是反向执行的，计时功能也是反向执行的。例如， ease-in 定时函数变为 ease-out。  
  - `alternate` – 动画在每个周期中反转方向，第一次迭代 向前播放。确定周期是偶数还是奇数的计数从 1 开始。  
  - `alternate-reverse` – 动画在每个周期中反转方向，第一次迭代向 后播放。确定周期是偶数还是奇数的计数从 1 开始。
