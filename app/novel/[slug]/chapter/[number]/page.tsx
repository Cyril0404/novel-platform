"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { SkeletonReader } from "@/components/ui/skeleton";
import { useReadingSettings, fontFamilyClasses, fontFamilyLabels } from "@/components/reading-settings";
import type { FontFamily } from "@/components/reading-settings";

export default function ChapterPage({
  params,
}: {
  params: { slug: string; number: string };
}) {
  const { data: session } = useSession();
  const {
    theme,
    fontSize,
    lineHeight,
    fontFamily,
    setTheme,
    setFontSize,
    setLineHeight,
    setFontFamily,
  } = useReadingSettings();
  const [showSettings, setShowSettings] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarkNote, setBookmarkNote] = useState("");
  const [showBookmarkModal, setShowBookmarkModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  // TTS state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechRate, setSpeechRate] = useState(1);
  const [showTTSPanel, setShowTTSPanel] = useState(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const paragraphsRef = useRef<string[]>([]);
  const currentParagraphRef = useRef(0);

  const chapterNumber = parseInt(params.number);
  const prevChapter = chapterNumber > 1 ? chapterNumber - 1 : null;
  const nextChapter = chapterNumber < 342 ? chapterNumber + 1 : null;

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const chapterContent = `
The morning sun cast long shadows across the imperial garden as Emperor Kaios walked alone among the cherry blossoms. Three thousand years he had walked these paths, yet today they felt different somehow. The petals that once brought him peace now served only to remind him of all he had lost.

"Mei," he whispered to the wind, her name a prayer on his lips.

The Immortal Council had given their verdict three days ago. Either he would banish the healer who had brought color back to his eternal existence, or he would face the consequences of his weakness. They called it weakness—his ability to feel, to love, to be human in a world that had long forgotten humanity.

"The council is foolish."

Kaios turned to find Grand Vizier Shen standing at the garden's edge, his ancient eyes reflecting centuries of wisdom.

"They are afraid," Kaios replied, his voice hollow. "They have ruled from the shadows for so long that they cannot comprehend why one of their own would choose mortality over immortality."

Shen approached slowly, his robes whispering against the stone path. "And what have you chosen, Your Majesty?"

The emperor's gaze returned to the blossoms above. "I have chosen her. Whatever the cost."

As if summoned by his words, a figure appeared at the garden gate. Mei moved like spring itself—vibrant, alive, utterly unlike the cold immortals who had watched empires rise and fall. She carried a basket of herbs, her simple farmer's clothes a stark contrast to the silk and gold that surrounded Kaios.

"Your Majesty," she called out, her voice like music in the silence.

Shen bowed and withdrew silently, leaving them alone beneath the falling petals.

"You should not be here," Kaios said, though he moved toward her. "The palace guards—"

"I don't care about guards." Mei smiled, and for a moment, Kaios forgot the weight of his crown. "I brought you something. Look."

She held out a small potted plant, its flowers a brilliant shade of amber.

"It blooms for three thousand years," she explained. "I thought... since you've seen so many springs, maybe this one would be special."

Kaios accepted the gift, his immortal fingers trembling slightly. A plant that lived as long as he did—one that would die when he died.

"It's beautiful," he managed, his voice thick with emotion. "Like you."

Mei's cheeks flushed, but before she could respond, a horn sounded in the distance. The Council had convened.

"I must go," Kaios said, his expression hardening. "Stay here. Do not leave the palace."

"Kaios, wait—"

But he was already gone, swept away by duty and destiny, leaving Mei alone with her flowers and her fears for a future she could not see.

---

The Council Chamber was a vast circular room, its walls inscribed with the names of every immortal who had ever lived. Twelve thrones ringed the central platform, eleven of them occupied by beings who had long forgotten what it meant to be human.

"Kaios of the Celestial Empire," intoned the Speaker, an ancient woman whose eyes held no warmth. "You stand accused of forming an attachment to a mortal. This is forbidden under the First Law of Immortality."

"I am aware of the law," Kaios replied, standing tall before them.

"Then you understand the penalty."

"I do."

"Death. Permanent death. Your immortality stripped away, your existence ended forever."

A murmur ran through the chamber. Even among immortals, execution was rare. Kaios met each of their gazes in turn, seeing nothing but cold calculation in their ancient eyes.

"I have ruled this empire for three thousand years," he said, his voice echoing through the chamber. "I have protected it from invaders, from disasters, from the chaos that comes when mortals must fend for themselves. I have earned my place."

"Your service is noted," the Speaker replied dismissively. "But service does not excuse weakness. Love is the crack through which mortality enters our eternal existence. You must be purified."

Kaios laughed—a bitter, broken sound. "Purified? You wish to kill me for loving someone. How very immortal of you."

"The vote is simple," the Speaker continued, ignoring his outburst. "All in favor of execution?"

One by one, the immortals raised their hands. Ten hands. Ten votes for his death.

Kaios closed his eyes, Mei's face filling his mind. He thought of her smile, her warmth, her impossible courage in the face of a world that would destroy them both.

"Then it is decided," the Speaker announced. "You have until sunset to—"

"Wait."

A new voice. Kaios opened his eyes to find the eleventh council member—Lady Chen, who had not spoken in centuries—rising from her throne.

"I invoke the Right of Challenge," she said, her voice cutting through the chamber like a blade.

The room erupted. The Speaker's gavel struck the podium repeatedly, but the chaos only grew.

"Silence!" Lady Chen commanded, and somehow, the immortals fell quiet. "I invoke the Right of Challenge. Any who wish to stop me?"

No one moved.

"Good. Then let the challenge proceed."

She turned to Kaios, and for the first time in three thousand years, he saw something like hope in an immortal's eyes.

"The Right of Challenge allows me to contest the execution," she explained. "By combat."

"Combat?" the Speaker sputtered. "You cannot—"

"I can. And I will. Unless the Council wishes to admit that the First Law exists not to protect immortals, but to control them?"

The accusation hung in the air, dangerous and damning.

The emperor straightened, the weight of three thousand years falling from his shoulders. For the first time since meeting Mei, he felt truly alive.

"Tell me the rules," he said.
`;

  const handleBookmark = async () => {
    if (bookmarked) {
      setBookmarked(false);
      return;
    }
    setShowBookmarkModal(true);
  };

  const saveBookmark = async () => {
    try {
      await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chapterId: `${params.slug}-${chapterNumber}`,
          position: 0,
          note: bookmarkNote || null,
        }),
      });
      setBookmarked(true);
      setShowBookmarkModal(false);
    } catch (error) {
      console.error("Failed to save bookmark:", error);
    }
  };

  const handleProgress = async () => {
    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chapterId: `${params.slug}-${chapterNumber}`,
          percentage: 100,
          chapterNumber,
        }),
      });
    } catch (error) {
      console.error("Failed to save progress:", error);
    }
  };

  useEffect(() => {
    handleProgress();
  }, []);

  // Scroll progress tracking
  useEffect(() => {
    const handleScroll = () => {
      const content = contentRef.current;
      if (!content) return;

      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const progress = Math.min(100, Math.max(0, (scrollTop / (documentHeight - windowHeight)) * 100));
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial calculation

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // TTS Functions
  const cleanText = (text: string) => {
    return text
      .replace(/[""]/g, '"')
      .replace(/['']/g, "'")
      .replace(/—/g, "-")
      .replace(/\n/g, " ")
      .trim();
  };

  const speakParagraph = useCallback((paragraphs: string[], index: number) => {
    if (index >= paragraphs.length) {
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText(paragraphs[index]));
    utterance.rate = speechRate;
    utterance.lang = "en-US";

    utterance.onend = () => {
      currentParagraphRef.current = index + 1;
      speakParagraph(paragraphs, index + 1);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    speechRef.current = utterance;
    speech.speak(utterance);
  }, [speechRate]);

  const toggleSpeech = useCallback(() => {
    if (isSpeaking) {
      speech.cancel();
      setIsSpeaking(false);
      return;
    }

    const paragraphs = chapterContent.split("\n\n").filter(p => p.trim().length > 0);
    paragraphsRef.current = paragraphs;
    currentParagraphRef.current = 0;

    setIsSpeaking(true);
    speakParagraph(paragraphs, 0);
  }, [isSpeaking, chapterContent, speakParagraph]);

  const stopSpeech = useCallback(() => {
    speech.cancel();
    setIsSpeaking(false);
    currentParagraphRef.current = 0;
  }, []);

  const changeSpeechRate = useCallback((rate: number) => {
    setSpeechRate(rate);
    if (isSpeaking && speechRef.current) {
      speech.cancel();
      setIsSpeaking(false);
      setTimeout(() => toggleSpeech(), 100);
    }
  }, [isSpeaking, toggleSpeech]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      speech.cancel();
    };
  }, []);

  // Stop speech on chapter change
  useEffect(() => {
    stopSpeech();
  }, [params.slug, params.number, stopSpeech]);

  const themeClasses = {
    light: "bg-stone-50 text-stone-800",
    dark: "bg-stone-950 text-stone-100",
    sepia: "bg-amber-50 text-stone-800",
  };

  const themeBgClasses = {
    light: "from-amber-50/50 to-white",
    dark: "from-stone-900/50 to-stone-950",
    sepia: "from-amber-100/50 to-amber-50",
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${themeClasses.light}`}>
        <header className="sticky top-0 z-50 border-b border-stone-200/50 bg-inherit backdrop-blur-sm">
          <div className="mx-auto max-w-4xl px-4 py-4">
            <div className="h-8 w-32 animate-pulse rounded bg-stone-200" />
          </div>
        </header>
        <SkeletonReader />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${themeClasses[theme]} transition-colors duration-300`}>
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-1 bg-stone-200/50">
        <div
          className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Header */}
      <header className={`sticky top-0 z-50 border-b border-stone-200/30 bg-gradient-to-r ${themeBgClasses[theme]} backdrop-blur-xl transition-colors duration-300`}>
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <Link
            href={`/novel/${params.slug}`}
            className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all hover:bg-white/20 ${
              theme === "dark" ? "text-stone-300 hover:text-white" : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <span>←</span>
            <span className="hidden sm:inline">Back</span>
          </Link>
          <div className="text-center">
            <h1 className={`font-semibold ${theme === "dark" ? "text-white" : "text-stone-900"}`}>
              The Eternal Emperor
            </h1>
            <p className={`text-xs ${theme === "dark" ? "text-stone-400" : "text-stone-500"}`}>
              Chapter {chapterNumber} · {Math.round(scrollProgress)}%
            </p>
          </div>
          <div className="flex items-center gap-1">
            {/* TTS Button */}
            <button
              onClick={() => {
                setShowTTSPanel(!showTTSPanel);
                setShowSettings(false);
              }}
              className={`rounded-xl p-2.5 transition-all hover:bg-white/20 ${
                isSpeaking
                  ? "text-emerald-500"
                  : theme === "dark"
                  ? "text-stone-300"
                  : "text-stone-600"
              } ${showTTSPanel ? (theme === "dark" ? "bg-white/20 text-emerald-400" : "bg-white/50 text-emerald-600") : ""}`}
              title="Text to Speech"
            >
              {isSpeaking ? (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              )}
            </button>

            <button
              onClick={() => {
                setShowSettings(!showSettings);
                setShowTTSPanel(false);
              }}
              className={`rounded-xl p-2.5 transition-all hover:bg-white/20 ${
                theme === "dark" ? "text-stone-300" : "text-stone-600"
              } ${showSettings ? (theme === "dark" ? "bg-white/20 text-white" : "bg-white/50 text-stone-900") : ""}`}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <button
              onClick={handleBookmark}
              className={`rounded-xl p-2.5 transition-all hover:bg-white/20 ${
                bookmarked
                  ? "text-amber-500"
                  : theme === "dark"
                  ? "text-stone-300"
                  : "text-stone-600"
              }`}
            >
              {bookmarked ? (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        <div className={`overflow-hidden transition-all duration-300 ${
          showSettings ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
        }`}>
          <div className={`mx-4 mb-4 rounded-2xl border border-stone-200/30 p-4 backdrop-blur-sm ${
            theme === "dark" ? "bg-stone-800/50" : "bg-white/80"
          }`}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Theme */}
              <div>
                <label className={`text-sm font-medium ${theme === "dark" ? "text-stone-300" : "text-stone-700"}`}>
                  Theme
                </label>
                <div className="mt-2 grid grid-cols-3 gap-1.5">
                  {(["light", "dark", "sepia"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      className={`rounded-lg py-2 text-xs font-medium capitalize transition-all ${
                        theme === t
                          ? t === "light"
                            ? "bg-amber-500 text-white shadow-lg shadow-amber-200"
                            : t === "dark"
                            ? "bg-stone-700 text-white"
                            : "bg-amber-200 text-amber-900"
                          : theme === "dark"
                          ? "bg-stone-700/50 text-stone-300 hover:bg-stone-700"
                          : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Size */}
              <div>
                <label className={`text-sm font-medium ${theme === "dark" ? "text-stone-300" : "text-stone-700"}`}>
                  Size: {fontSize}px
                </label>
                <input
                  type="range"
                  min="14"
                  max="28"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  className="mt-2 w-full accent-amber-500"
                />
              </div>

              {/* Line Height */}
              <div>
                <label className={`text-sm font-medium ${theme === "dark" ? "text-stone-300" : "text-stone-700"}`}>
                  Line: {lineHeight.toFixed(1)}
                </label>
                <input
                  type="range"
                  min="1.2"
                  max="2.4"
                  step="0.1"
                  value={lineHeight}
                  onChange={(e) => setLineHeight(parseFloat(e.target.value))}
                  className="mt-2 w-full accent-amber-500"
                />
              </div>

              {/* Font Family */}
              <div>
                <label className={`text-sm font-medium ${theme === "dark" ? "text-stone-300" : "text-stone-700"}`}>
                  Font
                </label>
                <div className="mt-2 flex gap-1">
                  {(["sans", "serif", "mono"] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFontFamily(f)}
                      className={`flex-1 rounded-lg py-2 text-xs font-medium capitalize transition-all ${
                        fontFamily === f
                          ? "bg-amber-500 text-white shadow-lg shadow-amber-200"
                          : theme === "dark"
                          ? "bg-stone-700/50 text-stone-300 hover:bg-stone-700"
                          : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                      }`}
                    >
                      {fontFamilyLabels[f]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TTS Panel */}
        <div className={`overflow-hidden transition-all duration-300 ${
          showTTSPanel ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
        }`}>
          <div className={`mx-4 mb-4 rounded-2xl border border-stone-200/30 p-4 backdrop-blur-sm ${
            theme === "dark" ? "bg-stone-800/50" : "bg-white/80"
          }`}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              {/* Play/Stop Button */}
              <button
                onClick={toggleSpeech}
                className={`flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-medium transition-all ${
                  isSpeaking
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-lg hover:shadow-emerald-200"
                }`}
              >
                {isSpeaking ? (
                  <>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 6h12v12H6z"/>
                    </svg>
                    Stop
                  </>
                ) : (
                  <>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                    Play
                  </>
                )}
              </button>

              {/* Speed Control */}
              <div className="flex items-center gap-4">
                <label className={`text-sm font-medium ${theme === "dark" ? "text-stone-300" : "text-stone-700"}`}>
                  Speed: {speechRate}x
                </label>
                <div className="flex gap-1">
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => changeSpeechRate(rate)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                        speechRate === rate
                          ? "bg-emerald-500 text-white"
                          : theme === "dark"
                          ? "bg-stone-700/50 text-stone-300 hover:bg-stone-700"
                          : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Status */}
            {isSpeaking && (
              <p className={`mt-3 text-sm ${theme === "dark" ? "text-emerald-400" : "text-emerald-600"}`}>
                Reading paragraph {currentParagraphRef.current + 1} of {paragraphsRef.current.length}...
              </p>
            )}
          </div>
        </div>
      </header>

      {/* Bookmark Modal */}
      {showBookmarkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in p-4">
          <div className={`w-full max-w-md rounded-2xl p-6 shadow-2xl ${
            theme === "dark" ? "bg-stone-800" : "bg-white"
          }`}>
            <h3 className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-stone-900"}`}>
              Add Bookmark
            </h3>
            <p className={`mt-1 text-sm ${theme === "dark" ? "text-stone-400" : "text-stone-500"}`}>
              Save your position and add a note
            </p>
            <textarea
              value={bookmarkNote}
              onChange={(e) => setBookmarkNote(e.target.value)}
              placeholder="My thoughts on this chapter..."
              className={`mt-4 w-full rounded-xl border p-3 transition-colors focus:border-amber-500 focus:outline-none ${
                theme === "dark"
                  ? "border-stone-600 bg-stone-700 text-white placeholder-stone-400"
                  : "border-stone-200 bg-stone-50 text-stone-900 placeholder-stone-400"
              }`}
              rows={3}
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowBookmarkModal(false)}
                className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                  theme === "dark"
                    ? "text-stone-400 hover:text-white hover:bg-stone-700"
                    : "text-stone-600 hover:bg-stone-100"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={saveBookmark}
                className="rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-amber-200 transition-all hover:shadow-xl"
              >
                Save Bookmark
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <article ref={contentRef} className="mx-auto max-w-4xl px-4 py-8">
        <div
          className={`rounded-3xl p-6 sm:p-8 shadow-xl transition-colors duration-300 ${
            theme === "dark"
              ? "bg-stone-900/50"
              : theme === "sepia"
              ? "bg-amber-100/50"
              : "bg-white/80"
          }`}
          style={{
            fontSize: `${fontSize}px`,
            lineHeight: lineHeight,
          }}
        >
          <h1 className="mb-8 text-center text-2xl font-bold tracking-tight">
            Chapter {chapterNumber}
          </h1>
          <div className={`tracking-wide ${fontFamilyClasses[fontFamily]}`}>
            {chapterContent.split("\n\n").map((paragraph, i) => (
              <p key={i} className="mb-6 first-letter:text-2xl first-letter:font-bold">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </article>

      {/* Navigation */}
      <nav className="mx-auto max-w-4xl px-4 pb-8">
        <div className={`flex items-center justify-between rounded-2xl p-4 shadow-lg transition-colors duration-300 ${
          theme === "dark" ? "bg-stone-800/80" : "bg-white/90"
        }`}>
          {prevChapter ? (
            <Link
              href={`/novel/${params.slug}/chapter/${prevChapter}`}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 font-medium transition-all ${
                theme === "dark"
                  ? "text-amber-400 hover:bg-stone-700"
                  : "text-amber-600 hover:bg-amber-50"
              }`}
            >
              <span>←</span>
              <span>Chapter {prevChapter}</span>
            </Link>
          ) : (
            <span className={`text-sm ${theme === "dark" ? "text-stone-500" : "text-stone-400"}`}>
              First Chapter
            </span>
          )}

          <Link
            href={`/novel/${params.slug}`}
            className={`rounded-xl px-3 py-2 text-sm transition-colors ${
              theme === "dark" ? "text-stone-400 hover:text-white hover:bg-stone-700" : "text-stone-500 hover:bg-stone-100"
            }`}
          >
            Chapter List
          </Link>

          {nextChapter ? (
            <Link
              href={`/novel/${params.slug}/chapter/${nextChapter}`}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 font-medium transition-all ${
                theme === "dark"
                  ? "text-amber-400 hover:bg-stone-700"
                  : "text-amber-600 hover:bg-amber-50"
              }`}
            >
              <span>Chapter {nextChapter}</span>
              <span>→</span>
            </Link>
          ) : (
            <span className={`text-sm ${theme === "dark" ? "text-stone-500" : "text-stone-400"}`}>
              Latest Chapter
            </span>
          )}
        </div>
      </nav>
    </div>
  );
}
