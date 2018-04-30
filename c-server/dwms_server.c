#include <arpa/inet.h>
#include <netinet/in.h>
#include <stdio.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <unistd.h>
#include <stdlib.h>
#include <string.h>
#include "update_shuttle.h"

#define BUFFER_SIZE 512
#define PORT 62321

int main(void){
	int s, len, slen;
	unsigned int packet_num = 0;
	unsigned int i = 0;
	double dlat, dlon;
	struct sockaddr_in si_me, si_other;
	char *buf = (char*)malloc(BUFFER_SIZE * sizeof(char));
	char *tok;
	char *lat = (char*)malloc(11 * sizeof(char));
	char *lon = (char*)malloc(12 * sizeof(char));

	/* Begin: C Server init setup */
	slen = sizeof(si_other);
	if((s = socket(AF_INET, SOCK_DGRAM, IPPROTO_UDP)) < 0){
		perror("ERROR: socket creation failed!");
	}
	memset((char*)&si_me, 0, sizeof(si_me));
	si_me.sin_family = AF_INET;
	si_me.sin_port = htons(PORT);
	si_me.sin_addr.s_addr = htonl(INADDR_ANY);

	if(bind(s, (struct sockaddr*)&si_me, sizeof(si_me)) < 0){
		perror("ERROR: bind failed!");
	}
	/* End: C server init setup */

        while(1){
		memset(buf, 0, BUFFER_SIZE * sizeof(char));
		recvfrom(s, buf, BUFFER_SIZE * sizeof(char), 0, (struct sockaddr*)&si_other, &slen);
		/* Example buf: 41.24386,-96.01332 */
		tok = strtok(buf, ",");
		for(i = 0; tok != NULL; i++){
			switch(i){
				case 0:
					strcpy(lat, tok);
					dlat = strtod(lat, NULL);
					printf("LAT: %f\n", dlat);
					break;
				case 1:
					strcpy(lon, tok);
					dlon = strtod(lon, NULL);
					printf("LON: %f\n", dlon);
					break;
				/*
				case 2:
					strcpy(mph, tok);
					printf("mph: %d\n", mph);
					break;
				*/
			}
			tok = strtok(NULL, ",");
		}
		printf("Packet Number | %d | Received Packet From %s:%d\n", ++packet_num, inet_ntoa(si_other.sin_addr), ntohs(si_other.sin_port));
		printf("Updating Database\n");
		startSQL(215, dlat, dlon);
	}
}

