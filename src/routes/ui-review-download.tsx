import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Download, CheckCircle, FileArchive, ShieldCheck, Layers, Eye } from "lucide-react";
import chunkData from "@/data/ui-review-chunks.json";

export const Route = createFileRoute("/ui-review-download")({
  head: () => ({
    meta: [
      { title: "Tải Trọn Bộ UI Review Full Package | Bắc Sơn Cường Nguyệt" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: UiReviewDownloadPage,
});

function UiReviewDownloadPage() {
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloaded, setDownloaded] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const handleDownload = async () => {
    try {
      setDownloading(true);
      setStatusMsg("Đang giải mã và hợp nhất 49 khối dữ liệu Base64...");

      // Assemble chunks
      let fullBase64 = "";
      for (let i = 0; i < chunkData.chunks.length; i++) {
        fullBase64 += chunkData.chunks[i];
        setProgress(Math.round(((i + 1) / chunkData.chunks.length) * 50));
      }

      setStatusMsg("Đang chuyển đổi sang tệp tin nhị phân ZIP...");
      await new Promise((r) => setTimeout(r, 50));

      // Convert Base64 to binary
      const binaryString = atob(fullBase64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
        if (i % 1000000 === 0) {
          setProgress(50 + Math.round((i / len) * 45));
        }
      }

      setProgress(98);
      setStatusMsg("Khởi tạo luồng tải về máy...");

      const blob = new Blob([bytes], { type: "application/zip" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = chunkData.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 30000);

      setProgress(100);
      setDownloaded(true);
      setStatusMsg("Tải về hoàn tất!");
    } catch (err) {
      console.error(err);
      setStatusMsg("Có lỗi xảy ra, thử chuyển hướng tải trực tiếp...");
      window.location.href = "/UI_REVIEW_FULL.zip";
    } finally {
      setDownloading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FBFAF7] px-4 py-12 text-[#23313F]">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#CDE0E5] bg-[#E8F2F4] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#3F6670]">
            <ShieldCheck className="size-3.5" /> Gói Đánh Giá Thiết Kế UI Toàn Diện
          </span>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-[#23313F] sm:text-4xl">
            Tải UI_REVIEW_FULL.zip
          </h1>
          <p className="mt-2 text-base text-[#5F6B76]">
            Toàn bộ ảnh chụp thực tế giao diện hiện tại (&ldquo;Sơn La những chuyến đi&rdquo;) qua 5
            độ phân giải màn hình, 17 phân đoạn, các trạng thái vi tương tác và tài liệu thông số kỹ
            thuật.
          </p>
        </div>

        {/* Package Summary Card */}
        <div className="mt-8 rounded-2xl border border-[#DFE5EA] bg-white p-6 shadow-[0_2px_12px_rgba(35,49,63,0.06)] sm:p-8">
          <div className="flex items-center gap-4 border-b border-[#E8EDF0] pb-6">
            <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-[#F6EDE7] text-[#D97757]">
              <FileArchive className="size-7" />
            </div>
            <div>
              <p className="text-lg font-black text-[#23313F]">{chunkData.filename}</p>
              <p className="text-sm font-medium text-[#5F6B76]">
                Dung lượng:{" "}
                <b className="text-[#23313F]">
                  {(chunkData.totalBytes / (1024 * 1024)).toFixed(2)} MB
                </b>{" "}
                ({chunkData.totalBytes.toLocaleString()} bytes) ·{" "}
                <b className="text-[#23313F]">{chunkData.totalScreenshots} ảnh chụp PNG</b>
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-[#E8EDF0] bg-[#F5F7F8] p-4">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#5F6B76]">
                <Eye className="size-4 text-[#3F6670]" /> 5 Độ Phân Giải (Viewports)
              </span>
              <ul className="mt-2 space-y-1 text-xs text-[#23313F]">
                <li>• Desktop Large (1920 × 1080)</li>
                <li>• Desktop Normal (1440 × 900)</li>
                <li>• Tablet (1024 × 1366)</li>
                <li>• Mobile (390 × 844)</li>
                <li>• Mobile Small (360 × 800)</li>
              </ul>
            </div>

            <div className="rounded-xl border border-[#E8EDF0] bg-[#F5F7F8] p-4">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#5F6B76]">
                <Layers className="size-4 text-[#3F6670]" /> 17 Phân Đoạn & Trạng Thái
              </span>
              <ul className="mt-2 space-y-1 text-xs text-[#23313F]">
                <li>• Full-page & Dedicated Hero captures</li>
                <li>• 17 Desktop & 17 Mobile sections</li>
                <li>• Contact button states (Normal, Hover, Focus, Active)</li>
                <li>• Mobile menu (Closed vs Open)</li>
                <li>• Google Maps & Gallery Modal</li>
              </ul>
            </div>
          </div>

          {/* Hash Verification Block */}
          <div className="mt-6 rounded-xl border border-[#DFE5EA] bg-[#F5F7F8] p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-[#5F6B76]">
              Mã kiểm chứng toàn vẹn (SHA-256):
            </p>
            <p className="mt-1 break-all font-mono text-xs font-semibold text-[#3F6670]">
              {chunkData.sha256}
            </p>
          </div>

          {/* Download Action */}
          <div className="mt-8">
            {downloading && (
              <div className="mb-4">
                <div className="flex justify-between text-xs font-bold text-[#3F6670]">
                  <span>{statusMsg}</span>
                  <span>{progress}%</span>
                </div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[#E8EDF0]">
                  <div
                    className="h-full rounded-full bg-[#D97757] transition-all duration-200"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleDownload}
                disabled={downloading}
                className="inline-flex min-h-12 flex-1 items-center justify-center gap-2.5 rounded-xl bg-[#D97757] px-6 text-base font-bold text-white shadow-[0_2px_8px_rgba(217,119,87,0.22)] transition-all duration-[220ms] hover:-translate-y-0.5 hover:bg-[#C86547] hover:shadow-[0_6px_18px_rgba(217,119,87,0.30)] active:scale-[0.98] disabled:opacity-50"
              >
                {downloaded ? (
                  <>
                    <CheckCircle className="size-5" /> Tải Lại Tệp Tin
                  </>
                ) : (
                  <>
                    <Download className="size-5" /> Tải Xuống UI_REVIEW_FULL.zip
                  </>
                )}
              </button>

              <a
                href="/UI_REVIEW_FULL.zip"
                download="UI_REVIEW_FULL.zip"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#DFE5EA] bg-white px-5 text-sm font-bold text-[#3F6670] shadow-xs transition-all duration-[220ms] hover:-translate-y-0.5 hover:border-[#3F6670] hover:bg-[#E8F2F4] active:scale-[0.98]"
              >
                Tải Trực Tiếp (Dự Phòng)
              </a>
            </div>

            {downloaded && (
              <p className="mt-3 text-center text-xs font-semibold text-emerald-700">
                ✓ Đã tải xuống thành công tệp tin {chunkData.filename} (
                {chunkData.totalBytes.toLocaleString()} bytes).
              </p>
            )}
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <a href="/" className="text-sm font-semibold text-[#3F6670] hover:underline">
            ← Quay về trang chủ
          </a>
        </div>
      </div>
    </main>
  );
}
