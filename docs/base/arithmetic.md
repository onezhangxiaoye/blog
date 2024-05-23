# 基础算法

## 最长严格递增子序列
给你一个整数数组 nums ，找到其中最长严格递增子序列的长度。[leetcode](https://leetcode-cn.com/problems/longest-increasing-subsequence/)


``` js
// 输入：nums = [10,9,2,5,3,7,101,18]
// 输出：4
// 解释：最长递增子序列是 [2,3,7,101]，因此长度为 4 。
```


> 倒序遍历数组，把当前元素的递增子序列长度存储在一个新的数组中，初始值都为 1，然后把当前的元素和后面的每个元素进行比较若小于，则当前的最大递增子序列长度在对应基础上加1，比较后取最大值，直致整个数组遍历完成，取最大值

::: details 代码

``` js
/**
 * @param {number[]} nums
 * @return {number}
 */
var lengthOfLIS = function(nums) {
    if(nums.length === 1) {
        return  1
    }
    var arr = new Array(nums.length).fill(1)
    var lastIndex = nums.length - 1
    var max = 1
    for (let i = lastIndex; i >= 0; i--) {
        let item = nums[i]
        let j = i + 1
        while (j <= lastIndex) {
            if(item < nums[j]) {
                arr[i] = Math.max(arr[i], arr[j] + 1)
                max = Math.max(max, arr[i])
            }
            j++
        }
    }
    return max
};
```

:::

## 冒泡排序
给你一个整数数组 nums ，从小到大对数组元素进行升序排序

> 顺序遍历，把当前元素和后面的元素进行逐一比较，若后面的元素较小则交换位置，然后使用新的值继续向后比较，然后把后面的每一个元素按照这种方式完成比较，直至比较完成，排序就完成了

::: details 代码
``` js
/** 冒泡
 * @param nums {[]}
 */
function bubbleSort(nums) {
    if(nums.length === 1) {
        return nums
    }

    for (let i = 0; i < nums.length; i++) {
        let item = nums[i]
        for (let j = 0; j < nums.length; j++) {

            if(i === j) {
                continue
            }

            const compare = nums[j]
            if(compare > item) {
                nums[j] = item
                nums[i] = compare
                item = compare
            }
        }
    }
    return nums
}
```
:::


## 插入排序
给你一个整数数组 nums ，从小到大对数组元素进行升序排序

> 顺序遍历，把从第二个元素开始的后面每个元素从前到当前元素下标依次进行比较，若小于则把元素插入到对应元素前面，直至所有元素遍历完成排序也就完成了


::: details 代码
``` js
/** 插入排序
 *
 * @param nums {[]}
 */
function insertSort(nums) {
    if(nums.length === 1) {
        return nums
    }

    for (let i = 1; i < nums.length; i++) {
        let item = nums[i]

        for (let j = 0; j < i; j++) {
            const compare = nums[j]
            if(compare > item) {
                item = nums.splice(i, 1)[0]
                nums.splice(j, 0, item)
                break
            }
        }

    }
    return nums
}
```
:::



## 快速排序
给你一个整数数组 nums ，从小到大对数组元素进行升序排序

> 在数组中取一个元素，表示数组的中间值，一般会取最后一个元素。然后把大的值放右边，小的值放左边，然后依次对左右数组依次执行次操作，这是一个递归的过程，在递归的最底层，其实就是对数组的两个，或者一个元素进行排序，最后在依次拼接直至最外层的函数，就完成了数组的排序


::: details 代码

``` js
/**
 * @param {number[]} nums
 */
function quickSort(nums) {
    if(nums.length < 2) {
        return nums
    }

    let low = [], high = [], lastValue = nums[nums.length - 1]

    for (let i = 0; i < nums.length - 1; i++) {
        const item = nums[i]
        if(item < lastValue) {
            low.push(item)
        } else {
            high.push(item)
        }
    }

    low = quickSort(low)
    high = quickSort(high)

    return low.concat(lastValue, high)
}
```

:::


## 两数之和
给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出 和为目标值 target  的那 两个 整数，并返回它们的数组下标。

> 遍历数组，通过 目标值减去当前元素 的结果去 hash 表中查找是否存在对应值，有则返回双方下标



::: details 代码

``` js
/**
 * @param {number[]} nums
 */
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    const map = Object.create(null)

    for (let i = 0; i < nums.length; i++) {
        const item = nums[i]
        const diff = target - item
        if(map[diff] >= 0) {
            return [map[diff], i]
        }
        map[item] = i
    }
};
```

:::










