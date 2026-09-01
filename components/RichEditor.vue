<template>
  <div class="border border-stone-300 dark:border-stone-700 rounded-xl overflow-hidden bg-white dark:bg-stone-900 shadow-sm">
    <!-- Toolbar -->
    <div
      v-if="editor"
      class="flex flex-wrap items-center gap-1 p-2 bg-stone-100 dark:bg-stone-800/80 border-b border-stone-300 dark:border-stone-700"
    >
      <!-- History -->
      <UButton
        size="xs"
        color="gray"
        variant="ghost"
        icon="i-mdi-undo"
        :disabled="!editor.can().undo()"
        @click="editor.chain().focus().undo().run()"
        title="Undo"
      />
      <UButton
        size="xs"
        color="gray"
        variant="ghost"
        icon="i-mdi-redo"
        :disabled="!editor.can().redo()"
        @click="editor.chain().focus().redo().run()"
        title="Redo"
      />

      <span class="w-[1px] h-5 bg-stone-300 dark:bg-stone-700 mx-1"></span>

      <!-- Headings / Text -->
      <UButton
        size="xs"
        :color="editor.isActive('paragraph') ? 'amber' : 'gray'"
        :variant="editor.isActive('paragraph') ? 'solid' : 'ghost'"
        @click="editor.chain().focus().setParagraph().run()"
      >
        {{ dir === 'ltr' ? 'Normal' : 'عادي' }}
      </UButton>
      <UButton
        size="xs"
        :color="editor.isActive('heading', { level: 2 }) ? 'amber' : 'gray'"
        :variant="editor.isActive('heading', { level: 2 }) ? 'solid' : 'ghost'"
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
      >
        {{ dir === 'ltr' ? 'H2' : 'عنوان رئيسي' }}
      </UButton>
      <UButton
        size="xs"
        :color="editor.isActive('heading', { level: 3 }) ? 'amber' : 'gray'"
        :variant="editor.isActive('heading', { level: 3 }) ? 'solid' : 'ghost'"
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
      >
        {{ dir === 'ltr' ? 'H3' : 'عنوان فرعي' }}
      </UButton>

      <span class="w-[1px] h-5 bg-stone-300 dark:bg-stone-700 mx-1"></span>

      <!-- Formats -->
      <UButton
        size="xs"
        :color="editor.isActive('bold') ? 'amber' : 'gray'"
        :variant="editor.isActive('bold') ? 'solid' : 'ghost'"
        icon="i-mdi-format-bold"
        @click="editor.chain().focus().toggleBold().run()"
        title="Bold"
      />
      <UButton
        size="xs"
        :color="editor.isActive('italic') ? 'amber' : 'gray'"
        :variant="editor.isActive('italic') ? 'solid' : 'ghost'"
        icon="i-mdi-format-italic"
        @click="editor.chain().focus().toggleItalic().run()"
        title="Italic"
      />
      <UButton
        size="xs"
        :color="editor.isActive('underline') ? 'amber' : 'gray'"
        :variant="editor.isActive('underline') ? 'solid' : 'ghost'"
        icon="i-mdi-format-underline"
        @click="editor.chain().focus().toggleUnderline().run()"
        title="Underline"
      />

      <span class="w-[1px] h-5 bg-stone-300 dark:bg-stone-700 mx-1"></span>

      <!-- Alignment -->
      <UButton
        size="xs"
        :color="editor.isActive({ textAlign: 'right' }) ? 'amber' : 'gray'"
        :variant="editor.isActive({ textAlign: 'right' }) ? 'solid' : 'ghost'"
        icon="i-mdi-format-align-right"
        @click="editor.chain().focus().setTextAlign('right').run()"
        title="Align Right"
      />
      <UButton
        size="xs"
        :color="editor.isActive({ textAlign: 'center' }) ? 'amber' : 'gray'"
        :variant="editor.isActive({ textAlign: 'center' }) ? 'solid' : 'ghost'"
        icon="i-mdi-format-align-center"
        @click="editor.chain().focus().setTextAlign('center').run()"
        title="Align Center"
      />
      <UButton
        size="xs"
        :color="editor.isActive({ textAlign: 'left' }) ? 'amber' : 'gray'"
        :variant="editor.isActive({ textAlign: 'left' }) ? 'solid' : 'ghost'"
        icon="i-mdi-format-align-left"
        @click="editor.chain().focus().setTextAlign('left').run()"
        title="Align Left"
      />

      <span class="w-[1px] h-5 bg-stone-300 dark:bg-stone-700 mx-1"></span>

      <!-- Lists -->
      <UButton
        size="xs"
        :color="editor.isActive('bulletList') ? 'amber' : 'gray'"
        :variant="editor.isActive('bulletList') ? 'solid' : 'ghost'"
        icon="i-mdi-format-list-bulleted"
        @click="editor.chain().focus().toggleBulletList().run()"
        title="Bullet List"
      />
      <UButton
        size="xs"
        :color="editor.isActive('orderedList') ? 'amber' : 'gray'"
        :variant="editor.isActive('orderedList') ? 'solid' : 'ghost'"
        icon="i-mdi-format-list-numbered"
        @click="editor.chain().focus().toggleOrderedList().run()"
        title="Numbered List"
      />

      <span class="w-[1px] h-5 bg-stone-300 dark:bg-stone-700 mx-1"></span>

      <!-- Link & Clear -->
      <UButton
        size="xs"
        :color="editor.isActive('link') ? 'amber' : 'gray'"
        :variant="editor.isActive('link') ? 'solid' : 'ghost'"
        icon="i-mdi-link"
        @click="setLink"
        title="Link"
      />
      <UButton
        v-if="editor.isActive('link')"
        size="xs"
        color="red"
        variant="ghost"
        icon="i-mdi-link-off"
        @click="editor.chain().focus().unsetLink().run()"
        title="Unlink"
      />
      <UButton
        size="xs"
        color="gray"
        variant="ghost"
        icon="i-mdi-format-clear"
        @click="editor.chain().focus().clearNodes().unsetAllMarks().run()"
        title="Clear Format"
      />

      <!-- Preview Toggle -->
      <div class="mr-auto flex items-center gap-2">
        <UButton
          size="xs"
          :color="showPreview ? 'amber' : 'gray'"
          variant="soft"
          :icon="showPreview ? 'i-mdi-eye-off' : 'i-mdi-eye'"
          @click="showPreview = !showPreview"
        >
          {{ showPreview ? (dir === 'ltr' ? 'Hide Preview' : 'إخفاء المعاينة') : (dir === 'ltr' ? 'Live Preview' : 'معاينة حية') }}
        </UButton>
      </div>
    </div>

    <!-- Content Area -->
    <div :class="['grid', showPreview ? 'grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-stone-200 dark:divide-stone-800' : 'grid-cols-1']">
      <!-- Editor View -->
      <div class="p-3 min-h-[160px] cursor-text" @click="focusEditor" :dir="dir">
        <editor-content :editor="editor" class="tiptap-editor prose-custom focus:outline-none min-h-[140px]" />
      </div>

      <!-- Live Preview -->
      <div v-if="showPreview" class="p-4 bg-stone-50/50 dark:bg-stone-950/40 min-h-[160px]" :dir="dir">
        <div class="text-xs font-semibold text-amber-500 mb-2 border-b border-amber-500/20 pb-1 flex items-center gap-1">
          <UIcon name="i-mdi-eye-outline" />
          <span>{{ dir === 'ltr' ? 'Live Preview' : 'المعاينة المباشرة كما ستظهر للزوار' }}</span>
        </div>
        <div class="prose-custom" v-html="modelValue"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: 'اكتب المحتوى هنا...',
  },
  dir: {
    type: String,
    default: 'rtl',
  },
})

const emit = defineEmits(['update:modelValue'])
const showPreview = ref(false)

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    Underline,
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: 'text-amber-500 underline',
      },
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph'],
      defaultAlignment: props.dir === 'ltr' ? 'left' : 'right',
    }),
  ],
  editorProps: {
    attributes: {
      class: 'focus:outline-none min-h-[140px]',
      dir: props.dir,
    },
  },
  onUpdate: () => {
    emit('update:modelValue', editor.value?.getHTML() || '')
  },
})

watch(
  () => props.modelValue,
  (val) => {
    const isSame = editor.value?.getHTML() === val
    if (editor.value && !isSame) {
      editor.value.commands.setContent(val || '', false)
    }
  }
)

const focusEditor = () => {
  editor.value?.commands.focus()
}

const setLink = () => {
  const previousUrl = editor.value?.getAttributes('link').href
  const url = window.prompt(props.dir === 'ltr' ? 'Enter URL:' : 'أدخل الرابط (URL):', previousUrl)

  if (url === null) {
    return
  }

  if (url === '') {
    editor.value?.chain().focus().extendMarkRange('link').unsetLink().run()
    return
  }

  editor.value?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
}

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<style>
.tiptap-editor .tiptap {
  outline: none !important;
}
</style>
