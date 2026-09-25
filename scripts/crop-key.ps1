param(
  [Parameter(Mandatory=$true)][string]$InPath,
  [Parameter(Mandatory=$true)][string]$OutPath,
  [int]$X, [int]$Y, [int]$W, [int]$H,
  [int]$BgR = 254, [int]$BgG = 233, [int]$BgB = 240,
  [double]$Lo = 14, [double]$Hi = 42,
  [int]$Scale = 1
)
Add-Type -AssemblyName System.Drawing
$src = [System.Drawing.Bitmap]::FromFile((Resolve-Path $InPath).Path)
$out = New-Object System.Drawing.Bitmap($W, $H, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
for ($j = 0; $j -lt $H; $j++) {
  for ($i = 0; $i -lt $W; $i++) {
    $c = $src.GetPixel($X + $i, $Y + $j)
    $d = [Math]::Sqrt([Math]::Pow($c.R - $BgR, 2) + [Math]::Pow($c.G - $BgG, 2) + [Math]::Pow($c.B - $BgB, 2))
    $a = ($d - $Lo) / ($Hi - $Lo)
    if ($a -lt 0) { $a = 0 } elseif ($a -gt 1) { $a = 1 }
    $out.SetPixel($i, $j, [System.Drawing.Color]::FromArgb([int](255 * $a), $c.R, $c.G, $c.B))
  }
}
$src.Dispose()
if ($Scale -gt 1) {
  $big = New-Object System.Drawing.Bitmap(($W * $Scale), ($H * $Scale), [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g = [System.Drawing.Graphics]::FromImage($big)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.DrawImage($out, 0, 0, $W * $Scale, $H * $Scale)
  $g.Dispose(); $out.Dispose(); $out = $big
}
$full = Join-Path (Get-Location) $OutPath
$out.Save($full, [System.Drawing.Imaging.ImageFormat]::Png)
$out.Dispose()
Write-Output "Saved: $OutPath"
