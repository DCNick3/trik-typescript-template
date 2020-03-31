#!/usr/bin/env python3

"""Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE."""

import socket
import sys
import os.path
import select
import time

"""
Usage: 
python3 remote-run.py [script-file]
python3 remote-run.py [script-file] [robot-number]
"""

ADDRESSES = ['192.168.77.1', '192.168.77.217']
ADDRESS=ADDRESSES[0] if len(sys.argv) < 3 else ADDRESSES[int(sys.argv[2])]
FILENAME='script.js'
FILENAME_BYTES=bytes(FILENAME, 'utf8')

def eprint(*args, **kwargs):
    print(*args, file=sys.stderr, **kwargs)

def wrap_cmd(cmd, sz=None):
    if sz == None:
        sz = len(cmd)
    return bytes(str(sz), 'utf8') + b':' + cmd


sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

sock.connect((ADDRESS, 8888))

s = sock.makefile('rwb')

filename = sys.argv[1]

file_cmd = b'file:' + FILENAME_BYTES + b':'
sz = len(file_cmd) + os.path.getsize(filename)
s.write(wrap_cmd(file_cmd, sz))

with open(filename, 'rb') as f:
    while True:
        c = f.read(1024)
        if c:
            s.write(c)
        else:
            break

run_cmd = b'run:' + FILENAME_BYTES

s.write(wrap_cmd(run_cmd))

s.flush()

KEEPALIVE_PERIOD = 1

last_keepalive = time.time()

try:
    while True:
        b = b''
        while not b or b[-1] != ord(b':'):
            r, _, _ = select.select([ sock ], [], [], 2)
            #eprint(r, b)
            if len(r) > 0:
                #eprint("_read_")
                c = s.read(1)
                #print(c)
                if not c:
                    eprint("EOF")
                    sys.exit()
                b += c
            if time.time() - last_keepalive >= KEEPALIVE_PERIOD:
                last_keepalive = time.time()
                #eprint("_keepalive_")
                s.write(b'9:keepalive')
                s.flush()
        sz = int(str(b[:-1], 'utf8'))
        #eprint(b, sz)
        b = s.read(sz)
        #eprint(b)
        cmd = b.split(b':', maxsplit=1)
        if len(cmd) == 1:
            cmd = cmd[0]
        else:
            cmd, args = cmd
        if cmd == b'keepalive':
            last_keepalive = time.time()
            s.write(b'9:keepalive')
            s.flush()
        elif cmd == b'print':
            args = str(args[1:], 'utf8')
            """real magic here:
            trik studio protocol does provide an event that signals stopping of a script
            so one is invented here: if script prints __eb3caide9Oojaiku__stop_marker__ it means that it has finished its execution =)
            """
            if args.strip() == '__eb3caide9Oojaiku__stop_marker__':
                break
            print(args, end='')
        elif cmd == b'error':
            args = args[1:]
            eprint("Error arised:", str(args, 'utf8'))
            break
        elif cmd == b'mail':
            args = args[1:]
            eprint("Mailbox message received:", str(args, 'utf8'))
        else:
            eprint("Unknown command received:", cmd)
except KeyboardInterrupt:
    s.write(b'4:stop')
    s.flush()
