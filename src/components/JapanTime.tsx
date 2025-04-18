import { useEffect, useState } from "react"
function JapanTime() {
  const [now, setNow] = useState(new Date());

  // 1秒ごとに現在時刻を更新
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 日本語形式・24時間表示に整形
  const timeString = now.toLocaleTimeString("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const dateString = now.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  return (
    // #root などのグローバルCSSの影響を受けにくくするため、可能ならば固有のコンテナを用意
    <div
    className="bg-white p-4 rounded-lg shadow-lg mx-auto mt-2 mb-2"      style={{ width: "100%", maxWidth: "100%" }}
    >
      <div className="flex flex-col items-center space-y-2">
        {/* 日付を上、時刻を大きく下に表示 */}
        <div className="text-center">
          <div className="text-10xl text-gray-600 mb-2">{dateString}</div>
          <div className="text-10xl font-extrabold text-gray-800 leading-none">
            {timeString}
          </div>
        </div>
      </div>
    </div>
  );
}

export default JapanTime;
