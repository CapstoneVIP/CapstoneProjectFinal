CC = gcc

CFLAGS = -g -Wall -pedantic
LMFLAG = -L/usr/lib/x86_64-linux-gnu -lmysqlclient -lpthread -lz -lm -lrt -ldl -I/usr/include/mysql

TARGET = dwms_server

all: $(TARGET)

$(TARGET): $(TARGET).c
	$(CC) $(CFLAGS) -o cmysql_server.bin $(TARGET).c $(LMFLAG)

clean:
	$(RM) $(TARGET)
