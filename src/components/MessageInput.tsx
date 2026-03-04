import { useState, useRef } from "react";
import { Search, Loader2, Mic, FileUp } from "lucide-react";
import { Lang } from "@/lib/translations";
import translations from "@/lib/translations";

interface MessageInputProps {
  lang: Lang;
  message: string;
  onMessageChange: (msg: string) => void;
  onAnalyze: (message: string) => void;
  onAnalyzeFile?: (file: File) => void;
  isAnalyzing: boolean;
}

const MessageInput = ({ lang, message, onMessageChange, onAnalyze, onAnalyzeFile, isAnalyzing }: MessageInputProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = translations[lang];
  const maxChars = 1000;

  const handleSubmit = () => {
    if (message.trim().length > 0) {
      onAnalyze(message);
    }
  };

  const handleMicClick = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Start recording
      console.log("Starting mic recording...");
    } else {
      // Stop recording
      console.log("Stopping mic recording...");
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      console.log("File selected:", file.name);
      if (file.type.startsWith("image/") && onAnalyzeFile) {
        onAnalyzeFile(file);
      } else {
        // non-image files could be handled differently (text/pdf)
        // For now attempt to read text files and analyze
        if (file.type === "text/plain") {
          const reader = new FileReader();
          reader.onload = () => {
            const txt = String(reader.result || "");
            onAnalyze(txt);
          };
          reader.readAsText(file);
        }
      }
    }
  };

  return (
    <div className="govt-card animate-fade-up">
      <label className="mb-2 block text-sm font-semibold text-foreground">
        {t.inputLabel}
      </label>
      <textarea
        value={message}
        onChange={(e) => onMessageChange(e.target.value.slice(0, maxChars))}
        placeholder={t.placeholder}
        rows={5}
        className="w-full resize-none rounded-lg border border-input bg-background p-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
      />
      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {message.length}/{maxChars} {t.characters}
        </span>
        <div className="flex items-center gap-2">
          {/* <button
            onClick={handleMicClick}
            disabled={isAnalyzing}
            className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-all ${
              isRecording
                ? "bg-red-500 text-white hover:opacity-90"
                : "bg-secondary text-secondary-foreground hover:opacity-90"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            title="Mic input"
          >
            <Mic size={16} />
          </button> */}
          <button
            onClick={handleFileClick}
            disabled={isAnalyzing}
            className="inline-flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-sm font-semibold text-secondary-foreground transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Upload file"
          >
            <FileUp size={16} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,.txt,.pdf,.doc,.docx"
          />
          <button
            onClick={handleSubmit}
            disabled={message.trim().length === 0 || isAnalyzing}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Search size={16} />
            )}
            {isAnalyzing ? t.analyzing : t.analyze}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
