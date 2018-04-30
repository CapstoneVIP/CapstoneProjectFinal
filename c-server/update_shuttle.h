#ifndef UPDATE_SHUTTLE

#include <my_global.h>
#include <my_config.h>
#include <mysql.h>

#define MAX_BUFFER_SIZE 255

int startSQL(unsigned int id, double lat, double lon);
int connect_mysql(MYSQL *con);
int update_mysql(MYSQL *con, unsigned int id, double lat, double lon);
void disconnect_mysql(MYSQL *con);
void error_mysql(MYSQL *con);


int startSQL(unsigned int id, double lat, double lon){
	/* Allocate for MYSQL object */
	MYSQL *con = mysql_init(NULL);
	if(con == NULL){
		error_mysql(con);
		return -1;
	}
	if(connect_mysql(con) < 0){
		error_mysql(con);
		return -1;
	}
	if(update_mysql(con, id, lat, lon) < 0){
		disconnect_mysql(con);
		error_mysql(con);
		return -1;
	}
	disconnect_mysql(con);
	return 1;
}

/************************************************
 Name   : connect_mysql
 Params : con - MYSQL object
 Desc   : Sets up connection to MYSQL database
 ************************************************/
int connect_mysql(MYSQL *con){
	if(mysql_real_connect(con, "localhost", "root", "G0ldF1sh3", "testauthdb", 0, NULL, 0) == NULL){
		error_mysql(con);
		return -1;
	}
	return 1;
}

/************************************************ 
  Update MySQL database based on incomming values   
  1)Use those appropiate variables to update MySQL shuttle database 
  2)The string gets parsed and values are passed as the update argument to MYSQL
  
  Fixes: Not using a static integer for the shuttle (bus number)
*************************************************/
int update_mysql(MYSQL *con, unsigned int id, double lat, double lon){
	char buffer[MAX_BUFFER_SIZE]; /* Message size */
	sprintf(buffer, "UPDATE shuttle SET latitude = %f, longitude = %f WHERE id = %d", lat, lon, id);
	if(mysql_query(con, buffer) < 0){
		error_mysql(con);
		disconnect_mysql(con);
		return -1;
	}
	return 1;
}


/************************************************
 Name   : disconnect_mysql
 Params : con - MYSQL object
 Desc   : Disconnect previously established 
 	  connection.
 ************************************************/
void disconnect_mysql(MYSQL *con){
	mysql_close(con);
}

/************************************************
 Name   : error_mysql
 Params : con - MYSQL object
 Desc   : In case of an error...
          print > close conn > close program
 ************************************************/
void error_mysql(MYSQL *con){
	fprintf(stderr, "%s\n", mysql_error(con));
	disconnect_mysql(con);
	exit(1);
}

#endif
