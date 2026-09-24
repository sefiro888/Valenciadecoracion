param(
  [Parameter(Mandatory=$true)][string]$InPath,
  [Parameter(Mandatory=$true)][string]$OutPath,
  [int]$WhiteMin = 232,
  [int]$Spread = 20,
  [int]$FeatherStart = 210,
  [int]$BlackMax = -1
)

Add-Type -AssemblyName PresentationCore
Add-Type -AssemblyName System.Drawing

$uri = New-Object System.Uri((Resolve-Path $InPath).Path)
$decoder = [System.Windows.Media.Imaging.BitmapDecoder]::Create($uri, [System.Windows.Media.Imaging.BitmapCreateOptions]::None, [System.Windows.Media.Imaging.BitmapCacheOption]::OnLoad)
$frame = $decoder.Frames[0]
$converted = New-Object System.Windows.Media.Imaging.FormatConvertedBitmap($frame, [System.Windows.Media.PixelFormats]::Bgra32, $null, 0)

$w = $converted.PixelWidth
$h = $converted.PixelHeight
$stride = $w * 4
$bytes = New-Object byte[] ($stride * $h)
$converted.CopyPixels($bytes, $stride, 0)

for ($i = 0; $i -lt $bytes.Length; $i += 4) {
  $b = [int]$bytes[$i]
  $g = [int]$bytes[$i+1]
  $r = [int]$bytes[$i+2]
  $srcA = [int]$bytes[$i+3]

  $mn = [Math]::Min($r, [Math]::Min($g, $b))
  $mx = [Math]::Max($r, [Math]::Max($g, $b))
  $spreadVal = $mx - $mn

  $newA = $srcA
  if ($spreadVal -le $Spread) {
    if ($mn -ge $WhiteMin) {
      $newA = 0
    } elseif ($mn -ge $FeatherStart) {
      $t = ($mn - $FeatherStart) / [double]($WhiteMin - $FeatherStart)
      $newA = [int]([double]$srcA * (1.0 - $t))
    } elseif ($BlackMax -ge 0 -and $mx -le $BlackMax) {
      $newA = 0
    }
  }
  $bytes[$i+3] = [byte]$newA
}

$bmp = New-Object System.Windows.Media.Imaging.WriteableBitmap($w, $h, $converted.DpiX, $converted.DpiY, [System.Windows.Media.PixelFormats]::Bgra32, $null)
$rect = New-Object System.Windows.Int32Rect(0, 0, $w, $h)
$bmp.WritePixels($rect, $bytes, $stride, 0)

$encoder = New-Object System.Windows.Media.Imaging.PngBitmapEncoder
$encoder.Frames.Add([System.Windows.Media.Imaging.BitmapFrame]::Create($bmp))
$outDir = Split-Path -Parent $OutPath
if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Force -Path $outDir | Out-Null }
$fs = [System.IO.File]::Open((Join-Path (Get-Location) $OutPath), [System.IO.FileMode]::Create)
$encoder.Save($fs)
$fs.Close()
Write-Output "Saved: $OutPath ($w x $h)"
