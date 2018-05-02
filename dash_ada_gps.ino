 /* Test code for Adafruit GPS modules using MTK3329/MTK3339 driver
  * Modified by Hologram for the Hologram Dash
  * This is based off of the Adafruit Arduino Due example at:
  * https://github.com/adafruit/Adafruit_GPS/blob/master/examples/due_parsing/due_parsing.ino
  * This modified Hologram version sends the latitude and longitude data back to the
  * Hologram cloud
  * 
  * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  * SOFTWARE.
  * 
  */

#include <Adafruit_GPS.h>

#define Serial SerialUSB
#define mySerial Serial0

//Change this to change how often the GPS data is printed and sent to the cloud
#define GPS_SERIAL_SEND_TIME 10000
#define GPS_CLOUD_SEND_TIME 5000

#define LED_DATA_INDICATOR_DURATION 200
#define LED_DATA_INDICATOR_FLICKER_OFF_DURATION 50
#define LED_DATA_INDICATOR_FLICKER_ON_DURATION 5

Adafruit_GPS GPS(&mySerial);

// Set GPSECHO to 'false' to turn off echoing the GPS data to the Serial console
// Set to 'true' if you want to debug and listen to the raw GPS sentences. 
#define GPSECHO false

// Static UDP HologramCloud passthrough AT commands.
#define CREATE_UDP_SOCKET "AT+USOCR=17\r"
#define DNS_RESOLUTION_DWMS "AT+UDNSRN=0,\"dwms.hopto.org\"\r"
#define UDP_SEND_DWMS "AT+USOST=0,\"174.138.38.245\",62321,20\r"

#define ONE_KT 1.15077945

/* globals */
unsigned ledStartMillis;
unsigned ledNextFlickerMillis;
bool uplinkDataDetected;
bool downlinkDataDetected;
bool ledOn;
uint32_t nextGPSSerialOutput;
uint32_t nextGPSCloudOutput;
unsigned lastMillis;

void setup()  
{
    Dash.begin();
    Serial2.begin(9600);
    // connect USB serial at 115200 to read the GPS fast enough and echo without dropping chars
    SerialUSB.begin(115200);
    
    //Requires System Firmware 0.9.10 or higher
    HologramCloud.enterPassthrough();

    ledStartMillis = 0; /* LED off by default */  
    ledNextFlickerMillis = 0;
    uplinkDataDetected = false;
    downlinkDataDetected = false;
    ledOn = false;
    ledIndicateData();

    nextGPSSerialOutput = 0;
    nextGPSCloudOutput = 0;

    // 9600 NMEA is the default baud rate for Adafruit MTK GPS's- some use 4800
    GPS.begin(9600);
    mySerial.begin(9600);

    // uncomment this line to turn on RMC (recommended minimum) and GGA (fix data) including altitude
    GPS.sendCommand(PMTK_SET_NMEA_OUTPUT_RMCGGA);
    // uncomment this line to turn on only the "minimum recommended" data
    //GPS.sendCommand(PMTK_SET_NMEA_OUTPUT_RMCONLY);
    // For parsing data, we don't suggest using anything but either RMC only or RMC+GGA since
    // the parser doesn't care about other sentences at this time

    // Set the update rate
    GPS.sendCommand(PMTK_SET_NMEA_UPDATE_1HZ);   // 1 Hz update rate
    // For the parsing code to work nicely and have time to sort thru the data, and
    // print it out we don't suggest using anything higher than 1 Hz

    // Request updates on antenna status, comment out to keep quiet
    //GPS.sendCommand(PGCMD_ANTENNA);

    delay(1000);
    // Ask for firmware version
    mySerial.println(PMTK_Q_RELEASE);

    lastMillis = millis();
    delay(1000);
    
    SerialSystem.write(CREATE_UDP_SOCKET);
    //OK: Verification needed here...
    delay(1000);
    SerialSystem.write(DNS_RESOLUTION_DWMS);
    //OK: Verification needed here...
    
}

void loop() {
  char currChar;
  
  if(ledOn) {
    Dash.onLED();
  } else {
    Dash.offLED();
  }
  if (uplinkDataDetected) {
    /* for uplink data, we turn on LED for duration */
    ledOn=true;
    if(millis() > (ledStartMillis + LED_DATA_INDICATOR_DURATION)) {
      uplinkDataDetected=false;
      ledOn=false;
    }
  }
  
  if (!uplinkDataDetected && downlinkDataDetected) {
    /* for downlink data, we flash LED for duration */
    if(millis() > ledNextFlickerMillis) {
      if(ledOn) {
        ledOn=false;
        ledNextFlickerMillis = millis() + LED_DATA_INDICATOR_FLICKER_OFF_DURATION;
      } else {
        ledOn=true;
        ledNextFlickerMillis = millis() + LED_DATA_INDICATOR_FLICKER_ON_DURATION;
      }
    }
    if(millis() > (ledStartMillis + LED_DATA_INDICATOR_DURATION)) {
      downlinkDataDetected=false;
      ledOn=false;
    }
  }

  // read GPS and send data to Cloud based on timer
  handleGPS();
  // if millis() or timer wraps around, we'll just reset it
  if(lastMillis > millis()) {
    nextGPSSerialOutput = millis();
    nextGPSCloudOutput = millis();
  }
  lastMillis = millis();
  
}


void handleGPS() {
    // read data from the GPS in the 'main loop'
    char c = GPS.read();
    int i = 0;
    double knots = 0;
    String msg = "\n";
    // if you want to debug, this is a good time to do it!
    if (GPSECHO)
        if (c) Serial.print(c);

    // if a sentence is received, we can check the checksum, parse it...
    if (GPS.newNMEAreceived()) {
        // a tricky thing here is if we print the NMEA sentence, or data
        // we end up not listening and catching other sentences! 
        // so be very wary if using OUTPUT_ALLDATA and trytng to print out data
        //Serial.println(GPS.lastNMEA());   // this also sets the newNMEAreceived() flag to false

        if (!GPS.parse(GPS.lastNMEA())) {  // this also sets the newNMEAreceived() flag to false
            return;  // we can fail to parse a sentence in which case we should just wait for another
        }
    }

    knots = GPS.speed;
    // print out the current stats and send to cloud
    if (nextGPSSerialOutput < millis()) {
        nextGPSSerialOutput = millis() + GPS_SERIAL_SEND_TIME; // reset the timer

        Serial.println("");
        Serial.print("\nTime: ");
        Serial.print(GPS.hour, DEC); Serial.print(':');
        Serial.print(GPS.minute, DEC); Serial.print(':');
        Serial.print(GPS.seconds, DEC); Serial.print('.');
        Serial.println(GPS.milliseconds);
        Serial.print("Date: ");
        Serial.print(GPS.day, DEC); Serial.print('/');
        Serial.print(GPS.month, DEC); Serial.print("/20");
        Serial.println(GPS.year, DEC);
        Serial.print("Fix: "); Serial.print((int)GPS.fix);
        Serial.print(" quality: "); Serial.println((int)GPS.fixquality); 
        if (GPS.fix) {
            Serial.print("Location: ");
            Serial.print(GPS.latitudeDegrees, 6);
            Serial.print(", "); 
            Serial.println(GPS.longitudeDegrees, 6);
            Serial.print("Speed (knots): "); Serial.println(knots);
            Serial.print("Angle: "); Serial.println(GPS.angle);
            Serial.print("Altitude: "); Serial.println(GPS.altitude);
            Serial.print("Satellites: "); Serial.println((int)GPS.satellites);
            Serial.println("");
        }
    }

    if(GPS.fix && nextGPSCloudOutput < millis()) {
        char coordbuf[32];
        char udpbuf[100];
        double mph = 0;
        String udp_out = "\0";

        // Update Cloud output counter with time the next message will be sent
        nextGPSCloudOutput = millis() + GPS_CLOUD_SEND_TIME;

        // Calculate knots to MPH
        mph = knots * ONE_KT;
        Serial.println(knots);
        Serial.println(mph);

        // Create String message with data to send to Cloud
        msg = "\0";
        dtostrf(GPS.latitudeDegrees, 0, 6, coordbuf);
        msg.concat(coordbuf);
        msg.concat(",");
        dtostrf(GPS.longitudeDegrees, 0, 6, coordbuf);
        msg.concat(coordbuf);
        /*
         * msg += ",";
         * msg += String((double)mph);
         */
        msg += "\n";

        // Copy String msg to character buffer for SystemSerial write
        for(i = 0; msg[i] != '\n'; i++){
          coordbuf[i] = msg[i];
        }
        coordbuf[i] = '\0';

        // Send data to Cloud via UDP using AT command
        Serial.println("\nSending message via UDP to cloud...");
        delay(600);
        SerialSystem.write(UDP_SEND_DWMS);
        delay(1000);
        SerialSystem.write(coordbuf, i);
        delay(1000);
        Serial.println("\nDONE!");
    }
}

void ledIndicateData(){
  ledStartMillis = millis();
  ledOn = true;
}

