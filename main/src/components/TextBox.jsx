import { useState } from 'react'
import { IconSend } from '@tabler/icons-react'
import { askVoddie } from '../api/ask'

function TextBox({ onMessageReceived, onThinking }) {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (onThinking) onThinking(true)
    if (!text.trim()) return
    setLoading(true)
    try {
      const response = await askVoddie(text)
      if (onMessageReceived) onMessageReceived(response)
    } catch (error) {
      console.error("Failed to send message:", error)
    } finally {
      setLoading(false)
      setText('')
      if (onThinking) onThinking(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend()
  }

  return (
    <div className="flex items-center bg-zinc-900 rounded-full px-4 py-2 w-full max-w-md shadow-lg border border-zinc-800">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type something..."
        className="flex-grow bg-transparent text-gray-200 placeholder-gray-500 text-sm focus:outline-none"
      />
      <button
        onClick={handleSend}
        className={`ml-2 bg-blue-600 hover:bg-blue-700 text-white text-sm p-3 rounded-full transition-all duration-200 ${
          loading ? 'opacity-50 cursor-not-allowed bg-blue-800 hover:bg-blue-800' : ''
        }`}
        disabled={loading}
      >
        <IconSend size={16} />
      </button>
    </div>
  )
}

export default TextBox
