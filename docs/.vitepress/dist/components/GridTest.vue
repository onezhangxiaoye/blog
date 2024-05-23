<template>
    <div class="grid-test">

        <div class="css-grid-buttons">
            <button :class="rowColumnLinesActive ? 'button-active' : ''" @click="rowColumnLinesTest(1)">行列及网格线区分实验</button>
            <button :class="gridTemplateColumnsActive ? 'button-active' : ''" @click="gridTemplateColumnsTest">grid-template-columns实验</button>
        </div>

        <br>

        <transition-group :class="boxClass" class="css-grid-box" name="flip-list" tag="div">
            <div
                :key="item.key"
                v-for="item in arr"
                :style="item.style"
                :class="item.class"
            >
                {{ item.index || '' }}
            </div>
        </transition-group>

        <div class="css-grid-buttons">
            <strong>点击下方样式进行切换</strong>
            <div v-show="rowColumnLinesActive">
                <button :class="isActive(0)" @click="itemClick(0, highlightRows)">高亮行</button>
                <button :class="isActive(1)" @click="itemClick(1, highlightColumns)">高亮列</button>
                <button :class="isActive(2)" @click="itemClick(2, highlightRowLines)">高亮行网格线</button>
                <button :class="isActive(3)" @click="itemClick(3, highlightColumnLines)">高亮列网格线</button>
            </div>
            <div v-show="gridTemplateColumnsActive" style="max-height: 40vh;overflow: auto">
                <pre :class="isActive(5)" @click="itemClick(5, 'css-grid-box-grid-template-columns1')">
    <strong>/**  grid-template-columns: repeat(3, 90px);  **/ </strong>
    .css-grid-box-grid-template-columns1 {
        grid-template-columns: repeat(3, 90px);
        row-gap: 15px;
        column-gap: 15px;
    }
                </pre>
                <pre :class="isActive(6)" @click="itemClick(6, 'css-grid-box-grid-template-columns2')">
    <strong>/**   grid-template-columns: repeat(auto-fill, 40px);  **/ </strong>
    .css-grid-box-grid-template-columns2 {
        grid-template-columns: repeat(auto-fill, 40px);
        row-gap: 15px;
        column-gap: 15px;
    }
                </pre>
                <pre :class="isActive(7)" @click="itemClick(7, 'css-grid-box-grid-template-columns3')">
    <strong>/**   grid-template-columns:30px 1fr 2fr;  **/ </strong>
    .css-grid-box-grid-template-columns3 {
        grid-template-columns:30px 1fr 2fr;
        row-gap: 15px;
        column-gap: 15px;
    }
                </pre>
                <pre :class="isActive(8)" @click="itemClick(8, 'css-grid-box-grid-template-columns4')">
    <strong>/**    grid-template-columns:30% 30% 40%;  **/ </strong>
    .css-grid-box-grid-template-columns4 {
        grid-template-columns:30% 30% 40%;
        row-gap: 15px;
    }
                </pre>
                <pre :class="isActive(9)" @click="itemClick(9, 'css-grid-box-grid-template-columns5')">
    <strong>/**   grid-template-columns: repeat(3, auto);  **/ </strong>
    .css-grid-box-grid-template-columns5 {
        grid-template-columns: repeat(3, auto);
        row-gap: 15px;
        column-gap: 15px;
    }
                </pre>
                <pre :class="isActive(10)" @click="itemClick(10, 'css-grid-box-grid-template-columns6')">
    <strong>/**   justify-content: left; align-content: center;  **/ </strong>
    .css-grid-box-grid-template-columns6 {
        grid-template-columns: repeat(3, 60px);
        grid-template-rows: repeat(3, 60px);
        justify-content: left;
        align-content: center;
    }
                </pre>
                <pre :class="isActive(11)" @click="itemClick(11, 'css-grid-box-grid-template-columns8')">
    <strong>/**   grid-auto-flow: column;  **/</strong>
    .css-grid-box-grid-template-columns8 {
        grid-template-columns: repeat(3, auto);
        grid-template-rows: repeat(3, auto);
        grid-auto-flow: column;
    }
                </pre>
                <pre :class="isActive(12)" @click="itemClick(12, 'css-grid-box-grid-template-columns9')">
    <strong>/**   grid-auto-flow: row dense;  **/</strong>
    .css-grid-box-grid-template-columns9 {
        grid-template-columns: repeat(3, auto);
        grid-template-rows: repeat(3, auto);
        grid-auto-flow: row dense;
    }

    .css-grid-box-grid-template-columns9 .grid-item1,
    .css-grid-box-grid-template-columns9 .grid-item2{
        grid-row-start: 1;
        grid-row-end: 3;
    }
                </pre>
                <pre :class="isActive(13)" @click="itemClick(13, 'css-grid-box-grid-template-columns10')">
    <strong>/**   grid-auto-flow: row;  **/</strong>
    .css-grid-box-grid-template-columns10 {
        grid-template-columns: repeat(3, auto);
        grid-template-rows: repeat(3, auto);
        grid-auto-flow: row;
    }

    .css-grid-box-grid-template-columns10 .grid-item1,
    .css-grid-box-grid-template-columns10 .grid-item2{
        grid-row-start: 1;
        grid-row-end: 3;
    }
                </pre>
                <pre :class="isActive(14)" @click="itemClick(14, 'css-grid-box-grid-template-columns11')">
    <strong>/**   justify-items: left;align-items 同理  **/</strong>
    .css-grid-box-grid-template-columns11 {
        grid-template-columns: repeat(3, auto);
        grid-template-rows: repeat(3, auto);
        justify-items: left;
    }
                </pre>
                <pre :class="isActive(15)" @click="itemClick(15, 'css-grid-box-grid-template-columns12')">
    <strong>/**   grid-auto-rows: 45px;grid-auto-columns: 45px;  **/</strong>
    <strong>/**   grid-column-start: 5;grid-column-end: 6;  **/</strong>
    <strong>/**   grid-row-start: 4;grid-row-end: 5;  **/</strong>
    .css-grid-box-grid-template-columns12 {
        grid-template-columns: repeat(3, 100px);
        grid-template-rows: repeat(3, 100px);
        grid-auto-rows: 45px;
        grid-auto-columns: 45px;
    }
    .css-grid-box-grid-template-columns12 .grid-item3 {
        grid-column-start: 5;
        grid-column-end: 6;
    }
    .css-grid-box-grid-template-columns12 .grid-item8 {
        grid-row-start: 4;
        grid-row-end: 5;
    }
                </pre>
                <pre :class="isActive(16)" @click="itemClick(16, 'css-grid-box-grid-template-columns13')">
    <strong>/**   grid-column: 1 / 3;grid-row: 1 / 3;  **/</strong>
    .css-grid-box-grid-template-columns13 {
        grid-template-columns: repeat(4, auto);
        grid-template-rows: repeat(4, auto);
    }
    .css-grid-box-grid-template-columns13 .grid-item1 {
        grid-column: 1 / 3;
        grid-row: 1 / 3;
    }
    .css-grid-box-grid-template-columns13 .grid-item2 {
        grid-column: 3 / span 2;
        grid-row: 1;
    }
                </pre>
                <pre :class="isActive(17)" @click="itemClick(17, 'css-grid-box-grid-template-columns14')">
    <strong>/**   grid-column: 1 / 3;grid-row: 1 / 3;  **/</strong>
    .css-grid-box-grid-template-columns14 {
        grid-template-columns: repeat(3, 60px);
        grid-template-rows: repeat(3, 60px);
        justify-content: center;
        align-content: center;
    }
    .css-grid-box-grid-template-columns14 .grid-item1 {
        justify-self: left;
    }
    .css-grid-box-grid-template-columns14 .grid-item3 {
        align-self: start;
    }
    .css-grid-box-grid-template-columns14 .grid-item9 {
        place-self:end right;
    }
                </pre>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {ref, defineComponent} from 'vue'

    function createDefaultBoxStyle() {
        return [
            {key: 'a', index: 1, class: {'grid-item1': true}, style: {'background-color': 'rgb(239,52,41)'}},
            {key: 'b', index: 2, class: {'grid-item2': true}, style: {'background-color': 'rgb(246,143,37)'}},
            {key: 'c', index: 3, class: {'grid-item3': true}, style: {'background-color': 'rgb(75,168,70)'}},
            {key: 'd', index: 4, class: {'grid-item4': true}, style: {'background-color': 'rgb(4,118,194)'}},
            {key: 'e', index: 5, class: {'grid-item5': true}, style: {'background-color': 'rgb(192,119,175)'}},
            {key: 'f', index: 6, class: {'grid-item6': true}, style: {'background-color': 'rgb(248,210,157)'}},
            {key: 'g', index: 7, class: {'grid-item7': true}, style: {'background-color': 'rgb(180,168,127)'}},
            {key: 'h', index: 8, class: {'grid-item8': true}, style: {'background-color': 'rgb(208,228,168)'}},
            {key: 'j', index: 9, class: {'grid-item9': true}, style: {'background-color': 'rgb(77,199,236)'}},
        ]
    }

    let count = 100

    function createBorderStyle() {
        return {key: count++ + '', class: {}, style: {'background-color': '#fff'}}
    }

    export default defineComponent({
        setup() {
            const count = ref(0);
            const boxClass = ref('css-grid-box-row-column')
            const arr = ref([])
            const activeIndex = ref(undefined)

            const rowColumnLinesActive = ref(true)
            const gridTemplateColumnsActive = ref(false)

            function setTestActive(type) {
                rowColumnLinesActive.value = "rowColumnLinesActive" === type
                gridTemplateColumnsActive.value = "gridTemplateColumnsActive" === type
            }

            function rowColumnLinesTest(i) {
                setTestActive("rowColumnLinesActive")
                boxClass.value = 'css-grid-box-row-column'
                activeIndex.value = i

                let array = []
                let index = 0, defaultBoxStyle = createDefaultBoxStyle()
                for (let i = 1; i < 8; i++) {
                    for (let j = 1; j < 8; j++) {
                        array.push((i%2 | j%2) === 0 ? defaultBoxStyle[index++] : createBorderStyle())
                    }
                }
                arr.value = array
                console.log(arr.value)
            }
            rowColumnLinesTest(undefined)

            /**
             *
             * @param condition {Function}
             */
            function each(condition) {
                for (let i = 0, j = 0; i < arr.value.length; i++) {
                    if(i !== 0 && i%7 === 0) {
                        j++
                    }

                    arr.value[i].class['css-grid-high-light-animation'] = condition(j, i%7)
                }
            }

            const rowLinesActive = ref(false)
            const columnLinesActive = ref(false)
            const columnActive = ref(false)
            const rowActive = ref(false)

            function setButtonActive(type) {
                rowLinesActive.value = "rowLinesActive" === type
                columnLinesActive.value = "columnLinesActive" === type
                columnActive.value = "columnActive" === type
                rowActive.value = "rowActive" === type
            }

            function highlightRowLines() {
                setButtonActive('rowLinesActive')
                each(() => false)
                setTimeout(() => {
                    each(i => i%2 === 0)
                })
            }

            function highlightColumnLines() {
                setButtonActive('columnLinesActive')
                // 必须先重置状态  否则动画节奏会不一致
                each(() => false)
                setTimeout(() => {
                    each((i, j) => j%2 === 0)
                })
            }

            function highlightRows() {
                setButtonActive('rowActive')
                each(() => false)
                setTimeout(() => {
                    each((i, j) => i%2 === 1)
                })
            }

            function highlightColumns() {
                setButtonActive('columnActive')
                each(() => false)
                setTimeout(() => {
                    each((i, j) => j%2 === 1)
                })
            }

            function gridTemplateColumnsTest() {
                each(() => false)
                arr.value = createDefaultBoxStyle()
                activeIndex.value = 5

                setTestActive("gridTemplateColumnsActive")
                boxClass.value = 'css-grid-box-grid-template-columns1'
                console.log(arr.value)
            }

            function isActive(index) {
                return activeIndex.value === index ? 'button-active' : ''
            }

            function itemClick(index, cls) {
                activeIndex.value = index
                if(typeof cls === "string") {
                    boxClass.value = cls
                } else {
                    cls()
                }

            }

            return {
                rowColumnLinesActive,
                gridTemplateColumnsActive,

                activeIndex,
                count,
                arr,
                rowLinesActive,
                columnLinesActive,
                columnActive,
                rowActive,
                boxClass,
                rowColumnLinesTest,
                highlightRowLines,
                highlightColumnLines,
                highlightRows,
                highlightColumns,
                gridTemplateColumnsTest,
                isActive,
                itemClick,
            }
        }
    })
</script>

<style scoped>
    .grid-test {
        margin-top: 20px;
    }
    .grid-test strong {
        color: red;
    }
    .css-grid-box {
        width: 300px;
        height: 300px;
        outline: 2px dashed;
        display: grid;

        font-weight: bold;
        font-size: 30px;
    }
    .css-grid-box-row-column {
        grid-template-columns: repeat(3, 15px 80px) 15px;
        grid-template-rows: repeat(3, 15px 80px) 15px;
    }

    .css-grid-box-grid-template-columns1 {
        grid-template-columns: repeat(3, 90px);
        row-gap: 15px;
        column-gap: 15px;
    }

    .css-grid-box-grid-template-columns2 {
        grid-template-columns: repeat(auto-fill, 40px);
        row-gap: 15px;
        column-gap: 15px;
    }

    .css-grid-box-grid-template-columns3 {
        grid-template-columns:30px 1fr 2fr;
        row-gap: 15px;
        column-gap: 15px;
    }

    .css-grid-box-grid-template-columns4 {
        grid-template-columns:30% 30% 40%;
        row-gap: 15px;
    }

    .css-grid-box-grid-template-columns5 {
        grid-template-columns: repeat(3, auto);
        row-gap: 15px;
        column-gap: 15px;
    }

    .css-grid-box-grid-template-columns6 {
        grid-template-columns: repeat(3, 60px);
        grid-template-rows: repeat(3, 60px);
        justify-content: left;
        align-content: center;
    }

    .css-grid-box-grid-template-columns7 {
        grid-template-columns: repeat(3, 60px);
        grid-template-rows: repeat(3, 60px);
        justify-content: left;
        align-content: center;
    }

    .css-grid-box-grid-template-columns8 {
        grid-template-columns: repeat(3, auto);
        grid-template-rows: repeat(3, auto);
        grid-auto-flow: column;
    }

    .css-grid-box-grid-template-columns9 {
        grid-template-columns: repeat(3, auto);
        grid-template-rows: repeat(3, auto);
        grid-auto-flow: row dense;
    }

    .css-grid-box-grid-template-columns9 .grid-item1,
    .css-grid-box-grid-template-columns9 .grid-item2{
        grid-column-start: 1;
        grid-column-end: 3;
    }

    .css-grid-box-grid-template-columns10 {
        grid-template-columns: repeat(3, auto);
        grid-template-rows: repeat(3, auto);
        grid-auto-flow: row;
    }

    .css-grid-box-grid-template-columns10 .grid-item1,
    .css-grid-box-grid-template-columns10 .grid-item2{
        grid-column-start: 1;
        grid-column-end: 3;
    }

    .css-grid-box-grid-template-columns11 {
        grid-template-columns: repeat(3, auto);
        grid-template-rows: repeat(3, auto);
        justify-items: left;
    }

    .css-grid-box-grid-template-columns12 {
        grid-template-columns: repeat(3, 100px);
        grid-template-rows: repeat(3, 100px);
        grid-auto-rows: 45px;
        grid-auto-columns: 45px;
    }
    .css-grid-box-grid-template-columns12 .grid-item3 {
        grid-column-start: 5;
        grid-column-end: 6;
    }
    .css-grid-box-grid-template-columns12 .grid-item8 {
        grid-row-start: 4;
        grid-row-end: 5;
    }

    .css-grid-box-grid-template-columns13 {
        grid-template-columns: repeat(4, auto);
        grid-template-rows: repeat(4, auto);
    }
    .css-grid-box-grid-template-columns13 .grid-item1 {
        grid-column: 1 / 3;
        grid-row: 1 / 3;
    }
    .css-grid-box-grid-template-columns13 .grid-item2 {
        grid-column: 3 / span 2;
        grid-row: 1;
    }

    .css-grid-box-grid-template-columns14 {
        grid-template-columns: repeat(3, 60px);
        grid-template-rows: repeat(3, 60px);
        justify-content: center;
        align-content: center;
    }
    .css-grid-box-grid-template-columns14 .grid-item1 {
        justify-self: left;
    }
    .css-grid-box-grid-template-columns14 .grid-item3 {
        align-self: start;
    }
    .css-grid-box-grid-template-columns14 .grid-item9 {
        place-self:end right;
    }

    .css-grid-box-item {
        font-size: 50px;
        text-align: center;
    }
    .css-grid-buttons {
        margin-top: 20px;
    }
    .css-grid-high-light-animation {
        animation-name: high-light-animation;
        animation-fill-mode: backwards;
        animation-timing-function: linear;
        animation-duration: 2.5s;
        animation-iteration-count: infinite;
        animation-direction: alternate;
    }

    .button-active {
        background-color: coral;
    }

    .flip-list-leave-active {
        display: none;
    }

    .css-grid-box div {
        transition: all .8s;
    }

    @keyframes high-light-animation {
        10% {
            background-color: rgb(249,182,180);
        }
        70% {
            background-color: rgb(242,96,92);
        }
        80% {
            background-color: rgb(243,113,109);
        }
        80% {
            background-color: rgb(242,96,92);
        }
        90% {
            background-color: rgb(243,113,109);
        }
        95% {
            background-color: rgb(242,96,92);
        }
        100% {
            background-color: rgb(243,113,109);
        }
    }
</style>
