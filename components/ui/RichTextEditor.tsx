'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { Underline } from '@tiptap/extension-underline'
import { Subscript } from '@tiptap/extension-subscript'
import { Superscript } from '@tiptap/extension-superscript'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableHeader } from '@tiptap/extension-table-header'
import { TableCell } from '@tiptap/extension-table-cell'
import { TaskList } from '@tiptap/extension-task-list'
import { TaskItem } from '@tiptap/extension-task-item'
import { CharacterCount } from '@tiptap/extension-character-count'
import { Placeholder } from '@tiptap/extension-placeholder'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Button } from './Button'
import {
  BoldIcon,
  ItalicIcon,
  MinusIcon,
  CodeBracketIcon,
  HashtagIcon,
  ListBulletIcon,
  Bars3Icon,
  ChatBubbleLeftIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  LinkIcon,
  PhotoIcon,
  DocumentTextIcon,
  DocumentIcon,
  EyeIcon,
  TableCellsIcon,
  CheckIcon,
  StopIcon,
  PaintBrushIcon,
  MagnifyingGlassIcon,
  DocumentDuplicateIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
  showWordCount?: boolean
  autoSave?: boolean
  autoSaveDelay?: number
  onImageUpload?: (file: File) => Promise<string>
  mediaLibrary?: boolean
}

const MenuBar = ({ editor }: { editor: any }) => {
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false)

  if (!editor) {
    return null
  }

  const addImage = () => {
    const url = window.prompt('Image URL')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    if (url === null) {
      return
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  const addTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  }

  const toggleTaskList = () => {
    editor.chain().focus().toggleTaskList().run()
  }

  const setTextColor = (color: string) => {
    editor.chain().focus().setColor(color).run()
  }

  const setHighlight = (color: string) => {
    editor.chain().focus().toggleHighlight({ color }).run()
  }

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-800">
      {/* First Row - Basic Formatting */}
      <div className="flex flex-wrap items-center gap-1 mb-2">
        <div className="flex items-center space-x-1">
          <Button
            variant={editor.isActive('bold') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <BoldIcon className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive('italic') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <ItalicIcon className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive('underline') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <span className="text-xs font-bold">U</span>
          </Button>
          <Button
            variant={editor.isActive('strike') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleStrike().run()}
          >
            <MinusIcon className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive('subscript') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleSubscript().run()}
          >
            <span className="text-xs">X₂</span>
          </Button>
          <Button
            variant={editor.isActive('superscript') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
          >
            <span className="text-xs">X²</span>
          </Button>
        </div>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />

        <div className="flex items-center space-x-1">
          <Button
            variant={editor.isActive('heading', { level: 1 }) ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          >
            H1
          </Button>
          <Button
            variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          >
            H2
          </Button>
          <Button
            variant={editor.isActive('heading', { level: 3 }) ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          >
            H3
          </Button>
        </div>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />

        <div className="flex items-center space-x-1">
          <Button
            variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <ListBulletIcon className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <Bars3Icon className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive('taskList') ? 'default' : 'ghost'}
            size="sm"
            onClick={toggleTaskList}
          >
            <CheckIcon className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive('blockquote') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <ChatBubbleLeftIcon className="h-4 w-4" />
          </Button>
        </div>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />

        <div className="flex items-center space-x-1">
          <Button
            variant={editor.isActive({ textAlign: 'left' }) ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
          >
            <DocumentTextIcon className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive({ textAlign: 'center' }) ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
          >
            <DocumentTextIcon className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive({ textAlign: 'right' }) ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
          >
            <DocumentTextIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Second Row - Advanced Features */}
      <div className="flex flex-wrap items-center gap-1">
        <div className="flex items-center space-x-1">
          <Button
            variant={editor.isActive('link') ? 'default' : 'ghost'}
            size="sm"
            onClick={setLink}
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={addImage}
          >
            <PhotoIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={addTable}
          >
            <TableCellsIcon className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive('codeBlock') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          >
            <CodeBracketIcon className="h-4 w-4" />
          </Button>
        </div>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />

        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          >
            <ArrowUturnLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          >
            <ArrowUturnRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder = 'Start writing...',
  className = '',
  showWordCount = true,
  autoSave = false,
  autoSaveDelay = 3000,
  onImageUpload,
  mediaLibrary = false
}: RichTextEditorProps) {
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 hover:text-blue-800 underline',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      Underline,
      Subscript,
      Superscript,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      CharacterCount,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange(html)

      // Update word and character count
      const text = editor.getText()
      setWordCount(text.split(/\s+/).filter(word => word.length > 0).length)
      setCharCount(text.length)
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[400px] p-6 prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-code:text-pink-600 prose-pre:bg-gray-100 prose-blockquote:border-l-4 prose-blockquote:border-orange-500 prose-ul:text-gray-700 prose-ol:text-gray-700',
      },
    },
  })

  // Auto-save functionality
  useEffect(() => {
    if (!autoSave || !editor) return

    const timer = setInterval(() => {
      const html = editor.getHTML()
      // Here you would typically save to your backend
      console.log('Auto-saving content...', html)
    }, autoSaveDelay)

    return () => clearInterval(timer)
  }, [autoSave, autoSaveDelay, editor])

  const handleImageUpload = async (file: File) => {
    if (onImageUpload) {
      try {
        const imageUrl = await onImageUpload(file)
        editor?.chain().focus().setImage({ src: imageUrl }).run()
      } catch (error) {
        console.error('Image upload failed:', error)
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 ${className}`}
    >
      <MenuBar editor={editor} />
      <EditorContent
        editor={editor}
        className="min-h-[400px]"
      />

      {/* Status Bar */}
      {showWordCount && (
        <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-2 bg-gray-50 dark:bg-gray-800 text-sm text-gray-600 dark:text-gray-400 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span>{wordCount} words</span>
            <span>{charCount} characters</span>
          </div>
          <div className="flex items-center space-x-2">
            {autoSave && (
              <div className="flex items-center space-x-1">
                <ClockIcon className="h-3 w-3" />
                <span>Auto-saving...</span>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  )
}