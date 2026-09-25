param(
  [Parameter(Mandatory=$true)][string]$InPath,
  [Parameter(Mandatory=$true)][string]$OutPath,
  [int]$WhiteMin = 228,
  [int]$Spread = 22
)
Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @"
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;
public static class BgFlood {
  public static void Run(string inPath, string outPath, int whiteMin, int spread) {
    Bitmap src = new Bitmap(inPath);
    int w = src.Width, h = src.Height;
    Bitmap bmp = new Bitmap(w, h, PixelFormat.Format32bppArgb);
    using (Graphics g = Graphics.FromImage(bmp)) { g.DrawImage(src, 0, 0, w, h); }
    src.Dispose();
    BitmapData data = bmp.LockBits(new Rectangle(0, 0, w, h), ImageLockMode.ReadWrite, PixelFormat.Format32bppArgb);
    int stride = data.Stride;
    byte[] px = new byte[stride * h];
    Marshal.Copy(data.Scan0, px, 0, px.Length);
    Func<int,bool> isBg = idx => {
      int b = px[idx], gg = px[idx+1], r = px[idx+2];
      int mn = Math.Min(r, Math.Min(gg, b)), mx = Math.Max(r, Math.Max(gg, b));
      return mn >= whiteMin && (mx - mn) <= spread;
    };
    bool[] bg = new bool[w * h];
    Queue<int> q = new Queue<int>();
    Action<int,int> seed = (x, y) => { int p = y * w + x; if (!bg[p] && isBg(y * stride + x * 4)) { bg[p] = true; q.Enqueue(p); } };
    for (int x = 0; x < w; x++) { seed(x, 0); seed(x, h - 1); }
    for (int y = 0; y < h; y++) { seed(0, y); seed(w - 1, y); }
    int[] dx = { 1, -1, 0, 0 }, dy = { 0, 0, 1, -1 };
    while (q.Count > 0) {
      int p = q.Dequeue(); int x = p % w, y = p / w;
      for (int k = 0; k < 4; k++) {
        int nx = x + dx[k], ny = y + dy[k];
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
        int np = ny * w + nx;
        if (!bg[np] && isBg(ny * stride + nx * 4)) { bg[np] = true; q.Enqueue(np); }
      }
    }
    for (int y = 0; y < h; y++) for (int x = 0; x < w; x++) {
      int p = y * w + x, idx = y * stride + x * 4;
      if (bg[p]) { px[idx+3] = 0; continue; }
      int n = 0;
      for (int k = 0; k < 4; k++) { int nx = x + dx[k], ny = y + dy[k]; if (nx >= 0 && ny >= 0 && nx < w && ny < h && bg[ny * w + nx]) n++; }
      if (n > 0) px[idx+3] = (byte)(px[idx+3] * (4 - n) / 5 + 40);
    }
    Marshal.Copy(px, 0, data.Scan0, px.Length);
    bmp.UnlockBits(data);
    bmp.Save(outPath, ImageFormat.Png);
    bmp.Dispose();
  }
}
"@
$full = Join-Path (Get-Location) $OutPath
[BgFlood]::Run((Resolve-Path $InPath).Path, $full, $WhiteMin, $Spread)
Write-Output "Saved: $OutPath"
