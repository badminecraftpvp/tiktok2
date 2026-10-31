"""Generates PNG icons with the standard library only. Run: python3 make_icons.py"""
import zlib, struct
def png(path, n):
    rows = bytearray(); aa = 1.5 / n
    cl = lambda v: max(0.0, min(1.0, v))
    for y in range(n):
        rows.append(0)
        for x in range(n):
            u, v = x / n, y / n; t = (u + v) / 2
            r, g, b = 124 + 131 * t, 92, 255 - 117 * t
            d = ((u - .5) ** 2 + (v - .5) ** 2) ** .5
            a = max(cl((.26 - d) / aa + .5) * cl((d - .20) / aa + .5), cl((.09 - d) / aa + .5))
            rows += bytes(int(c + (255 - c) * a) for c in (r, g, b))
    ck = lambda k, d: struct.pack('>I', len(d)) + k + d + struct.pack('>I', zlib.crc32(k + d) & 0xffffffff)
    open(path, 'wb').write(b'\x89PNG\r\n\x1a\n' + ck(b'IHDR', struct.pack('>IIBBBBB', n, n, 8, 2, 0, 0, 0)) + ck(b'IDAT', zlib.compress(bytes(rows), 9)) + ck(b'IEND', b''))
png('icons/apple-touch-icon.png', 180); png('icons/icon-192.png', 192); png('icons/icon-512.png', 512); png('icons/icon-maskable-512.png', 512)
