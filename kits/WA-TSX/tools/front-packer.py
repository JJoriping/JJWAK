import os
import sys
import signal
import subprocess
import psutil
from multiprocessing import Process

processes = []

def start_webpack(options):
  if options['is_for_production']:
    # Webpack for production
    return subprocess.Popen([
      "webpack", "-p",
      "--entry", "./src/front/%s/index.tsx" % options['page'],
      "--output", "./dist/pages/%s.js" % options['page'],
      "--resolve-extensions", ".ts,.tsx"
    ], shell=True)
  else:
    # Webpack for development
    return subprocess.Popen([
      "webpack", "--watch",
      "--mode", "development",
      "--devtool", "false",
      "--entry", "./src/front/%s/index.tsx" % options['page'],
      "--output", "./dist/pages/%s.js" % options['page'],
      "--resolve-extensions", ".ts,.tsx"
    ], shell=True)

def start_scss(options):
  if options['is_for_production']:
    # SCSS for production
    return subprocess.Popen([
      "node", "./tools/front-scss-loader",
      options['page'], "!"
    ], shell=True)
  else:
    # SCSS for development
    return subprocess.Popen([
      "node", "./tools/front-scss-loader",
      options['page']
    ], shell=True)

def start_lang(options):
  if options['is_for_production']:
    return None
  else:
    return subprocess.Popen([
      "node", "./tools/front-lang-loader"
    ], shell=True)

def terminate_one(pid):
  proc = psutil.Process(pid)
  for p in proc.children(recursive=True):
    p.terminate()
  proc.terminate()

def terminate():
  for v in processes:
    print("Terminating the process #%d..." % v.pid)
    terminate_one(v.pid)
  sys.exit(0)

if __name__ == "__main__":
  print("Current working directory: ", os.getcwd())
  options = {
    'page': sys.argv[1],
    'is_for_production': len(sys.argv) > 2 and sys.argv[2] == "!"
  }
  if options['is_for_production'] and options['page'] == "*":
    for v in os.listdir("./src/front"):
      if "@" in v: continue
      if os.path.isfile("./src/front/%s" % v): continue
      print("Packing %s..." % v)
      options['page'] = v
      processes.append(start_webpack(options))
      processes.append(start_scss(options))
      processes.append(start_lang(options))
  else:
    processes.append(start_webpack(options))
    processes.append(start_scss(options))
    processes.append(start_lang(options))
  if options['is_for_production']:
    for v in processes:
      if v == None: continue
      v.wait()
    sys.exit(0)
  while True:
    cmd = input("""
      [] [X] Terminate all
      [Rw] Restart webpack
      [Rs] Restart node-scss
      [Rl] Restart lang
    """)
    if cmd == "" or cmd == "X":
      terminate()
    elif cmd == "Rw":
      terminate_one(processes[0].pid)
      processes[0] = start_webpack(options)
    elif cmd == "Rs":
      terminate_one(processes[1].pid)
      processes[1] = start_scss(options)
    elif cmd == "Rl":
      if processes[2] != None:
        terminate_one(processes[2].pid)
      processes[2] = start_lang(options)