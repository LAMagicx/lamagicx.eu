TARGET=run
CC=gcc
CFLAGS= -Wall -Wextra -pedantic -lm -g -lncursesw


.PHONY: default all clean

default: $(TARGET)
all: default

OBJS=$(patsubst %.c, %.o, $(wildcard *.c))
DEPS=$(wildcard *.h)

%.o: %.c $(DEPS)
	$(CC) $(CFLAGS) -c $< -o $@

.PRECIOUS: $(TARGET) $(OBJS)

$(TARGET): $(OBJS)
	$(CC) $(OBJS) $(CFLAGS) -o $@
	-rm -f *.o

clean :
	-rm -f *.o
