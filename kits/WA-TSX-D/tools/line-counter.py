import os
import re
import sys

files = []

def get_stats(path):
  num_bytes = 0
  num_f_bytes = 0
  num_lines = 0
  num_f_lines = 0
  for _v in os.listdir(path):
    v = "%s\\%s" % (path, _v)
    b = 0
    fb = 0
    l = 0
    fl = 0
    if os.path.isdir(v):
      b, fb, l, fl = get_stats(v)
    if os.path.isfile(v):
      b, fb, l, fl = get_stat(v)
    num_bytes += b
    num_f_bytes += fb
    num_lines += l
    num_f_lines += fl
  return num_bytes, num_f_bytes, num_lines, num_f_lines

def filter_empty_line(v):
  return len(v.strip()) > 0

def get_stat(file):
  num_bytes = 0
  num_f_bytes = os.path.getsize(file)
  num_lines = 0
  num_f_lines = 0
  with open(file, "r", encoding="utf8") as f:
    lines = f.readlines()
    num_f_lines += len(lines)
    num_bytes += len(re.sub(r"\s", "", ''.join(lines)).encode())
    num_lines += len(list(filter(filter_empty_line, lines)))
  files.append((num_bytes, num_f_bytes, num_lines, num_f_lines, file))
  return num_bytes, num_f_bytes, num_lines, num_f_lines

if __name__ == "__main__":
  num_files = 0
  num_bytes, num_f_bytes, num_lines, num_f_lines = get_stats(sys.argv[1])
  for b, fb, l, fl, f in sorted(files, key=lambda v: v[1], reverse=True):
    num_files += 1
    print("#%-4d %5d B %5d L in %s" % (num_files, b, l, f))
  print("Files: %d\nBytes: %10d(%10d)\nLines: %10d(%10d)" % (num_files, num_bytes, num_f_bytes, num_lines, num_f_lines))