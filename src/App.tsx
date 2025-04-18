import { useState } from "react";
import { RiBus2Line } from "react-icons/ri";
import JapanTime from "./components/JapanTime.tsx";

const initialForm = {
  mode: "actual",
  type: "1",
  start: "13:00",
  end: "17:30",
  plannedStart: "13:00",
  plannedEnd: "17:30",
};

function App() {
  const [form, setForm] = useState({
    mode: "actual",
    type: "1",
    start: "13:00",
    end: "17:30",
    plannedStart: "13:00",
    plannedEnd: "17:30",
  });

  const parseTime = (str: string): number => {
    const [h, m] = str.split(":").map(Number);
    return h * 60 + m;
  };

  const calcExtension = (
    formType: string,
    calcStart: string,
    calcEnd: string,
    actualEnd: string,
    isException: boolean = false
  ): number => {
  
    const s = parseTime(calcStart);
    const e = parseTime(calcEnd);
    const duration = (e - s) / 60;

    if (formType === "1") {
      // 形態1：算定時間ベース
      if (duration < 3) return 0;
      const extra = duration - 3;
      if (extra >= 2) return 3;
      if (extra >= 1) return 2;
      if (extra >= 0.5) return 1;
      return 0;
    }

    if (formType === "2") {
      // 形態2：早朝・夕方枠
      // 実際の終了時刻で15:40チェック
      const endMinReal = parseTime(actualEnd);

      // まず計算基準でAM/PMを算出
      const overlapAM = Math.max(
        0,
        Math.min(e, parseTime("10:00")) - Math.max(s, parseTime("09:00"))
      );

      let overlapPM = 0;
      if (endMinReal >= parseTime("15:40")) {
        // 15:40以上 → calcStart/calcEndで夕方計算
        overlapPM = Math.max(
          0,
          Math.min(e, parseTime("17:30")) - Math.max(s, parseTime("15:00"))
        );
      } else {
        // 15:40未満 → 夕方加算なし
        overlapPM = 0;
      }

      const totalExtra = (overlapAM + overlapPM) / 60;

      if (duration < 5) {
        if (isException) return 2;
        return 0;
      }

      if (totalExtra >= 2) return 3;
      if (totalExtra >= 1) return 2;
      if (totalExtra >= 0.5) return 1;
      return 0;
    }

    return 0;
  };

  const selectedStart =
    form.mode === "planned" ? form.plannedStart : form.start;
  const selectedEnd = form.mode === "planned" ? form.plannedEnd : form.end;

  // ここで startMin / endMin を取得
  const startMin = parseTime(selectedStart);
  const endMin = parseTime(selectedEnd);

  // duration（算定時間数）を算出
  const duration = Math.floor(((endMin - startMin) / 60) * 10) / 10;

  const extraLevel = calcExtension(
    form.type,
    selectedStart,
    selectedEnd,
    form.end,
    false
  );
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-blue-100 to-green-50 p-8 flex flex-col items-center justify-center">
      {/* カード全体 */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 space-y-6">
        {/* タイトル部分 */}
        <div className="flex items-center justify-center gap-2 px-4 py-1">
          {" "}
          <RiBus2Line style={{ fill: "blue", width: "20px", height: "20px" }} />
          <h1 className="text-xl font-bold">延長支援加算チェッカー</h1>{" "}
        </div>

        {/* ★ 時計をカード風レイアウトにする例 */}
        <div id="root" className="px-6 py-1">
          <JapanTime />
        </div>

        {/* 提供形態 */}
        <div className="space-y-1">
          <label className="text-lg font-semibold text-gray-700">
            提供形態
          </label>
          <select
            className="w-full border-2 border-blue-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option value="1">1（学校）</option>
            <option value="2">2（休日）</option>
          </select>
        </div>

        {/* 計算基準 */}
        <div className="space-y-1">
          <label className="text-lg font-semibold text-gray-700">
            計算基準
          </label>
          <div className="flex gap-6 mt-1">
            <label className="flex items-center text-base gap-1 cursor-pointer">
              <input
                type="radio"
                className="h-5 w-5 text-blue-600"
                value="actual"
                checked={form.mode === "actual"}
                onChange={() => setForm({ ...form, mode: "actual" })}
              />
              実績
            </label>
            <label className="flex items-center text-base gap-1 cursor-pointer">
              <input
                type="radio"
                className="h-5 w-5 text-blue-600"
                value="planned"
                checked={form.mode === "planned"}
                onChange={() => setForm({ ...form, mode: "planned" })}
              />
              自己都合
            </label>
          </div>
        </div>

        {/* 時刻入力 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-lg font-medium text-gray-700">
              開始時刻
            </label>
            <input
              type="time"
              className="w-full border-2 border-blue-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
              value={form.start}
              onChange={(e) => setForm({ ...form, start: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="text-lg font-medium text-gray-700">
              終了時刻
            </label>
            <input
              type="time"
              className="w-full border-2 border-blue-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
              value={form.end}
              onChange={(e) => setForm({ ...form, end: e.target.value })}
            />
          </div>

          {form.mode === "planned" && (
            <>
              <div className="space-y-1">
                <label className="text-lg font-medium text-gray-700">
                  予定開始
                </label>
                <input
                  type="time"
                  className="w-full border-2 border-blue-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
                  value={form.plannedStart}
                  onChange={(e) =>
                    setForm({ ...form, plannedStart: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-lg font-medium text-gray-700">
                  予定終了
                </label>
                <input
                  type="time"
                  className="w-full border-2 border-blue-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
                  value={form.plannedEnd}
                  onChange={(e) =>
                    setForm({ ...form, plannedEnd: e.target.value })
                  }
                />
              </div>
            </>
          )}
        </div>

        {/* 結果表示 */}
        <div className="border-t-2 border-blue-100 pt-4 text-gray-700 space-y-3">
          <p className="text-xl">
            ⏱️ <span className="font-bold">算定時間数：</span>
            <span className="text-pink-600 font-extrabold">{duration}</span>
            時間
          </p>
          <p className="text-xl">
            ➕ <span className="font-bold">延長支援加算：</span>
            <span className="text-pink-600 font-extrabold">
              加算【{extraLevel}】
            </span>
          </p>
          <div className="text-sm text-gray-500 leading-relaxed space-y-1">
            <p>
              ※形態1は算定時間ベース。 形態2は9:00〜10:00 / 15:00〜17:30
              が加算対象。
            </p>
            <p>※15:40未満の早退時は予定時刻にかかわらず夕方加算は無効です。</p>
            <p>
              ※自己都合の遅延の場合は「自己都合」を選択し、開始時刻・終了時刻・予定時刻を入力してください。
            </p>
          </div>
        </div>

        {/* クリアボタン */}
        <div className="flex justify-center pt-4">
          <button
            onClick={() => setForm(initialForm)}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg"
          >
            クリア
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
