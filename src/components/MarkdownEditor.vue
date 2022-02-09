<template>
  <div>
      <div class="flex flex-wrap">
        <el-button @click="applyBold" class="button">
          <font-awesome-icon :icon="['fas', 'bold']"/>
        </el-button>
        <el-button @click="applyItalic" class="button">
          <font-awesome-icon :icon="['fas', 'italic']" />
        </el-button>
        <el-button @click="applyHeading" class="button">
          <font-awesome-icon :icon="['fas', 'heading']" />
        </el-button>
        <el-button @click="applyUl" class="button">
          <font-awesome-icon :icon="['fas', 'list-ul']" />
        </el-button>
        <el-button @click="applyOl" class="button">
          <font-awesome-icon :icon="['fas', 'list-ol']" />
        </el-button>
        <el-button @click="undo" class="button">
          <font-awesome-icon :icon="['fas', 'undo']" />
        </el-button>
        <el-button @click="redo" class="button">
          <font-awesome-icon :icon="['fas', 'redo']" />
        </el-button>
      </div>
      <div
        ref="markdownInput"
        @input="onInput"
        v-html="innerValue"
        contenteditable="true"
        class="wysiwyg-output outline-none border-2 p-4 rounded-lg border-gray-300 focus:border-green-300"
      />
    </div>
</template>

<script lang='ts'>
import { APP_BUS_STATE, APP_GETTERS } from "@/store/modules/app";
import { Marked } from "@ts-stack/markdown";
import { defineComponent } from "@vue/runtime-core";
import { computed, onMounted, ref, watch } from "vue";
import { useStore } from "vuex";
import TurndownService from "turndown";

const  MarkdownEditor = defineComponent({
  props: {
    setValue: {
      type: String,
      default: null
    }
  },
  setup(props, {emit}) {
    const store = useStore();
    const innerValue = ref("");
    const markdownInput = ref(null);
    const clearMarkDown = computed(() => store.getters[APP_GETTERS.GET_BUS_STATE](APP_BUS_STATE.CLEAR_MARKDOWN));

    innerValue.value = Marked.parse(typeof props.setValue === "string" ? props.setValue : "") || "";
    onMounted((): void => {
      document.execCommand("defaultParagraphSeparator", false, "p");
    });
    watch(() => props.setValue, () => {
      innerValue.value = Marked.parse(typeof props.setValue === "string" ? props.setValue : "") || "";
    });
    watch(clearMarkDown, (): void => {
      innerValue.value = Marked.parse("");
      const element: any = markdownInput.value;
      element.innerHTML = "";
    });
    const onInput = ( event: any ) => {
      const turndown = new TurndownService({
        emDelimiter: "_",
        linkStyle: "inlined",
        headingStyle: "atx"
      });
      emit("changeValue", turndown.turndown(event.target.innerHTML));
    }
    const applyBold = () => {
      document.execCommand("bold");
    }
    const applyItalic = () => {
      document.execCommand("italic");
    }
    const applyHeading = () => {
      document.execCommand("formatBlock", false, "<h1>");
    }
    const applyUl = () => {
      document.execCommand("insertUnorderedList");
    }
    const applyOl = () => {
      document.execCommand("insertOrderedList");
    }
    const undo = () => {
      document.execCommand("undo");
    }
    const redo = () => {
      document.execCommand("redo");
    }
    return {
      markdownInput
    }
  }
});
export default MarkdownEditor;
</script>

<style rel="stylesheet/scss" lang="scss">
.wysiwyg-output {
  border:1px solid #E4E7ED;
  margin-top: 10px;
  padding: 10px 15px;
  border-radius: 4px;
  min-height: 4em;
  p, ul, ol, h1 {
    margin-block-start: 0;
    margin-block-end: 0;
    line-height: 1.5em;
  }
}
.header-style {
  font-size: 16px;
}
.selfForm label.el-form-item__label {
  padding-bottom: 0;
}
</style>