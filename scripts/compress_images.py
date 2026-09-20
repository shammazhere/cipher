import os
import glob
from PIL import Image

def compress_images():
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'public'))
    print(f"Scanning public assets in: {base_dir}")
    
    total_original_bytes = 0
    total_compressed_bytes = 0
    
    # 1. Leadership PNGs (with alpha preservation)
    leadership_files = glob.glob(os.path.join(base_dir, 'leadership', '*.png'))
    for f in leadership_files:
        orig_size = os.path.getsize(f)
        total_original_bytes += orig_size
        
        with Image.open(f) as img:
            # Resize to max 900px while maintaining aspect ratio
            img.thumbnail((900, 900), Image.Resampling.LANCZOS)
            # Save optimized PNG
            img.save(f, format='PNG', optimize=True)
            # Also save WebP sibling
            webp_path = os.path.splitext(f)[0] + '.webp'
            img.save(webp_path, format='WEBP', quality=85, method=6)
            
        new_size = os.path.getsize(f)
        total_compressed_bytes += new_size
        print(f"Leadership: {os.path.basename(f)}: {orig_size/1024:.1f} KB -> {new_size/1024:.1f} KB")

    # 2. JPEG Event & Trail Photos
    jpeg_files = (
        glob.glob(os.path.join(base_dir, 'lumiere', '*.jpg')) +
        glob.glob(os.path.join(base_dir, 'promptops', '*.jpg')) +
        glob.glob(os.path.join(base_dir, 'images', 'trail', '*.jpg'))
    )
    
    for f in jpeg_files:
        orig_size = os.path.getsize(f)
        total_original_bytes += orig_size
        
        with Image.open(f) as img:
            if img.mode != 'RGB':
                img = img.convert('RGB')
            # Resize to max 1400px
            img.thumbnail((1400, 1400), Image.Resampling.LANCZOS)
            # Save progressive JPEG
            img.save(f, format='JPEG', quality=80, optimize=True, progressive=True)
            # Also save WebP sibling
            webp_path = os.path.splitext(f)[0] + '.webp'
            img.save(webp_path, format='WEBP', quality=78, method=6)
            
        new_size = os.path.getsize(f)
        total_compressed_bytes += new_size
        print(f"JPEG: {os.path.basename(f)}: {orig_size/1024:.1f} KB -> {new_size/1024:.1f} KB")

    # 3. Logo PNG
    logo_path = os.path.join(base_dir, 'images', 'cipher-logo.png')
    if os.path.exists(logo_path):
        orig_size = os.path.getsize(logo_path)
        total_original_bytes += orig_size
        with Image.open(logo_path) as img:
            img.thumbnail((512, 512), Image.Resampling.LANCZOS)
            img.save(logo_path, format='PNG', optimize=True)
            webp_path = os.path.splitext(logo_path)[0] + '.webp'
            img.save(webp_path, format='WEBP', quality=90)
        new_size = os.path.getsize(logo_path)
        total_compressed_bytes += new_size
        print(f"Logo: {orig_size/1024:.1f} KB -> {new_size/1024:.1f} KB")
        
    saved_bytes = total_original_bytes - total_compressed_bytes
    percent = (saved_bytes / total_original_bytes) * 100 if total_original_bytes else 0
    print("\n-----------------------------------------")
    print(f"Original total size:   {total_original_bytes / (1024*1024):.2f} MB")
    print(f"Compressed total size: {total_compressed_bytes / (1024*1024):.2f} MB")
    print(f"Storage & bandwidth saved: {saved_bytes / (1024*1024):.2f} MB ({percent:.1f}% reduction!)")
    print("-----------------------------------------")

if __name__ == '__main__':
    compress_images()
